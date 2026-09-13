import mongoose from 'mongoose';

/**
 * @file roadmapModel.js
 * @description Mongoose Schema & Model for AI Career Growth Roadmaps.
 */

const milestoneSchema = new mongoose.Schema({
  timeframe: {
    type: String,
    enum: ['7_days', '30_days', '60_days', '90_days'],
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium',
  },
  estimatedEffort: {
    type: String,
    default: '2-4 hours',
  },
  resources: [{ type: String }],
  completed: {
    type: Boolean,
    default: false,
  },
  whyItMatters: {
    type: String,
    default: 'Closing key technical gap increases interview callbacks.',
  },
  atsImpact: {
    type: String,
    default: '+5 ATS Points',
  },
});

const roadmapSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    targetRole: {
      type: String,
      default: 'Full Stack Engineer',
      trim: true,
    },
    milestones: [milestoneSchema],
    overallProgress: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Roadmap = mongoose.model('Roadmap', roadmapSchema);

export default Roadmap;
