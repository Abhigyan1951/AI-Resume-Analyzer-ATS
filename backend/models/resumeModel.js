import mongoose from 'mongoose';

/**
 * @file resumeModel.js
 * @description Mongoose Resume Schema and Model for AI Resume Analyzer & ATS Optimization Platform.
 * Stores uploaded PDF resume metadata, local storage path, extracted plain text, and user association.
 */

const resumeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Resume must belong to an authenticated user'],
      index: true,
    },
    originalName: {
      type: String,
      required: [true, 'Original file name is required'],
      trim: true,
    },
    fileName: {
      type: String,
      required: [true, 'Generated file name is required'],
      trim: true,
    },
    filePath: {
      type: String,
      required: [true, 'File storage path is required'],
      trim: true,
    },
    extractedText: {
      type: String,
      required: [true, 'Extracted resume text content is required'],
    },
    versionNumber: {
      type: Number,
      default: 1,
    },
    commitName: {
      type: String,
      default: 'Initial Upload',
      trim: true,
    },
    atsScore: {
      type: Number,
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
    targetRole: {
      type: String,
      default: 'Full Stack Engineer',
      trim: true,
    },
    matchedKeywords: {
      type: [String],
      default: [],
    },
    missingKeywords: {
      type: [String],
      default: [],
    },
    newlyAddedKeywords: {
      type: [String],
      default: [],
    },
    removedWeaknesses: {
      type: [String],
      default: [],
    },
    aiRewriteSnapshot: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    uploadDate: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt timestamps
  }
);

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;
