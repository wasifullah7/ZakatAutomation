const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'donor', 'acceptor'],
    default: 'donor'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  profile: {
    phone: {
      type: String,
      required: function() { return ['acceptor', 'donor'].includes(this.role); }
    },
    address: {
      type: String,
      required: function() { return ['acceptor', 'donor'].includes(this.role); }
    },
    city: {
      type: String,
      required: function() { return ['acceptor', 'donor'].includes(this.role); }
    },
    country: {
      type: String,
      required: function() { return ['acceptor', 'donor'].includes(this.role); }
    },
    postalCode: {
      type: String,
      required: function() { return ['acceptor', 'donor'].includes(this.role); }
    },
    nationalId: {
      type: String,
      required: function() { return ['acceptor', 'donor'].includes(this.role); }
    },
    nationalIdExpiry: {
      type: Date,
      required: function() { return ['acceptor', 'donor'].includes(this.role); }
    },
    familySize: {
      type: Number,
      required: function() { return this.role === 'acceptor'; },
      min: 1
    },
    monthlyIncome: {
      type: Number,
      required: function() { return this.role === 'acceptor'; },
      min: 0
    },
    monthlyExpenses: {
      type: Number,
      required: function() { return this.role === 'acceptor'; },
      min: 0
    },
    bankName: {
      type: String,
      required: function() { return ['acceptor', 'donor'].includes(this.role); }
    },
    bankBranch: {
      type: String,
      required: function() { return ['acceptor', 'donor'].includes(this.role); }
    },
    bankAccountNumber: {
      type: String,
      required: function() { return ['acceptor', 'donor'].includes(this.role); }
    },
    assets: [String],
    liabilities: [String],
    zakatReason: {
      type: String,
      required: function() { return this.role === 'acceptor'; },
      minlength: 100
    },
    documents: [
      {
        type: {
          type: String,
          enum: ['National ID', 'Proof of Address', 'Bank Statement', 'Income Statement', 'Organization Registration', 'Other'],
          required: true
        },
        filename: String,
        url: String,
        uploadedAt: { type: Date, default: Date.now },
        verified: { type: Boolean, default: false }
      }
    ],
    organizationName: {
      type: String,
      required: function() { return this.role === 'donor'; }
    },
    organizationType: {
      type: String,
      enum: ['Non-Profit Organization', 'Charity', 'Religious Institution', 'Community Center', 'Educational Institution', 'Healthcare Facility', 'Other'],
      required: function() { return this.role === 'donor'; }
    },
    registrationNumber: {
      type: String,
      required: function() { return this.role === 'donor'; }
    },
    registrationDate: {
      type: Date,
      required: function() { return this.role === 'donor'; }
    },
    registrationExpiry: {
      type: Date,
      required: function() { return this.role === 'donor'; }
    },
    needs: [{
      type: String,
      enum: ['Food', 'Education', 'Healthcare', 'Shelter', 'Clothing', 'Financial Aid', 'Emergency Relief', 'Other']
    }],
    emergencyContact: {
      name: {
        type: String,
        required: function() { return this.role === 'acceptor'; }
      },
      relationship: {
        type: String,
        required: function() { return this.role === 'acceptor'; }
      },
      phone: {
        type: String,
        required: function() { return this.role === 'acceptor'; }
      }
    },
    verificationNotes: [{
      note: String,
      addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      addedAt: {
        type: Date,
        default: Date.now
      }
    }]
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'in_review', 'approved', 'rejected'],
    default: 'pending'
  },
  verificationHistory: [{
    status: {
      type: String,
      enum: ['pending', 'in_review', 'approved', 'rejected']
    },
    changedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    changedAt: {
      type: Date,
      default: Date.now
    },
    reason: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Method to get public profile
userSchema.methods.getPublicProfile = function() {
  const userObject = this.toObject();
  delete userObject.password;
  return userObject;
};

// Method to update verification status
userSchema.methods.updateVerificationStatus = async function(newStatus, adminId, reason) {
  this.verificationStatus = newStatus;
  this.verificationHistory.push({
    status: newStatus,
    changedBy: adminId,
    reason: reason
  });
  return this.save();
};

// Method to add verification note
userSchema.methods.addVerificationNote = async function(note, adminId) {
  this.profile.verificationNotes.push({
    note,
    addedBy: adminId
  });
  return this.save();
};

const User = mongoose.model('User', userSchema);

module.exports = User; 