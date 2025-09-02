import React, { createContext, useContext, useState, ReactNode } from "react";
import IActivity from "../interfaces/IActivity";

type ActivityContextType = {
  activities: IActivity[];
  addActivity: (activity: IActivity) => void;
  removeActivity: (id: string) => void;
  editActivity: (updated: IActivity) => void;
  getActivityById: (id: string) => IActivity | undefined;
  // Novas funções para confirmação de presença
  confirmPresence: (id: string) => void;
  cancelPresence: (id: string) => void;
  isConfirmed: (id: string) => boolean;
  confirmedActivities: string[]; // IDs das atividades confirmadas
};

const ActivityContext = createContext<ActivityContextType | undefined>(undefined);

export function ActivityProvider({ children }: { children: ReactNode }) {
  const [activities, setActivities] = useState<IActivity[]>([]);
  const [confirmedActivities, setConfirmedActivities] = useState<string[]>([]);

  function addActivity(activity: IActivity) {
    setActivities((prev) => [...prev, activity]);
  }

  function removeActivity(id: string) {
    setActivities((prev) => prev.filter((act) => act.id !== id));
  }

  function editActivity(updated: IActivity) {
    setActivities((prev) =>
      prev.map((act) => (act.id === updated.id ? updated : act))
    );
  }

  function getActivityById(id: string) {
    return activities.find((act) => act.id === id);
  }

  // Função para confirmar presença
  function confirmPresence(id: string) {
    if (!confirmedActivities.includes(id)) {
      setConfirmedActivities((prev) => [...prev, id]);
    }
  }

  // Função para cancelar presença
  function cancelPresence(id: string) {
    setConfirmedActivities((prev) => prev.filter(activityId => activityId !== id));
  }

  // Função para verificar se está confirmado
  function isConfirmed(id: string) {
    return confirmedActivities.includes(id);
  }

  return (
    <ActivityContext.Provider value={{ 
      activities, 
      addActivity, 
      removeActivity, 
      editActivity,
      getActivityById,
      confirmPresence,
      cancelPresence: cancelPresence, // Corrigindo nome para manter consistência
      isConfirmed,
      confirmedActivities
    }}>
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