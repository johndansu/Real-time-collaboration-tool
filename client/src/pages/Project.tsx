import React, { useState } from "react";
import { useParams } from "react-router-dom";
import TaskManager from "../components/TaskManager";
import FileUpload from "../components/FileUpload";
import {
  FileText,
  Users,
  Clock,
  Edit3,
  FolderOpen,
  Calendar,
  BarChart3,
} from "lucide-react";

const Project: React.FC = () => {
  const { projectId } = useParams();
  const [activeTab, setActiveTab] = useState<
    "overview" | "tasks" | "files" | "team"
  >("overview");

  const [projectData] = useState({
    id: projectId,
    name: "Website Redesign Project",
    description:
      "Complete overhaul of company website with modern design, improved UX, and mobile responsiveness.",
    owner: "John Doe",
    members: [
      {
        id: "1",
        name: "John Doe",
        role: "Project Manager",
        avatar: "https://ui-avatars.com/api/?name=John+Doe&background=random",
      },
      {
        id: "2",
        name: "Sarah Johnson",
        role: "UI/UX Designer",
        avatar:
          "https://ui-avatars.com/api/?name=Sarah+Johnson&background=random",
      },
      {
        id: "3",
        name: "Mike Chen",
        role: "Frontend Developer",
        avatar: "https://ui-avatars.com/api/?name=Mike+Chen&background=random",
      },
      {
        id: "4",
        name: "Alex Rodriguez",
        role: "Backend Developer",
        avatar:
          "https://ui-avatars.com/api/?name=Alex+Rodriguez&background=random",
      },
    ],
    status: "In Progress",
    progress: 65,
    startDate: new Date("2024-01-15"),
    endDate: new Date("2024-06-30"),
    budget: "$25,000",
    documents: 12,
    tasks: 28,
  });

  const tabs = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "tasks", label: "Tasks", icon: Clock },
    { id: "files", label: "Files", icon: FolderOpen },
    { id: "team", label: "Team", icon: Users },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="space-y-6">
            {/* Project Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="card p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Clock className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Progress
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projectData.progress}%
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${projectData.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <FileText className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Documents
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projectData.documents}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Clock className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Tasks</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projectData.tasks}
                    </p>
                  </div>
                </div>
              </div>

              <div className="card p-4">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">
                      Team Members
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {projectData.members.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Details */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Project Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Status:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {projectData.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Start Date:</span>
                    <span className="text-sm text-gray-900">
                      {projectData.startDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">End Date:</span>
                    <span className="text-sm text-gray-900">
                      {projectData.endDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Budget:</span>
                    <span className="text-sm text-gray-900">
                      {projectData.budget}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        Sarah updated the homepage design
                      </p>
                      <p className="text-xs text-gray-500">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        Mike completed user authentication
                      </p>
                      <p className="text-xs text-gray-500">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                    <div>
                      <p className="text-sm text-gray-900">
                        New team member Alex joined
                      </p>
                      <p className="text-xs text-gray-500">3 days ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "tasks":
        return <TaskManager projectId={projectId || "default"} />;

      case "files":
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Project Files
              </h2>
              <p className="text-gray-600">
                Upload and manage project documents, images, and other files
              </p>
            </div>
            <FileUpload projectId={projectId || "default"} />
          </div>
        );

      case "team":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Team Members
                </h2>
                <p className="text-gray-600">
                  Manage your project team and their roles
                </p>
              </div>
              <button className="btn btn-primary px-4 py-2">
                <Users size={20} className="mr-2" />
                Invite Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projectData.members.map((member) => (
                <div key={member.id} className="card p-6 text-center">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4"
                  />
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">{member.role}</p>
                  <div className="flex items-center justify-center space-x-2">
                    <button className="btn btn-outline px-3 py-1 text-sm">
                      <Edit3 size={16} className="mr-1" />
                      Edit
                    </button>
                    <button className="btn btn-outline px-3 py-1 text-sm text-red-600 hover:text-red-700">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Project Header */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FolderOpen className="h-8 w-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {projectData.name}
                </h1>
                <p className="text-gray-600 mt-1">{projectData.description}</p>
              </div>
            </div>
            <div className="flex items-center space-x-6 mt-4 text-sm text-gray-500">
              <span className="flex items-center space-x-1">
                <Users size={16} />
                <span>Owned by {projectData.owner}</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>Due {projectData.endDate.toLocaleDateString()}</span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button className="btn btn-outline px-4 py-2">
              <Edit3 size={20} className="mr-2" />
              Edit Project
            </button>
            <button className="btn btn-primary px-4 py-2">
              <FileText size={20} className="mr-2" />
              New Document
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={20} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Project;
