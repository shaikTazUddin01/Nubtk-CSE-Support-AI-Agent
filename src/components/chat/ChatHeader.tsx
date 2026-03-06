import { Sparkles, Menu, User } from "lucide-react";
import { useState, useEffect } from "react";
import AuthModal from "./AuthModal";

interface ChatHeaderProps {
  onMenuClick?: () => void;
}

const ChatHeader = ({ onMenuClick }: ChatHeaderProps) => {

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
      setOpenDropdown(!openDropdown);
    } else {
      setOpenModal(true);
    }
  };

  const handleLogout = () => {
  localStorage.removeItem("user");

  setUserName(null);
  setOpenDropdown(false);

  alert("Logout successful 👋");
};

  return (
    <>
      <header className="border-b border-border/50">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3 ">

          <div className="flex items-center gap-3">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors md:hidden"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full gradient-accent flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>

              <span className="font-semibold text-foreground">
                NUBTK CSE
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 relative">

            <div
              onClick={handleUserClick}
              className="cursor-pointer w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-sm font-medium text-foreground"
            >
              {userName ? userName.charAt(0).toUpperCase() : <User className="h-4" />}
            </div>

            {openDropdown && (
             <div className="absolute right-0 top-12 w-40 rounded-xl border border-border bg-white shadow-xl p-2 animate-in fade-in zoom-in-95">
  <button
    onClick={handleLogout}
    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
  >
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