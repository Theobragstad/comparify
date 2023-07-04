import { useState } from "react";

export const useGameModalState = () => {
  const [gameModalIsOpen, setGameModalIsOpen] = useState(false);

  const openGameModal = () => {
    setGameModalIsOpen(true);
    document.getElementById("audio1")?.play();
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
