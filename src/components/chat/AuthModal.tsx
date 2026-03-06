import { useState } from "react";
import { X } from "lucide-react";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  setUserName: (name: string) => void;
}

const AuthModal = ({ isOpen, onClose, setUserName }: AuthModalProps) => {
  const [tab, setTab] = useState<"login" | "register">("login");

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      alert("No user found. Please register first.");
      return;
    }

    const user = JSON.parse(storedUser);

    if (
      user.email === loginData.email &&
      user.password === loginData.password
    ) {
      alert("Login Successful ✅");

      setUserName(user.name);

      onClose();
    } else {
      alert("Invalid email or password ❌");
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    localStorage.setItem("user", JSON.stringify(registerData));

    alert("Registration Successful 🎉");

    setTab("login");
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white rounded-xl w-[400px] shadow-xl p-6 relative">

        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-500 hover:text-black"
        >
          <X size={20} />
        </button>

        <div className="flex mb-6 border-b">
          <button
            onClick={() => setTab("login")}
            className={`flex-1 py-2 font-medium ${
              tab === "login"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Login
          </button>

          <button
            onClick={() => setTab("register")}
            className={`flex-1 py-2 font-medium ${
              tab === "register"
                ? "border-b-2 border-blue-500 text-blue-500"
                : "text-gray-500"
            }`}
          >
            Register
          </button>
        </div>

        {tab === "login" && (
          <form onSubmit={handleLogin} className="flex flex-col gap-4">

            <input
              type="email"
              placeholder="Email"
              className="border rounded-lg px-3 py-2 outline-none text-black"
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="border rounded-lg px-3 py-2 outline-none text-black"
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
            />

            <button className="bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600">
              Login
            </button>
          </form>
        )}

        {tab === "register" && (
          <form onSubmit={handleRegister} className="flex flex-col gap-4">

            <input
              type="text"
              placeholder="Name"
              className="border rounded-lg px-3 py-2 outline-none text-black"
              onChange={(e) =>
                setRegisterData({ ...registerData, name: e.target.value })
              }
            />

            <input
              type="email"
              placeholder="Email"
              className="border rounded-lg px-3 py-2 outline-none text-black"
              onChange={(e) =>
                setRegisterData({ ...registerData, email: e.target.value })
              }
            />

            <input
              type="password"
              placeholder="Password"
              className="border rounded-lg px-3 py-2 outline-none text-black"
              onChange={(e) =>
                setRegisterData({ ...registerData, password: e.target.value })
              }
            />

            <button className="bg-green-500 text-white py-2 rounded-lg hover:bg-green-600">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AuthModal;