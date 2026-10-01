import mongoose from 'mongoose';
import ResumeVersion from '../models/resumeVersionModel.js';
import Resume from '../models/resumeModel.js';
import ApiError from '../utils/apiError.js';
import atsService from './atsService.js';

/**
 * @file versionService.js
 * @description Service for managing Git-style Resume Version Snapshots and Comparisons.
 */

/**
 * Creates a new version snapshot for a given resume document.
 * 
 * @param {Object} params
 * @param {string} params.userId - User ObjectId
 * @param {string} params.resumeId - Resume ObjectId
 * @param {string} [params.versionLabel] - Version commit label
 * @param {string} [params.changesSummary] - Description of changes made
 * @param {Array} [params.newlyAddedKeywords] - Array of newly added keywords
 * @param {Array} [params.removedWeaknesses] - Array of eliminated gaps
 * @param {Object} [params.aiRewriteSnapshot] - AI optimization payload if available
 * @returns {Promise<Object>} Created ResumeVersion document
 */
export const createVersionSnapshot = async ({
  userId,
  resumeId,
  versionLabel,
  changesSummary,
  newlyAddedKeywords = [],
  removedWeaknesses = [],
  aiRewriteSnapshot = null,
}) => {
  if (!userId) throw new ApiError(401, 'User authentication required.');
  if (!resumeId || !mongoose.Types.ObjectId.isValid(resumeId)) {
    throw new ApiError(400, 'Valid Resume ID is required.');
  }

  const resume = await Resume.findOne({ _id: resumeId, user: userId });
  if (!resume) {
    throw new ApiError(404, 'Resume not found or access denied.');
  }

  // Count existing versions for this resume to auto-increment version number
  const existingVersions = await ResumeVersion.find({ user: userId, resume: resumeId }).sort({ versionNumber: -1 });
  const versionNumber = existingVersions.length > 0 ? existingVersions[0].versionNumber + 1 : (resume.versionNumber || 1);

  const label = versionLabel || resume.commitName || `v${versionNumber}.0 - Resume Snapshot`;
  const summary = changesSummary || (newlyAddedKeywords.length > 0
    ? `Integrated ${newlyAddedKeywords.slice(0, 3).join(', ')}`
    : `Version ${versionNumber}.0 commit`);

  const versionDoc = await ResumeVersion.create({
    user: userId,
    resume: resumeId,
    versionNumber,
    versionLabel: label,
    originalName: resume.originalName,
    extractedText: resume.extractedText,
    atsScore: resume.atsScore || 0,
    keywordScore: resume.keywordScore || 0,
    experienceScore: resume.experienceScore || 0,
    structureScore: resume.structureScore || 0,
    matchedKeywords: resume.matchedKeywords || [],
    missingKeywords: resume.missingKeywords || [],
    skillsOverlap: {
      matchedSkills: resume.matchedKeywords || [],
      missingSkills: resume.missingKeywords || [],
    },
    aiRewriteSnapshot: aiRewriteSnapshot || resume.aiRewriteSnapshot || null,
    changesSummary: summary,
    addedKeywords: newlyAddedKeywords.length > 0 ? newlyAddedKeywords : (resume.newlyAddedKeywords || []),
    removedWeaknesses: removedWeaknesses.length > 0 ? removedWeaknesses : (resume.removedWeaknesses || []),
  });

  return versionDoc;
};

/**
 * Fetch all versions for a specific resume (or all versions of user if no resumeId specified)
 */
export const getVersionsForResume = async (userId, resumeId) => {
  if (!userId) throw new ApiError(401, 'User authentication required.');

  let query = { user: userId };
  if (resumeId && mongoose.Types.ObjectId.isValid(resumeId)) {
    query.resume = resumeId;
  }

  let versions = await ResumeVersion.find(query).sort({ versionNumber: -1 });

  // Fallback: If no versions stored yet, populate from Resume collection
  if (versions.length === 0) {
    const resumes = await Resume.find({ user: userId }).sort({ versionNumber: -1 });
    for (const r of resumes) {
      const created = await ResumeVersion.create({
        user: userId,
        resume: r._id,
        versionNumber: r.versionNumber || 1,
        versionLabel: r.commitName || `v${r.versionNumber || 1}.0 Snapshot`,
        originalName: r.originalName,
        extractedText: r.extractedText,
        atsScore: r.atsScore || 0,
        keywordScore: r.keywordScore || 0,
        experienceScore: r.experienceScore || 0,
        structureScore: r.structureScore || 0,
        matchedKeywords: r.matchedKeywords || [],
        missingKeywords: r.missingKeywords || [],
        skillsOverlap: { matchedSkills: r.matchedKeywords || [], missingSkills: r.missingKeywords || [] },
        aiRewriteSnapshot: r.aiRewriteSnapshot || null,
        changesSummary: r.commitName || 'Baseline upload',
        addedKeywords: r.newlyAddedKeywords || [],
        removedWeaknesses: r.removedWeaknesses || [],
      });
      versions.push(created);
    }
  }

  return versions;
};

/**
 * Compare two resume versions side-by-side
 */
export const compareVersions = async (userId, resumeId, versionAIdOrNum, versionBIdOrNum) => {
  if (!userId) throw new ApiError(401, 'User authentication required.');

  const versions = await getVersionsForResume(userId, resumeId);
  if (versions.length === 0) {
    throw new ApiError(404, 'No version history found for comparison.');
  }

  // Resolve Version A
  let verA = versions.find(v => v._id.toString() === versionAIdOrNum || v.versionNumber === Number(versionAIdOrNum));
  if (!verA) verA = versions[versions.length - 1]; // default oldest

  // Resolve Version B
  let verB = versions.find(v => v._id.toString() === versionBIdOrNum || v.versionNumber === Number(versionBIdOrNum));
  if (!verB) verB = versions[0]; // default latest

  const scoreDiff = (verB.atsScore || 0) - (verA.atsScore || 0);
  const keywordScoreDiff = (verB.keywordScore || 0) - (verA.keywordScore || 0);
  const experienceScoreDiff = (verB.experienceScore || 0) - (verA.experienceScore || 0);
  const structureScoreDiff = (verB.structureScore || 0) - (verA.structureScore || 0);

  // Calculate Keyword Additions/Removals between verA and verB
  const setA = new Set((verA.matchedKeywords || []).map(k => k.toLowerCase()));
  const setB = new Set((verB.matchedKeywords || []).map(k => k.toLowerCase()));

  const addedInB = Array.from(setB).filter(k => !setA.has(k));
  const removedInB = Array.from(setA).filter(k => !setB.has(k));

  return {
    versionA: verA,
    versionB: verB,
    diff: {
      atsScoreDelta: scoreDiff,
      keywordScoreDelta: keywordScoreDiff,
      experienceScoreDelta: experienceScoreDiff,
      structureScoreDelta: structureScoreDiff,
      addedKeywordsInB: addedInB.length > 0 ? addedInB : (verB.addedKeywords || []),
      removedWeaknessesInB: verB.removedWeaknesses || [],
      removedKeywordsInB: removedInB,
      scoreImprovementPercentage: verA.atsScore > 0 ? Math.round((scoreDiff / verA.atsScore) * 100) : 0,
    },
  };
};

export default {
  createVersionSnapshot,
  getVersionsForResume,
  compareVersions,
};
