import { useState } from "react";

export const useGameModalState = () => {
  const [gameModalIsOpen, setGameModalIsOpen] = useState(false);

  const openGameModal = () => {
    setGameModalIsOpen(true);
  };

  const closeGameModal = () => {
    setGameModalIsOpen(false);
   

  };

  return {
    gameModalIsOpen,
    openGameModal,
    closeGameModal,
  };
};
