import React, { useState, useRef, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const UPI_ID = "222716826030217@cnrb";
const UPI_NAME = "Chhattisgarh Prantiya Agrawal Sammelan";

const BANK_DETAILS = {
  bankName: "Canara Bank",
  branch: "Raipur",
  accountNo: "785 522 000 302 17",
  ifsc: "CNRB0017855",
  accountName: "Chhattisgarh Prantiya Agrawal Sammelan",
};

const REGISTRATION_TYPES = [
  {
    value: "without-room",
    label: "बिना कमरे के पंजीकरण",
    fee: "300",
    feeLabel: "₹300",
    desc: "Without Room – Registration Fee ₹300",
  },
  {
    value: "with-room-2-nights",
    label: "कमरे सहित पंजीकरण (2 रात)",
    fee: "1500",
    feeLabel: "₹1500",
    desc: "With Room 2 Nights (Twin / Triple Sharing) – ₹1500",
  },
  {
    value: "with-room-1-night",
    label: "कमरे सहित पंजीकरण (1 रात)",
    fee: "500",
    feeLabel: "₹500",
    desc: "With Room 1 Night (Twin / Triple Sharing) – ₹500",
  },
];

const GENDERS = [
  { value: "पुरुष (Male)", short: "पुरुष" },
  { value: "महिला (Female)", short: "महिला" },
  { value: "अन्य (Other)", short: "अन्य" },
];

const BankDetailsCard = () => (
  <div className="bg-gradient-to-br from-blue-900 to-blue-700 text-white rounded-2xl p-5 md:p-6 border-2 border-yellow-400 shadow-xl">
    <div className="flex items-center gap-2 mb-3 border-b border-white/20 pb-3">
      <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797-2.25c.768 0 1.497.027 2.217.075M3 6h18M3 6l1.5-3h15L21 6M3 6v12.75a.75.75 0 01-.75.75H3M3 6h18v12.75a.75.75 0 01-.75.75H21M6 9v6M9 9v6M12 9v6M15 9v6" />
      </svg>
      <h4 className="font-black text-base md:text-lg">भुगतान हेतु बैंक विवरण (Bank Details)</h4>
    </div>
    <ul className="space-y-1.5 text-sm font-semibold">
      <li className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
        <span className="text-yellow-200 text-xs uppercase tracking-wider font-bold min-w-[130px]">Bank Name</span>
        <span className="font-black">{BANK_DETAILS.bankName}</span>
      </li>
      <li className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
        <span className="text-yellow-200 text-xs uppercase tracking-wider font-bold min-w-[130px]">Branch</span>
        <span className="font-black">{BANK_DETAILS.branch}</span>
      </li>
      <li className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
        <span className="text-yellow-200 text-xs uppercase tracking-wider font-bold min-w-[130px]">A/C No.</span>
        <span className="font-black tracking-wider">{BANK_DETAILS.accountNo}</span>
      </li>
      <li className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
        <span className="text-yellow-200 text-xs uppercase tracking-wider font-bold min-w-[130px]">IFSC Code</span>
        <span className="font-black tracking-wider">{BANK_DETAILS.ifsc}</span>
      </li>
      <li className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
        <span className="text-yellow-200 text-xs uppercase tracking-wider font-bold min-w-[130px]">Account Name</span>
        <span className="font-black">{BANK_DETAILS.accountName}</span>
      </li>
    </ul>
    <p className="mt-3 text-xs text-yellow-100 bg-white/10 rounded-lg px-3 py-2 border border-white/15">
      उपरोक्त बैंक खाते में पंजीकरण शुल्क जमा करके भुगतान स्क्रीनशॉट नीचे अपलोड करें।
    </p>
  </div>
);

const AgraMahakumbh2026 = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Form State
  const [form, setForm] = useState({
    fullName: "",
    gender: "",
    mobileNo: "",
    fatherName: "",
    address: "",
    registrationType: "",
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [paymentFile, setPaymentFile] = useState(null);
  const [paymentPreview, setPaymentPreview] = useState(null);

  const photoInputRef = useRef(null);
  const paymentInputRef = useRef(null);

  const selectedType = REGISTRATION_TYPES.find((t) => t.value === form.registrationType);

  const upiQrValue = selectedType
    ? `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&am=${selectedType.fee}.00&cu=INR&tn=${encodeURIComponent(
        `Agra Mahakumbh 2026 - ${selectedType.label}`
      )}`
    : `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(UPI_NAME)}&cu=INR&tn=${encodeURIComponent("Agra Mahakumbh 2026")}`;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "mobileNo") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setForm((prev) => ({ ...prev, [name]: cleaned }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
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

  const handlePaymentChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("स्क्रीनशॉट का आकार 10MB से कम होना चाहिए");
        return;
      }
      setPaymentFile(file);
      setPaymentPreview(URL.createObjectURL(file));
    }
  };

  const validate = () => {
    if (!form.fullName.trim()) {
      toast.error("कृपया पूरा नाम भरें");
      return false;
    }
    if (!form.gender) {
      toast.error("कृपया लिंग चुनें");
      return false;
    }
    if (!form.mobileNo) {
      toast.error("कृपया मोबाइल नंबर भरें");
      return false;
    }
    if (!/^\d{10}$/.test(form.mobileNo)) {
      toast.error("कृपया 10 अंकों का वैध मोबाइल नंबर दर्ज करें");
      return false;
    }
    if (!photoFile) {
      toast.error("कृपया अपनी फोटो अपलोड करें");
      return false;
    }
    if (!form.registrationType) {
      toast.error("कृपया पंजीकरण प्रकार चुनें");
      return false;
    }
    if (!paymentFile) {
      toast.error("कृपया भुगतान का स्क्रीनशॉट अपलोड करें");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setShowPreview(true);
  };

  const confirmSubmit = async () => {
    setShowConfirm(false);
    setLoading(true);

    const submitData = new FormData();
    submitData.append("fullName", form.fullName);
    submitData.append("gender", form.gender);
    submitData.append("mobileNo", form.mobileNo);
    submitData.append("fatherName", form.fatherName);
    submitData.append("address", form.address);
    submitData.append("registrationType", form.registrationType);
    submitData.append("registrationFee", selectedType ? selectedType.fee : "");

    if (photoFile) {
      submitData.append("photo", photoFile);
    }
    if (paymentFile) {
      submitData.append("paymentScreenshot", paymentFile);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/agra-mahakumbh-2026/submit`, {
        method: "POST",
        body: submitData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "आपका पंजीकरण सफलतापूर्वक जमा हो गया है!");
        setSuccessData(data);
        setShowPreview(false);
        setForm({
          fullName: "",
          gender: "",
          mobileNo: "",
          fatherName: "",
          address: "",
          registrationType: "",
        });
        setPhotoFile(null);
        setPhotoPreview(null);
        setPaymentFile(null);
        setPaymentPreview(null);
      } else {
        toast.error(data.message || "पंजीकरण जमा करने में विफलता");
      }
    } catch (err) {
      console.error(err);
      toast.error("सर्वर से संपर्क करने में विफलता");
    } finally {
      setLoading(false);
    }
  };

  const previewModal = showPreview && (
    <div className="fixed inset-0 z-50 bg-[#FFFDF6] overflow-y-auto">
      <div className="px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-red-700 to-orange-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-red-800">पंजीकरण विवरण जांचें (Review Details)</h1>
              <p className="text-sm text-gray-500 font-semibold">कृपया सभी जानकारी और भुगतान स्क्रीनशॉट सत्यापित करें</p>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-yellow-200">
              <h3 className="text-sm font-black text-red-800 uppercase tracking-wider border-b border-orange-100 pb-2 mb-3">
                व्यक्तिगत जानकारी
              </h3>
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="shrink-0">
                  <div className="w-24 h-28 rounded-xl border-2 border-yellow-400 overflow-hidden bg-orange-50">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Your Photo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400">
                        फोटो
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex-1 space-y-2.5">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider min-w-[140px]">पूरा नाम</span>
                    <span className="text-sm font-extrabold text-gray-800">{form.fullName}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider min-w-[140px]">लिंग</span>
                    <span className="text-sm font-extrabold text-gray-800">{form.gender}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-wider min-w-[140px]">मोबाइल नंबर</span>
                    <span className="text-sm font-extrabold text-gray-800">{form.mobileNo}</span>
                  </div>
                  {form.fatherName && (
                    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider min-w-[140px]">पिता का नाम</span>
                      <span className="text-sm font-extrabold text-gray-800">{form.fatherName}</span>
                    </div>
                  )}
                  {form.address && (
                    <div className="flex flex-col sm:flex-row sm:items-start gap-0.5 sm:gap-2">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider min-w-[140px]">पूरा पता</span>
                      <span className="text-sm font-extrabold text-gray-800">{form.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-yellow-200">
              <h3 className="text-sm font-black text-red-800 uppercase tracking-wider border-b border-orange-100 pb-2 mb-3">
                पंजीकरण प्रकार एवं शुल्क
              </h3>
              <div className="flex items-center justify-between gap-3 bg-orange-50/60 border border-orange-200 rounded-xl px-4 py-3">
                <span className="text-sm font-bold text-gray-700">{selectedType ? selectedType.desc : "—"}</span>
                <span className="text-lg font-black text-red-700 whitespace-nowrap">{selectedType ? selectedType.feeLabel : ""}</span>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-5 sm:p-6 shadow-lg border border-yellow-200">
              <h3 className="text-sm font-black text-red-800 uppercase tracking-wider border-b border-orange-100 pb-2 mb-3">
                भुगतान स्क्रीनशॉट
              </h3>
              {paymentPreview ? (
                <div className="max-w-sm mx-auto">
                  <img src={paymentPreview} alt="Payment Screenshot" className="w-full rounded-xl border-2 border-green-300 shadow-inner" />
                </div>
              ) : (
                <p className="text-sm text-gray-500 font-semibold">कोई स्क्रीनशॉट अपलोड नहीं किया गया</p>
              )}
            </div>

            <BankDetailsCard />

            <p className="text-center text-xs text-gray-500 font-semibold bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3">
              कृपया उपरोक्त बैंक खाते में पंजीकरण शुल्क जमा करने के बाद ही सबमिट करें। आपके द्वारा भरी गई सभी जानकारी सत्यापित की जाएगी।
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pb-8">
            <button
              type="button"
              onClick={() => setShowPreview(false)}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold text-gray-600 bg-white border-2 border-gray-200 hover:bg-gray-50 transition cursor-pointer"
            >
              संपादित करें (Edit)
            </button>
            <button
              type="button"
              onClick={() => setShowConfirm(true)}
              disabled={loading}
              className="w-full sm:w-auto px-10 py-3.5 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-red-700 via-orange-600 to-red-700 border-2 border-yellow-400 shadow-xl hover:scale-[1.02] transition cursor-pointer disabled:opacity-60"
            >
              पंजीकरण सबमिट करें
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-white rounded-3xl shadow-2xl p-6 sm:p-8 max-w-lg w-full animate-fade-in">
            <button
              type="button"
              onClick={() => setShowConfirm(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="w-14 h-14 rounded-full bg-amber-50 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7 text-amber-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            </div>
            <h3 className="text-lg font-black text-red-800 text-center mt-4">पंजीकरण की पुष्टि करें</h3>
            <p className="text-sm text-gray-600 text-center mt-2 leading-relaxed font-medium">
              क्या आप सुनिश्चित हैं कि आपने <span className="font-black text-green-700">{selectedType ? selectedType.feeLabel : ""}</span> का भुगतान
              कर दिया है? कृपया सबमिट करने से पहले सभी विवरण सत्यापित करें।
            </p>

            <div className="mt-5">
              <BankDetailsCard />
            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="flex-1 px-5 py-3 rounded-2xl text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition cursor-pointer"
              >
                रद्द करें
              </button>
              <button
                type="button"
                onClick={confirmSubmit}
                disabled={loading}
                className="flex-1 px-5 py-3 rounded-2xl text-sm font-black text-white bg-gradient-to-r from-red-700 via-orange-600 to-red-700 border-2 border-yellow-400 transition cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    जमा हो रहा है...
                  </>
                ) : (
                  "हाँ, सबमिट करें"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FFFDF6] py-10 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">

        {/* Main Header Container */}
        <div className="relative bg-gradient-to-r from-red-700 via-orange-600 to-red-700 text-white rounded-3xl p-6 shadow-2xl mb-8 overflow-hidden text-center border-4 border-yellow-500">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400/20 via-transparent to-transparent"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 max-w-6xl mx-auto">
            {/* Logo Left */}
            <div className="flex-shrink-0 bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
              <img src="/abcd logo3.png" alt="ABCD Logo" className="w-20 h-20 object-contain drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]" />
            </div>

            {/* Central Titles */}
            <div className="flex-1">
              <h1 className="text-2xl md:text-4xl font-extrabold tracking-wide drop-shadow-md mb-2">
                छत्तीसगढ़ प्रांतीय अग्रवाल संगठन (सम्मेलन) (रजि.)
              </h1>
              <h2 className="text-xl md:text-3xl font-bold text-yellow-300 drop-shadow-sm mb-2">
                अग्र महाकुंभ 2026
              </h2>
              <div className="text-sm md:text-base font-semibold text-orange-100 flex flex-wrap justify-center gap-x-6 gap-y-1">
                <span>दिनांक : 19-20 सितम्बर 2026</span>
                <span>|</span>
                <span>स्थान : अम्बिकापुर (छ.ग.)</span>
              </div>
              <p className="text-xs md:text-sm text-yellow-100 mt-2 font-medium">
                ऑनलाइन पंजीकरण (Online Registration)
              </p>
            </div>

            {/* Logo Right / Placeholder */}
            <div className="hidden md:block flex-shrink-0 bg-white/10 p-3 rounded-2xl backdrop-blur-sm border border-white/20">
              <div className="text-center text-xs font-bold w-20 h-20 flex items-center justify-center border-2 border-dashed border-yellow-300 rounded-lg">
                अग्र <br /> संगठन
              </div>
            </div>
          </div>

          {/* Office details */}
          <div className="mt-4 border-t border-white/20 pt-3 text-xs md:text-sm text-orange-200">
            प्रांतीय कार्यालय: श्री हनुमान मार्केट, रामसागर पारा, रायपुर (छत्तीसगढ़) | मोबा. : 99939 61778 , Email : cgpascg@gmail.com
          </div>
        </div>

        {/* Success Block */}
        {successData && (
          <div className="bg-green-50 border-2 border-green-300 text-green-800 p-6 rounded-2xl mb-8 shadow-inner">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h4 className="text-lg font-black mb-1">🎉 पंजीकरण सफलतापूर्वक जमा हो गया!</h4>
                <p className="text-sm font-semibold">
                  आपका पंजीकरण क्रमांक:{" "}
                  <span className="bg-green-200 text-green-950 px-3 py-1 rounded-lg font-black border border-green-300">
                    {successData.registrationNo}
                  </span>
                </p>
                <p className="text-xs text-green-600 mt-2">
                  इस पंजीकरण संख्या को सुरक्षित रख लें। आपका पंजीकरण सत्यापन के बाद पूर्ण माना जाएगा।
                </p>
              </div>
              <button
                onClick={() => setSuccessData(null)}
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition cursor-pointer"
              >
                नया पंजीकरण करें
              </button>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className="bg-white rounded-3xl p-6 md:p-10 shadow-2xl border border-yellow-200">
          {/* Form Title */}
          <div className="text-center mb-8 border-b-2 border-dashed border-red-200 pb-6">
            <h2 className="text-2xl md:text-3xl font-black text-red-800 mb-2">
              अग्र महाकुंभ 2026 – पंजीकरण पत्र
            </h2>
            <p className="text-sm md:text-base font-bold text-gray-600">
              (सभी आवश्यक फ़ील्ड चिन्हित हैं - <span className="text-red-600">*</span>)
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo + required fields */}
            <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-orange-50 pb-6">
              {/* Form fields */}
              <div className="flex-1 space-y-4">
                <div>
                  <label className="block text-gray-700 font-extrabold text-sm mb-2">
                    १. पूरा नाम (Full Name) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleInputChange}
                    placeholder="पूरा नाम दर्ज करें"
                    className="w-full px-4 py-3 border border-orange-200 rounded-xl bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-extrabold text-sm mb-2">
                    २. लिंग (Gender) <span className="text-red-600">*</span>
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {GENDERS.map((g) => (
                      <label
                        key={g.value}
                        className={`flex-1 min-w-[120px] px-4 py-3 border-2 rounded-xl text-center cursor-pointer transition font-bold text-sm ${
                          form.gender === g.value
                            ? "border-red-500 bg-red-50 text-red-800 shadow-sm"
                            : "border-gray-200 bg-white text-gray-600 hover:border-orange-300"
                        }`}
                      >
                        <input
                          type="radio"
                          name="gender"
                          value={g.value}
                          checked={form.gender === g.value}
                          onChange={handleInputChange}
                          className="hidden"
                        />
                        {g.short}
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-extrabold text-sm mb-2">
                    ३. मोबाइल नंबर (Mobile No.) <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    inputMode="numeric"
                    name="mobileNo"
                    value={form.mobileNo}
                    onChange={handleInputChange}
                    placeholder="10 अंकों का मोबाइल नंबर"
                    className="w-full px-4 py-3 border border-orange-200 rounded-xl bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-extrabold text-sm mb-2">
                    ४. पिता का पूरा नाम (Father&apos;s Full Name)
                  </label>
                  <input
                    type="text"
                    name="fatherName"
                    value={form.fatherName}
                    onChange={handleInputChange}
                    placeholder="वैकल्पिक - पिता का पूरा नाम दर्ज करें"
                    className="w-full px-4 py-3 border border-orange-200 rounded-xl bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-extrabold text-sm mb-2">
                    ५. पूरा पता (Address)
                  </label>
                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleInputChange}
                    rows="3"
                    placeholder="वैकल्पिक - मकान नंबर, मार्ग, शहर/गांव, जिला, पिनकोड..."
                    className="w-full px-4 py-3 border border-orange-200 rounded-xl bg-orange-50/10 focus:outline-none focus:ring-2 focus:ring-red-500 font-medium resize-y"
                  ></textarea>
                </div>
              </div>

              {/* Photo Upload Zone */}
              <div className="flex-shrink-0 self-center md:self-start">
                <label className="block text-gray-700 font-extrabold text-sm mb-2 text-center md:text-left">
                  आपकी फोटो <span className="text-red-600">*</span>
                </label>
                <div
                  onClick={() => photoInputRef.current?.click()}
                  className="w-40 h-52 border-2 border-dashed border-gray-400 bg-orange-50/20 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-orange-50/50 hover:border-red-500 transition relative overflow-hidden shadow-inner group"
                >
                  {photoPreview ? (
                    <>
                      <img src={photoPreview} alt="Your Photo Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                        <span className="text-white text-xs font-bold">बदलें</span>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-3">
                      <svg className="w-8 h-8 text-gray-400 mx-auto mb-2 group-hover:text-red-500 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      <p className="text-xs font-black text-gray-600">अपनी फोटो जोड़ें</p>
                      <p className="text-[9px] text-gray-400 mt-1">Passport size photo (Max 5MB)</p>
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

            {/* Registration Type */}
            <div>
              <label className="block text-gray-700 font-extrabold text-sm mb-2">
                ६. पंजीकरण प्रकार (Registration Type) <span className="text-red-600">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {REGISTRATION_TYPES.map((type) => (
                  <label
                    key={type.value}
                    className={`relative border-2 rounded-2xl p-4 cursor-pointer transition flex flex-col gap-2 ${
                      form.registrationType === type.value
                        ? "border-red-500 bg-red-50/50 shadow-md"
                        : "border-gray-200 bg-white hover:border-orange-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="registrationType"
                      value={type.value}
                      checked={form.registrationType === type.value}
                      onChange={handleInputChange}
                      className="hidden"
                    />
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-sm font-extrabold text-gray-800">{type.label}</span>
                      <span className="shrink-0 text-lg font-black text-red-700 bg-white border-2 border-red-200 rounded-lg px-2 py-0.5">
                        {type.feeLabel}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-semibold leading-snug">{type.desc}</p>
                    <div
                      className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 ${
                        form.registrationType === type.value ? "border-red-500 bg-red-500" : "border-gray-300"
                      }`}
                    >
                      {form.registrationType === type.value && (
                        <svg className="w-3 h-3 text-white mx-auto mt-[1px]" fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {selectedType && (
                <p className="mt-3 text-sm font-bold text-green-700 bg-green-50 border border-green-200 rounded-xl px-4 py-2.5">
                  आपका चयनित पंजीकरण शुल्क: <span className="text-lg font-black">{selectedType.feeLabel}</span>
                </p>
              )}
            </div>

            {/* Payment Section */}
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-black text-red-800 mb-3 border-b-2 border-dashed border-red-200 pb-2">
                  ७. पंजीकरण शुल्क का भुगतान (Registration Fee Payment)
                </h3>

                {/* UPI QR + Bank Details (same row like vendor signup) */}
                <div className="flex items-start gap-3 bg-white border-2 border-green-300 rounded-2xl p-3 shadow-lg mb-4">
                  {/* QR Code */}
                  <div className="flex-shrink-0">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(upiQrValue)}`}
                      alt="UPI QR Code"
                      className="w-24 h-24 sm:w-28 sm:h-28 border border-gray-200 rounded-lg bg-white p-1"
                    />
                    <p className="text-[9px] text-gray-500 text-center mt-1 font-semibold">Scan to pay</p>
                  </div>

                  {/* Bank Details */}
                  <div className="flex-1 space-y-1">
                    <p className="text-[#1a237e] text-[10px] sm:text-xs font-bold uppercase tracking-tight">Bank Details</p>
                    {[
                      ["UPI ID", UPI_ID],
                      ["Bank", BANK_DETAILS.bankName.toUpperCase()],
                      ["A/C No.", BANK_DETAILS.accountNo],
                      ["IFSC", BANK_DETAILS.ifsc],
                    ].map(([label, value]) => (
                      <div key={label} className="flex justify-between items-start gap-1">
                        <span className="text-gray-500 text-[9px] sm:text-[10px] shrink-0">{label}</span>
                        <span className="text-gray-900 text-[9px] sm:text-[10px] font-semibold text-right break-all">{value}</span>
                      </div>
                    ))}
                    <div className="mt-1.5 bg-green-50 rounded-lg px-2 py-1">
                      <p className="text-green-700 text-[10px] font-bold">
                        {selectedType ? `Amount: ${selectedType.feeLabel}` : "Choose registration type for amount"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Screenshot Upload */}
                <div className="mt-4">
                  <label className="block text-gray-700 font-extrabold text-sm mb-2">
                    भुगतान का स्क्रीनशॉट अपलोड करें (Payment Screenshot) <span className="text-red-600">*</span>
                  </label>
                  <div
                    onClick={() => paymentInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-orange-200 bg-orange-50/5 rounded-xl p-6 text-center cursor-pointer hover:bg-orange-50/20 hover:border-red-500 transition"
                  >
                    {paymentPreview ? (
                      <div className="max-w-sm mx-auto">
                        <img src={paymentPreview} alt="Payment Screenshot Preview" className="w-full rounded-xl border-2 border-green-300 shadow-inner" />
                        <p className="text-sm font-black text-green-700 mt-2">✓ स्क्रीनशॉट अपलोड हो गया (बदलने के लिए क्लिक करें)</p>
                      </div>
                    ) : (
                      <>
                        <svg className="w-8 h-8 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                        </svg>
                        <p className="text-xs font-bold text-gray-600">बैंक भुगतान की रसीद / स्क्रीनशॉट अपलोड करें</p>
                        <p className="text-[10px] text-gray-400 mt-1">JPG, PNG, WebP प्रारूप स्वीकृत (Max 10MB)</p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={paymentInputRef}
                    onChange={handlePaymentChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>
            </div>

            {/* Declaration */}
            <div className="bg-[#FFFDF6] border border-orange-100 rounded-2xl p-5 md:p-6 text-gray-600 text-xs md:text-sm leading-relaxed mt-8">
              <h4 className="font-extrabold text-red-800 text-sm md:text-base border-b border-orange-100 pb-1.5 mb-2">
                महत्वपूर्ण निर्देश:
              </h4>
              <ul className="list-decimal pl-4 space-y-2 font-medium">
                <li>पंजीकरण शुल्क उपरोक्त बैंक खाते में जमा करना अनिवार्य है।</li>
                <li>भुगतान स्क्रीनशॉट स्पष्ट होना चाहिए जिसमें दिनांक, राशि एवं UTR/Txn नंबर दिखाई दे।</li>
                <li>आपके द्वारा दी गई जानकारी के सत्यापन के बाद ही पंजीकरण पूर्ण माना जाएगा।</li>
              </ul>

              <div className="pt-4 border-t border-orange-100 mt-4 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-2">
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
            </div>

            {/* Submit button */}
            <div className="pt-6 text-center">
              <button
                type="submit"
                disabled={loading}
                className={`bg-gradient-to-r from-red-700 via-orange-600 to-red-700 hover:from-red-800 hover:to-orange-700 text-white font-extrabold text-sm md:text-base px-10 py-3.5 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98] border-2 border-yellow-400 min-w-[220px] cursor-pointer ${
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
                  "पंजीकरण जांचें और सबमिट करें"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
      {previewModal}
    </div>
  );
};

export default AgraMahakumbh2026;