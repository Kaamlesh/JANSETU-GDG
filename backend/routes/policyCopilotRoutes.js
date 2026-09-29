const express = require('express');
const router = express.Router();
const { queryPolicyCopilot } = require('../services/geminiService');
const { DemographicStore } = require('../models/Demographic');
const { GrievanceStore } = require('../models/Grievance');

/**
 * Ask Policy Copilot (Gemini Agent)
 */
router.post('/query', async (req, res) => {
  try {
    const { query, district = 'Madurai' } = req.body;

    if (!query) {
      return res.status(400).json({ error: 'Query prompt is required' });
    }

    // Retrieve active grievances and district demographic profile for grounding
    const districtData = (await DemographicStore.findOne({ district })) || {
      district: 'Madurai',
      state: 'Tamil Nadu',
      population: 1561000,
      vulnerabilityIndex: 0.72,
      existingInfrastructureIndex: 0.44
    };

    const activeGrievances = await GrievanceStore.find({ district });

    const result = await queryPolicyCopilot({
      query,
      districtData,
      activeGrievances
    });

    return res.json({
      success: true,
      query,
      district: districtData.district,
      answer: result.answer,
      generatedBy: result.generatedBy,
      contextMetrics: {
        population: districtData.population,
        activeGrievancesCount: activeGrievances.length,
        vulnerabilityScore: districtData.vulnerabilityIndex
      }
    });
  } catch (err) {
    console.error('Error in policy copilot query:', err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
