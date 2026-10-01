import React from 'react';
import RecruiterHeatmap from '../ats/RecruiterHeatmap';

/**
 * Reusable ResumeHeatmap Component (Feature 4 - Recruiter Heatmap)
 * Evaluates sections: Contact Info, Summary, Work Experience, Education, Technical Skills, Projects, Certifications.
 * Displays GREEN / YELLOW / RED status badges, score, explanation, and actionable recommendations.
 */
export const ResumeHeatmap = (props) => {
  return <RecruiterHeatmap {...props} />;
};

export default ResumeHeatmap;
