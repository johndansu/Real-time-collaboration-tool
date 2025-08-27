import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  FolderOpen,
  Users,
  Calendar,
  Search,
  Filter,
} from "lucide-react";

interface Project {
  id: string;
  name: string;
  description: string;
  owner: string;
  members: number;
  status: "active" | "completed" | "archived";
  progress: number;
  lastModified: Date;
  dueDate?: Date;
}

const Projects: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Website Redesign",
      description:
        "Complete overhaul of company website with modern design and improved UX",
      owner: "John Doe",
      members: 4,
      status: "active",
      progress: 65,
      lastModified: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
    {
      id: "2",
      name: "Mobile App Development",
      description: "iOS and Android app for customer engagement and support",
      owner: "Sarah Johnson",
      members: 6,
      status: "active",
      progress: 35,
      lastModified: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    },
    {
      id: "3",
      name: "Marketing Campaign Q4",
      description: "Holiday season marketing campaign across all channels",
      owner: "Mike Chen",
      members: 3,
      status: "active",
      progress: 80,
      lastModified: new Date(Date.now() - 12 * 60 * 60 * 1000),
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    },
    {
      id: "4",
      name: "Database Migration",
      description: "Migrate from legacy system to new cloud-based database",
      owner: "Alex Rodriguez",
      members: 2,
      status: "completed",
      progress: 100,
      lastModified: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      case "archived":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || project.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage and track your team projects
          </p>
        </div>
        <button
          onClick={() => setShowNewProjectForm(true)}
          className="btn btn-primary px-4 py-2"
        >
          <Plus size={20} className="mr-2" />
          New Project
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">
                Total Projects
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter((p) => p.status === "active").length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.filter((p) => p.status === "completed").length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {projects.reduce((acc, p) => acc + p.members, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="card p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <Link
            key={project.id}
            to={`/project/${project.id}`}
            className="card p-6 hover:shadow-lg transition-shadow cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-primary-100 rounded-lg">
                <FolderOpen className="h-6 w-6 text-primary-600" />
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                  project.status
                )}`}
              >
                {project.status}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {project.name}
            </h3>
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {project.description}
            </p>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(
                    project.progress
                  )}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            {/* Project Meta */}
            <div className="space-y-2 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <Users size={16} />
                <span>{project.members} members</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar size={16} />
                <span>
                  Modified {project.lastModified.toLocaleDateString()}
                </span>
              </div>
              {project.dueDate && (
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>Due {project.dueDate.toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <FolderOpen className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No projects found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by creating your first project"}
          </p>
          {!searchQuery && statusFilter === "all" && (
            <button
              onClick={() => setShowNewProjectForm(true)}
              className="btn btn-primary px-4 py-2"
            >
              <Plus size={20} className="mr-2" />
              Create Project
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Projects;
