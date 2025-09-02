import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import api from "../services/api";
import IPlace from "../interfaces/IPlace";

type PlacesContextType = {
  places: IPlace[];
  addPlace: (place: IPlace) => Promise<void>;
  editPlace: (place: IPlace) => Promise<void>;
  removePlace: (id: number) => Promise<void>;
  getPlaceById: (id: number) => IPlace | undefined;
  reloadPlaces: () => Promise<void>;
};

const PlacesContext = createContext<PlacesContextType | undefined>(undefined);

export function PlacesProvider({ children }: { children: ReactNode }) {
  const [places, setPlaces] = useState<IPlace[]>([]);

  const reloadPlaces = async () => {
    try {
      const response = await api.get<IPlace[]>("/place");
      setPlaces(response.data);
    } catch (error) {
      console.error("Erro ao carregar locais:", error);
    }
  };

  useEffect(() => {
    reloadPlaces();
  }, []);

  const buildPayload = (place: IPlace) => ({
    name: place.name.trim(),
    reference: place.reference?.trim() || "",
    maximumCapacityParticipants: place.maximumCapacityParticipants > 0 ? place.maximumCapacityParticipants : 100,
    isPublic: place.isPublic ?? true,
    responsibles: place.responsibles ?? [],
  });

  const addPlace = async (place: IPlace) => {
    if (!place.name || place.name.trim().length < 4) {
      throw new Error("O nome do local deve ter pelo menos 4 caracteres.");
    }

    const payload = buildPayload(place);
    console.log("Payload que será enviado ao backend:", payload);

    try {
      const response = await api.post<IPlace>("/place", payload);
      setPlaces(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Erro ao criar local:", error);
      throw error;
    }
  };

  const editPlace = async (place: IPlace) => {
    if (!place.id) throw new Error("O ID do local é obrigatório para edição.");
    if (!place.name || place.name.trim().length < 4) {
      throw new Error("O nome do local deve ter pelo menos 4 caracteres.");
    }

    const payload = buildPayload(place);
    console.log("Payload que será enviado ao backend para edição:", payload);

    try {
      const response = await api.put<IPlace>(`/place/${place.id}`, payload);
      setPlaces(prev => prev.map(p => (p.id === place.id ? response.data : p)));
    } catch (error) {
      console.error("Erro ao editar local:", error);
      throw error;
    }
  };

  const removePlace = async (id: number) => {
    try {
      await api.delete(`/place/${id}`);
      setPlaces(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Erro ao excluir local:", error);
      throw error;
    }
  };

  const getPlaceById = (id: number) => places.find(p => p.id === id);

  return (
    <PlacesContext.Provider value={{ places, addPlace, editPlace, removePlace, getPlaceById, reloadPlaces }}>
      {children}
    </PlacesContext.Provider>
  );
}

export function usePlaces() {
  const context = useContext(PlacesContext);
  if (!context) throw new Error("usePlaces must be used within a PlacesProvider");
  return context;
}
