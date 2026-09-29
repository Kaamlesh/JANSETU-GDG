const express = require('express');
const router = express.Router();
const { GrievanceStore } = require('../models/Grievance');
const { analyzeGrievanceText, analyzeGrievanceImage } = require('../services/geminiService');
const bigQueryService = require('../services/bigQueryService');

/**
 * Preview AI analysis for citizen voice or text input before submission
 */
router.post('/analyze-preview', async (req, res) => {
  try {
    const { text, language = 'ta', imageBase64 } = req.body;
    
    if (!text && !imageBase64) {
      return res.status(400).json({ error: 'Text transcript or image required' });
    }

    const textAnalysis = text ? await analyzeGrievanceText({ text, language, hasImage: !!imageBase64 }) : {};
    const imageAnalysis = imageBase64 ? await analyzeGrievanceImage({ imageBase64, textContext: text }) : {};

    return res.json({
      success: true,
      textAnalysis,
      imageAnalysis
    });
  } catch (err) {
    console.error('Error in analyze-preview:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Submit a new grievance (Web Voice, Portal, or App)
 */
router.post('/', async (req, res) => {
  try {
    const {
      source = 'voice_web',
      citizenPhone = '+91 98400 12345',
      citizenName = 'Citizen Reporter',
      originalLanguage = 'en',
      rawInputText,
      district = 'Madurai',
      ward = 'Ward 45 - South Gate',
      coordinates = { lat: 9.9195, lng: 78.1198 },
      imageBase64 = null,
      imageUrl = ''
    } = req.body;

    if (!rawInputText) {
      return res.status(400).json({ error: 'Grievance description / voice note required' });
    }

    // 1. Gemini NLP
    const textAnalysis = await analyzeGrievanceText({
      text: rawInputText,
      language: originalLanguage,
      hasImage: !!imageBase64 || !!imageUrl
    });

    // 2. Gemini Multimodal Image Inspection
    let imageAnalysis = null;
    if (imageBase64) {
      imageAnalysis = await analyzeGrievanceImage({
        imageBase64,
        textContext: rawInputText
      });
    }

    // 3. Fused with BigQuery Census Demographics & Predictive Prioritization
    const fusionData = await bigQueryService.fuseWithNationalDataset({
      location: { district },
      urgency: textAnalysis.urgency,
      media: { damageVerified: imageAnalysis?.damageVerified || false }
    });

    const ticketId = `JD-${new Date().getFullYear()}-${district.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newGrievance = await GrievanceStore.create({
      ticketId,
      source,
      citizenPhone,
      citizenName,
      originalLanguage,
      rawInputText,
      translatedText: textAnalysis.translatedText,
      category: textAnalysis.category,
      urgency: textAnalysis.urgency,
      sentimentScore: textAnalysis.sentimentScore,
      sentimentLabel: textAnalysis.sentimentLabel,
      media: {
        imageUrl: imageUrl || (imageBase64 ? 'data:image/jpeg;base64,...' : ''),
        damageVerified: imageAnalysis?.damageVerified || false,
        visionAnalysis: imageAnalysis?.visionAnalysis || 'Verified via JanDrishti AI multimodal pipeline',
        severityLevel: imageAnalysis?.severityLevel || 'Moderate'
      },
      location: {
        state: 'Tamil Nadu',
        district,
        ward,
        pincode: '625001',
        landmark: textAnalysis.landmark || 'Main Road',
        coordinates
      },
      priorityScore: fusionData.calculatedPriority,
      status: 'Fused with Census',
      impactAssessment: {
        estimatedBeneficiaries: textAnalysis.estimatedBeneficiaries || 20000,
        estimatedBudgetINR: textAnalysis.estimatedBudgetINR || 500000,
        recommendedDepartment: textAnalysis.recommendedDepartment || 'Public Works'
      }
    });

    return res.status(201).json({
      success: true,
      ticketId,
      grievance: newGrievance,
      fusionData
    });
  } catch (err) {
    console.error('Error submitting grievance:', err);
    return res.status(500).json({ error: err.message });
  }
});

/**
 * List grievances with filters
 */
router.get('/', async (req, res) => {
  try {
    const { district, category, urgency } = req.query;
    const query = {};
    if (district) query.district = district;
    if (category) query.category = category;
    if (urgency) query.urgency = urgency;

    const grievances = await GrievanceStore.find(query);
    return res.json({
      success: true,
      count: grievances.length,
      data: grievances
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Get single grievance by ticketId or ID
 */
router.get('/:id', async (req, res) => {
  try {
    const grievance = await GrievanceStore.findById(req.params.id);
    if (!grievance) {
      return res.status(404).json({ error: 'Grievance not found' });
    }
    return res.json({ success: true, data: grievance });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * Update grievance status (Policymaker workflow action)
 */
router.patch('/:ticketId/status', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await GrievanceStore.updateStatus(req.params.ticketId, status);
    if (!updated) {
      return res.status(404).json({ error: 'Grievance not found' });
    }
    return res.json({ success: true, data: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
