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

// Get all donors
router.get('/donors', auth, checkRole(['admin']), async (req, res) => {
  try {
    const donors = await User.find({ role: 'donor' })
      .select('-password')
      .sort({ createdAt: -1 });
    res.json(donors);
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ message: 'Error fetching donors' });
  }
});

// Approve or reject an acceptor
router.put('/approve/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { status, reason } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be either "approved" or "rejected"' });
    }

    const acceptor = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'acceptor' },
      { 
        isVerified: status === 'approved',
        verificationStatus: status,
        $push: {
          verificationHistory: {
            status,
            changedBy: req.user._id,
            reason: reason || (status === 'approved' ? 'Application approved' : 'Application rejected')
          }
        }
      },
      { new: true }
    ).select('-password');

    if (!acceptor) {
      return res.status(404).json({ message: 'Acceptor not found' });
    }

    res.json(acceptor);
  } catch (error) {
    console.error('Error updating acceptor status:', error);
    res.status(500).json({ message: 'Error updating acceptor status' });
  }
});

// Approve or reject a donor
router.put('/approve-donor/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { status, reason } = req.body;
    
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Must be either "approved" or "rejected"' });
    }

    const donor = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'donor' },
      { 
        isVerified: status === 'approved',
        verificationStatus: status,
        $push: {
          verificationHistory: {
            status,
            changedBy: req.user._id,
            reason: reason || (status === 'approved' ? 'Application approved' : 'Application rejected')
          }
        }
      },
      { new: true }
    ).select('-password');

    if (!donor) {
      return res.status(404).json({ message: 'Donor not found' });
    }

    res.json(donor);
  } catch (error) {
    console.error('Error updating donor status:', error);
    res.status(500).json({ message: 'Error updating donor status' });
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

// Get donor statistics
router.get('/stats/donors', auth, checkRole(['admin']), async (req, res) => {
  try {
    const stats = await User.aggregate([
      { $match: { role: 'donor' } },
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
    console.error('Error fetching donor stats:', error);
    res.status(500).json({ message: 'Error fetching donor statistics' });
  }
});

module.exports = router; 