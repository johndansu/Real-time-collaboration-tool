const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory document storage (replace with database in production)
const documents = new Map();

// Get document by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const document = documents.get(id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    res.json({ document });
  } catch (error) {
    console.error('Get document error:', error);
    res.status(500).json({ error: 'Failed to get document' });
  }
});

// Create new document
router.post('/', (req, res) => {
  try {
    const { name, content, projectId, ownerId, type = 'text' } = req.body;
    
    if (!name || !projectId || !ownerId) {
      return res.status(400).json({ error: 'Document name, project ID, and owner are required' });
    }
    
    const documentId = uuidv4();
    const newDocument = {
      id: documentId,
      name,
      content: content || '',
      projectId,
      ownerId,
      type,
      collaborators: [ownerId],
      version: 1,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastEditedBy: ownerId
    };
    
    documents.set(documentId, newDocument);
    
    res.status(201).json({
      message: 'Document created successfully',
      document: newDocument
    });
  } catch (error) {
    console.error('Create document error:', error);
    res.status(500).json({ error: 'Failed to create document' });
  }
});

// Update document content
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { content, userId } = req.body;
    
    const document = documents.get(id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Check if user has access to edit
    if (!document.collaborators.includes(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    // Update document
    document.content = content;
    document.version += 1;
    document.updatedAt = new Date();
    document.lastEditedBy = userId;
    
    res.json({
      message: 'Document updated successfully',
      document
    });
  } catch (error) {
    console.error('Update document error:', error);
    res.status(500).json({ error: 'Failed to update document' });
  }
});

// Delete document
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const document = documents.get(id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Only owner can delete document
    if (document.ownerId !== userId) {
      return res.status(403).json({ error: 'Only document owner can delete document' });
    }
    
    documents.delete(id);
    
    res.json({ message: 'Document deleted successfully' });
  } catch (error) {
    console.error('Delete document error:', error);
    res.status(500).json({ error: 'Failed to delete document' });
  }
});

// Add collaborator to document
router.post('/:id/collaborators', (req, res) => {
  try {
    const { id } = req.params;
    const { userId, collaboratorId } = req.body;
    
    const document = documents.get(id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Check if user has permission to add collaborators
    if (document.ownerId !== userId) {
      return res.status(403).json({ error: 'Only document owner can add collaborators' });
    }
    
    // Check if collaborator is already added
    if (document.collaborators.includes(collaboratorId)) {
      return res.status(400).json({ error: 'User is already a collaborator' });
    }
    
    // Add collaborator
    document.collaborators.push(collaboratorId);
    document.updatedAt = new Date();
    
    res.json({
      message: 'Collaborator added successfully',
      document
    });
  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({ error: 'Failed to add collaborator' });
  }
});

// Remove collaborator from document
router.delete('/:id/collaborators/:collaboratorId', (req, res) => {
  try {
    const { id, collaboratorId } = req.params;
    const { userId } = req.body;
    
    const document = documents.get(id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Check if user has permission to remove collaborators
    if (document.ownerId !== userId) {
      return res.status(403).json({ error: 'Only document owner can remove collaborators' });
    }
    
    // Cannot remove owner
    if (collaboratorId === document.ownerId) {
      return res.status(400).json({ error: 'Cannot remove document owner' });
    }
    
    // Remove collaborator
    document.collaborators = document.collaborators.filter(id => id !== collaboratorId);
    document.updatedAt = new Date();
    
    res.json({
      message: 'Collaborator removed successfully',
      document
    });
  } catch (error) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({ error: 'Failed to remove collaborator' });
  }
});

// Get document version history
router.get('/:id/history', (req, res) => {
  try {
    const { id } = req.params;
    const document = documents.get(id);
    
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // In a real application, you would store version history
    // For now, return basic document info
    const history = {
      currentVersion: document.version,
      lastEditedBy: document.lastEditedBy,
      lastEditedAt: document.updatedAt,
      createdAt: document.createdAt
    };
    
    res.json({ history });
  } catch (error) {
    console.error('Get document history error:', error);
    res.status(500).json({ error: 'Failed to get document history' });
  }
});

// Join document collaboration room
router.post('/:id/collaborate', (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    
    const document = documents.get(id);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }
    
    // Check if user has access to collaborate
    if (!document.collaborators.includes(userId)) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    res.json({
      message: 'Joined collaboration room',
      document: {
        id: document.id,
        name: document.name,
        content: document.content,
        type: document.type,
        collaborators: document.collaborators
      }
    });
  } catch (error) {
    console.error('Join collaboration error:', error);
    res.status(500).json({ error: 'Failed to join collaboration' });
  }
});

module.exports = router;
