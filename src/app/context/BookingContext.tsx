'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

type BookingContextType = {
  isOpen: boolean;
  selectedTreatment: string;
  openModal: (treatment?: string) => void;
  closeModal: () => void;
};

const BookingContext = createContext<BookingContextType | null>(null);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTreatment, setSelectedTreatment] = useState('');

  const openModal = (treatment = '') => {
    setSelectedTreatment(treatment);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <BookingContext.Provider value={{ isOpen, selectedTreatment, openModal, closeModal }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error('useBooking must be inside BookingProvider');
  return ctx;
}
