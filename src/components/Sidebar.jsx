import {
  LayoutDashboard,
  CheckSquare,
  Target,
  CalendarDays,
  Flame,
  BookOpen,
  Briefcase,
  Play,
  FileText,
  Wallet,
  Settings,
  Brain,
  TrendingUp,
  Pencil,
  BookHeart,
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

// ==========================================
// MENU ITEMS
// ==========================================

const menuItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/",
  },

  {
    name: "My Tasks",
    icon: CheckSquare,
    path: "/tasks",
  },

  {
    name: "Goals",
    icon: Target,
    path: "/goals",
  },

  {
    name: "Planner",
    icon: CalendarDays,
    path: "/planner",
  },

  {
    name: "Habits",
    icon: Flame,
    path: "/habits",
  },

  // ==========================================
  // STUDY
  // ==========================================

  {
    name: "Study",
    icon: BookOpen,
    path: "/study",
  },

  {
    name: "Study Notes",
    icon: FileText,
    path: "/study-notes",
  },
{
  name: "Journal",
  icon: BookHeart,
  path: "/journal",
},
  // ==========================================
  // LEARNING
  // ==========================================

  {
    name: "Learning",
    icon: Brain,
    path: "/learning",
  },

  // ==========================================
  // QUICK NOTES
  // ==========================================

  {
    name: "Quick Notes",
    icon: Pencil,
    path: "/quick-notes",
  },

  // ==========================================
  // TRADING
  // ==========================================

  {
    name: "Trading",
    icon: TrendingUp,
    path: "/trading",
  },

  // ==========================================
  // WORK / BUSINESS
  // ==========================================

  {
    name: "Clients",
    icon: Briefcase,
    path: "/clients",
  },

  // ==========================================
  // CONTENT
  // ==========================================

  {
    name: "YouTube",
    icon: Play,
    path: "/youtube",
  },

  {
    name: "Scripts",
    icon: FileText,
    path: "/scripts",
  },

  // ==========================================
  // MONEY
  // ==========================================

  {
    name: "Money",
    icon: Wallet,
    path: "/money",
  },

  // ==========================================
  // SETTINGS
  // ==========================================

  {
    name: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

// ==========================================
// SIDEBAR COMPONENT
// ==========================================

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="sidebar">

      {/* =====================================
          LOGO
      ===================================== */}

      <div
        className="logo"
        onClick={() => navigate("/")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            navigate("/");
          }
        }}
      >
        <div className="logo-icon">
          ✓
        </div>

        <span>
          MY LIFE
        </span>
      </div>

      {/* =====================================
          NAVIGATION
      ===================================== */}

      <nav className="sidebar-nav">

        {menuItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            location.pathname === item.path;

          return (
            <button
              key={item.name}
              type="button"
              className={`nav-item ${
                isActive ? "active" : ""
              }`}
              onClick={() => navigate(item.path)}
            >
              <Icon
                size={19}
                strokeWidth={2}
              />

              <span>
                {item.name}
              </span>
            </button>
          );
        })}

      </nav>

      {/* =====================================
          SIDEBAR BOTTOM
      ===================================== */}

      <div className="sidebar-bottom">

        <div className="life-status">

          <div className="status-dot"></div>

          <div className="status-text">
            <strong>
              Life OS
            </strong>

            <span>
              You're on track
            </span>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;