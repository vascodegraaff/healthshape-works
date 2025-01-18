import { Dumbbell, BarChart2, Users, User, History } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Dumbbell, label: "Workout", path: "/" },
    { icon: History, label: "History", path: "/history" },
    { icon: BarChart2, label: "Exercises", path: "/exercises" },
    { icon: Users, label: "Social", path: "/social" },
    { icon: User, label: "Me", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border pb-safe">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 ${
                isActive ? "text-accent" : "text-muted-foreground"
              }`}
            >
              <item.icon className={`w-6 h-6 ${isActive ? "text-accent" : "text-muted-foreground"}`} />
              {/* <span className="text-xs">{item.label}</span> */}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;