import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SubscriptionContextType = {
  inscricoes: string[];
  inscrever: (id: string) => void;
  desinscrever: (id: string) => void;
  estaInscrito: (id: string) => boolean;
};

const STORAGE_KEY = "@user_subscriptions";

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [inscricoes, setInscricoes] = useState<string[]>([]);

  // Carregar inscrições salvas ao montar
  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) setInscricoes(JSON.parse(stored));
      } catch (error) {
        console.log("Erro ao carregar inscrições:", error);
      }
    })();
  }, []);

  // Salvar inscrições no AsyncStorage
  const saveInscricoes = async (newInscricoes: string[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newInscricoes));
    } catch (error) {
      console.log("Erro ao salvar inscrições:", error);
    }
  };

  function inscrever(id: string) {
    if (!inscricoes.includes(id)) {
      const updated = [...inscricoes, id];
      setInscricoes(updated);
      saveInscricoes(updated);
    }
  }

  function desinscrever(id: string) {
    const updated = inscricoes.filter((itemId) => itemId !== id);
    setInscricoes(updated);
    saveInscricoes(updated);
  }

  function estaInscrito(id: string) {
    return inscricoes.includes(id);
  }

  return (
    <SubscriptionContext.Provider value={{ inscricoes, inscrever, desinscrever, estaInscrito }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error("useSubscriptions deve ser usado dentro de SubscriptionProvider");
  }
  return context;
}
