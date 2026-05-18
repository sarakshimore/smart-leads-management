import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { useAuth } from "../context/AuthContext";
import { Badge } from "./ui/badge";
import { LogOut } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";

const Navbar = () => {
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="sticky top-0 z-50 border-b border-white/30 bg-white/58 backdrop-blur-2xl dark:border-white/8 dark:bg-slate-950/40">
      <div className="mx-auto flex min-h-20 max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="min-w-0">
            <div className="flex min-w-0 items-center gap-3">
              <div className="min-w-0">
                <Link to="/" className="block">
                  <h1 className="truncate text-lg font-semibold tracking-tight sm:text-xl hover:opacity-80">
                    Smart Leads Management
                  </h1>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3"> 
          {user?.role === "admin" && (
            <Link to="/users">
              <Button
                variant="outline"
                className="h-10 rounded-xl px-3.5 text-sm font-medium"
              >
                Users
              </Button>
            </Link>
          )}

          <div className="hidden items-center gap-3 rounded-[1.1rem] border-none px-3 py-2 md:flex">
            <div className="text-left">
              <p className="max-w-44 truncate text-sm font-semibold">{user?.name}</p>
              <div className="mt-1 flex items-center gap-2">
                <Badge variant="outline" className="h-6 rounded-full border-primary/20 bg-primary/8 px-2.5 text-[11px] font-medium capitalize text-primary">
                  {user?.role}
                </Badge>
              </div>
            </div>
          </div>

          <div className="md:hidden">
            <Badge variant="outline" className="h-9 rounded-full border-primary/20 bg-primary/8 px-3 font-medium capitalize text-primary">
              {user?.role}
            </Badge>
          </div>

          <ThemeToggle />

          <Button
            variant="outline"
            className="h-10 cursor-pointer rounded-xl border-rose-200/70 bg-rose-50/85 px-3.5 text-rose-700 shadow-none hover:bg-rose-100/90 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-200 dark:hover:bg-rose-500/15"
            onClick={handleLogout}
          >
            <LogOut />
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </div>

      
    </div>
  );
};

export default Navbar;
