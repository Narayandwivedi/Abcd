import React, { useState, useContext, useRef } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import AudioControls from "../component/AudioControls";

const AgraAlankaran = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);

  // Success popup state
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [successCountdown, setSuccessCountdown] = useState(20);
  const countdownRef = React.useRef(null);

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
  const [docFiles, setDocFiles] = useState([]);

  const photoInputRef = useRef(null);
  const docInputRef = useRef(null);

  // DOB Slider state
  const [dobParts, setDobParts] = useState({ year: '', month: '', day: '' })
  const [showDobPopup, setShowDobPopup] = useState(false)
  const [dobStep, setDobStep] = useState('year')
  const [tempDob, setTempDob] = useState({ year: '', month: '', day: '' })

  const DOB_MONTHS = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ]
  const dobCurrentYear = new Date().getFullYear()
  const dobYears = Array.from({ length: 101 }, (_, i) => dobCurrentYear - i)

  const dobDaysInMonth = (year, month) => {
    if (!year || !month) return []
    const lastDay = new Date(year, month, 0).getDate()
    const today = new Date()
    const maxDay = year === today.getFullYear() && month === today.getMonth() + 1 ? today.getDate() : lastDay
    return Array.from({ length: maxDay }, (_, i) => i + 1)
  }

  // Apply DOB and compute age
  const applyDob = (year, month, day) => {
    if (year && month && day) {
      const dd = String(day).padStart(2, '0')
      const mm = String(month).padStart(2, '0')
      const dobValue = `${year}-${mm}-${dd}`
      const birthDate = new Date(dobValue)
      const today = new Date()
      let calculatedAge = today.getFullYear() - birthDate.getFullYear()
      const monthDiff = today.getMonth() - birthDate.getMonth()
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) calculatedAge--
      setForm(prev => ({ ...prev, dob: dobValue, age: calculatedAge > 0 ? String(calculatedAge) : '0' }))
    } else {
      setForm(prev => ({ ...prev, dob: '', age: '' }))
    }
  }

  const openDobPopup = () => {
    setTempDob({ ...dobParts })
    setDobStep(dobParts.year ? (dobParts.month ? 'day' : 'month') : 'year')
    setShowDobPopup(true)
  }

  const selectDobPart = (part, value) => {
    const next = { ...tempDob, [part]: value }
    if (part === 'year') { next.month = ''; next.day = ''; setDobStep('month') }
    else if (part === 'month') { next.day = ''; setDobStep('day') }
    setTempDob(next)
  }

  const confirmDob = () => {
    const { year, month, day } = tempDob
    if (!year || !month || !day) return
    setDobParts({ year, month, day })
    applyDob(year, month, day)
    setShowDobPopup(false)
  }

  const dobDisplay = dobParts.year && dobParts.month && dobParts.day
    ? `${String(dobParts.day).padStart(2, '0')}-${String(dobParts.month).padStart(2, '0')}-${dobParts.year}`
    : ''

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
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const oversized = files.find(file => file.size > 10 * 1024 * 1024);
    if (oversized) {
      toast.error("दस्तावेज़ का आकार 10MB से कम होना चाहिए");
      return;
    }

    const existingNames = new Set(docFiles.map(f => f.name));
    const newFiles = files.filter(f => !existingNames.has(f.name));

    if (newFiles.length === 0) return;

    const combined = [...docFiles, ...newFiles].slice(0, 10);
    if (combined.length < docFiles.length + newFiles.length) {
      toast.error("अधिकतम 10 दस्तावेज़ ही अपलोड कर सकते हैं");
    }
    setDocFiles(combined);
    e.target.value = "";
  };

  const handleRemoveDoc = (index) => {
    setDocFiles(prev => prev.filter((_, i) => i !== index));
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
    docFiles.forEach(file => {
      submitData.append("documents", file);
    });

    try {
      const response = await fetch(`${BACKEND_URL}/api/agra-alankaran/submit`, {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        setSuccessData(data);
        setSuccessCountdown(20);
        setShowSuccessPopup(true);
        // Start 14-second countdown
        if (countdownRef.current) clearInterval(countdownRef.current);
        countdownRef.current = setInterval(() => {
          setSuccessCountdown(prev => {
            if (prev <= 1) {
              clearInterval(countdownRef.current);
              setShowSuccessPopup(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
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
        setDocFiles([]);
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
    { name: "अग्र-दीप पुरस्कार", prayojak: "स्व. श्री मूलचंद अग्रवाल के परिजन, राजनांदगांव", eligibility: "पीएचडी / पीजी (गोल्ड मेडल)" },
    { name: "अग्र-गौरव पुरस्कार", prayojak: "श्री श्याम अग्रवाल (हनुमान परिवार), रायपुर", eligibility: "UPSC (IAS/IPS/IFS/IRS) चयन" },
    { name: "अग्र-अवध पुरस्कार", prayojak: "श्री मूलचंद अग्रवाल, बिल्हा", eligibility: "समाज सेवा में उल्लेखनीय उपलब्धि" },
    { name: "अग्र-दानी पुरस्कार", prayojak: "श्री चतुरदास अग्रवाल, रायपुर", eligibility: "अस्पताल/धर्मशाला/गौशाला निर्माण दान" },
    { name: "अग्र-शिखर पुरस्कार", prayojak: "श्री अशोक मोदी, कोरबा", eligibility: "राजनीति के क्षेत्र में सर्वश्रेष्ठ प्रदर्शन" },
    { name: "अग्र-शिरोमणि पुरस्कार", prayojak: "श्री सुनील रामदास अग्रवाल, रायगढ़", eligibility: "समाज सेवा में जीवन पर्यंत योगदान" },
    { name: "अग्र-श्री पुरस्कार", prayojak: "डॉ. निर्मल अग्रवाल, रायपुर", eligibility: "CGPSC में उत्कृष्ट चयन" },
    { name: "अग्र-जनहित पुरस्कार", prayojak: "श्री मुरलीधर रमेश कुमार अग्रवाल, सरायपाली वाले", eligibility: "स्वास्थ्य एवं चिकित्सा सेवा" },
    { name: "अग्र-पूंज पुरस्कार", prayojak: "श्री मनोज राजकुमार अग्रवाल, कुरूद", eligibility: "12वीं बोर्ड प्रावीण्य सूची (Merit)" },
    { name: "अग्र-मित्र पुरस्कार", prayojak: "श्रीमती किरण विष्णु गोयल, रायपुर", eligibility: "पर्यावरण एवं स्वच्छता में योगदान" },
    { name: "अग्र-प्रखर पुरस्कार", prayojak: "श्री सुरेश केजरीवाल, रायपुर", eligibility: "राष्ट्रीय व्यावसायिक प्रतियोगी परीक्षा" },
    { name: "अग्र-विश्व पुरस्कार", prayojak: "अशोक अग्रवाल (आईएएस), रायपुर", eligibility: "नृत्य एवं संगीत कला में उत्कृष्टता" },
    { name: "अग्र-विमुक्ति पुरस्कार", prayojak: "श्री विनोद अग्रवाल, चांपा", eligibility: "पत्रकारिता, प्रकाशन व मीडिया सपोर्ट" },
    { name: "अग्र-श्रेष्ठ पुरस्कार", prayojak: "श्री प्रहलादनाथ फंकस अग्रवाल, रायपुर", eligibility: "खेलकूद (राज्य/राष्ट्रीय स्तर)" },
    { name: "अग्र-ज्योति पुरस्कार", prayojak: "श्री हरि नारायण हरीश अग्रवाल (हनुमान परिवार)", eligibility: "महिला सशक्तिकरण कार्य" },
    { name: "अग्र-रतन पुरस्कार", prayojak: "श्री विकास सिंघल (विमल परिवार), भिलाई", eligibility: "कला, साहित्य एवं संस्कृति" },
    { name: "अग्र-उद्योगी पुरस्कार", prayojak: "एंट्री वाईट होटल्स एंड रिसोर्ट प्रा. लि., रायपुर", eligibility: "उद्योग एवं व्यापार में उत्कृष्ट उपलब्धि" },
    { name: "अग्र-संस्था पुरस्कार", prayojak: "टिटलू मेमोरियल, रायगढ़", eligibility: "उत्कृष्ट अग्र संस्था / सभा" }
  ];

  const organizers = [
    { name: "डॉ. अशोक अग्रवाल", title: "प्रांतीय अध्यक्ष", address: "रायपुर", mobile: "93010 14000" },
    { name: "संजय अग्रवाल", title: "प्रांतीय महामंत्री", address: "रायपुर", mobile: "94252 08960" },
    { name: "ललित अग्रवाल", title: "संयोजक : अग्र अलंकरण", address: "रायपुर", mobile: "70004 84146" },
    { name: "पवन अग्रवाल", title: "संभागीय अध्यक्ष", address: "सरगुजा", mobile: "96175 52233" },
    { name: "सुभाष गोयल", title: "संयोजक : अग्र महाकुंभ 2026", address: "अम्बिकापुर", mobile: "98261 90531" },
    { name: "कन्हैयालाल अग्रवाल", title: "संयोजक : अग्र महाकुंभ 2026", address: "अम्बिकापुर", mobile: "94252 56212" },
    { name: "पंकज अग्रवाल", title: "सह संयोजक : अग्र अलंकरण", address: "रायपुर", mobile: "98261 41138" },
    { name: "डॉ. विजय गोयल", title: "सह संयोजक : अग्र अलंकरण", address: "रायपुर", mobile: "75663 35151" },
    { name: "श्रीमती वर्षा अग्रवाल", title: "सह संयोजक : अग्र अलंकरण", address: "रायपुर", mobile: "75871 55011" },
    { name: "संजय मित्तल", title: "अध्यक्ष (सभा)", address: "अम्बिकापुर", mobile: "94252 71333" },
    { name: "संजय अग्रवाल", title: "महामंत्री (सभा)", address: "अम्बिकापुर", mobile: "96699 35080" },
    { name: "सुनील अग्रवाल (बॉबी)", title: "संभागीय महामंत्री", address: "सरगुजा", mobile: "99261 34000" }
  ];

  return (
    <div className="min-h-screen bg-[#FFFDF6] py-2 md:py-10 px-2 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Header Container with Traditional Saffron Board */}
        <div className="relative bg-gradient-to-r from-red-700 via-orange-600 to-red-700 text-white rounded-2xl md:rounded-3xl p-2 md:p-6 shadow-2xl mb-2.5 md:mb-8 overflow-hidden text-center border-2 md:border-4 border-yellow-500">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400/20 via-transparent to-transparent"></div>
          <div className="absolute top-2 right-2 z-20">
            <AudioControls inline compact highlighted blinking />
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-1.5 md:gap-6 max-w-6xl mx-auto">
            {/* Logo Left */}
            <div className="flex-shrink-0 bg-white/10 p-1 md:p-3 rounded-xl md:rounded-2xl backdrop-blur-sm border border-white/20">
              <img src="/abcd logo3.png" alt="ABCD Logo" className="w-8 h-8 md:w-20 md:h-20 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]" />
            </div>

            {/* Central Titles */}
            <div className="flex-1">
              <h1 className="text-[11px] sm:text-xs md:text-4xl font-extrabold tracking-wide drop-shadow-md mb-0.5 md:mb-2">
                छत्तीसगढ़ प्रांतीय अग्रवाल संगठन (सम्मेलन) (रजि.)
              </h1>
              <h2 className="text-[11px] sm:text-xs md:text-3xl font-bold text-yellow-300 drop-shadow-sm mb-0.5 md:mb-2">
                छत्तीसगढ़ स्तरीय दशम् अग्र अलंकरण समारोह 2026
              </h2>
              <div className="my-1.5 md:my-2.5 inline-flex flex-wrap items-center justify-center gap-x-2 md:gap-x-4 gap-y-1 bg-black/25 backdrop-blur-md border border-yellow-400/40 px-3 md:px-6 py-1 md:py-2 rounded-full text-xs sm:text-sm md:text-xl font-black text-yellow-300 drop-shadow-md shadow-inner">
                <span className="flex items-center gap-1">📅 दिनांक : 19-20 सितम्बर 2026</span>
                <span className="text-yellow-400/70 font-normal">|</span>
                <span className="flex items-center gap-1">📍 स्थान : अम्बिकापुर (छ.ग.)</span>
              </div>
              <p className="text-[9px] sm:text-[10px] md:text-sm text-yellow-100 mt-0.5 md:mt-2 font-medium">
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
          <div className="mt-1 md:mt-4 border-t border-white/20 pt-1 md:pt-3 text-[9px] sm:text-[10px] md:text-sm text-orange-200">
            प्रांतीय कार्यालय: श्री हनुमान मार्केट, रामसागर पारा, रायपुर (छत्तीसगढ़) | मोबा. : 99939 61778 , Email : cgpascg@gmail.com
          </div>
        </div>

        {/* Language Notice Banner - Directly after Hero Section */}
        <div className="max-w-4xl mx-auto mb-2.5 md:mb-6 text-center">
          <div className="inline-flex items-center justify-center gap-2 md:gap-3 bg-gradient-to-r from-amber-100 via-orange-100 to-amber-100 border-2 border-amber-400 text-amber-950 px-4 md:px-6 py-2 md:py-2.5 rounded-2xl md:rounded-full text-xs md:text-base font-black shadow-md">
            <span className="text-base md:text-xl shrink-0">🌐</span>
            <div className="flex flex-col sm:flex-row items-center gap-0.5 sm:gap-2">
              <span>आप यह फॉर्म हिंदी में भी भर सकते हैं</span>
              <span className="hidden sm:inline text-amber-600">/</span>
              <span className="text-amber-900">You can fill this form in English & Hindi</span>
            </div>
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
  आवेदन क्रमांक : <span className="bg-green-200 text-green-950 px-3 py-1 rounded-lg font-black border border-green-300">{successData.applicationNo}</span>
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
                      1. पुरस्कार के क्षेत्र का नाम <span className="text-red-600">*</span>
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
                        <option 
                          key={index} 
                          value={`${award.name} (प्रयोजक: ${award.prayojak}) — ${award.eligibility}`}
                        >
                          {award.name} (प्रयोजक: {award.prayojak}) — {award.eligibility}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Field 2: Applicant Name */}
                  <div className="col-span-2">
                    <label className="block text-gray-700 font-extrabold text-[11px] md:text-sm mb-1 md:mb-2">
                      2. आवेदक का नाम <span className="text-red-600">*</span>
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
                      3. जन्मतिथि <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={openDobPopup}
                        className="w-full flex items-center gap-2 pl-3 pr-9 py-2.5 bg-orange-50/10 border border-orange-200 rounded-xl text-xs sm:text-sm text-left transition-all font-medium hover:border-red-400 focus:outline-none focus:border-red-500 focus:bg-white"
                      >
                        <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                        <span className={`flex-1 truncate ${dobDisplay ? 'text-gray-900 font-semibold' : 'text-gray-400'}`}>
                          {dobDisplay || 'जन्मतिथि चुनें'}
                        </span>
                      </button>
                      {dobDisplay && (
                        <button
                          type="button"
                          onClick={() => { setDobParts({ year: '', month: '', day: '' }); applyDob('', '', '') }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center rounded-full text-gray-300 hover:text-red-500 transition-colors"
                          aria-label="Clear Date of Birth"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                        </button>
                      )}
                    </div>
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
                      4. पिता/पति का नाम <span className="text-red-600">*</span>
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
                      5. पूर्ण पता <span className="text-red-600">*</span>
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
                      6. मोबाइल नं. <span className="text-red-600">*</span>
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
                      7. ई-मेल <span className="text-red-600">*</span>
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
                      8. आपकी उपलब्धि का संक्षिप्त विवरण <span className="text-red-600">*</span>
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
                      <span className="text-gray-400">हिंदी या अंग्रेजी में विवरण मान्य होगा।</span>
                      <span className={form.achievementDesc.trim().split(/\s+/).filter(Boolean).length > 150 ? "text-red-600" : "text-gray-500"}>
                        शब्द संख्या: {form.achievementDesc.trim().split(/\s+/).filter(Boolean).length} / 150
                      </span>
                    </div>
                  </div>

                  {/* Field 9: Certificate / Proof Document Upload */}
                  <div className="col-span-2">
                    <label className="block text-gray-700 font-extrabold text-[11px] md:text-sm mb-1 md:mb-2">
                      9. उपलब्धि प्रमाण पत्र एवं आवश्यक दस्तावेज संलग्न करें
                    </label>
                    <div 
                      onClick={() => docInputRef.current?.click()}
                      className="w-full border-2 border-dashed border-orange-200 bg-orange-50/5 rounded-xl p-4 md:p-6 text-center cursor-pointer hover:bg-orange-50/20 hover:border-red-500 transition"
                    >
                      <svg className="w-6 h-6 md:w-8 md:h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-[11px] md:text-sm font-bold text-gray-700">प्रमाण पत्र, अनुशंसा पत्र या अख़बार की कतरन अपलोड करें</p>
                      
                      {/* Highlighted Document Upload Notice inside Box */}
                      <div className="my-2.5 inline-flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 bg-gradient-to-r from-amber-100 via-yellow-200 to-amber-100 border-2 border-yellow-500 text-amber-950 px-4 py-1.5 rounded-xl font-black text-xs md:text-sm shadow-sm">
                        <span>📄 आप <span className="font-black text-red-700 text-base md:text-lg mx-0.5">10</span> डॉक्यूमेंट तक अपलोड कर सकते हैं</span>
                        <span className="hidden sm:inline">/</span>
                        <span>You can upload up to <span className="font-black text-red-700 text-base md:text-lg mx-0.5">10</span> documents</span>
                      </div>

                      <p className="text-[10px] text-gray-400">PDF, JPG, PNG प्रारूप स्वीकृत (प्रत्येक अधिकतम 10MB)</p>
                    </div>

                    {docFiles.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <p className="text-xs font-black text-gray-600">
                          चुने गए दस्तावेज़ ({docFiles.length}): <span className="text-red-600">{docFiles.length === 10 ? " (अधिकतम सीमा पूर्ण)" : ""}</span>
                        </p>
                        {docFiles.map((file, index) => (
                          <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-2 bg-orange-50/60 border border-orange-100 rounded-lg px-3 py-2">
                            <div className="flex items-center gap-2 min-w-0">
                              <svg className="w-4 h-4 text-orange-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-xs font-bold text-gray-700 truncate">{file.name}</span>
                              <span className="text-[10px] text-gray-400 flex-shrink-0">({(file.size / (1024 * 1024)).toFixed(2)} MB)</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveDoc(index)}
                              className="flex-shrink-0 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg p-1 transition"
                              title="हटाएं"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                    <input 
                      type="file" 
                      ref={docInputRef}
                      onChange={handleDocChange}
                      accept=".pdf,image/*"
                      multiple
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
                          30 सेकण्ड का प्रस्तुतिकरण (Video Presentation) Email - <a href="mailto:cgpascg@gmail.com" className="text-blue-600 hover:underline">cgpascg@gmail.com</a> / Pendrive / Whatsapp में एवं आपकी 2 फोटो (वर्तमान की) दें।
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
                        <span className="flex flex-col leading-tight">
                          <span className="text-sm md:text-xl">आवेदन पत्र जमा करें</span>
                          <span className="text-xs md:text-sm font-semibold opacity-85">Submit Application</span>
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Award & Prayojak Reference Table */}
                <div className="bg-[#FFFDF6] rounded-2xl p-4 md:p-6 shadow-lg border border-yellow-200 mt-6">
                  <h3 className="text-center font-extrabold text-base md:text-xl text-red-800 mb-4 border-b border-red-100 pb-2">
                    🏆 अग्र अलंकरण पुरस्कार एवं प्रयोजक सूची
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs md:text-sm border-collapse">
                      <thead>
                        <tr className="bg-gradient-to-r from-red-700 to-orange-600 text-white font-extrabold text-[11px] md:text-xs">
                          <th className="py-2.5 px-2 md:px-3 border border-orange-300 text-center w-10">क्र.</th>
                          <th className="py-2.5 px-2 md:px-3 border border-orange-300 min-w-[140px]">पुरस्कार का नाम</th>
                          <th className="py-2.5 px-2 md:px-3 border border-orange-300 min-w-[200px]">प्रयोजक का नाम</th>
                          <th className="py-2.5 px-2 md:px-3 border border-orange-300 min-w-[180px]">पात्रता / क्षेत्र</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-orange-100 font-medium">
                        {awardCategories.map((award, index) => (
                          <tr key={index} className={index % 2 === 0 ? "bg-white hover:bg-orange-50/50" : "bg-orange-50/20 hover:bg-orange-50/50"}>
                            <td className="py-2 px-2 md:px-3 border border-orange-100 text-center font-bold text-gray-500">{index + 1}</td>
                            <td className="py-2 px-2 md:px-3 border border-orange-100 font-black text-red-900">{award.name}</td>
                            <td className="py-2 px-2 md:px-3 border border-orange-100 font-bold text-amber-900">{award.prayojak}</td>
                            <td className="py-2 px-2 md:px-3 border border-orange-100 text-gray-700">{award.eligibility}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
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
                </div>

              </form>
            </div>
          </div>

      </div>

      {/* ✅ Success Popup Modal */}
      {showSuccessPopup && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm p-6 sm:p-8 flex flex-col items-center text-center overflow-hidden">

            {/* Decorative top banner */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-orange-400 to-yellow-400 rounded-t-3xl" />

            {/* Close button */}
            <button
              type="button"
              onClick={() => { clearInterval(countdownRef.current); setShowSuccessPopup(false); }}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              aria-label="बंद करें"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Countdown ring */}
            <div className="relative w-20 h-20 mb-5">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#fee2e2" strokeWidth="6" />
                <circle
                  cx="40" cy="40" r="34" fill="none"
                  stroke="#dc2626"
                  strokeWidth="6"
                  strokeDasharray={`${2 * Math.PI * 34}`}
                  strokeDashoffset={`${2 * Math.PI * 34 * (1 - successCountdown / 20)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              {/* Green check icon inside ring */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Heading */}
            <h2 className="text-lg font-black text-gray-900 leading-snug mb-2">
              आवेदन सफलतापूर्वक जमा हो गया!
            </h2>

            {/* Application number */}
            {successData?.applicationNo && (
              <div className="w-full bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3 mb-4">
                <p className="text-[11px] text-gray-500 font-semibold mb-0.5">आवेदन क्रमांक</p>
                <p className="text-base font-black text-red-700 tracking-wide">{successData.applicationNo}</p>
              </div>
            )}

            {/* Message */}
            <p className="text-sm text-gray-600 leading-relaxed mb-5">
              इस आवेदन पत्र को सुरक्षित रख लें। चयन समिति जल्द ही आपकी समीक्षा करेगी।
            </p>

            {/* Auto-close note */}
            <p className="text-xs text-gray-400 mb-4">
              यह संदेश <span className="font-bold text-red-500">{successCountdown}</span> सेकंड में स्वतः बंद होगा
            </p>

            {/* Close button */}
            <button
              type="button"
              onClick={() => { clearInterval(countdownRef.current); setShowSuccessPopup(false); }}
              className="w-full py-3 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-red-600 to-orange-500 hover:opacity-90 transition-all shadow-md"
            >
              ठीक है, बंद करें
            </button>
          </div>
        </div>
      )}

      {/* DOB Popup Modal */}
      {showDobPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowDobPopup(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-5 sm:p-6 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-black text-gray-900">जन्मतिथि चुनें</h3>
              <button
                type="button"
                onClick={() => setShowDobPopup(false)}
                className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Stepper */}
            <div className="flex gap-1.5 mb-4">
              {['वर्ष', 'माह', 'दिन'].map((label, i) => {
                const stepName = ['year', 'month', 'day'][i]
                const active = dobStep === stepName
                const done = i === 0 ? !!tempDob.year : i === 1 ? !!tempDob.month : !!tempDob.day
                return (
                  <div
                    key={label}
                    className={`flex-1 rounded-lg py-2 text-center text-[11px] font-black ${
                      active ? 'bg-red-600 text-white' : done ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-400'
                    }`}
                  >
                    {label}
                  </div>
                )
              })}
            </div>

            {/* Year Step */}
            {dobStep === 'year' && (
              <div className="max-h-64 overflow-y-auto grid grid-cols-4 gap-1.5 pr-1">
                {dobYears.map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => selectDobPart('year', String(y))}
                    className={`py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                      tempDob.year === String(y)
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-red-300'
                    }`}
                  >
                    {y}
                  </button>
                ))}
              </div>
            )}

            {/* Month Step */}
            {dobStep === 'month' && (
              <div className="max-h-64 overflow-y-auto grid grid-cols-3 gap-1.5 pr-1">
                {DOB_MONTHS.map((m, i) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => selectDobPart('month', String(i + 1))}
                    className={`px-1 py-2 rounded-lg text-[11px] font-bold border-2 transition-all ${
                      tempDob.month === String(i + 1)
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-red-300'
                    }`}
                  >
                    {m}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setDobStep('year')}
                  className="col-span-3 py-2 rounded-lg text-xs font-bold text-gray-500 bg-gray-50 border-2 border-dashed border-gray-300 hover:border-red-300 hover:text-red-600 transition-all"
                >
                  ← वर्ष बदलें
                </button>
              </div>
            )}

            {/* Day Step */}
            {dobStep === 'day' && (
              <div className="max-h-64 overflow-y-auto grid grid-cols-7 gap-1.5 pr-1">
                {dobDaysInMonth(Number(tempDob.year), Number(tempDob.month)).map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => selectDobPart('day', String(d))}
                    className={`py-2 rounded-lg text-xs font-bold border-2 transition-all ${
                      tempDob.day === String(d)
                        ? 'border-red-600 bg-red-50 text-red-700'
                        : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-red-300'
                    }`}
                  >
                    {d}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setDobStep('month')}
                  className="col-span-7 py-2 rounded-lg text-xs font-bold text-gray-500 bg-gray-50 border-2 border-dashed border-gray-300 hover:border-red-300 hover:text-red-600 transition-all"
                >
                  ← माह बदलें
                </button>
              </div>
            )}

            {/* Live preview */}
            {tempDob.year && tempDob.month && tempDob.day && (
              <p className="mt-3 text-center text-sm font-black text-red-700 bg-red-50 border border-red-100 rounded-xl py-2">
                {String(tempDob.day).padStart(2, '0')}-{String(tempDob.month).padStart(2, '0')}-{tempDob.year}
              </p>
            )}

            {/* Footer */}
            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => setShowDobPopup(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={confirmDob}
                disabled={!tempDob.year || !tempDob.month || !tempDob.day}
                className="flex-1 py-2.5 rounded-xl text-sm font-black text-white bg-gradient-to-r from-red-600 to-orange-500 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                पुष्टि करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgraAlankaran;
