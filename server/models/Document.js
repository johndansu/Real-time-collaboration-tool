const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  position: {
    start: Number,
    end: Number
  },
  resolved: {
    type: Boolean,
    default: false
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  resolvedAt: Date,
  replies: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    content: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, { timestamps: true });

const versionSchema = new mongoose.Schema({
  versionNumber: {
    type: Number,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  changes: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: Date,
  publishedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

const collaborationSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionId: {
    type: String,
    required: true
  },
  joinedAt: {
    type: Date,
    default: Date.now
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  cursorPosition: {
    line: Number,
    ch: Number
  },
  isActive: {
    type: Boolean,
    default: true
  }
});

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    enum: ['document', 'spreadsheet', 'presentation', 'code', 'other'],
    default: 'document'
  },
  format: {
    type: String,
    enum: ['markdown', 'html', 'plain-text', 'json', 'xml', 'other'],
    default: 'markdown'
  },
  project: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'editor', 'commenter', 'viewer'],
      default: 'viewer'
    },
    permissions: [{
      type: String,
      enum: ['read', 'write', 'comment', 'share', 'delete']
    }],
    invitedAt: {
      type: Date,
      default: Date.now
    },
    joinedAt: Date,
    lastAccess: Date
  }],
  status: {
    type: String,
    enum: ['draft', 'review', 'published', 'archived'],
    default: 'draft'
  },
  visibility: {
    type: String,
    enum: ['private', 'team', 'public'],
    default: 'private'
  },
  tags: [String],
  category: {
    type: String,
    trim: true
  },
  currentVersion: {
    type: Number,
    default: 1
  },
  versions: [versionSchema],
  comments: [commentSchema],
  activeCollaborators: [collaborationSessionSchema],
  settings: {
    allowComments: {
      type: Boolean,
      default: true
    },
    allowVersioning: {
      type: Boolean,
      default: true
    },
    requireApproval: {
      type: Boolean,
      default: false
    },
    autoSave: {
      type: Boolean,
      default: true
    },
    autoSaveInterval: {
      type: Number,
      default: 30000 // 30 seconds
    },
    maxVersions: {
      type: Number,
      default: 50
    }
  },
  metadata: {
    wordCount: { type: Number, default: 0 },
    characterCount: { type: Number, default: 0 },
    lineCount: { type: Number, default: 0 },
    lastModified: { type: Date, default: Date.now },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    size: { type: Number, default: 0 }, // in bytes
    language: { type: String, default: 'en' },
    readingTime: { type: Number, default: 0 } // in minutes
  },
  analytics: {
    views: { type: Number, default: 0 },
    uniqueViews: { type: Number, default: 0 },
    editSessions: { type: Number, default: 0 },
    totalEditTime: { type: Number, default: 0 }, // in minutes
    lastViewed: { type: Date, default: Date.now },
    popularSections: [{
      section: String,
      views: Number
    }]
  },
  sharing: {
    publicLink: String,
    passwordProtected: {
      type: Boolean,
      default: false
    },
    password: String,
    expiresAt: Date,
    allowDownload: {
      type: Boolean,
      default: true
    },
    allowPrint: {
      type: Boolean,
      default: true
    }
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
documentSchema.index({ owner: 1 });
documentSchema.index({ project: 1 });
documentSchema.index({ 'collaborators.user': 1 });
documentSchema.index({ status: 1 });
documentSchema.index({ visibility: 1 });
documentSchema.index({ tags: 1 });
documentSchema.index({ type: 1 });
documentSchema.index({ 'metadata.lastModified': -1 });

// Pre-save middleware to update metadata
documentSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.metadata.wordCount = this.content.split(/\s+/).filter(word => word.length > 0).length;
    this.metadata.characterCount = this.content.length;
    this.metadata.lineCount = this.content.split('\n').length;
    this.metadata.lastModified = new Date();
    this.metadata.readingTime = Math.ceil(this.metadata.wordCount / 200); // Average reading speed
    this.metadata.size = Buffer.byteLength(this.content, 'utf8');
  }
  next();
});

// Method to add collaborator
documentSchema.methods.addCollaborator = function(userId, role = 'viewer', permissions = []) {
  const existingCollaborator = this.collaborators.find(
    c => c.user.toString() === userId.toString()
  );
  
  if (existingCollaborator) {
    existingCollaborator.role = role;
    existingCollaborator.permissions = permissions;
  } else {
    this.collaborators.push({
      user: userId,
      role,
      permissions,
      invitedAt: new Date()
    });
  }
  
  return this.save();
};

// Method to remove collaborator
documentSchema.methods.removeCollaborator = function(userId) {
  this.collaborators = this.collaborators.filter(
    c => c.user.toString() !== userId.toString()
  );
  return this.save();
};

// Method to check user permissions
documentSchema.methods.hasUserPermission = function(userId, permission) {
  if (this.owner.toString() === userId.toString()) return true;
  
  const collaborator = this.collaborators.find(
    c => c.user.toString() === userId.toString()
  );
  
  if (!collaborator) return false;
  
  if (collaborator.role === 'owner') return true;
  if (collaborator.role === 'editor' && permission !== 'delete') return true;
  
  return collaborator.permissions.includes(permission);
};

// Method to create new version
documentSchema.methods.createVersion = function(content, changes, userId) {
  this.currentVersion += 1;
  
  // Keep only the last N versions
  if (this.versions.length >= this.settings.maxVersions) {
    this.versions.shift();
  }
  
  this.versions.push({
    versionNumber: this.currentVersion,
    content,
    changes,
    createdBy: userId
  });
  
  return this.save();
};

// Method to add comment
documentSchema.methods.addComment = function(userId, content, position = null) {
  this.comments.push({
    user: userId,
    content,
    position
  });
  
  return this.save();
};

// Method to log activity
documentSchema.methods.logActivity = function(action, description, userId, metadata = {}) {
  this.activityLog.push({
    action,
    description,
    user: userId,
    metadata
  });
  
  this.metadata.lastModified = new Date();
  this.metadata.lastModifiedBy = userId;
  
  return this.save();
};

// Method to update view analytics
documentSchema.methods.recordView = function(userId) {
  this.analytics.views += 1;
  
  if (userId) {
    const existingView = this.analytics.uniqueViews.find(
      v => v.user.toString() === userId.toString()
    );
    
    if (!existingView) {
      this.analytics.uniqueViews += 1;
    }
  }
  
  this.analytics.lastViewed = new Date();
  return this.save();
};

// Static method to find documents by user
documentSchema.statics.findByUser = function(userId) {
  return this.find({
    $or: [
      { owner: userId },
      { 'collaborators.user': userId }
    ]
  }).populate('owner', 'username email avatar');
};

// Static method to find public documents
documentSchema.statics.findPublic = function() {
  return this.find({ visibility: 'public' }).populate('owner', 'username email avatar');
};

// Static method to find documents by project
documentSchema.statics.findByProject = function(projectId) {
  return this.find({ project: projectId }).populate('owner', 'username email avatar');
};

module.exports = mongoose.model('Document', documentSchema);
