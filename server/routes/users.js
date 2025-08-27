const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

// In-memory user storage (replace with database in production)
const users = new Map();

// Get all users (for team collaboration)
router.get('/', (req, res) => {
  try {
    const allUsers = Array.from(users.values()).map(user => {
      const { password, ...userData } = user;
      return userData;
    });
    
    res.json({ users: allUsers });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Get user by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const user = users.get(id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    const { password, ...userData } = user;
    res.json({ user: userData });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Update user profile
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, avatar } = req.body;
    
    const user = users.get(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Update user fields
    if (username) user.username = username;
    if (email) user.email = email;
    if (avatar) user.avatar = avatar;
    
    user.updatedAt = new Date();
    
    const { password, ...userData } = user;
    res.json({ 
      message: 'User updated successfully',
      user: userData 
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Search users by username or email
router.get('/search/:query', (req, res) => {
  try {
    const { query } = req.params;
    const searchResults = Array.from(users.values())
      .filter(user => 
        user.username.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase())
      )
      .map(user => {
        const { password, ...userData } = user;
        return userData;
      });
    
    res.json({ users: searchResults });
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Failed to search users' });
  }
});

module.exports = router;
