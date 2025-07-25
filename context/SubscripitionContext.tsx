import React, { createContext, useContext, useState, ReactNode } from "react";

type SubscriptionContextType = {
  inscricoes: string[]; // lista de IDs de atividades inscritas
  inscrever: (id: string) => void;
  desinscrever: (id: string) => void;
  estaInscrito: (id: string) => boolean;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [inscricoes, setInscricoes] = useState<string[]>([]);

  function inscrever(id: string) {
    if (!inscricoes.includes(id)) {
      setInscricoes((prev) => [...prev, id]);
    }
  }

  function desinscrever(id: string) {
    setInscricoes((prev) => prev.filter((itemId) => itemId !== id));
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
