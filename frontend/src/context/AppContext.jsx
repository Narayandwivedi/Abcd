import { createContext, useState } from "react";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  // Backend URL - can be imported and used anywhere
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [demoState, setDemoState] = useState(true);

  
  const value = {
    backendUrl,
    demoState,
    setDemoState,
   
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};

export default AppContextProvider;
