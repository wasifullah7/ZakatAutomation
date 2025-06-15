const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');

// Get all acceptors
router.get('/acceptors', auth, checkRole(['admin']), async (req, res) => {
  try {
    const acceptors = await User.find({ role: 'acceptor' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(acceptors);
  } catch (error) {
    console.error('Error fetching acceptors:', error);
    res.status(500).json({ message: 'Error fetching acceptors' });
  }
});

// Approve an acceptor
router.put('/approve/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const acceptor = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'acceptor' },
      { isVerified: true },
      { new: true }
    ).select('-password');

    if (!acceptor) {
      return res.status(404).json({ message: 'Acceptor not found' });
    }

    res.json(acceptor);
  } catch (error) {
    console.error('Error approving acceptor:', error);
    res.status(500).json({ message: 'Error approving acceptor' });
  }
});

// Get acceptor statistics
router.get('/stats/acceptors', auth, checkRole(['admin']), async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { role: 'acceptor' } },
      {
        $group: {
          _id: '$isVerified',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      total: stats.reduce((acc, curr) => acc + curr.count, 0),
      verified: stats.find(s => s._id === true)?.count || 0,
      unverified: stats.find(s => s._id === false)?.count || 0
    };

    res.json(formattedStats);
  } catch (error) {
    console.error('Error fetching acceptor stats:', error);
    res.status(500).json({ message: 'Error fetching acceptor statistics' });
  }
});

module.exports = router; 