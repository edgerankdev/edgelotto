import React, { useState, useEffect } from 'react';

interface NumberSlotProps {
  isSpinning: boolean;
  finalNumber: number;
}

export const NumberSlot: React.FC<NumberSlotProps> = ({ isSpinning, finalNumber }) => {
  const [currentNumber, setCurrentNumber] = useState(0);

  useEffect(() => {
    if (isSpinning) {
      // Cycle numbers rapidly for a spinning effect
      const intervalId = setInterval(() => {
        setCurrentNumber(Math.floor(Math.random() * 10));
      }, 30);
      return () => clearInterval(intervalId);
    } else {
      // Set the final number once spinning stops
      setCurrentNumber(finalNumber);
    }
  }, [isSpinning, finalNumber]);

  return (
    <div className={`
      w-24 h-36 md:w-32 md:h-48 
      flex items-center justify-center 
      bg-slate-800/50 backdrop-blur-sm 
      rounded-lg 
      text-7xl md:text-9xl font-mono font-bold
      text-white overflow-hidden
      transition-all duration-300 ease-in-out
      ${isSpinning 
        ? 'border border-slate-600 shadow-2xl shadow-cyan-500/10'
        : 'border-2 border-cyan-400 shadow-2xl shadow-cyan-400/40'
      }`
    }>
      <span className={`
        transition-all duration-500 ease-out
        ${isSpinning 
          ? 'opacity-60 blur-md [animation:jitter_0.1s_infinite]' 
          : 'opacity-100 scale-110 text-cyan-400'
        }`
      }>
        {currentNumber}
      </span>
    </div>
  );
};
