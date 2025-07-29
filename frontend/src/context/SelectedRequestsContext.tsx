import { createContext } from "preact";
import { useState } from "preact/hooks";
import { mockProduceRequests } from "../api/menurithmMockRequests";

// Type for a produce request (adjust if you have a type in types/route.ts)
export type ProduceRequest = typeof mockProduceRequests[number];

interface SelectedRequestsContextType {
  selectedRequests: ProduceRequest[];
  setSelectedRequests: (reqs: ProduceRequest[]) => void;
}

export const SelectedRequestsContext = createContext<SelectedRequestsContextType | undefined>(undefined);

export const SelectedRequestsProvider = ({ children }: { children: preact.ComponentChildren }) => {
  const [selectedRequests, setSelectedRequests] = useState<ProduceRequest[]>([]);

  return (
    <SelectedRequestsContext.Provider value={{ selectedRequests, setSelectedRequests }}>
      {children}
    </SelectedRequestsContext.Provider>
  );
};
