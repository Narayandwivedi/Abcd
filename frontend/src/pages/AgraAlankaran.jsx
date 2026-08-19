import React, { useState, useEffect, useContext, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const AgraAlankaran = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Form State
  const [form, setForm] = useState({
    awardCategory: "",
    applicantName: "",
    dob: "",
    age: "",
    fatherHusbandName: "",
    fullAddress: "",
    mobileNo: "",
    email: "",
    achievementDesc: "",
    date: new Date().toISOString().split("T")[0],
    place: "अम्बिकापुर",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [docFile, setDocFile] = useState(null);
  const [docName, setDocName] = useState("");

  const photoInputRef = useRef(null);
  const docInputRef = useRef(null);

  // Calculate age automatically when DOB changes
  useEffect(() => {
    if (form.dob) {
      const birthDate = new Date(form.dob);
      const today = new Date();
      let calculatedAge = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();
      
      if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
        calculatedAge--;
      }

      setForm(prev => ({ ...prev, age: calculatedAge > 0 ? String(calculatedAge) : "0" }));
    }
  }, [form.dob]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobileNo") {
      // Allow only numbers and max 10 digits
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setForm(prev => ({ ...prev, [name]: cleaned }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("फोटो का आकार 5MB से कम होना चाहिए");
        return;
      }
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleDocChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("दस्तावेज़ का आकार 10MB से कम होना चाहिए");
        return;
      }
      setDocFile(file);
      setDocName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Word count validation for Achievement Description
    const words = form.achievementDesc.trim().split(/\s+/).filter(Boolean);
    if (words.length > 150) {
      toast.error("उपलब्धि का विवरण 150 शब्दों से अधिक नहीं होना चाहिए");
      return;
    }

    if (!form.awardCategory || !form.applicantName || !form.dob || !form.fatherHusbandName || !form.fullAddress || !form.mobileNo || !form.email || !form.achievementDesc) {
      toast.error("कृपया सभी आवश्यक फ़ील्ड भरें");
      return;
    }

    if (form.mobileNo.length !== 10) {
      toast.error("कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें");
      return;
    }

    setLoading(true);

    const submitData = new FormData();
    submitData.append("awardCategory", form.awardCategory);
    submitData.append("applicantName", form.applicantName);
    submitData.append("dob", form.dob);
    submitData.append("age", form.age);
    submitData.append("fatherHusbandName", form.fatherHusbandName);
    submitData.append("fullAddress", form.fullAddress);
    submitData.append("mobileNo", form.mobileNo);
    submitData.append("email", form.email);
    submitData.append("achievementDesc", form.achievementDesc);
    submitData.append("date", form.date);
    submitData.append("place", form.place);

    if (photoFile) {
      submitData.append("photo", photoFile);
    }
    if (docFile) {
      submitData.append("document", docFile);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/agra-alankaran/submit`, {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "आपका आवेदन सफलतापूर्वक जमा हो गया है!");
        setSuccessData(data);
        // Reset form
        setForm({
          awardCategory: "",
          applicantName: "",
          dob: "",
          age: "",
          fatherHusbandName: "",
          fullAddress: "",
          mobileNo: "",
          email: "",
          achievementDesc: "",
          date: new Date().toISOString().split("T")[0],
          place: "अम्बिकापुर",
        });
        setPhotoFile(null);
        setPhotoPreview(null);
        setDocFile(null);
        setDocName("");
      } else {
        toast.error(data.message || "आवेदन जमा करने में विफलता");
      }
    } catch (err) {
      console.error(err);
      toast.error("सर्वर से संपर्क करने में विफलता");
    } finally {
      setLoading(false);
    }
  };

  const awardCategories = [
    { name: "अग्र-दीप पुरस्कार", eligibility: "पीएचडी / पीजी (गोल्ड मेडल)" },
    { name: "अग्र-गौरव पुरस्कार", eligibility: "UPSC (IAS/IPS/IFS/IRS) चयन" },
    { name: "अग्र-भूषण पुरस्कार", eligibility: "समाज सेवा में उल्लेखनीय उपलब्धि" },
    { name: "अग्र-दानी पुरस्कार", eligibility: "अस्पताल/धर्मशाला/गौशाला निर्माण दान" },
    { name: "अग्र-शिखर पुरस्कार", eligibility: "राजनीति के क्षेत्र में सर्वश्रेष्ठ प्रदर्शन" },
    { name: "अग्र-शिरोमणी पुरस्कार", eligibility: "समाज सेवा में जीवन पर्यंत योगदान" },
    { name: "अग्र-श्री पुरस्कार", eligibility: "CGPSC में उत्कृष्ट चयन" },
    { name: "अग्र-धनवंतरी पुरस्कार", eligibility: "स्वास्थ्य एवं चिकित्सा सेवा" },
    { name: "अग्र-पुंज पुरस्कार", eligibility: "12वीं बोर्ड प्रावीण्य सूची (Merit)" },
    { name: "अग्र-मित्र पुरस्कार", eligibility: "पर्यावरण एवं स्वच्छता में योगदान" },
    { name: "अग्र-प्रखर पुरस्कार", eligibility: "राष्ट्रीय व्यावसायिक प्रतियोगी परीक्षा" },
    { name: "अग्र-विशारद पुरस्कार", eligibility: "नृत्य एवं संगीत कला में उत्कृष्टता" },
    { name: "अग्र-विभूति पुरस्कार", eligibility: "पत्रकारिता, प्रकाशन व मीडिया सपोर्ट" },
    { name: "अग्र-श्रेष्ठ पुरस्कार", eligibility: "खेलकूद (राज्य/राष्ट्रीय स्तर)" },
    { name: "अग्र-ज्योति पुरस्कार", eligibility: "महिला सशक्तिकरण कार्य" },
    { name: "अग्र-रत्न पुरस्कार", eligibility: "कला, साहित्य एवं संस्कृति" },
    { name: "अग्र-उद्यमी पुरस्कार", eligibility: "उद्योग एवं व्यापार में उत्कृष्ट उपलब्धि" },
    { name: "अग्र-संस्था पुरस्कार", eligibility: "उत्कृष्ट अग्र संस्था / सभा" }
  ];

  const organizers = [
    { name: "डॉ. अशोक अग्रवाल", title: "प्रांतीय अध्यक्ष", address: "रायपुर", mobile: "93010 14000" },
    { name: "संजय अग्रवाल", title: "प्रांतीय महामंत्री", address: "रायपुर", mobile: "94252 08960" },
    { name: "संजय मित्तल", title: "अध्यक्ष (सभा)", address: "अम्बिकापुर", mobile: "94252 71333" },
    { name: "संजय अग्रवाल", title: "महामंत्री (सभा)", address: "अम्बिकापुर", mobile: "96699 35080" },
    { name: "पवन अग्रवाल", title: "संभागीय अध्यक्ष", address: "सरगुजा", mobile: "96175 52233" },
    { name: "सुनील अग्रवाल (बॉबी)", title: "संभागीय महामंत्री", address: "सरगुजा", mobile: "99261 34000" }
  ];

  const subCoordinators = [
    { role: "संयोजक : अग्र महाकुंभ 2026", details: "सुभाष गोयल (98261 90531) | कन्हैयालाल अग्रवाल (94252 56212) - अम्बिकापुर" },
    { role: "संयोजक : अग्र अलंकरण", details: "ललित अग्रवाल (70004 84146) - रायपुर" },
    { role: "सह संयोजक : अग्र अलंकरण", details: "पंकज अग्रवाल (98261 41138) - रायपुर" },
    { role: "सह संयोजक : अग्र अलंकरण", details: "डॉ. विजय गोयल (75663 35151) - रायपुर" },
    { role: "सह संयोजक : अग्र अलंकरण", details: "श्रीमती वर्षा अग्रवाल (75871 55011) - रायपुर" }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF6] py-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Header Container with Traditional Saffron Board */}
        <div className="relative bg-gradient-to-r from-red-700 via-orange-600 to-red-700 text-white rounded-3xl p-2 md:p-6 shadow-2xl mb-5 md:mb-8 overflow-hidden text-center border-4 border-yellow-500">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400/20 via-transparent to-transparent"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-2 md:gap-6 max-w-6xl mx-auto">
            {/* Logo Left */}
            <div className="flex-shrink-0 bg-white/10 p-1 md:p-3 rounded-2xl backdrop-blur-sm border border-white/20">
              <img src="/abcd logo3.png" alt="ABCD Logo" className="w-8 h-8 md:w-20 md:h-20 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]" />
            </div>

            {/* Central Titles */}
            <div className="flex-1">
              <h1 className="text-xs md:text-4xl font-extrabold tracking-wide drop-shadow-md mb-1 md:mb-2">
                छत्तीसगढ़ प्रांतीय अग्रवाल संगठन (सम्मेलन) (रजि.)
              </h1>
              <h2 className="text-[11px] md:text-3xl font-bold text-yellow-300 drop-shadow-sm mb-1 md:mb-2">
                छत्तीसगढ़ स्तरीय दशम् अग्र अलंकरण समारोह 2026
              </h2>
              <div className="text-[10px] md:text-base font-semibold text-orange-100 flex flex-wrap justify-center gap-x-3 md:gap-x-6 gap-y-0.5">
                <span>दिनांक : 19-20 सितम्बर 2026</span>
                <span>|</span>
                <span>स्थान : अम्बिकापुर (छ.ग.)</span>
              </div>
              <p className="text-[10px] md:text-sm text-yellow-100 mt-1 md:mt-2 font-medium">
                आतिथ्य : श्री अग्रवाल सभा अम्बिकापुर एवं सरगुजा संभागीय अग्रवाल सभा
              </p>
            </div>

            {/* Logo Right / Placeholder */}
            <div className="hidden md:block flex-shrink-0 bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
              <div className="text-center text-xs font-bold w-20 h-20 flex items-center justify-center border-2 border-dashed border-yellow-300 rounded-lg">
                अग्र <br/> संगठन
              </div>
            </div>
          </div>
          
          {/* Office details */}
          <div className="mt-1.5 md:mt-4 border-t border-white/20 pt-1.5 md:pt-3 text-[10px] md:text-sm text-orange-200">
            प्रांतीय कार्यालय: श्री हनुमान मार्केट, रामसागर पारा, रायपुर (छत्तीसगढ़) | मोबा. : 99939 61778 , Email : cgpascg@gmail.com
          </div>
        </div>

        {/* Application Form */}
        <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl p-3 md:p-10 shadow-2xl border border-yellow-200">
              
              {/* Form Title */}
              <div className="text-center mb-4 md:mb-8 border-b-2 border-dashed border-red-200 pb-3 md:pb-6">
                <h2 className="text-lg md:text-3xl font-black text-red-800 mb-1 md:mb-2">
                  अग्र अलंकरण 2025-26 हेतु आवेदन-पत्र
                </h2>
                <p className="text-xs md:text-base font-bold text-gray-600">
                  (उपलब्धि अवधि : 1 जुलाई 2025 से 30 जून 2026)
                </p>
              </div>

              {/* Success Info Block */}
              {successData && (
                <div className="bg-green-50 border-2 border-green-300 text-green-800 p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-4 shadow-inner">
                  <div>
                    <h4 className="text-lg font-black mb-1">🎉 आवेदन सफलतापूर्वक जमा हो गया!</h4>
                    <p className="text-sm font-semibold">
                      आपका आवेदन क्रमांक: <span className="bg-green-200 text-green-950 px-3 py-1 rounded-lg font-black border border-green-300">{successData.applicationNo}</span>
                    </p>
                    <p className="text-xs text-green-600 mt-2">
                      इस आवेदन पत्र को सुरक्षित रख लें। चयन समिति जल्द ही आपकी समीक्षा करेगी।
                    </p>
                  </div>
                  <button 
                    onClick={() => setSuccessData(null)}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition"
                  >
                    नया आवेदन करें
                  </button>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-3 md:space-y-6">
                
                {/* Photo and Application Number Row */}
                <div className="flex flex-row items-start justify-between gap-3 md:gap-6 border-b border-orange-50 pb-3 md:pb-6">
                  
                  {/* Application No Box */}
                  <div className="flex-1">
                    <label className="block text-gray-700 font-extrabold text-[11px] md:text-sm mb-1 md:mb-2">
                      आवेदन क्रमांक :
                    </label>
                    <div className="w-full max-w-[180px] md:max-w-[200px] border-2 border-dashed border-gray-300 bg-gray-50 rounded-xl p-2.5 md:p-3 text-center text-xs md:text-sm font-bold text-gray-500">
                      स्वचालित जनरेट होगा
                    </div>
                  </div>

                  {/* Photo Upload Zone (Styled exactly like the paper form box) */}
                  <div className="flex-shrink-0 self-center md:self-start">
                    <div 
                      onClick={() => photoInputRef.current?.click()}
                      className="w-28 h-36 md:w-40 md:h-52 border-2 border-dashed border-gray-400 bg-orange-50/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50/50 hover:border-red-500 transition relative overflow-hidden shadow-inner group"
                    >
                      {photoPreview ? (
                        <>
                          <img src={photoPreview} alt="Passport Preview" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <span className="text-white text-xs font-bold">बदलें</span>
</div>
                        </>
                      ) : (
                        <div className="text-center p-2 md:p-3">
                          <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400 mx-auto mb-2 group-hover:text-red-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                          </svg>
                          <p className="text-[10px] md:text-xs font-black text-gray-600">पासपोर्ट साइज फोटो</p>
                          <p className="text-[9px] text-gray-400 mt-1">संलग्न करें (Max 5MB)</p>
                        </div>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={photoInputRef}
                      onChange={handlePhotoChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                </div>

                {/* Main fields */}
                <div className="grid grid-cols-2 gap-2.5 md:gap-6">
                  
                  {/* Field 1: Award Category */}
                  <div className="col-span-2">
                    <label className="block text-gray-700 font-extrabold text-[11px] md:text-sm mb-1 md:mb-2">
                      १. पुरस्कार के क्षेत्र का नाम <span className="text-red-600">*</span>
                    </label>
                    <select 
                      name="awardCategory"
                      value={form.awardCategory}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-2 md:px-4 md:py-3 border border-orange-200 rounded-xl bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium text-sm"
                      required
                    >
                      <option value="" disabled>— पुरस्कार का चयन करें —</option>
                      {awardCategories.map((award, index) => (
                        <option key={index} value={`${award.name} — ${award.eligibility}`}>{award.name} — {award.eligibility}</option>
                      ))}
                    </select>
                  </div>

                  {/* Field 2: Applicant Name */}
                  <div className="col-span-2">
                    <label className="block text-gray-700 font-extrabold text-[11px] md:text-sm mb-1 md:mb-2">
                      २. आवेदक का नाम <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="text"
                      name="applicantName"
                      value={form.applicantName}
                      onChange={handleInputChange}
                      placeholder="पूरा नाम दर्ज करें (हिंदी या अंग्रेजी में)"
                      className="w-full px-2.5 py-2 md:px-4 md:py-3 border border-orange-200 rounded-xl bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium placeholder:text-[11px] md:placeholder:text-base"
                      required
                    />
                  </div>

                  {/* Field 3: DOB & Age */}
                  <div>
                    <label className="block text-gray-700 font-extrabold text-[11px] md:text-sm mb-1 md:mb-2">
                      ३. जन्मतिथि <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="date"
                      name="dob"
                      value={form.dob}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-2 md:px-4 md:py-3 border border-orange-200 rounded-xl bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium placeholder:text-[11px] md:placeholder:text-base"
                      required
                    />
                  </div>

                  {/* Field 3b: Age */}
                  <div>
                    <label className="block text-gray-700 font-extrabold text-[11px] md:text-sm mb-1 md:mb-2">
                      उम्र (वर्ष) <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="number"
                      name="age"
                      value={form.age}
                      onChange={handleInputChange}
                      placeholder="जन्मतिथि से स्वतः गणना होगी"
                      className="w-full px-2.5 py-2 md:px-4 md:py-3 border border-orange-200 rounded-xl bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium placeholder:text-[11px] md:placeholder:text-base"
                      required
                    />
                  </div>

                  {/* Field 4: Father/Husband Name */}
                  <div className="col-span-2">
                    <label className="block text-gray-700 font-extrabold text-[11px] md:text-sm mb-1 md:mb-2">
                      ४. पिता/पति का नाम <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="text"
                      name="fatherHusbandName"
                      value={form.fatherHusbandName}
                      onChange={handleInputChange}
                      placeholder="पिता या पति का नाम लिखें"
                      className="w-full px-2.5 py-2 md:px-4 md:py-3 border border-orange-200 rounded-xl bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium placeholder:text-[11px] md:placeholder:text-base"
                      required
                    />
                  </div>

                  {/* Field 5: Full Address */}
                  <div className="col-span-2">
                    <label className="block text-gray-700 font-extrabold text-[11px] md:text-sm mb-1 md:mb-2">
                      ५. पूर्ण पता <span className="text-red-600">*</span>
                    </label>
                    <textarea 
                      name="fullAddress"
                      value={form.fullAddress}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="मकान नंबर, वार्ड, मार्ग, शहर/गांव, जिला और पिनकोड..."
                      className="w-full px-2.5 py-2 md:px-4 md:py-3 border border-orange-200 rounded-xl bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium placeholder:text-[11px] md:placeholder:text-base resize-y"
                      required
                    ></textarea>
                  </div>

                  {/* Field 6: Mobile No */}
                  <div>
                    <label className="block text-gray-700 font-extrabold text-[11px] md:text-sm mb-1 md:mb-2">
                      ६. मोबाइल नं. <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="tel"
                      name="mobileNo"
                      value={form.mobileNo}
                      onChange={handleInputChange}
                      placeholder="10 अंकों का मोबाइल नंबर"
                      className="w-full px-2.5 py-2 md:px-4 md:py-3 border border-orange-200 rounded-xl bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium placeholder:text-[11px] md:placeholder:text-base"
                      required
                    />
                  </div>

                  {/* Field 7: Email */}
                  <div>
                    <label className="block text-gray-700 font-extrabold text-[11px] md:text-sm mb-1 md:mb-2">
                      ७. ई-मेल <span className="text-red-600">*</span>
                    </label>
                    <input 
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="example@gmail.com"
                      className="w-full px-2.5 py-2 md:px-4 md:py-3 border border-orange-200 rounded-xl bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium placeholder:text-[11px] md:placeholder:text-base"
                      required
                    />
                  </div>

                  {/* Field 8: Description of achievements */}
                  <div className="col-span-2">
                    <label className="block text-gray-700 font-extrabold text-[11px] md:text-sm mb-1 md:mb-2">
                      ८. आपकी उपलब्धि का संक्षिप्त विवरण <span className="text-red-600">*</span>
                    </label>
                    <textarea 
                      name="achievementDesc"
                      value={form.achievementDesc}
                      onChange={handleInputChange}
                      rows="5"
                      placeholder="अपनी प्रमुख उपलब्धियों का स्पष्ट एवं संक्षिप्त विवरण लिखें (अधिकतम 100 - 150 शब्द)..."
                      className="w-full px-2.5 py-2 md:px-4 md:py-3 border border-orange-200 rounded-xl bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium placeholder:text-[11px] md:placeholder:text-base resize-y"
                      required
                    ></textarea>
                    
                    <div className="flex justify-between items-center text-xs font-bold mt-1">
                      <span className="text-gray-400">केवल हिंदी टाइपिंग में विवरण मान्य होगा।</span>
                      <span className={form.achievementDesc.trim().split(/\s+/).filter(Boolean).length > 150 ? "text-red-600" : "text-gray-500"}>
                        शब्द संख्या: {form.achievementDesc.trim().split(/\s+/).filter(Boolean).length} / 150
                      </span>
                    </div>
                  </div>

                  {/* Field 9: Certificate / Proof Document Upload */}
                  <div className="col-span-2">
                    <label className="block text-gray-700 font-extrabold text-[11px] md:text-sm mb-1 md:mb-2">
                      ९. उपलब्धि प्रमाण पत्र एवं आवश्यक दस्तावेज संलग्न करें
                    </label>
                    <div 
                      onClick={() => docInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-orange-200 bg-orange-50/5 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:bg-orange-50/20 hover:border-red-500 transition"
                    >
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      {docName ? (
                        <p className="text-sm font-black text-green-700">{docName}</p>
                      ) : (
                        <>
                          <p className="text-[11px] md:text-xs font-bold text-gray-600">प्रमाण पत्र, अनुशंसा पत्र या अख़बार की कतरन अपलोड करें</p>
                          <p className="text-[10px] text-gray-400 mt-1">PDF, JPG, PNG प्रारूप स्वीकृत (Max 10MB)</p>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={docInputRef}
                      onChange={handleDocChange}
                      accept=".pdf,image/*"
                      className="hidden"
                    />
                  </div>

                  {/* Place and Date */}
                  <div>
                    <label className="block text-gray-700 font-extrabold text-[11px] md:text-sm mb-1 md:mb-2">
                      दिनांक :
                    </label>
                    <input 
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-2 md:px-4 md:py-3 border border-orange-200 rounded-xl bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium placeholder:text-[11px] md:placeholder:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-extrabold text-[11px] md:text-sm mb-1 md:mb-2">
                      स्थान :
                    </label>
                    <input 
                      type="text"
                      name="place"
                      value={form.place}
                      onChange={handleInputChange}
                      className="w-full px-2.5 py-2 md:px-4 md:py-3 border border-orange-200 rounded-xl bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium placeholder:text-[11px] md:placeholder:text-base"
                    />
                  </div>

                </div>

                {/* Rules & Declarations */}
                <div className="bg-[#FFFDF6] border border-orange-100 rounded-2xl p-4 md:p-6 text-gray-600 text-xs md:text-sm leading-relaxed space-y-3 mt-6 md:mt-8">
                  <h4 className="font-extrabold text-red-800 text-xs md:text-base border-b border-orange-100 pb-1.5 mb-2">
                    महत्वपूर्ण निर्देश एवं टीप:
                  </h4>
                  <ul className="list-decimal pl-4 space-y-2 font-medium">
                    <li>अग्र-अलंकरण योजना के संबंध में चयन समिति द्वारा लिया गया निर्णय अंतिम एवं सर्वमान्य होगा।</li>
                    <li>आपकी उपलब्धि दी गई अवधि (<span className="font-bold text-red-700">1 जुलाई 2025 से 30 जून 2026</span>) के मध्य की ही होनी चाहिए।</li>
                    <li>
                      इस आवेदन के साथ निम्न प्रपत्रों की स्वयं द्वारा प्रमाणित छायाप्रति संलग्न करें:
                      <ul className="list-disc pl-4 mt-1 text-[11px] text-gray-500 space-y-0.5">
                        <li>छत्तीसगढ़ का निवासी होने का प्रमाण पत्र।</li>
                        <li>उपलब्धि जिसके आधार पर पुरस्कार के लिए आवेदन किया गया है, का प्रमाण पत्र।</li>
                        <li>स्थानीय अग्रवाल सभा, मारवाड़ी युवा मंच, अग्रवाल युवा मंच के वर्तमान अध्यक्ष या वर्तमान प्रांतीय पदाधिकारी का अनुशंसा पत्र।</li>
                        <li>समाचार पत्रों की कटिंग जिसमें उपलब्धि के बारे में छपा हो।</li>
                      </ul>
                    </li>
                    <li>
                      इस आवेदन के साथ निम्न बिंदुओं से संबंधित आवश्यक जानकारी भी संलग्न करें:
                      <ul className="list-disc pl-4 mt-1 text-[11px] text-gray-500 space-y-0.5">
                        <li>केवल 100-150 शब्दों में हिन्दी टाइपिंग में अपनी उपलब्धि का विवरण दें।</li>
                        <li>
                          30 सेकण्ड का प्रस्तुतिकरण (Video Presentation) Email - <a href="mailto:agraalankaran@gmail.com" className="text-blue-600 hover:underline">agraalankaran@gmail.com</a> / Pendrive / Whatsapp में एवं आपकी 2 फोटो (वर्तमान की) दें।
                        </li>
                        <li>जिस श्रेणी में आप आवेदन कर रहे हैं उससे संबंधित प्रमाण पत्र संलग्न करें।</li>
                      </ul>
                    </li>
                    <li>आवेदन प्रांतीय कार्यालय के पते पर 31 अगस्त 2026 की संध्या 5 बजे तक हार्ड कॉपी में भी स्वीकार किये जायेंगे।</li>
                  </ul>

                  <div className="pt-4 border-t border-orange-100 mt-4 flex items-center gap-2">
                    <input 
                      type="checkbox" 
                      id="declaration" 
                      required 
                      className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500 cursor-pointer"
                    />
                    <label htmlFor="declaration" className="font-bold text-xs text-gray-700 cursor-pointer selection:bg-transparent">
                      मै घोषणा करता/करती हूँ कि मेरे द्वारा दी गई सभी जानकारी पूर्णतः सत्य है।
                    </label>
                  </div>
                </div>

                {/* Organizers Grid */}
                <div className="bg-[#FFFDF6] rounded-2xl p-5 md:p-6 shadow-lg border border-yellow-200">
                  <h3 className="text-center font-bold text-base md:text-lg text-red-800 mb-4 border-b border-red-100 pb-2">
                    प्रांतीय एवं संभागीय पदाधिकारी संपर्क सूत्र
                  </h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-4 text-center">
                    {organizers.map((org, index) => (
                      <div key={index} className="bg-white p-2 md:p-3 rounded-xl border border-orange-100 hover:shadow-md transition">
                        <p className="font-extrabold text-[10px] md:text-sm text-red-900">{org.name}</p>
                        <p className="text-[9px] md:text-xs text-gray-500 font-semibold">{org.title}</p>
                        <p className="text-[8px] md:text-[10px] text-gray-400 font-medium">{org.address}</p>
                        <a href={`tel:${org.mobile.replace(/\s+/g, '')}`} className="text-[9px] md:text-xs font-black text-blue-600 block mt-0.5 md:mt-1 hover:underline">
                          {org.mobile}
                        </a>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-4 pt-4 border-t border-orange-50">
                    {subCoordinators.map((coord, index) => (
                      <div key={index} className="bg-orange-50/50 p-2.5 rounded-lg border border-orange-100/50 text-center">
                        <span className="block text-[10px] uppercase tracking-wider font-extrabold text-orange-700">{coord.role}</span>
                        <span className="block text-xs font-bold text-gray-700 mt-0.5">{coord.details}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-6 text-center">
                  <button
                    type="submit"
                    disabled={loading}
                    className={`bg-gradient-to-r from-red-700 via-orange-600 to-red-700 hover:from-red-800 hover:to-orange-700 text-white font-extrabold text-xs md:text-base px-5 md:px-10 py-2.5 md:py-3.5 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] border-2 border-yellow-400 min-w-[180px] md:min-w-[200px] cursor-pointer ${
                      loading ? "opacity-75 cursor-not-allowed" : ""
                    }`}
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        प्रक्रिया जारी है...
                      </span>
                    ) : (
                      "आवेदन पत्र जमा करें"
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>

      </div>
    </div>
  );
};

export default AgraAlankaran;
