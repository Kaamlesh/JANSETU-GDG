/**
 * JanDrishti AI - Predictive Prioritization Engine
 * Based on National Open Data & Citizen Signal Fusion:
 * Formula: Priority Index = w1*(Complaint Density) + w2*(Demographic Vulnerability) - w3*(Existing Infrastructure Index) + Boosters
 */

const DEFAULT_WEIGHTS = {
  w1: 0.45, // Weight for Complaint Density & Urgency
  w2: 0.35, // Weight for Demographic Vulnerability (BPL %, population density)
  w3: 0.20  // Weight for Existing Infrastructure Index (higher existing infra = lower deficit)
};

/**
 * Calculate Priority Index for a single grievance or ward cluster
 * @param {Object} params
 * @param {number} params.complaintDensity Normalized 0-100 (frequency in ward + urgency)
 * @param {number} params.demographicVulnerability Normalized 0-100 (from data.gov.in census)
 * @param {number} params.existingInfraIndex Normalized 0-100 (existing amenities)
 * @param {boolean} params.damageVerified Whether image AI confirmed physical hazard
 * @param {string} params.urgency 'Critical' | 'High' | 'Medium' | 'Low'
 * @returns {Object} score breakdown and action recommendation
 */
function calculatePriorityScore({
  complaintDensity = 50,
  demographicVulnerability = 60,
  existingInfraIndex = 40,
  damageVerified = false,
  urgency = 'Medium'
}) {
  const w1 = DEFAULT_WEIGHTS.w1;
  const w2 = DEFAULT_WEIGHTS.w2;
  const w3 = DEFAULT_WEIGHTS.w3;

  // Base raw score
  let baseScore = (w1 * complaintDensity) + (w2 * demographicVulnerability) - (w3 * existingInfraIndex);

  // Urgency modifier
  let urgencyModifier = 0;
  if (urgency === 'Critical') urgencyModifier = 18;
  else if (urgency === 'High') urgencyModifier = 10;
  else if (urgency === 'Medium') urgencyModifier = 4;

  // AI Multimodal verification booster
  const visionBooster = damageVerified ? 12 : 0;

  let totalScore = Math.round(baseScore + urgencyModifier + visionBooster);

  // Clamp 1 - 100
  totalScore = Math.max(5, Math.min(99, totalScore));

  let tier = 'Medium';
  let recommendedAction = 'Routine municipal review';
  let badgeColor = '#f9ab00'; // Amber

  if (totalScore >= 80) {
    tier = 'Critical';
    recommendedAction = 'Immediate Fast-Track Sanction under Capital Outlay';
    badgeColor = '#ea4335'; // Red
  } else if (totalScore >= 65) {
    tier = 'High';
    recommendedAction = 'Priority inclusion in upcoming District Development Plan';
    badgeColor = '#fa7b17'; // Orange
  } else if (totalScore < 45) {
    tier = 'Low';
    recommendedAction = 'Scheduled maintenance or ward corporator discretionary pool';
    badgeColor = '#34a853'; // Green
  }

  return {
    score: totalScore,
    tier,
    badgeColor,
    recommendedAction,
    formulaBreakdown: {
      formula: 'w1*(ComplaintDensity) + w2*(DemographicVulnerability) - w3*(ExistingInfra) + Modifiers',
      densityTerm: +(w1 * complaintDensity).toFixed(1),
      vulnerabilityTerm: +(w2 * demographicVulnerability).toFixed(1),
      infraPenaltyTerm: -(w3 * existingInfraIndex).toFixed(1),
      urgencyModifier,
      visionBooster
    }
  };
}

module.exports = {
  calculatePriorityScore,
  DEFAULT_WEIGHTS
};
