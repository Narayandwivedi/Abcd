import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  // Backend URL - can be imported and used anywhere
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://api.abcdvyapar.com";
  const [demoState, setDemoState] = useState(true);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      // Check localStorage first
      const storedUser = localStorage.getItem('userData');

      if (!storedUser) {
        // Dispatch event to update navbar
        window.dispatchEvent(new Event('authChange'));
        return { isLoggedIn: false, user: null };
      }

      // Verify with backend
      const response = await fetch(`${backendUrl}/api/auth/status`, {
        method: 'GET',
        credentials: 'include',
      });
      const data = await response.json();

      if (data.isLoggedIn && data.user) {
        // Update localStorage with fresh data
        localStorage.setItem('userData', JSON.stringify(data.user));
        // Dispatch event to update navbar
        window.dispatchEvent(new Event('authChange'));
        return { isLoggedIn: true, user: data.user };
      } else {
        // Session expired, clear storage
        localStorage.removeItem('userData');
        window.dispatchEvent(new Event('authChange'));
        return { isLoggedIn: false, user: null };
      }
    } catch (error) {
      console.error('Auth check error:', error);
      // On error, keep local state if exists
      const storedUser = localStorage.getItem('userData');
      if (storedUser) {
        return { isLoggedIn: true, user: JSON.parse(storedUser) };
      }
      return { isLoggedIn: false, user: null };
    }
  };

  const value = {
    backendUrl,
    demoState,
    setDemoState,
    checkAuthStatus,
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
