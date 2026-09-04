/**
 * 🔒 Smart Attendance Device Manager
 * 
 * Provides robust, multi-layer persistent device identification to enforce
 * 1-to-1 device binding (1 student per device, 1 device per student).
 * 
 * Storage Persistence Tiers:
 * 1. localStorage
 * 2. Persistent Cookie (1 Year, SameSite=Lax)
 * 3. IndexedDB Key-Value Vault
 * 4. sessionStorage fallback
 */

const DEVICE_ID_KEY = 'smart_attendance_device_id';
const DB_NAME = 'smart_attendance_device_db';
const DB_STORE = 'device_vault';

// IndexedDB Helper
const openDeviceDB = () => {
    return new Promise((resolve) => {
        if (!window.indexedDB) {
            return resolve(null);
        }
        try {
            const request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = (e) => {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(DB_STORE)) {
                    db.createObjectStore(DB_STORE);
                }
            };
            request.onsuccess = (e) => resolve(e.target.result);
            request.onerror = () => resolve(null);
        } catch {
            resolve(null);
        }
    });
};

const getFromIndexedDB = async () => {
    try {
        const db = await openDeviceDB();
        if (!db) return null;
        return new Promise((resolve) => {
            const tx = db.transaction(DB_STORE, 'readonly');
            const store = tx.objectStore(DB_STORE);
            const req = store.get('device_id');
            req.onsuccess = () => resolve(req.result || null);
            req.onerror = () => resolve(null);
        });
    } catch {
        return null;
    }
};

const saveToIndexedDB = async (id) => {
    try {
        const db = await openDeviceDB();
        if (!db) return;
        const tx = db.transaction(DB_STORE, 'readwrite');
        const store = tx.objectStore(DB_STORE);
        store.put(id, 'device_id');
    } catch {
        // Silently fail if storage disabled
    }
};

// Cookie Helpers
const getCookie = (name) => {
    try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift() || null;
    } catch {
        return null;
    }
    return null;
};

const setCookie = (name, val, days = 365) => {
    try {
        const d = new Date();
        d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${val}; expires=${d.toUTCString()}; path=/; SameSite=Lax`;
    } catch {
        // Ignore cookie errors
    }
};

/**
 * Generates a standard RFC4122 v4 UUID with cryptographic fallback.
 */
export const generateUUID = () => {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
        return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
            (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
    }
    return 'dev_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 10);
};

/**
 * Synchronous getter for device ID (used by Axios request interceptors).
 * Checks localStorage, then Cookie. If not found, generates and saves one.
 */
export const getDeviceIdSync = () => {
    try {
        let id = localStorage.getItem(DEVICE_ID_KEY);
        if (!id) {
            id = getCookie(DEVICE_ID_KEY);
            if (id) {
                localStorage.setItem(DEVICE_ID_KEY, id);
            }
        }
        if (!id) {
            id = sessionStorage.getItem(DEVICE_ID_KEY);
            if (id) {
                localStorage.setItem(DEVICE_ID_KEY, id);
                setCookie(DEVICE_ID_KEY, id);
            }
        }
        if (!id) {
            id = generateUUID();
            localStorage.setItem(DEVICE_ID_KEY, id);
            setCookie(DEVICE_ID_KEY, id);
            try { sessionStorage.setItem(DEVICE_ID_KEY, id); } catch {}
            // Async sync to IndexedDB
            saveToIndexedDB(id);
        }
        return id;
    } catch {
        return generateUUID();
    }
};

/**
 * Asynchronous getter that checks all 4 persistence layers:
 * localStorage -> Cookie -> IndexedDB -> sessionStorage.
 * Self-heals if any layer was cleared.
 */
export const getOrCreateDeviceId = async () => {
    try {
        let id = localStorage.getItem(DEVICE_ID_KEY);

        if (!id) {
            id = getCookie(DEVICE_ID_KEY);
        }

        if (!id) {
            id = await getFromIndexedDB();
        }

        if (!id) {
            try { id = sessionStorage.getItem(DEVICE_ID_KEY); } catch {}
        }

        if (!id) {
            id = generateUUID();
        }

        // Self-heal: ensure ID is written across all tiers
        try { localStorage.setItem(DEVICE_ID_KEY, id); } catch {}
        try { sessionStorage.setItem(DEVICE_ID_KEY, id); } catch {}
        setCookie(DEVICE_ID_KEY, id);
        await saveToIndexedDB(id);

        return id;
    } catch {
        return getDeviceIdSync();
    }
};

/**
 * Extract human-readable client OS, browser, screen, and device type.
 */
export const getDeviceInfo = () => {
    const ua = navigator.userAgent || '';
    
    // 1. Detect OS
    let os = 'Unknown OS';
    if (/android/i.test(ua)) os = 'Android';
    else if (/iphone|ipad|ipod/i.test(ua)) os = 'iOS';
    else if (/windows phone/i.test(ua)) os = 'Windows Phone';
    else if (/win/i.test(ua)) os = 'Windows';
    else if (/mac/i.test(ua)) os = 'macOS';
    else if (/linux/i.test(ua)) os = 'Linux';

    // 2. Detect Browser
    let browser = 'Unknown Browser';
    if (/samsungbrowser/i.test(ua)) browser = 'Samsung Internet';
    else if (/edg/i.test(ua)) browser = 'Microsoft Edge';
    else if (/opr\//i.test(ua) || /opera/i.test(ua)) browser = 'Opera';
    else if (/chrome|crios/i.test(ua)) browser = 'Chrome';
    else if (/firefox|fxios/i.test(ua)) browser = 'Firefox';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';

    // 3. Form factor
    const isMobile = /mobile|android|iphone|ipod/i.test(ua) || (window.innerWidth <= 768);
    const isTablet = /tablet|ipad/i.test(ua) || (!isMobile && window.innerWidth <= 1024);
    const formFactor = isMobile ? 'Mobile Phone' : isTablet ? 'Tablet' : 'Desktop / PC';

    // 4. Human-readable name
    const name = `${browser} on ${os} (${formFactor})`;

    return {
        name,
        browser,
        os,
        platform: navigator.platform || '',
        screenResolution: `${window.screen?.width || 0}x${window.screen?.height || 0}`,
        pixelRatio: window.devicePixelRatio || 1,
        formFactor,
        isMobile
    };
};

/**
 * Detects whether the user is in Private / Incognito mode.
 */
export const checkIsPrivateMode = async () => {
    try {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const { quota } = await navigator.storage.estimate();
            if (quota && quota < 120000000) {
                return true;
            }
        }
        return false;
    } catch {
        return false;
    }
};
