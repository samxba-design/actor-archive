import { createContext, useContext } from "react";

// Generic demo data context - holds all mock data for the current demo page
interface DemoDataContextType {
  [key: string]: any;
}

const DemoDataContext = createContext<DemoDataContextType>({});

export const DemoDataProvider = DemoDataContext.Provider;

export function useDemoDataContext() {
  return useContext(DemoDataContext);
}
