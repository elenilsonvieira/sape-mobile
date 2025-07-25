import React, { createContext, useContext, useState, ReactNode } from "react";
import IActivity from "../interfaces/IActivity";

type ActivityContextType = {
  activities: IActivity[];
  addActivity: (activity: IActivity) => void;
  removeActivity: (id: string) => void;
};

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<IActivity[]>([]);

  function addActivity(activity: IActivity) {
    setActivities((prev) => [...prev, activity]);
  }

  function removeActivity(id: string) {
    setActivities((prev) => prev.filter((act) => act.id !== id));
  }

  return (
    <ActivityContext.Provider value={{ activities, addActivity, removeActivity }}>
      {children}
    </ActivityContext.Provider>
  );
}

export function useActivities() {
  const context = useContext(ActivityContext);
  if (!context) {
    throw new Error("useActivities must be used within an ActivityProvider");
  }
  return context;
}
