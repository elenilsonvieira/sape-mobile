import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ScheduleConfig, ScheduleContextProps } from "../interfaces/ISchedule";

const STORAGE_KEY = "@schedule_config";

const SchedulesContext = createContext<ScheduleContextProps>({
  config: null,
  setConfig: () => {}
});

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [config, setConfigState] = useState<ScheduleConfig | null>(null);

  // Carregar configuração do AsyncStorage ao montar
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setConfigState(JSON.parse(stored));
      } catch (error) {
        console.log("Erro ao carregar configuração de horários:", error);
      }
    })();
  }, []);

  // Função para salvar no AsyncStorage
  const saveConfig = async (newConfig: ScheduleConfig) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    } catch (error) {
      console.log("Erro ao salvar configuração de horários:", error);
    }
  };

  const setConfig = (start: string, end: string) => {
    const newConfig = { startTime: start, endTime: end };
    setConfigState(newConfig);
    saveConfig(newConfig);
  };

  return (
    <SchedulesContext.Provider value={{ config, setConfig }}>
      {children}
    </SchedulesContext.Provider>
  );
};

export const useSchedules = () => useContext(SchedulesContext);
