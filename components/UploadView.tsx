import React, { useRef, useState } from 'react';

interface UploadViewProps {
  onPhotoUpload: (file: File, limit: number) => void;
}

export const UploadView: React.FC<UploadViewProps> = ({ onPhotoUpload }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [limitInput, setLimitInput] = useState('50');
  const [error, setError] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const limit = parseInt(limitInput, 10);
      // This check is a safeguard, though handleClick should prevent this state.
      if (isNaN(limit) || limit <= 0) {
        setError('Like goal must be a valid, positive number.');
        return;
      }
      onPhotoUpload(event.target.files[0], limit);
    }
  };
  
  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLimitInput(event.target.value);
    if (error) {
        setError(''); // Clear error while user is correcting it
    }
  };

  const handleClick = () => {
    const limit = parseInt(limitInput, 10);
    if (isNaN(limit) || limit <= 0) {
        setError('Please set a valid, positive like goal.');
        return;
    }
    setError('');
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-lg p-8 text-white text-center transition-all duration-300 hover:shadow-2xl">
      <div className="text-6xl mb-4 animate-bounce">☀️</div>
      <h1 className="text-4xl font-bold mb-2">TrueWishes</h1>
      <p className="text-lg opacity-80 mb-6">Make a wish for the day!</p>
      
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div className="mb-4 text-left">
        <label htmlFor="like-goal" className="block text-sm font-medium opacity-80 mb-1">Set a Like Goal</label>
        <input
          type="number"
          id="like-goal"
          value={limitInput}
          onChange={handleLimitChange}
          min="1"
          className="w-full bg-white/20 border border-white/30 rounded-lg py-2 px-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-pink-400 transition"
        />
        {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
      </div>
      
      <button
        onClick={handleClick}
        className="w-full bg-pink-500/80 hover:bg-pink-500 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-pink-300"
      >
        <div className="flex items-center justify-center space-x-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>Share a Wish</span>
        </div>
      </button>
      <p className="text-xs opacity-60 mt-4">Your wish disappears automatically after 24 hours.</p>
    </div>
  );
};
