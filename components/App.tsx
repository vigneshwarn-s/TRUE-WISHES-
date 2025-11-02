
import React, { useState, useEffect, useCallback } from 'react';
import type { Comment } from '../types';
import { UploadView } from './UploadView';
import { PhotoCard } from './PhotoCard';
import { ExpiredMessage } from './ExpiredMessage';

const EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

// AI-generated captions simulation with a party/wish theme
const aiCaptions = [
  "✨ Making a wish come true!",
  "🎉 A moment of pure joy!",
  "💖 Sending good vibes your way.",
  "🥳 Celebrating this wonderful memory.",
  "🎁 A gift of a moment, captured for a day.",
  "🌟 Shine bright and make your wish!",
  "🎈 Hope this brings a smile to your face."
];

const getRandomCaption = () => aiCaptions[Math.floor(Math.random() * aiCaptions.length)];

function App() {
  const [photoDataUrl, setPhotoDataUrl] = useState<string | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [uploadTimestamp, setUploadTimestamp] = useState<number | null>(null);
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [aiCaption, setAiCaption] = useState<string>('');
  const [likeLimit, setLikeLimit] = useState<number | null>(null);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [timeToGoal, setTimeToGoal] = useState<number | null>(null);
  
  const clearData = useCallback(() => {
    localStorage.removeItem('photoShareData');
    setPhotoDataUrl(null);
    setLikes(0);
    setComments([]);
    setUploadTimestamp(null);
    setLikeLimit(null);
    setTimeToGoal(null);
    setIsExpired(true);
  }, []);

  // Effect to load data from localStorage on initial mount and check for expiration
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('photoShareData');
      if (savedData) {
        const { photoDataUrl, likes, comments, timestamp, caption, likeLimit, timeToGoal } = JSON.parse(savedData);
        if (Date.now() - timestamp > EXPIRATION_TIME) {
          clearData();
        } else {
          setPhotoDataUrl(photoDataUrl);
          setLikes(likes);
          setComments(comments);
          setUploadTimestamp(timestamp);
          setAiCaption(caption);
          setLikeLimit(likeLimit);
          setTimeToGoal(timeToGoal || null);
        }
      }
    } catch (error) {
      console.error("Failed to parse data from localStorage", error);
      clearData();
    }
  }, [clearData]);

  // Effect to handle automatic expiration while the app is open
  useEffect(() => {
    if (!uploadTimestamp) return;

    const timeSinceUpload = Date.now() - uploadTimestamp;
    if (timeSinceUpload >= EXPIRATION_TIME) {
      clearData();
      return;
    }

    const expirationTimer = setTimeout(() => {
      clearData();
    }, EXPIRATION_TIME - timeSinceUpload);

    return () => clearTimeout(expirationTimer);
  }, [uploadTimestamp, clearData]);

  // Effect to save data to localStorage whenever it changes
  useEffect(() => {
    if (photoDataUrl && uploadTimestamp && aiCaption) {
      const dataToSave = {
        photoDataUrl,
        likes,
        comments,
        timestamp: uploadTimestamp,
        caption: aiCaption,
        likeLimit,
        timeToGoal
      };
      localStorage.setItem('photoShareData', JSON.stringify(dataToSave));
    }
  }, [photoDataUrl, likes, comments, uploadTimestamp, aiCaption, likeLimit, timeToGoal]);


  const handlePhotoUpload = (file: File, limit: number) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const newTimestamp = Date.now();
      
      setPhotoDataUrl(dataUrl);
      setUploadTimestamp(newTimestamp);
      setLikes(0);
      setComments([]);
      setIsExpired(false);
      setAiCaption(getRandomCaption());
      setLikeLimit(limit);
      setTimeToGoal(null);
    };
    reader.readAsDataURL(file);
  };

  const handleLike = () => {
    setLikes(prevLikes => {
      const newLikes = prevLikes + 1;
      // The notification should only fire ONCE when the goal is first met.
      if (likeLimit !== null && newLikes === likeLimit) { 
        setToastMessage('Congratulations! Your wish reached its goal! 🎉');
        setTimeout(() => setToastMessage(''), 3000); // Hide after 3s
        if (uploadTimestamp) {
          const durationInSeconds = Math.round((Date.now() - uploadTimestamp) / 1000);
          setTimeToGoal(durationInSeconds);
        }
      }
      return newLikes;
    });
  };
  
  const handleAddComment = (commentText: string) => {
    if (commentText.trim()) {
      const newComment: Comment = {
        id: Date.now(),
        text: commentText,
      };
      setComments(prevComments => [...prevComments, newComment]);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-400 flex items-center justify-center p-4 font-sans">
      {toastMessage && (
        <div className="fixed top-5 right-5 bg-green-500 text-white py-2 px-4 rounded-lg shadow-lg z-50 animate-fade-in-down">
          {toastMessage}
        </div>
      )}
      <main className="w-full max-w-md mx-auto">
        {isExpired && <ExpiredMessage onReset={() => setIsExpired(false)} />}
        {!photoDataUrl && !isExpired && <UploadView onPhotoUpload={handlePhotoUpload} />}
        {photoDataUrl && !isExpired && (
          <PhotoCard
            photoDataUrl={photoDataUrl}
            aiCaption={aiCaption}
            likes={likes}
            comments={comments}
            likeLimit={likeLimit}
            timeToGoal={timeToGoal}
            onLike={handleLike}
            onAddComment={handleAddComment}
          />
        )}
      </main>
    </div>
  );
}

export default App;