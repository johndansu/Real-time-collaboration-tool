const User = require('../models/User');
const Project = require('../models/Project');
const Document = require('../models/Document');

class AnalyticsService {
  // Project Analytics
  async getProjectAnalytics(projectId, timeframe = '30d') {
    const project = await Project.findById(projectId)
      .populate('team.user', 'username email avatar')
      .populate('owner', 'username email avatar');

    if (!project) {
      throw new Error('Project not found');
    }

    const startDate = this.getStartDate(timeframe);
    
    // Task completion trends
    const taskTrends = await this.getTaskCompletionTrends(projectId, startDate);
    
    // Team productivity metrics
    const teamProductivity = await this.getTeamProductivity(projectId, startDate);
    
    // Time tracking analytics
    const timeAnalytics = await this.getTimeAnalytics(projectId, startDate);
    
    // Budget tracking
    const budgetAnalytics = await this.getBudgetAnalytics(project);
    
    // Risk assessment
    const riskAssessment = await this.getRiskAssessment(project);
    
    // Milestone progress
    const milestoneProgress = await this.getMilestoneProgress(project);

    return {
      project: {
        id: project._id,
        name: project.name,
        status: project.status,
        progress: project.progress,
        startDate: project.startDate,
        dueDate: project.dueDate,
        duration: project.duration,
        isOverdue: project.isOverdue
      },
      tasks: {
        total: project.analytics.totalTasks,
        completed: project.analytics.completedTasks,
        pending: project.analytics.totalTasks - project.analytics.completedTasks,
        completionRate: project.analytics.totalTasks > 0 
          ? Math.round((project.analytics.completedTasks / project.analytics.totalTasks) * 100)
          : 0,
        trends: taskTrends
      },
      team: {
        totalMembers: project.team.length,
        activeMembers: project.team.filter(m => m.user.status === 'online').length,
        productivity: teamProductivity,
        roles: this.getRoleDistribution(project.team)
      },
      time: timeAnalytics,
      budget: budgetAnalytics,
      risks: riskAssessment,
      milestones: milestoneProgress,
      activity: {
        recentActivity: project.activityLog.slice(-10).reverse(),
        activityTrend: await this.getActivityTrend(projectId, startDate)
      }
    };
  }

  // Team Analytics
  async getTeamAnalytics(teamId = null, timeframe = '30d') {
    const startDate = this.getStartDate(timeframe);
    
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: 'team.user',
          foreignField: '_id',
          as: 'teamMember'
        }
      },
      {
        $unwind: '$teamMember'
      },
      {
        $group: {
          _id: '$teamMember._id',
          username: { $first: '$teamMember.username' },
          email: { $first: '$teamMember.email' },
          avatar: { $first: '$teamMember.avatar' },
          role: { $first: '$team.role' },
          projects: { $addToSet: '$_id' },
          totalTasks: { $sum: { $size: '$tasks' } },
          completedTasks: { $sum: { $size: { $filter: { input: '$tasks', cond: { $eq: ['$$this.status', 'completed'] } } } } },
          totalHours: { $sum: '$analytics.totalHours' },
          lastActivity: { $max: '$analytics.lastActivity' }
        }
      },
      {
        $addFields: {
          taskCompletionRate: {
            $cond: {
              if: { $gt: ['$totalTasks', 0] },
              then: { $multiply: [{ $divide: ['$completedTasks', '$totalTasks'] }, 100] },
              else: 0
            }
          },
          projectCount: { $size: '$projects' }
        }
      },
      {
        $sort: { taskCompletionRate: -1 }
      }
    ];

    if (teamId) {
      pipeline[0].$match['team.user'] = teamId;
    }

    const teamAnalytics = await Project.aggregate(pipeline);

    // Overall team metrics
    const overallMetrics = {
      totalMembers: teamAnalytics.length,
      averageTaskCompletion: teamAnalytics.reduce((acc, member) => acc + member.taskCompletionRate, 0) / teamAnalytics.length,
      totalProjects: new Set(teamAnalytics.flatMap(m => m.projects)).size,
      totalHours: teamAnalytics.reduce((acc, member) => acc + member.totalHours, 0)
    };

    return {
      overall: overallMetrics,
      members: teamAnalytics,
      trends: await this.getTeamTrends(startDate)
    };
  }

  // User Analytics
  async getUserAnalytics(userId, timeframe = '30d') {
    const startDate = this.getStartDate(timeframe);
    
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Projects owned by user
    const ownedProjects = await Project.find({ owner: userId, createdAt: { $gte: startDate } });
    
    // Projects where user is team member
    const teamProjects = await Project.find({ 
      'team.user': userId, 
      createdAt: { $gte: startDate },
      owner: { $ne: userId }
    });

    // Documents created by user
    const documents = await Document.find({ 
      owner: userId, 
      createdAt: { $gte: startDate } 
    });

    // Activity timeline
    const activityTimeline = await this.getUserActivityTimeline(userId, startDate);

    // Performance metrics
    const performanceMetrics = {
      projectsOwned: ownedProjects.length,
      projectsContributed: teamProjects.length,
      documentsCreated: documents.length,
      totalViews: documents.reduce((acc, doc) => acc + doc.analytics.views, 0),
      averageDocumentViews: documents.length > 0 
        ? Math.round(documents.reduce((acc, doc) => acc + doc.analytics.views, 0) / documents.length)
        : 0
    };

    // Productivity trends
    const productivityTrends = await this.getUserProductivityTrends(userId, startDate);

    return {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        joinDate: user.createdAt,
        lastActive: user.lastActive
      },
      performance: performanceMetrics,
      projects: {
        owned: ownedProjects.map(p => ({
          id: p._id,
          name: p.name,
          status: p.status,
          progress: p.progress,
          dueDate: p.dueDate
        })),
        contributed: teamProjects.map(p => ({
          id: p._id,
          name: p.name,
          role: p.team.find(t => t.user.toString() === userId.toString())?.role,
          progress: p.progress
        }))
      },
      documents: documents.map(d => ({
        id: d._id,
        title: d.title,
        type: d.type,
        views: d.analytics.views,
        lastModified: d.metadata.lastModified
      })),
      activity: activityTimeline,
      productivity: productivityTrends
    };
  }

  // Dashboard Analytics
  async getDashboardAnalytics(userId, timeframe = '30d') {
    const startDate = this.getStartDate(timeframe);
    
    const [
      projectStats,
      taskStats,
      userStats,
      recentActivity,
      upcomingDeadlines,
      teamPerformance
    ] = await Promise.all([
      this.getProjectStats(userId, startDate),
      this.getTaskStats(userId, startDate),
      this.getUserStats(startDate),
      this.getRecentActivity(userId, startDate),
      this.getUpcomingDeadlines(userId),
      this.getTeamPerformance(startDate)
    ]);

    return {
      overview: {
        totalProjects: projectStats.total,
        activeProjects: projectStats.active,
        totalTasks: taskStats.total,
        completedTasks: taskStats.completed,
        teamMembers: userStats.total,
        onlineUsers: userStats.online
      },
      performance: {
        projectProgress: projectStats.averageProgress,
        taskCompletion: taskStats.completionRate,
        teamProductivity: teamPerformance.averageProductivity
      },
      activity: recentActivity,
      deadlines: upcomingDeadlines,
      trends: {
        projects: await this.getProjectTrends(startDate),
        tasks: await this.getTaskTrends(startDate),
        users: await this.getUserTrends(startDate)
      }
    };
  }

  // Helper methods
  getStartDate(timeframe) {
    const now = new Date();
    switch (timeframe) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      case '90d':
        return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      case '1y':
        return new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  async getTaskCompletionTrends(projectId, startDate) {
    // Implementation for task completion trends over time
    return [];
  }

  async getTeamProductivity(projectId, startDate) {
    // Implementation for team productivity metrics
    return {};
  }

  async getTimeAnalytics(projectId, startDate) {
    // Implementation for time tracking analytics
    return {};
  }

  async getBudgetAnalytics(project) {
    // Implementation for budget tracking
    return {};
  }

  async getRiskAssessment(project) {
    // Implementation for risk assessment
    return {};
  }

  async getMilestoneProgress(project) {
    // Implementation for milestone progress tracking
    return [];
  }

  async getActivityTrend(projectId, startDate) {
    // Implementation for activity trends
    return [];
  }

  getRoleDistribution(team) {
    const roles = {};
    team.forEach(member => {
      roles[member.role] = (roles[member.role] || 0) + 1;
    });
    return roles;
  }

  async getTeamTrends(startDate) {
    // Implementation for team trends
    return [];
  }

  async getUserActivityTimeline(userId, startDate) {
    // Implementation for user activity timeline
    return [];
  }

  async getUserProductivityTrends(userId, startDate) {
    // Implementation for user productivity trends
    return [];
  }

  async getProjectStats(userId, startDate) {
    // Implementation for project statistics
    return {};
  }

  async getTaskStats(userId, startDate) {
    // Implementation for task statistics
    return {};
  }

  async getUserStats(startDate) {
    // Implementation for user statistics
    return {};
  }

  async getRecentActivity(userId, startDate) {
    // Implementation for recent activity
    return [];
  }

  async getUpcomingDeadlines(userId) {
    // Implementation for upcoming deadlines
    return [];
  }

  async getTeamPerformance(startDate) {
    // Implementation for team performance
    return {};
  }

  async getProjectTrends(startDate) {
    // Implementation for project trends
    return [];
  }

  async getTaskTrends(startDate) {
    // Implementation for task trends
    return [];
  }

  async getUserTrends(startDate) {
    // Implementation for user trends
    return [];
  }
}

module.exports = new AnalyticsService();
