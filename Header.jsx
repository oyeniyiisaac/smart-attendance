 import logo from './src/assets/logo.png';

export default function Header() {
    return (
        <header className="flex items-center gap-3 p-4">
            <img
                src={logo}
                alt="My Project Logo"
                className="w-24 h-24 object-contain"
            />
            <span className="font-bold text-lg">Smart Attendance System</span>
        </header>
    );
}