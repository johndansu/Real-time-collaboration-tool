const mongoose = require('mongoose');

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed', 'overdue'],
    default: 'pending'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  assignedTo: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  completedAt: Date
}, { timestamps: true });

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'review', 'completed'],
    default: 'todo'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  dueDate: Date,
  estimatedHours: Number,
  actualHours: Number,
  tags: [String],
  attachments: [{
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  comments: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  dependencies: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task'
  }]
}, { timestamps: true });

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  team: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'manager', 'member', 'viewer'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    },
    permissions: [{
      type: String,
      enum: ['read', 'write', 'delete', 'invite', 'admin']
    }]
  }],
  status: {
    type: String,
    enum: ['planning', 'active', 'on-hold', 'completed', 'archived'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  category: {
    type: String,
    trim: true
  },
  tags: [String],
  startDate: {
    type: Date,
    default: Date.now
  },
  dueDate: Date,
  completedDate: Date,
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  budget: {
    estimated: Number,
    actual: Number,
    currency: {
      type: String,
      default: 'USD'
    }
  },
  milestones: [milestoneSchema],
  tasks: [taskSchema],
  documents: [{
    title: String,
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    type: String,
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    },
    version: {
      type: Number,
      default: 1
    },
    isPublic: {
      type: Boolean,
      default: false
    }
  }],
  settings: {
    allowGuestAccess: {
      type: Boolean,
      default: false
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    autoArchive: {
      type: Boolean,
      default: true
    },
    notificationPreferences: {
      email: { type: Boolean, default: true },
      push: { type: Boolean, default: true },
      desktop: { type: Boolean, default: true }
    }
  },
  analytics: {
    totalTasks: { type: Number, default: 0 },
    completedTasks: { type: Number, default: 0 },
    totalHours: { type: Number, default: 0 },
    teamProductivity: { type: Number, default: 0 },
    lastActivity: { type: Date, default: Date.now }
  },
  activityLog: [{
    action: String,
    description: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    metadata: mongoose.Schema.Types.Mixed
  }]
}, {
  timestamps: true
});

// Indexes for performance
projectSchema.index({ owner: 1 });
projectSchema.index({ status: 1 });
projectSchema.index({ 'team.user': 1 });
projectSchema.index({ dueDate: 1 });
projectSchema.index({ tags: 1 });
projectSchema.index({ category: 1 });

// Virtual for project duration
projectSchema.virtual('duration').get(function() {
  if (!this.startDate) return 0;
  const endDate = this.completedDate || this.dueDate || new Date();
  return Math.ceil((endDate - this.startDate) / (1000 * 60 * 60 * 24));
});

// Virtual for overdue status
projectSchema.virtual('isOverdue').get(function() {
  return this.dueDate && this.dueDate < new Date() && this.status !== 'completed';
});

// Pre-save middleware to update analytics
projectSchema.pre('save', function(next) {
  if (this.tasks && this.tasks.length > 0) {
    this.analytics.totalTasks = this.tasks.length;
    this.analytics.completedTasks = this.tasks.filter(task => task.status === 'completed').length;
    
    if (this.analytics.totalTasks > 0) {
      this.progress = Math.round((this.analytics.completedTasks / this.analytics.totalTasks) * 100);
    }
  }
  
  this.analytics.lastActivity = new Date();
  next();
});

// Method to add team member
projectSchema.methods.addTeamMember = function(userId, role = 'member', permissions = []) {
  const existingMember = this.team.find(member => member.user.toString() === userId.toString());
  
  if (existingMember) {
    existingMember.role = role;
    existingMember.permissions = permissions;
  } else {
    this.team.push({
      user: userId,
      role,
      permissions,
      joinedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to remove team member
projectSchema.methods.removeTeamMember = function(userId) {
  this.team = this.team.filter(member => member.user.toString() !== userId.toString());
  return this.save();
};

// Method to check user permissions
projectSchema.methods.hasUserPermission = function(userId, permission) {
  const member = this.team.find(m => m.user.toString() === userId.toString());
  if (!member) return false;
  
  if (member.role === 'owner') return true;
  if (member.role === 'manager' && permission !== 'admin') return true;
  
  return member.permissions.includes(permission);
};

// Method to log activity
projectSchema.methods.logActivity = function(action, description, userId, metadata = {}) {
  this.activityLog.push({
    action,
    description,
    user: userId,
    metadata
  });
  
  this.analytics.lastActivity = new Date();
  return this.save();
};

// Static method to find projects by user
projectSchema.statics.findByUser = function(userId) {
  return this.find({
    $or: [
      { owner: userId },
      { 'team.user': userId }
    ]
  }).populate('owner', 'username email avatar');
};

// Static method to find active projects
projectSchema.statics.findActive = function() {
  return this.find({ status: { $in: ['planning', 'active'] } });
};

// Static method to find overdue projects
projectSchema.statics.findOverdue = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    status: { $ne: 'completed' }
  });
};

module.exports = mongoose.model('Project', projectSchema);
