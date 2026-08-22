import { useNavigate } from 'react-router-dom';

const AdminProfile = ({ profileImg }) => {
    const navigate = useNavigate();
    const fallbackImg = 'https://imgs.search.brave.com/Jopvk0MWzfaYi1h8ZX8btE8nIJgelXumRnIDVQKFXI8/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9pLnBp/bmltZy5jb20vb3Jp/Z2luYWxzL2M2LzU2/L2VkL2M2NTZlZDAy/MDdjMDViZTc5ZGI2/ZDdkYTQxZDdhNmZk/LmpwZw';
    const displayImg = profileImg || fallbackImg;

    // Read admin info saved at login or fallback to token payload
    const getAdminName = () => {
        try {
            const stored = localStorage.getItem('adminUser');
            if (stored) {
                const parsed = JSON.parse(stored);
                if (parsed?.fullName) return parsed.fullName;
            }
            const token = localStorage.getItem('adminToken');
            if (token) {
                const payload = JSON.parse(atob(token.split('.')[1]));
                return payload.fullName || payload.name || payload.email?.split('@')[0] || 'Admin';
            }
            return 'Admin';
        } catch {
            return 'Admin';
        }
    };
    const displayName = getAdminName();

    return (
        <button
            onClick={() => navigate('/admin/settings')}
            className="flex items-center gap-3 hover:bg-black/5 p-1.5 rounded-2xl transition-colors cursor-pointer"
            title="Admin Settings & Profile"
        >
            {/* Name */}
            <span className="text-sm font-semibold text-[#1a1c1a] hidden sm:block">
                {displayName}
            </span>

            {/* Avatar */}
            <img
                src={displayImg}
                alt="profile"
                className="w-[40px] h-[40px] rounded-full border-2 border-[#0a643a] object-cover"
            />
        </button>
    );
};

export default AdminProfile;
