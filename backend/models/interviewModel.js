import mongoose from 'mongoose';

/**
 * @file interviewModel.js
 * @description Mongoose Schema & Model for AI Interview Preparation Sets.
 */

const questionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['HR', 'Technical', 'Resume', 'Project', 'Behavioral'],
    default: 'Technical',
  },
  question: {
    type: String,
    required: true,
  },
  expectedAnswer: {
    type: String,
    required: true,
  },
  followUp: {
    type: String,
    default: '',
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium',
  },
  whyAsked: {
    type: String,
    default: 'Evaluates practical engineering experience and architectural decisions.',
  },
  atsImpact: {
    type: String,
    default: 'High Recruiter Signal',
  },
  userMastered: {
    type: Boolean,
    default: false,
  },
  userAnswerNotes: {
    type: String,
    default: '',
  },
});

const interviewSchema = new mongoose.Schema(
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
    questions: [questionSchema],
    readinessScore: {
      type: Number,
      default: 75,
    },
  },
  {
    timestamps: true,
  }
);

const InterviewPrep = mongoose.model('InterviewPrep', interviewSchema);

export default InterviewPrep;
