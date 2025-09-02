import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import ISport from "../interfaces/ISport";
import api from "../services/api";




type SportContextType = {
  sports: ISport[];
  addSport: (sport: ISport) => Promise<void>;
  removeSport: (id: string) => Promise<void>;
  editSport: (updated: ISport) => Promise<void>;
  getSportById: (id: string) => ISport | undefined;
  reloadSports: () => Promise<void>;
};

const SportContext = createContext<SportContextType | undefined>(undefined);

export function SportProvider({ children }: { children: ReactNode }) {
  const [sports, setSports] = useState<ISport[]>([]);

  // Função para recarregar esportes do backend
  const reloadSports = async () => {
    try {
      const response = await api.get<ISport[]>("/sport");
      setSports(response.data);
    } catch (error) {
      console.error("Erro ao carregar esportes:", error);
    }
  };

  useEffect(() => {
    reloadSports();
  }, []);

  const addSport = async (sport: ISport) => {
    try {
      const response = await api.post<ISport>("/sport", sport);
      setSports(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Erro ao criar esporte:", error);
    }
  };

  const removeSport = async (id: string) => {
    try {
      await api.delete(`/sport/${id}`);
      setSports(prev => prev.filter(s => s.id !== id));
    } catch (error) {
      console.error("Erro ao excluir esporte:", error);
    }
  };

  const editSport = async (updated: ISport) => {
    try {
      const response = await api.put<ISport>(`/sport/${updated.id}`, updated);
      setSports(prev => prev.map(s => (s.id === updated.id ? response.data : s)));
    } catch (error) {
      console.error("Erro ao editar esporte:", error);
    }
  };

  const getSportById = (id: string) => sports.find(s => s.id === id);

  return (
    <SportContext.Provider value={{ sports, addSport, removeSport, editSport, getSportById, reloadSports }}>
      {children}
    </SportContext.Provider>
  );
}

export function useSports() {
  const context = useContext(SportContext);
  if (!context) throw new Error("useSports must be used within a SportProvider");
  return context;
}
