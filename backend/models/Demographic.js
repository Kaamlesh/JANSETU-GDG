const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { isUsingMockStore } = require('../config/db');

const demographicSchema = new mongoose.Schema({
  district: { type: String, required: true, unique: true },
  state: { type: String, required: true },
  country: { type: String, default: 'India' },
  bricsNation: { type: String, default: 'India' },
  population: { type: Number, required: true },
  densityPerSqKm: { type: Number, required: true },
  vulnerabilityIndex: { type: Number, required: true }, // 0.0 - 1.0 (BPL %, disaster susceptibility)
  existingInfrastructureIndex: { type: Number, required: true }, // 0.0 - 1.0 (road coverage, piped water, health centers)
  activeComplaintsCount: { type: Number, default: 0 },
  hotspotScore: { type: Number, default: 50 },
  coordinates: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true }
  },
  wards: [{
    wardNumber: String,
    wardName: String,
    population: Number,
    vulnerabilityIndex: Number,
    infraIndex: Number,
    topGrievanceCategory: String
  }],
  allocatedBudgetCrINR: { type: Number, default: 45.5 },
  lastCensusYear: { type: Number, default: 2021 }
});

const DemographicModel = mongoose.model('Demographic', demographicSchema);

// In-memory / JSON file fallback
const DATA_FILE = path.join(__dirname, '..', 'data_store_demographics.json');
let inMemoryDemographics = [];

if (fs.existsSync(DATA_FILE)) {
  try {
    inMemoryDemographics = JSON.parse(fs.readFileSync(DATA_FILE, 'utf-8'));
  } catch (e) {
    inMemoryDemographics = [];
  }
}

const saveInMemory = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(inMemoryDemographics, null, 2), 'utf-8');
  } catch (e) {
    console.error('Failed to persist in-memory demographics:', e);
  }
};

const DemographicStore = {
  find: async (query = {}) => {
    if (!isUsingMockStore()) {
      try {
        return await DemographicModel.find(query);
      } catch (err) {}
    }
    return inMemoryDemographics;
  },

  findOne: async (query = {}) => {
    if (!isUsingMockStore()) {
      try {
        return await DemographicModel.findOne(query);
      } catch (err) {}
    }
    if (query.district) {
      return inMemoryDemographics.find(d => d.district.toLowerCase() === query.district.toLowerCase());
    }
    return inMemoryDemographics[0] || null;
  },

  seedBatch: async (items) => {
    inMemoryDemographics = [...items];
    saveInMemory();
    if (!isUsingMockStore()) {
      try {
        await DemographicModel.deleteMany({});
        await DemographicModel.insertMany(items);
      } catch (err) {}
    }
    return inMemoryDemographics.length;
  }
};

module.exports = {
  DemographicModel,
  DemographicStore
};
