// Bihar Cities - District-wise organization
const biharCities = [
  // Patna District
  { state: "Bihar", district: "Patna", city: "Patna" },
  { state: "Bihar", district: "Patna", city: "Danapur" },
  { state: "Bihar", district: "Patna", city: "Phulwari Sharif" },
  { state: "Bihar", district: "Patna", city: "Fatuha" },
  { state: "Bihar", district: "Patna", city: "Khusrupur" },
  { state: "Bihar", district: "Patna", city: "Maner" },
  { state: "Bihar", district: "Patna", city: "Barh" },
  { state: "Bihar", district: "Patna", city: "Bakhtiyarpur" },
  { state: "Bihar", district: "Patna", city: "Mokama" },
  { state: "Bihar", district: "Patna", city: "Masaurhi" },

  // Gaya District
  { state: "Bihar", district: "Gaya", city: "Gaya" },
  { state: "Bihar", district: "Gaya", city: "Bodh Gaya" },
  { state: "Bihar", district: "Gaya", city: "Sherghati" },
  { state: "Bihar", district: "Gaya", city: "Manpur" },
  { state: "Bihar", district: "Gaya", city: "Tekari" },
  { state: "Bihar", district: "Gaya", city: "Wazirganj" },

  // Nalanda District
  { state: "Bihar", district: "Nalanda", city: "Bihar Sharif" },
  { state: "Bihar", district: "Nalanda", city: "Rajgir" },
  { state: "Bihar", district: "Nalanda", city: "Hilsa" },
  { state: "Bihar", district: "Nalanda", city: "Islampur" },
  { state: "Bihar", district: "Nalanda", city: "Asthawan" },

  // Bhagalpur District
  { state: "Bihar", district: "Bhagalpur", city: "Bhagalpur" },
  { state: "Bihar", district: "Bhagalpur", city: "Naugachhia" },
  { state: "Bihar", district: "Bhagalpur", city: "Sultanganj" },
  { state: "Bihar", district: "Bhagalpur", city: "Kahalgaon" },

  // Muzaffarpur District
  { state: "Bihar", district: "Muzaffarpur", city: "Muzaffarpur" },
  { state: "Bihar", district: "Muzaffarpur", city: "Kanti" },
  { state: "Bihar", district: "Muzaffarpur", city: "Minapur" },
  { state: "Bihar", district: "Muzaffarpur", city: "Sahebganj" },

  // Darbhanga District
  { state: "Bihar", district: "Darbhanga", city: "Darbhanga" },
  { state: "Bihar", district: "Darbhanga", city: "Benipur" },
  { state: "Bihar", district: "Darbhanga", city: "Jale" },
  { state: "Bihar", district: "Darbhanga", city: "Kiratpur" },

  // Purnia District
  { state: "Bihar", district: "Purnia", city: "Purnia" },
  { state: "Bihar", district: "Purnia", city: "Kasba" },
  { state: "Bihar", district: "Purnia", city: "Baisa" },
  { state: "Bihar", district: "Purnia", city: "Dhamdaha" },

  // Saharsa District
  { state: "Bihar", district: "Saharsa", city: "Saharsa" },
  { state: "Bihar", district: "Saharsa", city: "Simri Bakhtiarpur" },
  { state: "Bihar", district: "Saharsa", city: "Mahishi" },

  // Araria District
  { state: "Bihar", district: "Araria", city: "Araria" },
  { state: "Bihar", district: "Araria", city: "Forbesganj" },
  { state: "Bihar", district: "Araria", city: "Raniganj" },

  // Katihar District
  { state: "Bihar", district: "Katihar", city: "Katihar" },
  { state: "Bihar", district: "Katihar", city: "Manihari" },
  { state: "Bihar", district: "Katihar", city: "Barari" },

  // Begusarai District
  { state: "Bihar", district: "Begusarai", city: "Begusarai" },
  { state: "Bihar", district: "Begusarai", city: "Khudabandpur" },
  { state: "Bihar", district: "Begusarai", city: "Barauni" },
  { state: "Bihar", district: "Begusarai", city: "Teghra" },

  // Munger District
  { state: "Bihar", district: "Munger", city: "Munger" },
  { state: "Bihar", district: "Munger", city: "Jamalpur" },
  { state: "Bihar", district: "Munger", city: "Kharagpur" },

  // Lakhisarai District
  { state: "Bihar", district: "Lakhisarai", city: "Lakhisarai" },
  { state: "Bihar", district: "Lakhisarai", city: "Halsi" },

  // Sheikhpura District
  { state: "Bihar", district: "Sheikhpura", city: "Sheikhpura" },
  { state: "Bihar", district: "Sheikhpura", city: "Barbigha" },

  // Nawada District
  { state: "Bihar", district: "Nawada", city: "Nawada" },
  { state: "Bihar", district: "Nawada", city: "Hisua" },
  { state: "Bihar", district: "Nawada", city: "Rajauli" },

  // Jamui District
  { state: "Bihar", district: "Jamui", city: "Jamui" },
  { state: "Bihar", district: "Jamui", city: "Jhajha" },
  { state: "Bihar", district: "Jamui", city: "Sikandra" },

  // Aurangabad District
  { state: "Bihar", district: "Aurangabad", city: "Aurangabad" },
  { state: "Bihar", district: "Aurangabad", city: "Daudnagar" },
  { state: "Bihar", district: "Aurangabad", city: "Rafiganj" },

  // Jehanabad District
  { state: "Bihar", district: "Jehanabad", city: "Jehanabad" },
  { state: "Bihar", district: "Jehanabad", city: "Makhdumpur" },

  // Arwal District
  { state: "Bihar", district: "Arwal", city: "Arwal" },
  { state: "Bihar", district: "Arwal", city: "Kurtha" },

  // Rohtas District
  { state: "Bihar", district: "Rohtas", city: "Sasaram" },
  { state: "Bihar", district: "Rohtas", city: "Dehri" },
  { state: "Bihar", district: "Rohtas", city: "Nokha" },
  { state: "Bihar", district: "Rohtas", city: "Bikramganj" },

  // Kaimur District
  { state: "Bihar", district: "Kaimur", city: "Bhabua" },
  { state: "Bihar", district: "Kaimur", city: "Ramgarh" },
  { state: "Bihar", district: "Kaimur", city: "Mohania" },

  // Buxar District
  { state: "Bihar", district: "Buxar", city: "Buxar" },
  { state: "Bihar", district: "Buxar", city: "Dumraon" },

  // Bhojpur District
  { state: "Bihar", district: "Bhojpur", city: "Ara" },
  { state: "Bihar", district: "Bhojpur", city: "Jagdispur" },
  { state: "Bihar", district: "Bhojpur", city: "Piro" },

  // Saran District
  { state: "Bihar", district: "Saran", city: "Chapra" },
  { state: "Bihar", district: "Saran", city: "Marhaura" },
  { state: "Bihar", district: "Saran", city: "Amnour" },

  // Siwan District
  { state: "Bihar", district: "Siwan", city: "Siwan" },
  { state: "Bihar", district: "Siwan", city: "Raghunathpur" },
  { state: "Bihar", district: "Siwan", city: "Maharajganj" },

  // Gopalganj District
  { state: "Bihar", district: "Gopalganj", city: "Gopalganj" },
  { state: "Bihar", district: "Gopalganj", city: "Barauli" },

  // East Champaran District
  { state: "Bihar", district: "East Champaran", city: "Motihari" },
  { state: "Bihar", district: "East Champaran", city: "Areraj" },
  { state: "Bihar", district: "East Champaran", city: "Dhaka" },
  { state: "Bihar", district: "East Champaran", city: "Raxaul" },

  // West Champaran District
  { state: "Bihar", district: "West Champaran", city: "Bettiah" },
  { state: "Bihar", district: "West Champaran", city: "Bagaha" },
  { state: "Bihar", district: "West Champaran", city: "Narkatiaganj" },
  { state: "Bihar", district: "West Champaran", city: "Lauriya" },

  // Sheohar District
  { state: "Bihar", district: "Sheohar", city: "Sheohar" },

  // Sitamarhi District
  { state: "Bihar", district: "Sitamarhi", city: "Sitamarhi" },
  { state: "Bihar", district: "Sitamarhi", city: "Dumra" },
  { state: "Bihar", district: "Sitamarhi", city: "Pupri" },

  // Madhubani District
  { state: "Bihar", district: "Madhubani", city: "Madhubani" },
  { state: "Bihar", district: "Madhubani", city: "Benipatti" },
  { state: "Bihar", district: "Madhubani", city: "Jhanjharpur" },

  // Supaul District
  { state: "Bihar", district: "Supaul", city: "Supaul" },
  { state: "Bihar", district: "Supaul", city: "Nirmali" },
  { state: "Bihar", district: "Supaul", city: "Birpur" },

  // Madhepura District
  { state: "Bihar", district: "Madhepura", city: "Madhepura" },
  { state: "Bihar", district: "Madhepura", city: "Murliganj" },
  { state: "Bihar", district: "Madhepura", city: "Singheshwar" },

  // Khagaria District
  { state: "Bihar", district: "Khagaria", city: "Khagaria" },
  { state: "Bihar", district: "Khagaria", city: "Parbatta" },
  { state: "Bihar", district: "Khagaria", city: "Mansi" },

  // Vaishali District
  { state: "Bihar", district: "Vaishali", city: "Hajipur" },
  { state: "Bihar", district: "Vaishali", city: "Mahua" },
  { state: "Bihar", district: "Vaishali", city: "Desri" },
  { state: "Bihar", district: "Vaishali", city: "Lalganj" },

  // Samastipur District
  { state: "Bihar", district: "Samastipur", city: "Samastipur" },
  { state: "Bihar", district: "Samastipur", city: "Dalsinghsarai" },
  { state: "Bihar", district: "Samastipur", city: "Rosera" },
  { state: "Bihar", district: "Samastipur", city: "Hasanpur" },
];

module.exports = biharCities;
