const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory project storage (replace with database in production)
const projects = new Map();

// Get all projects for a user
router.get('/', (req, res) => {
  try {
    const { userId } = req.query;
    
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }
    
    const userProjects = Array.from(projects.values())
      .filter(project => 
        project.ownerId === userId || 
        project.members.some(member => member.userId === userId)
      );
    
    res.json({ projects: userProjects });
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ error: 'Failed to get projects' });
  }
});

// Get project by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const project = projects.get(id);
    
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    res.json({ project });
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ error: 'Failed to get project' });
  }
});

// Create new project
router.post('/', (req, res) => {
  try {
    const { name, description, ownerId, members = [] } = req.body;
    
    if (!name || !ownerId) {
      return res.status(400).json({ error: 'Project name and owner are required' });
    }
    
    const projectId = uuidv4();
    const newProject = {
      id: projectId,
      name,
      description,
      ownerId,
      members: [
        { userId: ownerId, role: 'owner', joinedAt: new Date() },
        ...members.map(member => ({
          userId: member.userId,
          role: member.role || 'member',
          joinedAt: new Date()
        }))
      ],
      documents: [],
      tasks: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    projects.set(projectId, newProject);
    
    res.status(201).json({
      message: 'Project created successfully',
      project: newProject
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ error: 'Failed to create project' });
  }
});

// Update project
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, members } = req.body;
    
    const project = projects.get(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Update project fields
    if (name) project.name = name;
    if (description) project.description = description;
    if (members) project.members = members;
    
    project.updatedAt = new Date();
    
    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ error: 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const project = projects.get(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Only owner can delete project
    if (project.ownerId !== userId) {
      return res.status(403).json({ error: 'Only project owner can delete project' });
    }
    
    projects.delete(id);
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Add member to project
router.post('/:id/members', (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role = 'member' } = req.body;
    
    const project = projects.get(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Check if user is already a member
    const existingMember = project.members.find(member => member.userId === userId);
    if (existingMember) {
      return res.status(400).json({ error: 'User is already a member' });
    }
    
    // Add new member
    project.members.push({
      userId,
      role,
      joinedAt: new Date()
    });
    
    project.updatedAt = new Date();
    
    res.json({
      message: 'Member added successfully',
      project
    });
  } catch (error) {
    console.error('Add member error:', error);
    res.status(500).json({ error: 'Failed to add member' });
  }
});

// Remove member from project
router.delete('/:id/members/:userId', (req, res) => {
  try {
    const { id, userId } = req.params;
    
    const project = projects.get(id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    
    // Remove member
    project.members = project.members.filter(member => member.userId !== userId);
    project.updatedAt = new Date();
    
    res.json({
      message: 'Member removed successfully',
      project
    });
  } catch (error) {
    console.error('Remove member error:', error);
    res.status(500).json({ error: 'Failed to remove member' });
  }
});

module.exports = router;
