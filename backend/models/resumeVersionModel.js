import mongoose from 'mongoose';

/**
 * @file resumeVersionModel.js
 * @description Mongoose Schema & Model for Git-style Resume Version Snapshots.
 * Tracks version history, ATS scores, keyword diffs, and AI optimization snapshots over time.
 */

const resumeVersionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Version must belong to an authenticated user'],
      index: true,
    },
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: [true, 'Version must reference a valid Resume document'],
      index: true,
    },
    versionNumber: {
      type: Number,
      required: [true, 'Version number is required'],
      default: 1,
    },
    versionLabel: {
      type: String,
      required: true,
      default: 'v1.0 - Initial Baseline Resume Upload',
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    extractedText: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number,
      required: true,
      default: 0,
    },
    keywordScore: {
      type: Number,
      default: 0,
    },
    experienceScore: {
      type: Number,
      default: 0,
    },
    structureScore: {
      type: Number,
      default: 0,
    },
    matchedKeywords: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    skillsOverlap: {
      type: mongoose.Schema.Types.Mixed,
      default: { matchedSkills: [], missingSkills: [] },
    },
    aiRewriteSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    changesSummary: {
      type: String,
      default: 'Initial baseline resume upload',
      trim: true,
    },
    addedKeywords: {
      type: [String],
      default: [],
    },
    removedWeaknesses: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const ResumeVersion = mongoose.model('ResumeVersion', resumeVersionSchema);

export default ResumeVersion;
