require('dotenv').config();
const mongoose = require('mongoose');
const City = require('../models/City');

const MONGODB_URI = process.env.MONGO_URL;

// Import citylist data from frontend
const cityListByDistrict = {
  "Balod": [
    "Arjunda - Balod",
    "Balod - Balod",
    "Chikhalakasa - Balod",
    "Dalli-Rajhara - Balod",
    "Daundi Lohara - Balod",
    "Daundi - Balod",
    "Gunderdehi - Balod",
    "Gurur - Balod",
    "Jhalamala - Balod"
  ],
  "Baloda Bazar": [
    "Baloda Bazar - Baloda Bazar",
    "Balodabazar - Baloda Bazar",
    "Bhatapara - Baloda Bazar",
    "Simga - Baloda Bazar",
    "Tundra - Baloda Bazar"
  ],
  "Balrampur": [
    "Rajgarh - Balrampur",
    "Rajpur - Balrampur",
    "Ramanujganj - Balrampur",
    "Wadrafnagar - Balrampur"
  ],
  "Bastar": [
    "Adawal - Bastar",
    "Bastar - Bastar",
    "Jagdalpur - Bastar",
    "Visrampuree - Bastar"
  ],
  "Bemetara": [
    "Bemetara - Bemetara",
    "Berla - Bemetara",
    "Devkar - Bemetara",
    "Khamhria - Bemetara",
    "Maro - Bemetara",
    "Nawagarh - Bemetara",
    "Parpondi - Bemetara",
    "Saja - Bemetara",
    "Thana-Khamharia - Bemetara"
  ],
  "Bijapur": [
    "Bhairamgarh - Bijapur",
    "Bhopalpattanam - Bijapur",
    "Bijapur - Bijapur"
  ],
  "Bilaspur": [
    "Bhilaipahari - Bilaspur",
    "Bilaspur - Bilaspur",
    "Bilha - Bilaspur",
    "Bodri - Bilaspur",
    "Darpan - Bilaspur",
    "Deori - Bilaspur",
    "Kota - Bilaspur",
    "Lingiyadih - Bilaspur",
    "Malhar - Bilaspur",
    "Mehmand - Bilaspur",
    "Phunderdihari - Bilaspur",
    "Ratanpur - Bilaspur",
    "Sakari - Bilaspur",
    "Sargaon - Bilaspur",
    "Sirgitti - Bilaspur",
    "Takhatpur - Bilaspur",
    "Tifra - Bilaspur"
  ],
  "Dantewada": [
    "Bade Bacheli - Dantewada",
    "Barsur - Dantewada",
    "Dantewada - Dantewada",
    "Geedam - Dantewada",
    "Kirandul - Dantewada"
  ],
  "Dhamtari": [
    "Aamadi - Dhamtari",
    "Bhakhara - Dhamtari",
    "Dhamtari - Dhamtari",
    "Kurud - Dhamtari",
    "Magarlod - Dhamtari",
    "Nagari - Dhamtari",
    "Sankra - Dhamtari"
  ],
  "Durg": [
    "Ahiwara - Durg",
    "Amleshwar - Durg",
    "Anjora (Dha) - Durg",
    "Bhilai Charoda - Durg",
    "Bhilai - Durg",
    "Borai - Durg",
    "Dhaba - Durg",
    "Dhamdha - Durg",
    "Dhawari - Durg",
    "Domar - Durg",
    "Durg - Durg",
    "Ganiyari - Durg",
    "Jamul - Durg",
    "Khursul - Durg",
    "Kumhari - Durg",
    "Mohra - Durg",
    "Nagpura - Durg",
    "Patan - Durg",
    "Risali - Durg",
    "Shivpur-Char - Durg",
    "Utai - Durg"
  ],
  "Gariyaband": [
    "Gariyaband - Gariyaband",
    "Rajim - Gariyaband"
  ],
  "GPM": [
    "Gaurella - GPM",
    "Pendra - GPM"
  ],
  "Janjgir-Champa": [
    "Akaltara - Janjgir–Champa",
    "Balod - Janjgir-Champa",
    "Baloda - Janjgir–Champa",
    "Baradwar - Janjgir–Champa",
    "Champa - Janjgir–Champa",
    "Chandrapur - Janjgir–Champa",
    "Dabhra - Janjgir–Champa",
    "Jaijepur - Janjgir-Champa",
    "Janjgir - Janjgir–Champa",
    "Kharod - Janjgir–Champa",
    "Naila-Janjgir - Janjgir–Champa",
    "Naya Baradwar - Janjgir–Champa",
    "Rahaud - Janjgir–Champa",
    "Saragaon - Janjgir–Champa",
    "Shivrinarayan - Janjgir–Champa"
  ],
  "Jashpur": [
    "Bagicha - Jashpur",
    "Jashpur Nagar - Jashpur",
    "Kotba - Jashpur",
    "Kunkuri - Jashpur",
    "Pathalgaon - Jashpur",
    "Patthalgaon - Jashpur",
    "Tapkara - Jashpur"
  ],
  "Kabirdham": [
    "Kawardha - Kabirdham",
    "Pandariya - Kabirdham"
  ],
  "Kanker": [
    "Kanker - Kanker"
  ],
  "KCG": [
    "Chhuikhadan - KCG",
    "Gandai - KCG",
    "Khairagarh - KCG"
  ],
  "Kondagaon": [
    "Farasgaon - Kondagaon",
    "Keskal - Kondagaon",
    "Kondagaon - Kondagaon"
  ],
  "Korba": [
    "Darri - Korba",
    "Dipka - Korba",
    "Gevra - Korba",
    "Katghora - Korba",
    "Korba - Korba",
    "Pali - Korba",
    "Sikher - Korba"
  ],
  "Koriya": [
    "Baikunthpur - Koriya",
    "Chharchha - Koriya",
    "Koriya - Koriya"
  ],
  "Mahasamund": [
    "Bagbahara - Mahasamund",
    "Basna - Mahasamund",
    "Frezarpur - Mahasamund",
    "Mahasamund - Mahasamund",
    "Pithora - Mahasamund",
    "Saraipali - Mahasamund"
  ],
  "MCB": [
    "Chirmiri - MCB",
    "Manendragarh - MCB"
  ],
  "MMA": [
    "Ambagarh Chowki - MMA",
    "Manpur - MMA",
    "Mohla - MMA"
  ],
  "Mungeli": [
    "Lormi - Mungeli",
    "Mungeli - Mungeli",
    "Pathariya - Mungeli"
  ],
  "Raigarh": [
    "Dharamjaigarh - Raigarh",
    "Gharghoda - Raigarh",
    "Kapu - Raigarh",
    "Kharsia - Raigarh",
    "Kheragarh - Raigarh",
    "Lailanga - Raigarh",
    "Lailunga - Raigarh",
    "Pusaur - Raigarh",
    "Raigarh - Raigarh",
    "Tamanar - Raigarh"
  ],
  "Raipur": [
    "Abhanpur - Raipur",
    "Arang - Raipur",
    "Birgaon - Raipur",
    "Gobranawapara - Raipur",
    "Gogaon - Raipur",
    "Kharora - Raipur",
    "Koora - Raipur",
    "Kurra - Raipur",
    "Mana-Camp - Raipur",
    "Nardaha - Raipur",
    "Naya Raipur - Raipur",
    "Raipur - Raipur",
    "Rawabhata - Raipur",
    "Sejbahar - Raipur",
    "Siltara - Raipur",
    "Sondra - Raipur",
    "Tatibandh - Raipur",
    "Telibandha - Raipur",
    "Tilda-Newra - Raipur",
    "Urla - Raipur"
  ],
  "Rajnandgaon": [
    "Dongargaon - Rajnandgaon",
    "Dongargarh - Rajnandgaon",
    "Rajnandgaon - Rajnandgaon"
  ],
  "Sakti": [
    "Adbhar - Sakti",
    "Sakti - Sakti"
  ],
  "Sarangarh-Bilaigarh": [
    "Baramkela - Sarangarh-Bilaigarh",
    "Bilaigarh - Sarangarh-Bilaigarh",
    "Sarangarh - Sarangarh-Bilaigarh"
  ],
  "Sukma": [
    "Dornapal - Sukma",
    "Konta - Sukma",
    "Sukma - Sukma"
  ],
  "Surajpur": [
    "Bhatagaon - Surajpur",
    "Bishrampur - Surajpur",
    "Pratappur - Surajpur",
    "Surajpur - Surajpur",
    "Telgaon - Surajpur"
  ],
  "Surguja": [
    "Ambikapur - Surguja",
    "Dharamsayagarh - Surguja",
    "Lakhanpur - Surguja",
    "Lundra - Surguja",
    "Mainpat - Surguja",
    "Sitapur - Surguja"
  ]
};

// Convert to array of objects
const prepareCityData = () => {
  const cities = [];

  for (const [district, cityList] of Object.entries(cityListByDistrict)) {
    for (const city of cityList) {
      cities.push({
        district,
        city,
        isActive: true
      });
    }
  }

  return cities;
};

// Main function to seed cities
const seedCities = async () => {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB successfully!\n');

    // Prepare city data
    const cityData = prepareCityData();
    console.log(`📊 Total cities to insert: ${cityData.length}`);
    console.log(`📊 Total districts: ${Object.keys(cityListByDistrict).length}\n`);

    // Clear existing cities (optional - uncomment if you want to clear)
    console.log('🗑️  Clearing existing cities...');
    await City.deleteMany({});
    console.log('✅ Existing cities cleared\n');

    // Insert cities
    console.log('📥 Inserting cities...');
    const insertedCities = await City.insertMany(cityData);
    console.log(`✅ Successfully inserted ${insertedCities.length} cities\n`);

    // Display summary by district
    console.log('📋 Summary by District:');
    for (const [district, cityList] of Object.entries(cityListByDistrict)) {
      console.log(`   ${district}: ${cityList.length} cities`);
    }

    console.log('\n🎉 City seeding completed successfully!');

    // Close connection
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
    process.exit(0);

  } catch (error) {
    console.error('❌ Error seeding cities:', error);
    if (mongoose.connection.readyState === 1) {
      await mongoose.connection.close();
    }
    process.exit(1);
  }
};

// Run the seed function
seedCities();
