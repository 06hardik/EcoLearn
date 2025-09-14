import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
    default: 'default-avatar-url.jpg', // A default image path
  },
  points: {
    type: Number,
    default: 0,
  },
  category: {
    type: String,
    enum: ['Low Waste', 'Medium Waste', 'High Waste', 'Unknown'],
    default: 'Unknown',
  },
  registeredEvents: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',
  }],
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
  }],
  completedModules: [{
    type: mongoose.Schema.Types.ObjectId, // References a specific module within a Course
  }],
  surveyData: {
    householdSize: Number,
    wasteCollectionFrequency: String,
    recyclingPractices: String,
  },
}, {
  timestamps: true,
});

// Pre-save hook to hash password before saving a new user
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export const User = mongoose.model('User', userSchema);
