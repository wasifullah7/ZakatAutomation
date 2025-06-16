const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
    // Accept images and PDFs
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG and PDF files are allowed.'));
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Helper function to generate JWT token
const generateToken = (user) => {
  return jwt.sign(
    { 
      userId: user._id,
      role: user.role 
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate role
    if (role && !['donor', 'acceptor', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create default profile based on role
    const defaultProfile = {
      phone: 'Not provided',
      address: 'Not provided',
      city: 'Not provided',
      country: 'Not provided',
      postalCode: 'Not provided',
      nationalId: 'Not provided',
      nationalIdExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year from now
      bankName: 'Not provided',
      bankBranch: 'Not provided',
      bankAccountNumber: 'Not provided',
      documents: [],
      ...(role === 'donor' && {
        organizationName: 'Not provided',
        organizationType: 'Other',
        registrationNumber: 'Not provided',
        registrationDate: new Date(),
        registrationExpiry: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      }),
      ...(role === 'acceptor' && {
        familySize: 1,
        monthlyIncome: 0,
        monthlyExpenses: 0,
        zakatReason: 'Not provided',
        emergencyContact: {
          name: 'Not provided',
          relationship: 'Not provided',
          phone: 'Not provided'
        }
      })
    };

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      password,
      role: role || 'donor', // Default role is donor
      profile: defaultProfile
    });

    await user.save();

    // Generate JWT token
    const token = generateToken(user);

    res.status(201).json({
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(400).json({ 
      message: error.name === 'ValidationError' 
        ? 'Invalid user data provided' 
        : 'Error creating user account'
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated. Please contact support.' });
    }

    // Check if role matches
    if (role && user.role !== role) {
      return res.status(401).json({ 
        message: `This account is registered as a ${user.role}. Please select the correct role.`
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate token
    const token = generateToken(user);

    // Return user data and token
    res.json({
      token,
      user: user.getPublicProfile()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'An error occurred during login. Please try again.' });
  }
});

// Get current user profile
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.getPublicProfile());
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Error retrieving user profile' });
  }
});

// Update user profile
router.patch('/me', auth, upload.array('documents', 5), async (req, res) => {
  try {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['firstName', 'lastName', 'profile'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({ message: 'Invalid updates' });
    }

    // Ensure user has a profile object
    if (!req.user.profile) {
      req.user.profile = {};
    }

    // Handle file uploads
    if (req.files && req.files.length > 0) {
      const documents = req.files.map(file => ({
        type: 'National ID', // Default type, can be updated later
        filename: file.filename,
        url: `/uploads/${file.filename}`,
        uploadedAt: new Date(),
        verified: false
      }));

      // Initialize documents array if it doesn't exist
      if (!req.user.profile.documents) {
        req.user.profile.documents = [];
      }

      // Add new documents to existing ones
      req.user.profile.documents = [...req.user.profile.documents, ...documents];
    }

    // Handle profile updates
    updates.forEach(update => {
      if (update === 'profile') {
        try {
          const profileData = JSON.parse(req.body.profile);
          Object.keys(profileData).forEach(profileKey => {
            if (profileKey !== 'documents') { // Skip documents as they're handled above
              req.user.profile[profileKey] = profileData[profileKey];
            }
          });
        } catch (error) {
          console.error('Error parsing profile data:', error);
          return res.status(400).json({ message: 'Invalid profile data format' });
        }
      } else {
        req.user[update] = req.body[update];
      }
    });

    // For acceptors, ensure at least one document is uploaded
    if (req.user.role === 'acceptor' && (!req.user.profile.documents || req.user.profile.documents.length === 0)) {
      return res.status(400).json({ message: 'At least one document is required for acceptors' });
    }

    await req.user.save();
    res.json(req.user.getPublicProfile());
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

module.exports = router; 