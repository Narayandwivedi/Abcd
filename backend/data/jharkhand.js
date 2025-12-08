// Jharkhand Cities - District-wise organization
const jharkhandCities = [
  // Ranchi District
  { state: "Jharkhand", district: "Ranchi", city: "Ranchi" },
  { state: "Jharkhand", district: "Ranchi", city: "Bundu" },
  { state: "Jharkhand", district: "Ranchi", city: "Kanke" },
  { state: "Jharkhand", district: "Ranchi", city: "Namkum" },
  { state: "Jharkhand", district: "Ranchi", city: "Ormanjhi" },

  // Jamshedpur (East Singhbhum) District
  { state: "Jharkhand", district: "East Singhbhum", city: "Jamshedpur" },
  { state: "Jharkhand", district: "East Singhbhum", city: "Ghatshila" },
  { state: "Jharkhand", district: "East Singhbhum", city: "Chaibasa" },
  { state: "Jharkhand", district: "East Singhbhum", city: "Potka" },
  { state: "Jharkhand", district: "East Singhbhum", city: "Baharagora" },

  // West Singhbhum District
  { state: "Jharkhand", district: "West Singhbhum", city: "Chaibasa" },
  { state: "Jharkhand", district: "West Singhbhum", city: "Chakradharpur" },
  { state: "Jharkhand", district: "West Singhbhum", city: "Noamundi" },
  { state: "Jharkhand", district: "West Singhbhum", city: "Manoharpur" },

  // Dhanbad District
  { state: "Jharkhand", district: "Dhanbad", city: "Dhanbad" },
  { state: "Jharkhand", district: "Dhanbad", city: "Jharia" },
  { state: "Jharkhand", district: "Dhanbad", city: "Sindri" },
  { state: "Jharkhand", district: "Dhanbad", city: "Katras" },
  { state: "Jharkhand", district: "Dhanbad", city: "Baliapur" },

  // Bokaro District
  { state: "Jharkhand", district: "Bokaro", city: "Bokaro Steel City" },
  { state: "Jharkhand", district: "Bokaro", city: "Chas" },
  { state: "Jharkhand", district: "Bokaro", city: "Chandankiyari" },
  { state: "Jharkhand", district: "Bokaro", city: "Phusro" },
  { state: "Jharkhand", district: "Bokaro", city: "Bermo" },

  // Deoghar District
  { state: "Jharkhand", district: "Deoghar", city: "Deoghar" },
  { state: "Jharkhand", district: "Deoghar", city: "Jasidih" },
  { state: "Jharkhand", district: "Deoghar", city: "Madhupur" },
  { state: "Jharkhand", district: "Deoghar", city: "Sarwan" },

  // Giridih District
  { state: "Jharkhand", district: "Giridih", city: "Giridih" },
  { state: "Jharkhand", district: "Giridih", city: "Dumri" },
  { state: "Jharkhand", district: "Giridih", city: "Bengabad" },
  { state: "Jharkhand", district: "Giridih", city: "Tisri" },

  // Hazaribagh District
  { state: "Jharkhand", district: "Hazaribagh", city: "Hazaribagh" },
  { state: "Jharkhand", district: "Hazaribagh", city: "Barhi" },
  { state: "Jharkhand", district: "Hazaribagh", city: "Chatra" },
  { state: "Jharkhand", district: "Hazaribagh", city: "Ichak" },

  // Ramgarh District
  { state: "Jharkhand", district: "Ramgarh", city: "Ramgarh" },
  { state: "Jharkhand", district: "Ramgarh", city: "Mandu" },
  { state: "Jharkhand", district: "Ramgarh", city: "Patratu" },

  // Koderma District
  { state: "Jharkhand", district: "Koderma", city: "Koderma" },
  { state: "Jharkhand", district: "Koderma", city: "Jainagar" },
  { state: "Jharkhand", district: "Koderma", city: "Markacho" },

  // Chatra District
  { state: "Jharkhand", district: "Chatra", city: "Chatra" },
  { state: "Jharkhand", district: "Chatra", city: "Simaria" },
  { state: "Jharkhand", district: "Chatra", city: "Hunterganj" },

  // Latehar District
  { state: "Jharkhand", district: "Latehar", city: "Latehar" },
  { state: "Jharkhand", district: "Latehar", city: "Manika" },
  { state: "Jharkhand", district: "Latehar", city: "Barwadih" },

  // Palamu District
  { state: "Jharkhand", district: "Palamu", city: "Daltonganj" },
  { state: "Jharkhand", district: "Palamu", city: "Medininagar" },
  { state: "Jharkhand", district: "Palamu", city: "Garhwa" },
  { state: "Jharkhand", district: "Palamu", city: "Chainpur" },

  // Garhwa District
  { state: "Jharkhand", district: "Garhwa", city: "Garhwa" },
  { state: "Jharkhand", district: "Garhwa", city: "Ranka" },
  { state: "Jharkhand", district: "Garhwa", city: "Bhawnathpur" },

  // Dumka District
  { state: "Jharkhand", district: "Dumka", city: "Dumka" },
  { state: "Jharkhand", district: "Dumka", city: "Jarmundi" },
  { state: "Jharkhand", district: "Dumka", city: "Shikaripara" },

  // Jamtara District
  { state: "Jharkhand", district: "Jamtara", city: "Jamtara" },
  { state: "Jharkhand", district: "Jamtara", city: "Narayanpur" },
  { state: "Jharkhand", district: "Jamtara", city: "Kundhit" },

  // Pakur District
  { state: "Jharkhand", district: "Pakur", city: "Pakur" },
  { state: "Jharkhand", district: "Pakur", city: "Littipara" },
  { state: "Jharkhand", district: "Pakur", city: "Maheshpur" },

  // Godda District
  { state: "Jharkhand", district: "Godda", city: "Godda" },
  { state: "Jharkhand", district: "Godda", city: "Mahagama" },
  { state: "Jharkhand", district: "Godda", city: "Sundarpahari" },

  // Sahibganj District
  { state: "Jharkhand", district: "Sahibganj", city: "Sahibganj" },
  { state: "Jharkhand", district: "Sahibganj", city: "Rajmahal" },
  { state: "Jharkhand", district: "Sahibganj", city: "Barharwa" },

  // Seraikela-Kharsawan District
  { state: "Jharkhand", district: "Seraikela-Kharsawan", city: "Seraikela" },
  { state: "Jharkhand", district: "Seraikela-Kharsawan", city: "Kharsawan" },
  { state: "Jharkhand", district: "Seraikela-Kharsawan", city: "Adityapur" },
  { state: "Jharkhand", district: "Seraikela-Kharsawan", city: "Gamharia" },

  // Lohardaga District
  { state: "Jharkhand", district: "Lohardaga", city: "Lohardaga" },
  { state: "Jharkhand", district: "Lohardaga", city: "Kuru" },
  { state: "Jharkhand", district: "Lohardaga", city: "Senha" },

  // Gumla District
  { state: "Jharkhand", district: "Gumla", city: "Gumla" },
  { state: "Jharkhand", district: "Gumla", city: "Sisai" },
  { state: "Jharkhand", district: "Gumla", city: "Basia" },

  // Simdega District
  { state: "Jharkhand", district: "Simdega", city: "Simdega" },
  { state: "Jharkhand", district: "Simdega", city: "Kolebira" },
  { state: "Jharkhand", district: "Simdega", city: "Jaldega" },

  // Khunti District
  { state: "Jharkhand", district: "Khunti", city: "Khunti" },
  { state: "Jharkhand", district: "Khunti", city: "Murhu" },
  { state: "Jharkhand", district: "Khunti", city: "Torpa" },
];

module.exports = jharkhandCities;
