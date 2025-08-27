import React, { useState } from "react";
import {
  Plus,
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  MapPin,
  Calendar,
  UserPlus,
  MessageSquare,
  Video,
} from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  location: string;
  avatar: string;
  status: "online" | "offline" | "away" | "busy";
  department: string;
  joinDate: Date;
  projects: string[];
  skills: string[];
}

const Team: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: "1",
      name: "John Doe",
      role: "Project Manager",
      email: "john.doe@company.com",
      phone: "+1 (555) 123-4567",
      location: "New York, NY",
      avatar:
        "https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff&size=150",
      status: "online",
      department: "Project Management",
      joinDate: new Date("2022-01-15"),
      projects: ["Website Redesign", "Mobile App Development"],
      skills: ["Project Management", "Agile", "Team Leadership"],
    },
    {
      id: "2",
      name: "Sarah Johnson",
      role: "Senior Developer",
      email: "sarah.johnson@company.com",
      phone: "+1 (555) 234-5678",
      location: "San Francisco, CA",
      avatar:
        "https://ui-avatars.com/api/?name=Sarah+Johnson&background=10B981&color=fff&size=150",
      status: "online",
      department: "Engineering",
      joinDate: new Date("2021-08-20"),
      projects: ["Mobile App Development", "API Development"],
      skills: ["React Native", "Node.js", "TypeScript", "API Design"],
    },
    {
      id: "3",
      name: "Mike Chen",
      role: "Marketing Specialist",
      email: "mike.chen@company.com",
      phone: "+1 (555) 345-6789",
      location: "Los Angeles, CA",
      avatar:
        "https://ui-avatars.com/api/?name=Mike+Chen&background=F59E0B&color=fff&size=150",
      status: "away",
      department: "Marketing",
      joinDate: new Date("2022-03-10"),
      projects: ["Marketing Campaign Q4"],
      skills: ["Digital Marketing", "Content Strategy", "Analytics"],
    },
    {
      id: "4",
      name: "Alex Rodriguez",
      role: "DevOps Engineer",
      email: "alex.rodriguez@company.com",
      phone: "+1 (555) 456-7890",
      location: "Austin, TX",
      avatar:
        "https://ui-avatars.com/api/?name=Alex+Rodriguez&background=8B5CF6&color=fff&size=150",
      status: "busy",
      department: "Engineering",
      joinDate: new Date("2021-11-05"),
      projects: ["Database Migration", "Infrastructure Setup"],
      skills: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    },
    {
      id: "5",
      name: "Emily Davis",
      role: "UI/UX Designer",
      email: "emily.davis@company.com",
      phone: "+1 (555) 567-8901",
      location: "Seattle, WA",
      avatar:
        "https://ui-avatars.com/api/?name=Emily+Davis&background=EF4444&color=fff&size=150",
      status: "online",
      department: "Design",
      joinDate: new Date("2022-02-28"),
      projects: ["Website Redesign", "Mobile App Development"],
      skills: ["Figma", "Adobe Creative Suite", "User Research", "Prototyping"],
    },
  ]);

  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500";
      case "away":
        return "bg-yellow-500";
      case "busy":
        return "bg-red-500";
      case "offline":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online";
      case "away":
        return "Away";
      case "busy":
        return "Busy";
      case "offline":
        return "Offline";
      default:
        return "Unknown";
    }
  };

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch =
      member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment =
      departmentFilter === "all" || member.department === departmentFilter;
    const matchesStatus =
      statusFilter === "all" || member.status === statusFilter;
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const departments = Array.from(new Set(teamMembers.map((m) => m.department)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-600 mt-1">
            Manage your team members and collaboration
          </p>
        </div>
        <button className="btn btn-primary px-4 py-2">
          <UserPlus size={20} className="mr-2" />
          Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.length}
              </p>
            </div>
          </div>
        </div>
        <div className="card p-4">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Online</p>
              <p className="text-2xl font-bold text-gray-900">
                {teamMembers.filter((m) => m.status === "online").length}
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
              <p className="text-sm font-medium text-gray-600">Departments</p>
              <p className="text-2xl font-bold text-gray-900">
                {departments.length}
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
                Active Projects
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {
                  Array.from(new Set(teamMembers.flatMap((m) => m.projects)))
                    .length
                }
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
                placeholder="Search team members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input pl-10 w-full"
              />
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-gray-400" />
            <select
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="away">Away</option>
              <option value="busy">Busy</option>
              <option value="offline">Offline</option>
            </select>
          </div>
        </div>
      </div>

      {/* Team Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="card p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div
                    className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getStatusColor(
                      member.status
                    )}`}
                  />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {member.name}
                  </h3>
                  <p className="text-sm text-gray-600">{member.role}</p>
                  <span className="text-xs text-gray-500">
                    {member.department}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Mail size={16} />
                <span>{member.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Phone size={16} />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <MapPin size={16} />
                <span>{member.location}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar size={16} />
                <span>Joined {member.joinDate.toLocaleDateString()}</span>
              </div>
            </div>

            {/* Projects */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">
                Active Projects
              </h4>
              <div className="flex flex-wrap gap-1">
                {member.projects.map((project, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {project}
                  </span>
                ))}
              </div>
            </div>

            {/* Skills */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Skills</h4>
              <div className="flex flex-wrap gap-1">
                {member.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg">
                  <MessageSquare size={20} />
                </button>
                <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg">
                  <Video size={20} />
                </button>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  member.status === "online"
                    ? "text-green-600 bg-green-100"
                    : member.status === "away"
                    ? "text-yellow-600 bg-yellow-100"
                    : member.status === "busy"
                    ? "text-red-600 bg-red-100"
                    : "text-gray-600 bg-gray-100"
                }`}
              >
                {getStatusText(member.status)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No team members found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || departmentFilter !== "all" || statusFilter !== "all"
              ? "Try adjusting your search or filters"
              : "Get started by adding your first team member"}
          </p>
          {!searchQuery &&
            departmentFilter === "all" &&
            statusFilter === "all" && (
              <button className="btn btn-primary px-4 py-2">
                <UserPlus size={20} className="mr-2" />
                Add Team Member
              </button>
            )}
        </div>
      )}
    </div>
  );
};

export default Team;
