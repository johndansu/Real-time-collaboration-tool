import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  FolderOpen,
  FileText,
  Users,
  Clock,
  TrendingUp,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  members: Array<{
    userId: string;
    role: string;
    joinedAt: string;
  }>;
  documents: string[];
  createdAt: string;
  updatedAt: string;
}

interface RecentActivity {
  id: string;
  type: "document_edit" | "project_create" | "member_join" | "comment";
  description: string;
  timestamp: string;
  userId: string;
  username: string;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setProjects([
        {
          id: "1",
          name: "Website Redesign",
          description:
            "Complete overhaul of company website with modern design",
          ownerId: user?.id || "",
          members: [
            {
              userId: user?.id || "",
              role: "owner",
              joinedAt: new Date().toISOString(),
            },
            { userId: "2", role: "member", joinedAt: new Date().toISOString() },
          ],
          documents: ["doc1", "doc2"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Mobile App Development",
          description: "iOS and Android app for customer engagement",
          ownerId: "2",
          members: [
            { userId: "2", role: "owner", joinedAt: new Date().toISOString() },
            {
              userId: user?.id || "",
              role: "member",
              joinedAt: new Date().toISOString(),
            },
          ],
          documents: ["doc3"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]);

      setRecentActivity([
        {
          id: "1",
          type: "document_edit",
          description: "Updated homepage content in Website Redesign",
          timestamp: new Date().toISOString(),
          userId: user?.id || "",
          username: user?.username || "",
        },
        {
          id: "2",
          type: "member_join",
          description: "Sarah joined Mobile App Development project",
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          userId: "3",
          username: "Sarah",
        },
      ]);

      setLoading(false);
    }, 1000);
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back, {user?.username}! 👋
        </h1>
        <p className="text-primary-100">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Active Projects
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Documents</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.reduce(
                  (acc, project) => acc + project.documents.length,
                  0
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.reduce(
                  (acc, project) => acc + project.members.length,
                  0
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Hours Today</p>
              <p className="text-2xl font-bold text-gray-900">4.5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Projects
            </h2>
            <Link
              to="/projects"
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View all
            </Link>
          </div>

          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <div
                key={project.id}
                className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50"
              >
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FolderOpen className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {project.name}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {project.description}
                  </p>
                </div>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Users className="h-4 w-4" />
                  <span>{project.members.length}</span>
                </div>
              </div>
            ))}
          </div>

          <button className="w-full mt-4 flex items-center justify-center space-x-2 py-2 px-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-primary-400 hover:text-primary-600 transition-colors">
            <Plus className="h-5 w-5" />
            <span>Create New Project</span>
          </button>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Activity
            </h2>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all
            </button>
          </div>

          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="h-4 w-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-900">
                    <span className="font-medium">{activity.username}</span>{" "}
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(activity.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <Plus className="h-6 w-6 text-primary-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">New Document</p>
              <p className="text-sm text-gray-500">Create a new document</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <Users className="h-6 w-6 text-primary-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Invite Team</p>
              <p className="text-sm text-gray-500">Add new members</p>
            </div>
          </button>

          <button className="flex items-center space-x-3 p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
            <Calendar className="h-6 w-6 text-primary-600" />
            <div className="text-left">
              <p className="font-medium text-gray-900">Schedule Meeting</p>
              <p className="text-sm text-gray-500">Plan team sync</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
