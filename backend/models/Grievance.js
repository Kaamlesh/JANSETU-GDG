const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { isUsingMockStore } = require('../config/db');

const grievanceSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  source: { type: String, enum: ['whatsapp', 'voice_web', 'portal', 'sms'], default: 'voice_web' },
  citizenPhone: { type: String, default: '+91 98765 43210' },
  citizenName: { type: String, default: 'Citizen' },
  originalLanguage: { type: String, default: 'en' },
  rawInputText: { type: String, required: true },
  translatedText: { type: String, required: true },
  category: { 
    type: String, 
    enum: [
      'Roads & Potholes',
      'Water Supply & Drainage',
      'Sanitation & Waste',
      'Electricity & Streetlights',
      'Public Health & Clinics',
      'Education & Schools'
    ], 
    default: 'Roads & Potholes' 
  },
  urgency: { type: String, enum: ['Critical', 'High', 'Medium', 'Low'], default: 'Medium' },
  sentimentScore: { type: Number, default: -0.5 },
  sentimentLabel: { type: String, default: 'Negative' },
  media: {
    imageUrl: { type: String, default: '' },
    audioUrl: { type: String, default: '' },
    damageVerified: { type: Boolean, default: false },
    visionAnalysis: { type: String, default: '' },
    severityLevel: { type: String, default: 'Moderate' }
  },
  location: {
    state: { type: String, default: 'Tamil Nadu' },
    district: { type: String, default: 'Madurai' },
    ward: { type: String, default: 'Ward 45 - South Gate' },
    pincode: { type: String, default: '625001' },
    landmark: { type: String, default: 'Near Municipal School' },
    coordinates: {
      lat: { type: Number, default: 9.9195 },
      lng: { type: Number, default: 78.1198 }
    }
  },
  priorityScore: { type: Number, default: 65 },
  status: { 
    type: String, 
    enum: [
      'Under AI Review', 
      'Validated & Geotagged', 
      'Fused with Census', 
      'Budget Proposed', 
      'Work Sanctioned', 
      'Resolved'
    ], 
    default: 'Under AI Review' 
  },
  impactAssessment: {
    estimatedBeneficiaries: { type: Number, default: 12000 },
    estimatedBudgetINR: { type: Number, default: 450000 },
    recommendedDepartment: { type: String, default: 'Highways & Municipal Works' }
  },
  createdAt: { type: Date, default: Date.now }
});

const GrievanceModel = mongoose.model('Grievance', grievanceSchema);

// In-memory / JSON persistence fallback for instant 0-config execution
const DATA_FILE = path.join(__dirname, '..', 'data_store_grievances.json');
let inMemoryGrievances = [];

if (fs.existsSync(DATA_FILE)) {
  try {
    inMemoryGrievances = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    inMemoryGrievances = [];
  }
}

const saveInMemory = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(inMemoryGrievances, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to persist in-memory grievances to disk:', e);
  }
};

const GrievanceStore = {
  create: async (data) => {
    if (!isUsingMockStore()) {
      try {
        return await GrievanceModel.create(data);
      } catch (err) {
        // fallback to memory if Atlas fails
      }
    }
    const doc = {
      _id: 'g_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      ...data,
      createdAt: data.createdAt || new Date().toISOString()
    };
    inMemoryGrievances.unshift(doc);
    saveInMemory();
    return doc;
  },

  find: async (query = {}) => {
    if (!isUsingMockStore()) {
      try {
        return await GrievanceModel.find(query).sort({ createdAt: -1 });
      } catch (err) {
        // fallback
      }
    }
    let filtered = [...inMemoryGrievances];
    if (query.category) {
      filtered = filtered.filter(g => g.category === query.category);
    }
    if (query.district) {
      filtered = filtered.filter(g => g.location?.district?.toLowerCase() === query.district.toLowerCase());
    }
    if (query.urgency) {
      filtered = filtered.filter(g => g.urgency === query.urgency);
    }
    return filtered;
  },

  findById: async (id) => {
    if (!isUsingMockStore()) {
      try {
        return await GrievanceModel.findById(id);
      } catch (err) {}
    }
    return inMemoryGrievances.find(g => g._id === id || g.ticketId === id);
  },

  updateStatus: async (ticketId, status) => {
    if (!isUsingMockStore()) {
      try {
        return await GrievanceModel.findOneAndUpdate({ ticketId }, { status }, { new: true });
      } catch (err) {}
    }
    const item = inMemoryGrievances.find(g => g.ticketId === ticketId);
    if (item) {
      item.status = status;
      saveInMemory();
      return item;
    }
    return null;
  },

  countDocuments: async () => {
    if (!isUsingMockStore()) {
      try {
        return await GrievanceModel.countDocuments();
      } catch (err) {}
    }
    return inMemoryGrievances.length;
  },

  seedBatch: async (items) => {
    inMemoryGrievances = [...items];
    saveInMemory();
    if (!isUsingMockStore()) {
      try {
        await GrievanceModel.deleteMany({});
        await GrievanceModel.insertMany(items);
      } catch (err) {}
    }
    return inMemoryGrievances.length;
  }
};

module.exports = {
  GrievanceModel,
  GrievanceStore
};
