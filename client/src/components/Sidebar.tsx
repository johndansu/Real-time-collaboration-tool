import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  FolderOpen,
  FileText,
  Users,
  MessageCircle,
  Video,
  BarChart3,
  Plus,
  Settings,
  HelpCircle,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Sidebar: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "Projects", href: "/projects", icon: FolderOpen },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "Team", href: "/team", icon: Users },
    { name: "Chat", href: "/chat", icon: MessageCircle },
    { name: "Video Call", href: "/video", icon: Video },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div
      className={`bg-white border-r border-gray-200 flex flex-col transition-all duration-300 ease-in-out shadow-sm ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      {/* Header */}
      <div
        className={`border-b border-gray-200 ${isCollapsed ? "p-3" : "p-4"}`}
      >
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <h1 className="text-xl font-bold text-gray-900">CollabTool</h1>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>
      </div>

      {/* New Project Button */}
      <div
        className={`border-b border-gray-200 ${isCollapsed ? "p-3" : "p-4"}`}
      >
        <Link
          to="/projects"
          className={`flex items-center justify-center w-full text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-sm ${
            isCollapsed ? "px-2 py-2" : "px-4 py-2"
          }`}
          title={isCollapsed ? "New Project" : ""}
        >
          <Plus className="w-4 h-4" />
          {!isCollapsed && <span className="ml-2">New Project</span>}
        </Link>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 space-y-1 ${isCollapsed ? "p-3" : "p-4"}`}>
        {navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex items-center text-sm font-medium rounded-lg transition-colors group ${
                isActive(item.href)
                  ? "bg-blue-100 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
              } ${isCollapsed ? "justify-center px-2 py-2" : "px-3 py-2"}`}
              title={isCollapsed ? item.name : ""}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 ${
                  isActive(item.href)
                    ? "text-blue-600"
                    : "text-gray-500 group-hover:text-gray-700"
                } ${isCollapsed ? "mr-0" : "mr-3"}`}
              />
              {!isCollapsed && item.name}
            </Link>
          );
        })}
      </nav>

      {/* User Section */}
      <div
        className={`border-t border-gray-200 ${isCollapsed ? "p-3" : "p-4"}`}
      >
        <div
          className={`flex items-center ${
            isCollapsed ? "justify-center" : "space-x-3"
          }`}
        >
          <img
            src={
              user?.avatar ||
              `https://ui-avatars.com/api/?name=${
                user?.username || "User"
              }&background=3B82F6&color=fff&size=150`
            }
            alt={user?.username}
            className="w-10 h-10 rounded-full object-cover flex-shrink-0 border-2 border-gray-200"
          />
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.username}
              </p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
          )}
        </div>

        {!isCollapsed && (
          <div className="mt-3 space-y-1">
            <Link
              to="/settings"
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-4 h-4 mr-3" />
              Settings
            </Link>
            <Link
              to="/help"
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <HelpCircle className="w-4 h-4 mr-3" />
              Help
            </Link>
            <button
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-sm text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut className="w-4 h-4 mr-3" />
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
