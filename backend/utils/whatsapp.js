const axios = require('axios');

/**
 * WhatsApp Utility for sending messages via the WhatsApp Engine API.
 */
const sendWhatsAppMessage = async (numbers, text, media = null) => {
  try {
    const apiKey = process.env.WHATSAPP_API_KEY;
    const apiUrl = process.env.WHATSAPP_API_URL;

    if (!apiKey || !apiUrl) {
      console.warn('[WHATSAPP] API Key or URL not configured');
      return { success: false, message: 'WhatsApp API not configured' };
    }

    // Ensure numbers is an array
    const numberList = Array.isArray(numbers) ? numbers : [numbers];
    
    // Format messages for the API
    const messages = numberList.map(num => {
      // Clean number: remove non-digits, ensure it's in 91xxxxxxxxxx format for India if only 10 digits
      let cleanNum = num.toString().replace(/\D/g, '');
      if (cleanNum.length === 10) {
        cleanNum = '91' + cleanNum;
      }
      
      const msgObj = { number: cleanNum, text };
      if (media && media.url) {
        msgObj.mediaUrl = media.url;
        msgObj.mediaFilename = media.filename || 'document.pdf';
      }
      return msgObj;
    });

    const response = await axios.post(`${apiUrl}/messages/send`, {
      messages
    }, {
      headers: {
        'x-api-key': apiKey,
        'Content-Type': 'application/json'
      }
    });

    return { 
      success: true, 
      jobId: response.data.jobId, 
      count: response.data.count 
    };
  } catch (error) {
    console.error('[WHATSAPP] Error sending message:', error.response?.data || error.message);
    return { 
      success: false, 
      error: error.response?.data?.message || error.message 
    };
  }
};

module.exports = {
  sendWhatsAppMessage
};
