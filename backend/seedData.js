require('dotenv').config();
const { connectDB } = require('./config/db');
const { GrievanceStore } = require('./models/Grievance');
const { DemographicStore } = require('./models/Demographic');

const seedDemographics = [
  {
    district: 'Madurai',
    state: 'Tamil Nadu',
    country: 'India',
    bricsNation: 'India',
    population: 1561000,
    densityPerSqKm: 823,
    vulnerabilityIndex: 0.72,
    existingInfrastructureIndex: 0.44,
    activeComplaintsCount: 28,
    allocatedBudgetCrINR: 64.5,
    coordinates: { lat: 9.9252, lng: 78.1198 },
    wards: [
      { wardNumber: '45', wardName: 'South Gate & Keela Vaasal', population: 64000, vulnerabilityIndex: 0.81, infraIndex: 0.38, topGrievanceCategory: 'Water Supply & Drainage' },
      { wardNumber: '28', wardName: 'Simmakkal & Goripalayam', population: 52000, vulnerabilityIndex: 0.68, infraIndex: 0.52, topGrievanceCategory: 'Roads & Potholes' },
      { wardNumber: '61', wardName: 'Villapuram & Avaniyapuram', population: 78000, vulnerabilityIndex: 0.79, infraIndex: 0.35, topGrievanceCategory: 'Sanitation & Waste' }
    ]
  },
  {
    district: 'Chennai',
    state: 'Tamil Nadu',
    country: 'India',
    bricsNation: 'India',
    population: 7088000,
    densityPerSqKm: 26903,
    vulnerabilityIndex: 0.65,
    existingInfrastructureIndex: 0.68,
    activeComplaintsCount: 42,
    allocatedBudgetCrINR: 185.0,
    coordinates: { lat: 13.0827, lng: 80.2707 },
    wards: [
      { wardNumber: '117', wardName: 'T. Nagar South', population: 89000, vulnerabilityIndex: 0.55, infraIndex: 0.72, topGrievanceCategory: 'Roads & Potholes' },
      { wardNumber: '178', wardName: 'Velachery West', population: 94000, vulnerabilityIndex: 0.76, infraIndex: 0.58, topGrievanceCategory: 'Water Supply & Drainage' }
    ]
  },
  {
    district: 'Varanasi',
    state: 'Uttar Pradesh',
    country: 'India',
    bricsNation: 'India',
    population: 1215000,
    densityPerSqKm: 2399,
    vulnerabilityIndex: 0.78,
    existingInfrastructureIndex: 0.41,
    activeComplaintsCount: 34,
    allocatedBudgetCrINR: 52.0,
    coordinates: { lat: 25.3176, lng: 82.9739 },
    wards: [
      { wardNumber: '12', wardName: 'Dashashwamedh Ghat Ward', population: 48000, vulnerabilityIndex: 0.82, infraIndex: 0.40, topGrievanceCategory: 'Sanitation & Waste' },
      { wardNumber: '34', wardName: 'Cantt Railway Colony', population: 56000, vulnerabilityIndex: 0.62, infraIndex: 0.55, topGrievanceCategory: 'Roads & Potholes' }
    ]
  },
  {
    district: 'Bengaluru Urban',
    state: 'Karnataka',
    country: 'India',
    bricsNation: 'India',
    population: 9621000,
    densityPerSqKm: 4378,
    vulnerabilityIndex: 0.58,
    existingInfrastructureIndex: 0.62,
    activeComplaintsCount: 39,
    allocatedBudgetCrINR: 210.0,
    coordinates: { lat: 12.9716, lng: 77.5946 },
    wards: [
      { wardNumber: '85', wardName: 'Doddanekkundi / Whitefield', population: 112000, vulnerabilityIndex: 0.61, infraIndex: 0.49, topGrievanceCategory: 'Roads & Potholes' }
    ]
  },
  {
    district: 'Pune',
    state: 'Maharashtra',
    country: 'India',
    bricsNation: 'India',
    population: 3124000,
    densityPerSqKm: 9400,
    vulnerabilityIndex: 0.52,
    existingInfrastructureIndex: 0.64,
    activeComplaintsCount: 21,
    allocatedBudgetCrINR: 115.0,
    coordinates: { lat: 18.5204, lng: 73.8567 },
    wards: [
      { wardNumber: '18', wardName: 'Kothrud Central', population: 76000, vulnerabilityIndex: 0.48, infraIndex: 0.71, topGrievanceCategory: 'Electricity & Streetlights' }
    ]
  },
  {
    district: 'Johannesburg (Soweto)',
    state: 'Gauteng',
    country: 'South Africa',
    bricsNation: 'South Africa',
    population: 1271000,
    densityPerSqKm: 6400,
    vulnerabilityIndex: 0.84,
    existingInfrastructureIndex: 0.39,
    activeComplaintsCount: 19,
    allocatedBudgetCrINR: 42.0,
    coordinates: { lat: -26.2485, lng: 27.8540 },
    wards: [
      { wardNumber: 'S-14', wardName: 'Orlando East', population: 58000, vulnerabilityIndex: 0.86, infraIndex: 0.34, topGrievanceCategory: 'Water Supply & Drainage' }
    ]
  }
];

const seedGrievances = [
  {
    ticketId: 'JD-2026-MDU-4821',
    source: 'voice_web',
    citizenPhone: '+91 98421 11029',
    citizenName: 'M. Senthilkumar',
    originalLanguage: 'ta',
    rawInputText: 'கீழ வாசல் மெயின் ரோடுல பெரிய பள்ளம் இருக்கு தம்பி, ரெண்டு நாளா பைப் உடைஞ்சு தண்ணி வீணாகுது, ஸ்கூல் பசங்க வண்டி விழுந்துட்டாங்க.',
    translatedText: 'Deep road crater and major broken potable water pipeline near Keela Vaasal main road causing water wastage and school commute accidents.',
    category: 'Water Supply & Drainage',
    urgency: 'Critical',
    sentimentScore: -0.92,
    sentimentLabel: 'Very Frustrated',
    media: {
      imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=600&auto=format&fit=crop',
      damageVerified: true,
      visionAnalysis: 'Severe subterranean pipeline burst with crater depth of ~22cm on asphalt carriage-way.',
      severityLevel: 'Critical'
    },
    location: {
      state: 'Tamil Nadu',
      district: 'Madurai',
      ward: 'Ward 45 - South Gate',
      pincode: '625001',
      landmark: 'Near Municipal Higher Secondary School',
      coordinates: { lat: 9.9189, lng: 78.1215 }
    },
    priorityScore: 92,
    status: 'Fused with Census',
    impactAssessment: {
      estimatedBeneficiaries: 38000,
      estimatedBudgetINR: 420000,
      recommendedDepartment: 'Tamil Nadu Water Supply & Drainage Board'
    },
    createdAt: new Date(Date.now() - 3600000 * 4)
  },
  {
    ticketId: 'JD-2026-MDU-1904',
    source: 'whatsapp',
    citizenPhone: '+91 97901 34912',
    citizenName: 'K. Meenakshi Sundaram',
    originalLanguage: 'tanglish',
    rawInputText: 'Simmakkal signal kitta heavy pothole, night-la street lights illama 3 bike slip aaiduchu please fix pannunga.',
    translatedText: 'Severe cluster of potholes near Simmakkal junction accompanied by dysfunctional streetlights leading to multiple night-time two-wheeler slips.',
    category: 'Roads & Potholes',
    urgency: 'High',
    sentimentScore: -0.84,
    sentimentLabel: 'Very Frustrated',
    media: {
      imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop',
      damageVerified: true,
      visionAnalysis: 'Pothole cluster spanning 3.5 meters across arterial intersection.',
      severityLevel: 'Severe'
    },
    location: {
      state: 'Tamil Nadu',
      district: 'Madurai',
      ward: 'Ward 28 - Simmakkal',
      pincode: '625002',
      landmark: 'Opposite Old Bus Stand',
      coordinates: { lat: 9.9298, lng: 78.1189 }
    },
    priorityScore: 84,
    status: 'Budget Proposed',
    impactAssessment: {
      estimatedBeneficiaries: 52000,
      estimatedBudgetINR: 580000,
      recommendedDepartment: 'Highways & Municipal Works Wing'
    },
    createdAt: new Date(Date.now() - 3600000 * 12)
  },
  {
    ticketId: 'JD-2026-CHN-7731',
    source: 'whatsapp',
    citizenPhone: '+91 94440 28190',
    citizenName: 'R. Balasubramanian',
    originalLanguage: 'en',
    rawInputText: 'Velachery 100 feet road storm water drain blocked with construction debris. Even a 10 min drizzle causes ankle-deep water logging.',
    translatedText: 'Storm water drain blockage from dumped construction debris along 100 Feet Road triggering severe waterlogging on pedestrian corridors.',
    category: 'Water Supply & Drainage',
    urgency: 'High',
    sentimentScore: -0.71,
    sentimentLabel: 'Negative',
    media: {
      imageUrl: '',
      damageVerified: true,
      visionAnalysis: 'Drainage inlet choke confirmed via GIS topographic elevation mapping.',
      severityLevel: 'Moderate'
    },
    location: {
      state: 'Tamil Nadu',
      district: 'Chennai',
      ward: 'Ward 178 - Velachery',
      pincode: '600042',
      landmark: 'Near MRTS Station',
      coordinates: { lat: 12.9815, lng: 80.2180 }
    },
    priorityScore: 79,
    status: 'Validated & Geotagged',
    impactAssessment: {
      estimatedBeneficiaries: 65000,
      estimatedBudgetINR: 350000,
      recommendedDepartment: 'Greater Chennai Corporation (GCC) Storm Water Wing'
    },
    createdAt: new Date(Date.now() - 3600000 * 20)
  },
  {
    ticketId: 'JD-2026-VNS-3209',
    source: 'voice_web',
    citizenPhone: '+91 98390 44102',
    citizenName: 'Ramprasad Tiwari',
    originalLanguage: 'hi',
    rawInputText: 'दशाश्वमेध घाट जाने वाले मुख्य रास्ते पर कचरे का ढेर लगा है और ट्रांसफार्मर की खुली तारें लटक रही हैं, तुरंत मरम्मत कराएं।',
    translatedText: 'Massive solid waste accumulation and exposed electrical transformer wires along main Dashashwamedh access lane endangering pilgrims.',
    category: 'Sanitation & Waste',
    urgency: 'Critical',
    sentimentScore: -0.94,
    sentimentLabel: 'Very Frustrated',
    media: {
      imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=600&auto=format&fit=crop',
      damageVerified: true,
      visionAnalysis: 'High-voltage cable sag over municipal waste container in high pedestrian density zone.',
      severityLevel: 'Critical'
    },
    location: {
      state: 'Uttar Pradesh',
      district: 'Varanasi',
      ward: 'Ward 12 - Dashashwamedh',
      pincode: '221001',
      landmark: 'Near Vishwanath Corridor Entrance 4',
      coordinates: { lat: 25.3080, lng: 83.0090 }
    },
    priorityScore: 94,
    status: 'Work Sanctioned',
    impactAssessment: {
      estimatedBeneficiaries: 85000,
      estimatedBudgetINR: 620000,
      recommendedDepartment: 'Varanasi Nagar Nigam & Purvanchal Vidyut Vitaran'
    },
    createdAt: new Date(Date.now() - 3600000 * 28)
  },
  {
    ticketId: 'JD-2026-BLR-8812',
    source: 'portal',
    citizenPhone: '+91 99800 67123',
    citizenName: 'Ananya Hegde',
    originalLanguage: 'en',
    rawInputText: 'Varthur Kodi road pedestrian footpath broken down, open manholes without lids. Extremely dangerous for elderly and children.',
    translatedText: 'Missing manhole covers and broken pedestrian pavement slabs along Varthur road causing acute fall hazards.',
    category: 'Roads & Potholes',
    urgency: 'High',
    sentimentScore: -0.78,
    sentimentLabel: 'Negative',
    media: {
      imageUrl: '',
      damageVerified: true,
      visionAnalysis: 'Open utility chamber without cautionary signage on busy school transport route.',
      severityLevel: 'Severe'
    },
    location: {
      state: 'Karnataka',
      district: 'Bengaluru Urban',
      ward: 'Ward 85 - Whitefield',
      pincode: '560066',
      landmark: 'Near Varthur Kodi Circle',
      coordinates: { lat: 12.9698, lng: 77.7499 }
    },
    priorityScore: 82,
    status: 'Budget Proposed',
    impactAssessment: {
      estimatedBeneficiaries: 41000,
      estimatedBudgetINR: 290000,
      recommendedDepartment: 'BBMP Engineering Wing'
    },
    createdAt: new Date(Date.now() - 3600000 * 36)
  }
];

async function runSeed() {
  console.log('🌱 Starting JanDrishti AI Database Seeding...');
  await connectDB();

  await DemographicStore.seedBatch(seedDemographics);
  console.log(`✅ Seeded ${seedDemographics.length} National & BRICS Demographic Districts`);

  await GrievanceStore.seedBatch(seedGrievances);
  console.log(`✅ Seeded ${seedGrievances.length} Realistic Multi-Lingual Citizen Grievances`);

  console.log('🚀 Database seeding complete.');
}

if (require.main === module) {
  runSeed().then(() => process.exit(0)).catch(err => {
    console.error('Seed error:', err);
    process.exit(1);
  });
}

module.exports = runSeed;
