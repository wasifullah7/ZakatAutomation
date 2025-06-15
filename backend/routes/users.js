const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { auth, checkRole } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG and PDF files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all users (Admin only)
router.get('/', auth, checkRole(['admin']), async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user by ID (Admin only)
router.get('/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password')
      .populate('verificationHistory.changedBy', 'firstName lastName email');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user (Admin only)
router.patch('/:id', auth, checkRole(['admin']), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['firstName', 'lastName', 'email', 'role', 'isActive', 'profile'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    updates.forEach(update => user[update] = req.body[update]);
    await user.save();
    res.json(user.getPublicProfile());
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete user (Admin only)
router.delete('/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Instead of deleting, deactivate the user
    user.isActive = false;
    await user.save();
    res.json({ message: 'User deactivated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all donors (Admin and Acceptor can access)
router.get('/donors', auth, checkRole(['admin', 'acceptor']), async (req, res) => {
  try {
    const donors = await User.find({ role: 'donor', isActive: true }).select('-password');
    res.json(donors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all acceptors (Admin and Donor can access)
router.get('/acceptors', auth, checkRole(['admin', 'donor']), async (req, res) => {
  try {
    const acceptors = await User.find({ role: 'acceptor', isActive: true })
      .select('-password')
      .populate('verificationHistory.changedBy', 'firstName lastName email');
    res.json(acceptors);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile with file uploads
router.put('/profile', auth, upload.array('documents', 5), async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { firstName, lastName, email, profile } = req.body;
    const profileData = JSON.parse(profile);

    // Handle document uploads
    const documents = req.files ? req.files.map(file => ({
      type: file.fieldname,
      filename: file.filename,
      url: `/uploads/${file.filename}`,
      uploadedAt: new Date(),
      verified: false
    })) : [];

    // Update user data
    user.firstName = firstName;
    user.lastName = lastName;
    user.email = email;
    user.profile = {
      ...user.profile,
      ...profileData,
      documents: [...(user.profile.documents || []), ...documents]
    };

    // If this is an acceptor's first submission, set status to in_review
    if (user.role === 'acceptor' && user.verificationStatus === 'pending') {
      await user.updateVerificationStatus('in_review', req.user.id, 'Initial submission');
    }

    await user.save();
    res.json(user.getPublicProfile());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin endpoints for verification process
router.put('/admin/verify/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { status, reason, note } = req.body;
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!['pending', 'in_review', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Update verification status
    await user.updateVerificationStatus(status, req.user.id, reason);

    // Add verification note if provided
    if (note) {
      await user.addVerificationNote(note, req.user.id);
    }

    res.json(user.getPublicProfile());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin endpoint to verify specific documents
router.put('/admin/verify-document/:userId/:documentId', auth, checkRole(['admin']), async (req, res) => {
  try {
    const { verified, note } = req.body;
    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const document = user.profile.documents.id(req.params.documentId);
    if (!document) {
      return res.status(404).json({ error: 'Document not found' });
    }

    document.verified = verified;
    if (note) {
      await user.addVerificationNote(`Document verification note: ${note}`, req.user.id);
    }

    await user.save();
    res.json(user.getPublicProfile());
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get verification history for a user
router.get('/verification-history/:id', auth, checkRole(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('verificationStatus verificationHistory profile.verificationNotes')
      .populate('verificationHistory.changedBy', 'firstName lastName email')
      .populate('profile.verificationNotes.addedBy', 'firstName lastName email');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      status: user.verificationStatus,
      history: user.verificationHistory,
      notes: user.profile.verificationNotes
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 