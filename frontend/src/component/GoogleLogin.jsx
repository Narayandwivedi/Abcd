import React, { useContext, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { toast } from 'react-toastify';

const GoogleLogin = () => {
  const { backendUrl } = useContext(AppContext);
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
        window.google.accounts.id.renderButton(
          googleButtonRef.current,
          {
            theme: 'outline',
            size: 'large',
            width: '360',
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
      const result = await fetch(`${backendUrl}/api/auth/google`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          credential: response.credential,
        }),
      });

      const data = await result.json();

      if (data.success) {
        toast.success(data.message || 'Google login successful!');
        // Store user data
        localStorage.setItem('userData', JSON.stringify(data.userData));
        // Navigate to home and reload to update navbar
        navigate('/');
        window.location.reload();
      } else {
        console.error('Backend login failed:', data.message);
        toast.error(data.message || 'Google login failed');
      }
    } catch (error) {
      console.error('Google login error:', error);
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
