import {
  Sparkles,
  Menu,
  User,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModal from "./AuthModal";
import logo from '@/assets/logo.jfif'

interface ChatHeaderProps {
  onMenuClick?: () => void;
}

const ChatHeader = ({ onMenuClick }: ChatHeaderProps) => {
  const navigate = useNavigate();

  const [openModal, setOpenModal] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [openDropdown, setOpenDropdown] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
    }
  }, []);

  const handleUserClick = () => {
    if (userName) {
      setOpenDropdown((prev) => !prev);
    } else {
      setOpenModal(true);
    }
  };

  const handleDashboard = () => {
    setOpenDropdown(false);
    navigate("/admin-dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUserName(null);
    setOpenDropdown(false);
    alert("Logout successful 👋");
  };

  return (
    <>
      <header className="border-b border-border/50 bg-background">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
          
          {/* Left Side */}
          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full gradient-accent flex items-center justify-center">
                {/* <Sparkles className="w-4 h-4 text-white" /> */}
                <img src={logo} alt="" className="w-10 h-10" />
              </div>

              <span className="font-semibold text-foreground">
                NUBTK CSE
              </span>
            </div>
          </div>

          {/* Right Side */}
          <div className="relative flex items-center gap-3">
            <button
              onClick={handleUserClick}
              className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-foreground hover:bg-muted transition"
            >
              {userName ? (
                userName.charAt(0).toUpperCase()
              ) : (
                <User className="h-4 w-4" />
              )}
            </button>

            {/* Dropdown */}
            {openDropdown && (
  <div className="absolute right-0 top-12 z-50 w-56 rounded-xl border border-border bg-background shadow-lg p-2 animate-in fade-in zoom-in-95">
    
    <div className="border-b border-border px-3 py-2 mb-1 flex items-center gap-2.5">
      <p className="text-xs text-muted-foreground">
        Signed in as :
      </p>
      <p className="truncate text-sm font-semibold text-foreground">
        {userName}
      </p>
    </div>

    <button
      onClick={handleDashboard}
      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-foreground hover:bg-secondary transition-colors"
    >
      <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
      Dashboard
    </button>

    <button
      onClick={handleLogout}
      className="mt-1 flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
    >
      <LogOut className="h-4 w-4" />
      Logout
    </button>

  </div>
)}
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
        setUserName={setUserName}
      />
    </>
  );
};

export default ChatHeader;