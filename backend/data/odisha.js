// Odisha Cities - District-wise organization
const odishaCities = [
  // Khordha District
  { state: "Odisha", district: "Khordha", city: "Bhubaneswar" },
  { state: "Odisha", district: "Khordha", city: "Khordha" },
  { state: "Odisha", district: "Khordha", city: "Balipatna" },
  { state: "Odisha", district: "Khordha", city: "Jatani" },
  { state: "Odisha", district: "Khordha", city: "Balianta" },

  // Cuttack District
  { state: "Odisha", district: "Cuttack", city: "Cuttack" },
  { state: "Odisha", district: "Cuttack", city: "Choudwar" },
  { state: "Odisha", district: "Cuttack", city: "Banki" },
  { state: "Odisha", district: "Cuttack", city: "Athagarh" },
  { state: "Odisha", district: "Cuttack", city: "Salipur" },

  // Puri District
  { state: "Odisha", district: "Puri", city: "Puri" },
  { state: "Odisha", district: "Puri", city: "Konark" },
  { state: "Odisha", district: "Puri", city: "Pipili" },
  { state: "Odisha", district: "Puri", city: "Nimapara" },
  { state: "Odisha", district: "Puri", city: "Satyabadi" },

  // Ganjam District
  { state: "Odisha", district: "Ganjam", city: "Berhampur" },
  { state: "Odisha", district: "Ganjam", city: "Chhatrapur" },
  { state: "Odisha", district: "Ganjam", city: "Gopalpur" },
  { state: "Odisha", district: "Ganjam", city: "Bhanjanagar" },
  { state: "Odisha", district: "Ganjam", city: "Aska" },

  // Balasore District
  { state: "Odisha", district: "Balasore", city: "Balasore" },
  { state: "Odisha", district: "Balasore", city: "Jaleswar" },
  { state: "Odisha", district: "Balasore", city: "Soro" },
  { state: "Odisha", district: "Balasore", city: "Nilagiri" },
  { state: "Odisha", district: "Balasore", city: "Remuna" },

  // Bhadrak District
  { state: "Odisha", district: "Bhadrak", city: "Bhadrak" },
  { state: "Odisha", district: "Bhadrak", city: "Chandbali" },
  { state: "Odisha", district: "Bhadrak", city: "Dhamnagar" },
  { state: "Odisha", district: "Bhadrak", city: "Basudevpur" },

  // Jajpur District
  { state: "Odisha", district: "Jajpur", city: "Jajpur" },
  { state: "Odisha", district: "Jajpur", city: "Jajpur Road" },
  { state: "Odisha", district: "Jajpur", city: "Vyasanagar" },
  { state: "Odisha", district: "Jajpur", city: "Dharmasala" },

  // Kendrapara District
  { state: "Odisha", district: "Kendrapara", city: "Kendrapara" },
  { state: "Odisha", district: "Kendrapara", city: "Pattamundai" },
  { state: "Odisha", district: "Kendrapara", city: "Aul" },
  { state: "Odisha", district: "Kendrapara", city: "Rajkanika" },

  // Jagatsinghpur District
  { state: "Odisha", district: "Jagatsinghpur", city: "Jagatsinghpur" },
  { state: "Odisha", district: "Jagatsinghpur", city: "Paradip" },
  { state: "Odisha", district: "Jagatsinghpur", city: "Tirtol" },
  { state: "Odisha", district: "Jagatsinghpur", city: "Raghunathpur" },

  // Nayagarh District
  { state: "Odisha", district: "Nayagarh", city: "Nayagarh" },
  { state: "Odisha", district: "Nayagarh", city: "Odagaon" },
  { state: "Odisha", district: "Nayagarh", city: "Ranpur" },

  // Mayurbhanj District
  { state: "Odisha", district: "Mayurbhanj", city: "Baripada" },
  { state: "Odisha", district: "Mayurbhanj", city: "Rairangpur" },
  { state: "Odisha", district: "Mayurbhanj", city: "Karanjia" },
  { state: "Odisha", district: "Mayurbhanj", city: "Udala" },

  // Keonjhar District
  { state: "Odisha", district: "Keonjhar", city: "Keonjhar" },
  { state: "Odisha", district: "Keonjhar", city: "Barbil" },
  { state: "Odisha", district: "Keonjhar", city: "Joda" },
  { state: "Odisha", district: "Keonjhar", city: "Anandapur" },

  // Sundargarh District
  { state: "Odisha", district: "Sundargarh", city: "Sundargarh" },
  { state: "Odisha", district: "Sundargarh", city: "Rourkela" },
  { state: "Odisha", district: "Sundargarh", city: "Rajgangpur" },
  { state: "Odisha", district: "Sundargarh", city: "Panposh" },

  // Sambalpur District
  { state: "Odisha", district: "Sambalpur", city: "Sambalpur" },
  { state: "Odisha", district: "Sambalpur", city: "Burla" },
  { state: "Odisha", district: "Sambalpur", city: "Kuchinda" },
  { state: "Odisha", district: "Sambalpur", city: "Rairakhol" },

  // Deogarh District
  { state: "Odisha", district: "Deogarh", city: "Deogarh" },
  { state: "Odisha", district: "Deogarh", city: "Reamal" },

  // Jharsuguda District
  { state: "Odisha", district: "Jharsuguda", city: "Jharsuguda" },
  { state: "Odisha", district: "Jharsuguda", city: "Brajrajnagar" },
  { state: "Odisha", district: "Jharsuguda", city: "Belpahar" },

  // Bargarh District
  { state: "Odisha", district: "Bargarh", city: "Bargarh" },
  { state: "Odisha", district: "Bargarh", city: "Padampur" },
  { state: "Odisha", district: "Bargarh", city: "Bijepur" },

  // Nuapada District
  { state: "Odisha", district: "Nuapada", city: "Nuapada" },
  { state: "Odisha", district: "Nuapada", city: "Khariar" },

  // Balangir District
  { state: "Odisha", district: "Balangir", city: "Balangir" },
  { state: "Odisha", district: "Balangir", city: "Titilagarh" },
  { state: "Odisha", district: "Balangir", city: "Patnagarh" },

  // Sonepur District
  { state: "Odisha", district: "Sonepur", city: "Sonepur" },
  { state: "Odisha", district: "Sonepur", city: "Birmaharajpur" },
  { state: "Odisha", district: "Sonepur", city: "Ulunda" },

  // Boudh District
  { state: "Odisha", district: "Boudh", city: "Boudh" },
  { state: "Odisha", district: "Boudh", city: "Purunakatak" },

  // Angul District
  { state: "Odisha", district: "Angul", city: "Angul" },
  { state: "Odisha", district: "Angul", city: "Talcher" },
  { state: "Odisha", district: "Angul", city: "Athamallik" },

  // Dhenkanal District
  { state: "Odisha", district: "Dhenkanal", city: "Dhenkanal" },
  { state: "Odisha", district: "Dhenkanal", city: "Kamakhyanagar" },
  { state: "Odisha", district: "Dhenkanal", city: "Hindol" },

  // Kandhamal District
  { state: "Odisha", district: "Kandhamal", city: "Phulbani" },
  { state: "Odisha", district: "Kandhamal", city: "G. Udayagiri" },
  { state: "Odisha", district: "Kandhamal", city: "Baliguda" },

  // Kalahandi District
  { state: "Odisha", district: "Kalahandi", city: "Bhawanipatna" },
  { state: "Odisha", district: "Kalahandi", city: "Dharamgarh" },
  { state: "Odisha", district: "Kalahandi", city: "Kesinga" },

  // Rayagada District
  { state: "Odisha", district: "Rayagada", city: "Rayagada" },
  { state: "Odisha", district: "Rayagada", city: "Gunupur" },
  { state: "Odisha", district: "Rayagada", city: "Padmapur" },

  // Nabarangpur District
  { state: "Odisha", district: "Nabarangpur", city: "Nabarangpur" },
  { state: "Odisha", district: "Nabarangpur", city: "Umerkote" },
  { state: "Odisha", district: "Nabarangpur", city: "Papadahandi" },

  // Koraput District
  { state: "Odisha", district: "Koraput", city: "Koraput" },
  { state: "Odisha", district: "Koraput", city: "Jeypore" },
  { state: "Odisha", district: "Koraput", city: "Sunabeda" },

  // Malkangiri District
  { state: "Odisha", district: "Malkangiri", city: "Malkangiri" },
  { state: "Odisha", district: "Malkangiri", city: "Mathili" },
  { state: "Odisha", district: "Malkangiri", city: "Motu" },

  // Gajapati District
  { state: "Odisha", district: "Gajapati", city: "Paralakhemundi" },
  { state: "Odisha", district: "Gajapati", city: "Kashinagar" },
  { state: "Odisha", district: "Gajapati", city: "Mohana" },
];

module.exports = odishaCities;
