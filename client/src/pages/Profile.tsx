import React, { useState } from "react";
import {
  User,
  Mail,
  MapPin,
  Building,
  Briefcase,
  Calendar,
  Award,
  Activity,
  Edit,
  Camera,
  Star,
  Users,
  FileText,
  MessageCircle,
  Clock,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  // Mock data - in a real app, this would come from the backend
  const userStats = {
    projectsCreated: 12,
    documentsEdited: 45,
    teamMembers: 8,
    totalCollaborations: 156,
    averageRating: 4.8,
    responseTime: "2.3 hours",
  };

  const recentActivity = [
    {
      id: 1,
      type: "project_created",
      description: "Created new project 'Mobile App Redesign'",
      timestamp: "2 hours ago",
      icon: "📱",
    },
    {
      id: 2,
      type: "document_edited",
      description: "Updated 'Project Requirements' document",
      timestamp: "4 hours ago",
      icon: "📝",
    },
    {
      id: 3,
      type: "team_joined",
      description: "Joined 'Website Development' team",
      timestamp: "1 day ago",
      icon: "👥",
    },
    {
      id: 4,
      type: "comment_added",
      description: "Added comment to 'Design Mockups'",
      timestamp: "2 days ago",
      icon: "💬",
    },
  ];

  const achievements = [
    {
      id: 1,
      title: "First Project",
      description: "Created your first project",
      icon: "🎯",
      unlocked: true,
      date: "2024-01-15",
    },
    {
      id: 2,
      title: "Team Player",
      description: "Collaborated with 5+ team members",
      icon: "🤝",
      unlocked: true,
      date: "2024-02-20",
    },
    {
      id: 3,
      title: "Document Master",
      description: "Edited 50+ documents",
      icon: "📚",
      unlocked: true,
      date: "2024-03-10",
    },
    {
      id: 4,
      title: "Quick Responder",
      description: "Maintained <2 hour response time for 30 days",
      icon: "⚡",
      unlocked: false,
      date: null,
    },
  ];

  const tabs = [
    { id: "overview", name: "Overview", icon: User },
    { id: "activity", name: "Activity", icon: Activity },
    { id: "achievements", name: "Achievements", icon: Award },
    { id: "teams", name: "Teams", icon: Users },
  ];

  const renderOverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {userStats.projectsCreated}
          </div>
          <div className="text-sm text-gray-600">Projects Created</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {userStats.documentsEdited}
          </div>
          <div className="text-sm text-gray-600">Documents Edited</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {userStats.teamMembers}
          </div>
          <div className="text-sm text-gray-600">Team Members</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-orange-600 mb-2">
            {userStats.totalCollaborations}
          </div>
          <div className="text-sm text-gray-600">Total Collaborations</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-yellow-600 mb-2">
            {userStats.averageRating}
          </div>
          <div className="text-sm text-gray-600">Average Rating</div>
        </div>
        <div className="card text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">
            {userStats.responseTime}
          </div>
          <div className="text-sm text-gray-600">Avg Response Time</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
            >
              <span className="text-2xl">{activity.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderActivityTab = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Activity Timeline
        </h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm">{activity.icon}</span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.description}
                </p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
              {index < recentActivity.length - 1 && (
                <div className="absolute left-4 top-8 w-0.5 h-8 bg-gray-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderAchievementsTab = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {achievements.map((achievement) => (
          <div
            key={achievement.id}
            className={`card text-center ${
              achievement.unlocked
                ? "bg-gradient-to-br from-blue-50 to-blue-100"
                : "bg-gray-50"
            }`}
          >
            <div className="text-4xl mb-3">{achievement.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {achievement.title}
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              {achievement.description}
            </p>
            {achievement.unlocked ? (
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <Star className="w-4 h-4" />
                <span className="text-sm font-medium">Unlocked</span>
              </div>
            ) : (
              <div className="text-sm text-gray-500">Locked</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  const renderTeamsTab = () => (
    <div className="space-y-6">
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Teams</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">
                  Website Development
                </h4>
                <p className="text-sm text-gray-600">5 members • Owner</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
              Active
            </span>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Mobile App Team</h4>
                <p className="text-sm text-gray-600">8 members • Member</p>
              </div>
            </div>
            <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
              Active
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return renderOverviewTab();
      case "activity":
        return renderActivityTab();
      case "achievements":
        return renderAchievementsTab();
      case "teams":
        return renderTeamsTab();
      default:
        return renderOverviewTab();
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* Avatar Section */}
          <div className="relative">
            <img
              src={
                user?.avatar ||
                `https://ui-avatars.com/api/?name=${
                  user?.username || "User"
                }&background=3B82F6&color=fff&size=150`
              }
              alt={user?.username}
              className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
            />
            <button className="absolute bottom-0 right-0 p-2 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors">
              <Camera className="w-4 h-4" />
            </button>
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                {user?.username}
              </h1>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>{user?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4" />
                <span>Software Development</span>
              </div>
              <div className="flex items-center space-x-2">
                <Briefcase className="w-4 h-4" />
                <span>Senior Developer</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>San Francisco, CA</span>
              </div>
            </div>

            <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>Joined January 2024</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>Last active 2 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.name}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">{renderTabContent()}</div>
      </div>
    </div>
  );
};

export default Profile;
