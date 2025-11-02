import React from 'react';

interface ExpiredMessageProps {
  onReset: () => void;
}

export const ExpiredMessage: React.FC<ExpiredMessageProps> = ({ onReset }) => {
  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg p-8 text-white text-center transition-all duration-300 animate-fade-in">
      <div className="text-5xl mb-4">🌅</div>
      <h2 className="text-2xl font-bold mb-2">The Day is Done</h2>
      <p className="opacity-80 mb-6">This wish was here for the day, but now it's time for a new sunrise.</p>
      <button
        onClick={onReset}
        className="bg-pink-500/80 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105"
      >
        Make a New Wish
      </button>
    </div>
  );
};