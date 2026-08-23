import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ultra-Reliable Animate On Scroll (AOS) Engine
 * - Immediate in-viewport element animation (never leaves initial page blank)
 * - Safe IntersectionObserver with positive pre-fetch rootMargin
 * - Dynamic MutationObserver for API data & dynamically loaded cards
 * - React Router route-change synchronized
 */

class AOSController {
    constructor() {
        this.observer = null;
        this.mutationObserver = null;
        this.options = {
            rootMargin: '100px 0px 40px 0px',
            threshold: 0,
            once: true,
        };
        this.initialized = false;
    }

    init(userOptions = {}) {
        this.options = { ...this.options, ...userOptions };

        if (typeof window === 'undefined') return;

        if (this.observer) {
            this.observer.disconnect();
        }

        if ('IntersectionObserver' in window) {
            this.observer = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    const el = entry.target;
                    const once = el.getAttribute('data-aos-once') !== 'false';

                    if (entry.isIntersecting) {
                        el.classList.add('aos-animate');
                        if (once && this.observer) {
                            this.observer.unobserve(el);
                        }
                    } else if (!once) {
                        el.classList.remove('aos-animate');
                    }
                });
            }, {
                root: null,
                rootMargin: this.options.rootMargin,
                threshold: this.options.threshold,
            });
        }

        this.refresh();
        this.observeMutations();
        this.initialized = true;
    }

    refresh() {
        if (typeof document === 'undefined' || typeof window === 'undefined') return;

        const elements = document.querySelectorAll('[data-aos]');
        const vh = window.innerHeight || document.documentElement.clientHeight;

        elements.forEach((el) => {
            // Apply delay and duration styles if specified
            const delay = el.getAttribute('data-aos-delay');
            const duration = el.getAttribute('data-aos-duration');
            const easing = el.getAttribute('data-aos-easing');

            if (delay) el.style.transitionDelay = `${delay}ms`;
            if (duration) el.style.transitionDuration = `${duration}ms`;
            if (easing) el.style.transitionTimingFunction = easing;

            // Check if element is already in or near viewport
            const rect = el.getBoundingClientRect();
            const isInOrNearViewport = rect.top <= vh + 80 && rect.bottom >= -80;

            if (!el.classList.contains('aos-init')) {
                el.classList.add('aos-init');
            }

            if (isInOrNearViewport) {
                // Instantly trigger animation for elements in view so page never renders blank
                requestAnimationFrame(() => {
                    el.classList.add('aos-animate');
                });
            } else if (this.observer && !el.classList.contains('aos-animate')) {
                // Observe off-screen elements
                this.observer.observe(el);
            }
        });
    }

    observeMutations() {
        if (typeof MutationObserver === 'undefined' || this.mutationObserver) return;

        this.mutationObserver = new MutationObserver(() => {
            this.refresh();
        });

        this.mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });
    }
}

export const aos = new AOSController();

/**
 * Global React Router AOS Component
 * Automatically refreshes animations on route changes with progressive ticks
 */
export const AOSWrapper = ({ children }) => {
    const location = useLocation();

    useEffect(() => {
        aos.init();

        // Progressive refresh ticks ensure animations trigger even with lazy loads or route shifts
        aos.refresh();
        const t1 = setTimeout(() => aos.refresh(), 30);
        const t2 = setTimeout(() => aos.refresh(), 120);
        const t3 = setTimeout(() => aos.refresh(), 350);

        return () => {
            clearTimeout(t1);
            clearTimeout(t2);
            clearTimeout(t3);
        };
    }, [location.pathname]);

    return children || null;
};

export default aos;
