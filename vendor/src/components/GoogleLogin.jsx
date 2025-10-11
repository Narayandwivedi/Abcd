import React, { useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const GoogleLogin = () => {
  const { BACKEND_URL } = useContext(AppContext);
  const navigate = useNavigate();
  const googleButtonRef = useRef(null);
  const isGoogleLoaded = useRef(false);

  useEffect(() => {
    // Check if Google script is loaded
    const checkGoogleLoaded = () => {
      if (window.google && window.google.accounts && !isGoogleLoaded.current) {
        initializeGoogleSignIn();
        isGoogleLoaded.current = true;
      } else if (!isGoogleLoaded.current) {
        // Retry after a short delay
        setTimeout(checkGoogleLoaded, 100);
      }
    };

    checkGoogleLoaded();
  }, []);

  const initializeGoogleSignIn = () => {
    if (!window.google) {
      console.error('Google SDK not loaded');
      return;
    }

    try {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      });

      // Render the Google button
      if (googleButtonRef.current) {
        // Get the container width and set Google button to fit
        const containerWidth = googleButtonRef.current.offsetWidth || 300;
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: 'outline',
            size: 'large',
            width: containerWidth,
            text: 'signin_with',
            shape: 'rectangular',
            logo_alignment: 'center'
          }
        );
      }
    } catch (error) {
      console.error('Google initialization error:', error);
    }
  };

  const handleCredentialResponse = async (response) => {
    try {
      console.log('🔐 Google login attempt...')
      const result = await axios.post(`${BACKEND_URL}/api/vendor-auth/google`, {
        credential: response.credential
      }, {
        withCredentials: true
      });

      if (result.data.success) {
        console.log('✅ Google login successful')
        toast.success('Login successful! Redirecting to home...');
        // Reload to trigger fresh auth check from server
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        console.error('❌ Google login failed:', result.data.message);
        toast.error(result.data.message || 'Google login failed');
      }
    } catch (error) {
      console.error('❌ Google login error:', error);
      toast.error('Google login failed. Please try again.');
    }
  };

  return (
    <div className="w-full flex justify-center items-center">
      <div
        ref={googleButtonRef}
        className="w-full flex justify-center"
        style={{ minHeight: '44px' }}
      >
        {/* Google button will be rendered here */}
      </div>
    </div>
  );
};

export default GoogleLogin;
