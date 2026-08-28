import mongoose from 'mongoose';
import Resume from '../models/resumeModel.js';
import ApiError from '../utils/apiError.js';

/**
 * @file atsService.js
 * @description Production-grade ATS Scoring and Resume Analysis Engine.
 * Evaluates resume text against job descriptions using keyword matching, skills extraction,
 * experience indicators, and ATS structure analysis.
 */

// Common English Stop Words & Job Posting Boilerplate Words
const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
  'aren\'t', 'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both',
  'but', 'by', 'can', 'can\'t', 'cannot', 'could', 'couldn\'t', 'did', 'didn\'t', 'do', 'does',
  'doesn\'t', 'doing', 'don\'t', 'down', 'during', 'each', 'few', 'for', 'from', 'further',
  'had', 'hadn\'t', 'has', 'hasn\'t', 'have', 'haven\'t', 'having', 'he', 'he\'d', 'he\'ll',
  'he\'s', 'her', 'here', 'here\'s', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'how\'s', 'i', 'i\'d', 'i\'ll', 'i\'m', 'i\'ve', 'if', 'in', 'into', 'is', 'isn\'t', 'it',
  'it\'s', 'its', 'itself', 'let\'s', 'me', 'more', 'most', 'mustn\'t', 'my', 'myself', 'no',
  'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', 'shan\'t', 'she', 'she\'d', 'she\'ll', 'she\'s',
  'should', 'shouldn\'t', 'so', 'some', 'such', 'than', 'that', 'that\'s', 'the', 'their',
  'theirs', 'them', 'themselves', 'then', 'there', 'there\'s', 'these', 'they', 'they\'d',
  'they\'ll', 'they\'re', 'they\'ve', 'this', 'those', 'through', 'to', 'too', 'under',
  'until', 'up', 'very', 'was', 'wasn\'t', 'we', 'we\'d', 'we\'ll', 'we\'re', 'we\'ve',
  'were', 'weren\'t', 'what', 'what\'s', 'when', 'when\'s', 'where', 'where\'s', 'which',
  'while', 'who', 'who\'s', 'whom', 'why', 'why\'s', 'with', 'won\'t', 'would', 'wouldn\'t',
  'you', 'you\'d', 'you\'ll', 'you\'re', 'you\'ve', 'your', 'yours', 'yourself', 'yourselves',
  'will', 'shall', 'may', 'might', 'must', 'across', 'within', 'including', 'using', 'etc',
  'also', 'well', 'plus', 'need', 'needs', 'required', 'preferred', 'qualification', 'qualifications',
  'role', 'responsibilities', 'responsibility', 'work', 'job', 'description', 'candidate', 'company',
  'look', 'looking', 'seek', 'seeking', 'want', 'wanted', 'ideal', 'apply', 'join', 'opportunity',
  'year', 'years', 'experience', 'experienced', 'strong', 'proven', 'working', 'ability', 'proficient'
]);

// Standard Technical and Professional Domain Skills Dictionary
const DOMAIN_SKILLS = [
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'golang', 'go', 'rust', 'ruby',
  'php', 'swift', 'kotlin', 'scala', 'sql', 'nosql', 'r', 'dart', 'html', 'html5', 'css', 'css3',
  'react', 'react.js', 'reactjs', 'next.js', 'nextjs', 'vue', 'vue.js', 'angular', 'svelte',
  'node', 'node.js', 'nodejs', 'express', 'express.js', 'nest.js', 'nestjs', 'django', 'fastapi',
  'flask', 'spring', 'spring boot', 'rails', 'ruby on rails', 'asp.net', 'laravel',
  'mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'dynamodb', 'cassandra',
  'elasticsearch', 'mariadb', 'oracle', 'firebase', 'supabase', 'prisma', 'mongoose',
  'aws', 'amazon web services', 'azure', 'gcp', 'google cloud', 'docker', 'kubernetes', 'k8s',
  'ci/cd', 'cicd', 'jenkins', 'github actions', 'gitlab ci', 'terraform', 'ansible', 'linux',
  'rest', 'restful api', 'rest api', 'graphql', 'grpc', 'websockets', 'microservices', 'serverless',
  'git', 'github', 'gitlab', 'bitbucket', 'jira', 'confluence', 'agile', 'scrum', 'kanban',
  'unit testing', 'integration testing', 'jest', 'mocha', 'cypress', 'selenium', 'playwright',
  'machine learning', 'deep learning', 'nlp', 'computer vision', 'tensorflow', 'pytorch',
  'pandas', 'numpy', 'scikit-learn', 'data analysis', 'data engineering', 'data structures',
  'algorithms', 'system design', 'cloud architecture', 'devops', 'security', 'oauth', 'jwt',
  'leadership', 'team management', 'mentorship', 'communication', 'problem solving', 'collaboration'
];

// Standard Resume Section Patterns
const RESUME_SECTIONS = [
  { name: 'Contact Information', patterns: [/(contact|email|phone|address|linkedin|github|portfolio)/i] },
  { name: 'Professional Summary', patterns: [/(summary|professional summary|executive summary|about me|profile|career objective|objective)/i] },
  { name: 'Work Experience', patterns: [/(experience|work experience|employment history|professional experience|work history|career history)/i] },
  { name: 'Education', patterns: [/(education|academic background|academics|degrees|university|college|qualifications)/i] },
  { name: 'Technical Skills', patterns: [/(skills|technical skills|core competencies|technologies|tools|proficiencies|areas of expertise)/i] },
  { name: 'Projects', patterns: [/(projects|personal projects|key projects|academic projects|portfolio projects)/i] },
  { name: 'Certifications', patterns: [/(certifications|certificates|licenses|accreditations|awards|honors)/i] },
];

// Strong Action Verbs for Resume Impact
const ACTION_VERBS = [
  'accelerated', 'achieved', 'administered', 'architected', 'automated', 'built', 'championed',
  'collaborated', 'constructed', 'created', 'customized', 'decreased', 'delivered', 'deployed',
  'designed', 'developed', 'directed', 'engineered', 'enhanced', 'established', 'executed',
  'expanded', 'facilitated', 'formulated', 'generated', 'guided', 'implemented', 'improved',
  'increased', 'initiated', 'innovated', 'integrated', 'introduced', 'launched', 'led',
  'managed', 'maximized', 'mentored', 'minimized', 'modernized', 'optimized', 'orchestrated',
  'overhauled', 'pioneered', 'produced', 'programmed', 'rearchitected', 'reduced', 'refactored',
  'resolved', 'revamped', 'scaled', 'spearheaded', 'streamlined', 'strengthened', 'supervised',
  'tested', 'transformed', 'upgraded', 'validated', 'yielded'
];

/**
 * Escapes regex special characters safely
 * @param {string} str - String to escape
 * @returns {string} Escaped string for regex construction
 */
const escapeRegex = (str = '') => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

/**
 * Normalizes text: converts to lowercase, standardizes delimiters, and trims.
 * @param {string} text - Input raw text
 * @returns {string} Normalized string
 */
export const normalizeText = (text = '') => {
  return text
    .toLowerCase()
    .replace(/[^\w\s+#./-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Extracts distinct tokens and multi-word phrases from text.
 * Filters out stop words and single-character terms while preserving tech keywords like node.js, c++, and c#.
 * @param {string} text - Input text
 * @returns {Set<string>} Set of unique extracted keywords
 */
export const extractKeywords = (text = '') => {
  const normalized = normalizeText(text);
  const rawWords = normalized.split(' ');
  const keywordSet = new Set();

  // 1. Clean and add individual meaningful words
  rawWords.forEach((word) => {
    // Strip leading/trailing non-alphanumeric chars except valid symbols (+, #)
    const cleaned = word.replace(/^[^\w+#]+|[^\w+#]+$/g, '');
    if (cleaned.length > 1 && !STOP_WORDS.has(cleaned)) {
      keywordSet.add(cleaned);
    }
  });

  // 2. Add domain-specific multi-word skills if present in text
  DOMAIN_SKILLS.forEach((skill) => {
    const skillEscaped = escapeRegex(skill);
    const skillPattern = new RegExp(`(^|\\W)${skillEscaped}(\\W|$)`, 'i');
    if (skillPattern.test(text)) {
      keywordSet.add(skill.toLowerCase());
    }
  });

  return keywordSet;
};

/**
 * Evaluates keyword matching between Job Description and Resume Text.
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobDescription - Target job description text
 * @returns {Object} { keywordScore, matchedKeywords, missingKeywords }
 */
export const calculateKeywordMatch = (resumeText = '', jobDescription = '') => {
  const jdKeywords = extractKeywords(jobDescription);
  const resumeLower = normalizeText(resumeText);

  if (jdKeywords.size === 0) {
    return {
      keywordScore: 70,
      matchedKeywords: [],
      missingKeywords: [],
    };
  }

  const matchedKeywords = [];
  const missingKeywords = [];

  jdKeywords.forEach((keyword) => {
    const escaped = escapeRegex(keyword);
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');

    if (regex.test(resumeLower)) {
      matchedKeywords.push(keyword);
    } else {
      missingKeywords.push(keyword);
    }
  });

  // Calculate percentage of matched keywords
  const matchRatio = matchedKeywords.length / jdKeywords.size;
  const keywordScore = Math.min(100, Math.round(matchRatio * 100));

  return {
    keywordScore,
    matchedKeywords,
    missingKeywords,
  };
};

/**
 * Identifies domain skills overlap between Resume and Job Description.
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobDescription - Job description
 * @returns {Object} Skills overlap breakdown
 */
export const calculateSkillsOverlap = (resumeText = '', jobDescription = '') => {
  const resumeLower = normalizeText(resumeText);
  const jdLower = normalizeText(jobDescription);

  const jdSkills = DOMAIN_SKILLS.filter((skill) => {
    const escaped = escapeRegex(skill);
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
    return regex.test(jdLower);
  });

  const resumeSkills = DOMAIN_SKILLS.filter((skill) => {
    const escaped = escapeRegex(skill);
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
    return regex.test(resumeLower);
  });

  const matchedSkills = jdSkills.filter((skill) => resumeSkills.includes(skill));
  const missingSkills = jdSkills.filter((skill) => !resumeSkills.includes(skill));

  return {
    jdSkills,
    resumeSkills,
    matchedSkills,
    missingSkills,
  };
};

/**
 * Evaluates experience indicators such as years of experience, action verbs, and quantifiable metrics.
 * @param {string} resumeText - Extracted resume text
 * @param {string} jobDescription - Job description
 * @returns {Object} { experienceScore, yearsDetected, actionVerbsFound, quantifiedMetricsCount }
 */
export const evaluateExperience = (resumeText = '', jobDescription = '') => {
  const resumeLower = normalizeText(resumeText);

  // 1. Extract years of experience mentioned in resume
  const experiencePattern = /(\d{1,2})\+?\s*(?:years?|yrs?)(?:\s+(?:of\s+)?experience)?/gi;
  const matches = [...resumeText.matchAll(experiencePattern)];
  const yearsDetected = matches.map((m) => parseInt(m[1], 10)).filter((y) => y > 0 && y < 50);
  const maxYearsFound = yearsDetected.length > 0 ? Math.max(...yearsDetected) : null;

  // 2. Count strong action verbs utilized
  const actionVerbsFound = ACTION_VERBS.filter((verb) => {
    const escaped = escapeRegex(verb);
    const regex = new RegExp(`(^|\\W)${escaped}(\\W|$)`, 'i');
    return regex.test(resumeLower);
  });

  // 3. Count quantifiable achievements (e.g. 50%, $100k, 10x, 500+ users)
  const metricRegex = /(\d+%\b|\$\d+[\d,]*\b|\b\d+x\b|\b\d+\s*(?:k|m|million|billion|users|clients|requests|endpoints)\b)/gi;
  const quantifiedMetrics = resumeText.match(metricRegex) || [];
  const quantifiedMetricsCount = quantifiedMetrics.length;

  // Compute Experience Subscore (Max 100)
  // - Action Verbs density: up to 45 pts
  // - Quantified Metrics: up to 30 pts
  // - Clear Experience mentions: up to 25 pts
  const verbScore = Math.min(45, (actionVerbsFound.length / 8) * 45);
  const metricScore = Math.min(30, (quantifiedMetricsCount / 4) * 30);
  const yearsScore = maxYearsFound !== null ? 25 : 15;

  const experienceScore = Math.min(100, Math.round(verbScore + metricScore + yearsScore));

  return {
    experienceScore,
    maxYearsFound,
    actionVerbsFound,
    quantifiedMetricsCount,
  };
};

/**
 * Detects structural resume sections and validates standard ATS organization.
 * @param {string} resumeText - Extracted resume text
 * @returns {Object} { structureScore, detectedSections, missingSections }
 */
export const detectResumeSections = (resumeText = '') => {
  const detectedSections = [];
  const missingSections = [];

  RESUME_SECTIONS.forEach((section) => {
    const isDetected = section.patterns.some((pattern) => pattern.test(resumeText));
    if (isDetected) {
      detectedSections.push(section.name);
    } else {
      missingSections.push(section.name);
    }
  });

  // Core sections that carry highest ATS weight
  const essentialCount = detectedSections.length;
  const totalCount = RESUME_SECTIONS.length;
  const structureScore = Math.min(100, Math.round((essentialCount / totalCount) * 100));

  return {
    structureScore,
    detectedSections,
    missingSections,
  };
};

/**
 * Generates tailored, actionable suggestions to boost ATS compatibility and scores.
 * @param {Object} params - Analysis results
 * @returns {string[]} List of actionable recommendations
 */
export const generateActionableSuggestions = ({
  missingKeywords,
  missingSkills,
  missingSections,
  actionVerbsFound,
  quantifiedMetricsCount,
  keywordScore,
  experienceScore,
  structureScore,
}) => {
  const suggestions = [];

  // 1. Missing Keyword Recommendations
  if (missingKeywords && missingKeywords.length > 0) {
    const topMissing = missingKeywords.slice(0, 6).join(', ');
    suggestions.push(`Incorporate key job description keywords directly into your summary and experience: ${topMissing}.`);
  }

  // 2. Missing Technical Skills Recommendations
  if (missingSkills && missingSkills.length > 0) {
    const topSkills = missingSkills.slice(0, 5).join(', ');
    suggestions.push(`Highlight relevant target skills required by the job posting: ${topSkills}.`);
  }

  // 3. Structure & Formatting Recommendations
  if (missingSections && missingSections.length > 0) {
    suggestions.push(`Add standard ATS section headers to improve parseability: ${missingSections.join(', ')}.`);
  }

  // 4. Action Verbs Recommendations
  if (actionVerbsFound.length < 6) {
    suggestions.push('Begin bullet points with strong impact action verbs such as "Architected", "Spearheaded", "Optimized", or "Engineered".');
  }

  // 5. Quantifiable Impact Recommendations
  if (quantifiedMetricsCount < 3) {
    suggestions.push('Quantify your achievements with measurable business metrics (e.g., "Increased performance by 35%", "Reduced latency by 120ms").');
  }

  // 6. General ATS Optimization
  if (keywordScore < 60) {
    suggestions.push('Tailor your resume wording to more closely align with the specific terminology and requirements in the job description.');
  }

  if (suggestions.length === 0) {
    suggestions.push('Excellent alignment! Ensure formatting remains simple, clean, and free of tables or multi-column layouts for maximum ATS readability.');
  }

  return suggestions;
};

/**
 * Calculates weighted composite overall ATS score.
 * Formula: 45% Keyword Score + 30% Experience Score + 25% Structure Score.
 * @param {number} keywordScore
 * @param {number} experienceScore
 * @param {number} structureScore
 * @returns {number} Overall ATS score (0 - 100)
 */
export const calculateOverallScore = (keywordScore, experienceScore, structureScore) => {
  const weighted = keywordScore * 0.45 + experienceScore * 0.30 + structureScore * 0.25;
  return Math.min(100, Math.max(0, Math.round(weighted)));
};

/**
 * Service: Analyze resume against job description using ATS scoring engine.
 * 
 * @param {Object} params - Analysis parameters
 * @param {string} params.resumeId - MongoDB ObjectId of the uploaded resume
 * @param {string} params.jobDescription - Job description text
 * @param {string} params.userId - Authenticated user ObjectId
 * @returns {Promise<Object>} Full ATS analysis report
 */
export const analyzeResumeATS = async ({ resumeId, jobDescription, userId }) => {
  // 1. Validate inputs
  if (!resumeId) {
    throw new ApiError(400, 'Resume ID is required for ATS analysis.');
  }

  if (!mongoose.Types.ObjectId.isValid(resumeId)) {
    throw new ApiError(400, 'Invalid Resume ID format.');
  }

  if (!jobDescription || typeof jobDescription !== 'string' || jobDescription.trim().length < 20) {
    throw new ApiError(400, 'Please provide a detailed job description (minimum 20 characters).');
  }

  // 2. Fetch resume document from MongoDB
  const resume = await Resume.findOne({
    _id: resumeId,
    user: userId,
  });

  if (!resume) {
    throw new ApiError(404, 'Resume not found or you do not have permission to access it.');
  }

  const resumeText = resume.extractedText;

  if (!resumeText || resumeText.trim().length === 0) {
    throw new ApiError(422, 'The specified resume contains no extracted text content.');
  }

  // 3. Execute ATS Evaluation Pipelines
  const keywordAnalysis = calculateKeywordMatch(resumeText, jobDescription);
  const skillsAnalysis = calculateSkillsOverlap(resumeText, jobDescription);
  const experienceAnalysis = evaluateExperience(resumeText, jobDescription);
  const structureAnalysis = detectResumeSections(resumeText);

  // 4. Calculate Composite Overall Score
  const overallScore = calculateOverallScore(
    keywordAnalysis.keywordScore,
    experienceAnalysis.experienceScore,
    structureAnalysis.structureScore
  );

  // 5. Generate Actionable Suggestions
  const actionableSuggestions = generateActionableSuggestions({
    missingKeywords: keywordAnalysis.missingKeywords,
    missingSkills: skillsAnalysis.missingSkills,
    missingSections: structureAnalysis.missingSections,
    actionVerbsFound: experienceAnalysis.actionVerbsFound,
    quantifiedMetricsCount: experienceAnalysis.quantifiedMetricsCount,
    keywordScore: keywordAnalysis.keywordScore,
    experienceScore: experienceAnalysis.experienceScore,
    structureScore: structureAnalysis.structureScore,
  });

  return {
    resumeId: resume._id,
    originalName: resume.originalName,
    overallScore,
    keywordScore: keywordAnalysis.keywordScore,
    experienceScore: experienceAnalysis.experienceScore,
    structureScore: structureAnalysis.structureScore,
    matchedKeywords: keywordAnalysis.matchedKeywords,
    missingKeywords: keywordAnalysis.missingKeywords,
    skillsOverlap: {
      matchedSkills: skillsAnalysis.matchedSkills,
      missingSkills: skillsAnalysis.missingSkills,
    },
    experienceIndicators: {
      yearsDetected: experienceAnalysis.maxYearsFound,
      actionVerbsCount: experienceAnalysis.actionVerbsFound.length,
      quantifiedMetricsCount: experienceAnalysis.quantifiedMetricsCount,
    },
    sectionsDetected: structureAnalysis.detectedSections,
    actionableSuggestions,
    analyzedAt: new Date().toISOString(),
  };
};

export default {
  analyzeResumeATS,
  calculateKeywordMatch,
  calculateSkillsOverlap,
  evaluateExperience,
  detectResumeSections,
  generateActionableSuggestions,
  calculateOverallScore,
};
