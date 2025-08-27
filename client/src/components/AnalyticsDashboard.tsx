import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FolderOpen,
  CheckCircle,
  Clock,
  DollarSign,
  Target,
  Activity,
  Calendar,
  Award,
  Zap,
} from "lucide-react";

interface AnalyticsData {
  overview: {
    totalProjects: number;
    activeProjects: number;
    totalTasks: number;
    completedTasks: number;
    teamMembers: number;
    onlineUsers: number;
  };
  performance: {
    projectProgress: number;
    taskCompletion: number;
    teamProductivity: number;
  };
  trends: {
    projects: Array<{ date: string; count: number }>;
    tasks: Array<{ date: string; completed: number; total: number }>;
    users: Array<{ date: string; active: number }>;
  };
  teamPerformance: Array<{
    name: string;
    tasks: number;
    completed: number;
    productivity: number;
    avatar: string;
  }>;
  projectStatus: Array<{
    status: string;
    count: number;
    color: string;
  }>;
  recentActivity: Array<{
    action: string;
    description: string;
    user: string;
    timestamp: string;
    type: "project" | "task" | "document" | "user";
  }>;
}

const AnalyticsDashboard: React.FC = () => {
  const [timeframe, setTimeframe] = useState("30d");
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  const mockData: AnalyticsData = {
    overview: {
      totalProjects: 24,
      activeProjects: 18,
      totalTasks: 156,
      completedTasks: 89,
      teamMembers: 12,
      onlineUsers: 8,
    },
    performance: {
      projectProgress: 78,
      taskCompletion: 67,
      teamProductivity: 84,
    },
    trends: {
      projects: [
        { date: "Jan", count: 3 },
        { date: "Feb", count: 5 },
        { date: "Mar", count: 7 },
        { date: "Apr", count: 6 },
        { date: "May", count: 8 },
        { date: "Jun", count: 10 },
      ],
      tasks: [
        { date: "Jan", completed: 12, total: 20 },
        { date: "Feb", completed: 18, total: 25 },
        { date: "Mar", completed: 22, total: 30 },
        { date: "Apr", completed: 19, total: 28 },
        { date: "May", completed: 25, total: 35 },
        { date: "Jun", completed: 32, total: 40 },
      ],
      users: [
        { date: "Jan", active: 8 },
        { date: "Feb", active: 9 },
        { date: "Mar", active: 10 },
        { date: "Apr", active: 11 },
        { date: "May", active: 12 },
        { date: "Jun", active: 12 },
      ],
    },
    teamPerformance: [
      {
        name: "John Doe",
        tasks: 15,
        completed: 12,
        productivity: 92,
        avatar:
          "https://ui-avatars.com/api/?name=John+Doe&background=3B82F6&color=fff&size=150",
      },
      {
        name: "Sarah Johnson",
        tasks: 18,
        completed: 16,
        productivity: 89,
        avatar:
          "https://ui-avatars.com/api/?name=Sarah+Johnson&background=10B981&color=fff&size=150",
      },
      {
        name: "Mike Chen",
        tasks: 12,
        completed: 10,
        productivity: 85,
        avatar:
          "https://ui-avatars.com/api/?name=Mike+Chen&background=F59E0B&color=fff&size=150",
      },
      {
        name: "Alex Rodriguez",
        tasks: 20,
        completed: 18,
        productivity: 95,
        avatar:
          "https://ui-avatars.com/api/?name=Alex+Rodriguez&background=8B5CF6&color=fff&size=150",
      },
    ],
    projectStatus: [
      { status: "Active", count: 18, color: "#10B981" },
      { status: "Planning", count: 4, color: "#3B82F6" },
      { status: "Completed", count: 2, color: "#8B5CF6" },
    ],
    recentActivity: [
      {
        action: "Project Created",
        description: "Website Redesign project created",
        user: "John Doe",
        timestamp: "2 hours ago",
        type: "project",
      },
      {
        action: "Task Completed",
        description: "Frontend design completed",
        user: "Sarah Johnson",
        timestamp: "4 hours ago",
        type: "task",
      },
      {
        action: "Document Updated",
        description: "API documentation updated",
        user: "Mike Chen",
        timestamp: "6 hours ago",
        type: "document",
      },
      {
        action: "Team Member Added",
        description: "Emily Davis joined the team",
        user: "Alex Rodriguez",
        timestamp: "1 day ago",
        type: "user",
      },
    ],
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setAnalyticsData(mockData);
      setLoading(false);
    }, 1000);
  }, [timeframe]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return <div>No analytics data available</div>;
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "project":
        return <FolderOpen size={16} className="text-blue-600" />;
      case "task":
        return <CheckCircle size={16} className="text-green-600" />;
      case "document":
        return <Activity size={16} className="text-purple-600" />;
      case "user":
        return <Users size={16} className="text-orange-600" />;
      default:
        return <Activity size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Comprehensive insights into your team's performance and productivity
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="input"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Projects
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.totalProjects}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <FolderOpen className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+12% from last month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Projects
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.activeProjects}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Target className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+8% from last month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Task Completion
              </p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.completedTasks}/
                {analyticsData.overview.totalTasks}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-600">+15% from last month</span>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Team Members</p>
              <p className="text-2xl font-bold text-gray-900">
                {analyticsData.overview.teamMembers}
              </p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Users className="h-6 w-6 text-orange-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-green-600">
              {analyticsData.overview.onlineUsers} online now
            </span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Project Progress
          </h3>
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${
                    (analyticsData.performance.projectProgress / 100) * 226
                  } 226`}
                  className="text-blue-600"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xl font-bold text-gray-900">
                {analyticsData.performance.projectProgress}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Average completion rate
            </p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Task Completion
          </h3>
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${
                    (analyticsData.performance.taskCompletion / 100) * 226
                  } 226`}
                  className="text-green-600"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xl font-bold text-gray-900">
                {analyticsData.performance.taskCompletion}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Tasks completed on time
            </p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Team Productivity
          </h3>
          <div className="text-center">
            <div className="relative inline-flex items-center justify-center w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-gray-200"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="36"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={`${
                    (analyticsData.performance.teamProductivity / 100) * 226
                  } 226`}
                  className="text-purple-600"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-xl font-bold text-gray-900">
                {analyticsData.performance.teamProductivity}%
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Overall team efficiency
            </p>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Project Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsData.trends.projects}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#3B82F6"
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Task Completion Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Task Completion Trends
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={analyticsData.trends.tasks}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area
                type="monotone"
                dataKey="completed"
                stackId="1"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.6}
              />
              <Area
                type="monotone"
                dataKey="total"
                stackId="1"
                stroke="#6B7280"
                fill="#6B7280"
                fillOpacity={0.3}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Team Performance and Project Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Performance */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Team Performance
          </h3>
          <div className="space-y-4">
            {analyticsData.teamPerformance.map((member, index) => (
              <div key={index} className="flex items-center space-x-3">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">
                      {member.name}
                    </span>
                    <span className="text-sm text-gray-600">
                      {member.completed}/{member.tasks} tasks
                    </span>
                  </div>
                  <div className="mt-1 flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${member.productivity}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-500">
                      {member.productivity}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Status Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Project Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={analyticsData.projectStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ status, percent }) =>
                  `${status} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {analyticsData.projectStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-4">
          {analyticsData.recentActivity.map((activity, index) => (
            <div
              key={index}
              className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg"
            >
              <div className="flex-shrink-0 mt-1">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action}
                </p>
                <p className="text-sm text-gray-600">{activity.description}</p>
                <div className="mt-1 flex items-center space-x-2 text-xs text-gray-500">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.timestamp}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
