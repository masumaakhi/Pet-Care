// src/context/PetContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../utils/api";

const PetContext = createContext();

export const PetProvider = ({ children }) => {
  const [pets, setPets] = useState([]);
  const [selectedPetId, setSelectedPetId] = useState(
    localStorage.getItem("selectedPetId") || null
  );
  const [loading, setLoading] = useState(true);

  const fetchPets = async () => {
    try {
      setLoading(true);
      const res = await api.get("/pets");
      if (res.data.success) {
        setPets(res.data.data);
        if (!selectedPetId && res.data.data.length > 0) {
          handleSelectPet(res.data.data[0].id);
        }
      }
    } catch (error) {
      console.error("Error fetching pets for context:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPets();
  }, []);

  const handleSelectPet = (id) => {
    setSelectedPetId(id);
    localStorage.setItem("selectedPetId", id);
  };

  return (
    <PetContext.Provider
      value={{
        pets,
        selectedPetId,
        setSelectedPetId: handleSelectPet,
        refetchPets: fetchPets,
        loading,
      }}
    >
      {children}
    </PetContext.Provider>
  );
};

export const usePet = () => {
  const context = useContext(PetContext);
  if (!context) {
    throw new Error("usePet must be used within a PetProvider");
  }
  return context;
};
