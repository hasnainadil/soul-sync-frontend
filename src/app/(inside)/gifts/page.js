'use client';

import { useState, useEffect } from "react";

export default function CardsPage() {
  const [redeemedCards] = useState([
    { id: 1, name: "Mood Booster Card", image: "https://wallpapers.com/images/featured/goku-super-saiyan-pictures-dm8zixw58guf3x1b.jpg" },
    { id: 2, name: "Work Efficiency Card", image: "https://preview.redd.it/d6x82jw2bcf71.png?width=1080&crop=smart&auto=webp&s=7d9af062f8dace23c3978f09c096590e30ca3f5c" },
    { id: 3, name: "Mindfulness Card", image: "https://mir-s3-cdn-cf.behance.net/projects/404/4ef57a198155957.Y3JvcCw0MTY3LDMyNTksMCw0NTM.jpg" },
    { id: 4, name: "Focus Enhancement Card", image: "https://www.shutterstock.com/image-illustration/rain-ourside-beautiful-chill-atmospheric-600nw-2320274447.jpg" },
    { id: 5, name: "Creative Spark Card", image: "https://preview.redd.it/hwyb-yami-sukehiro-from-black-clover-v0-4yl1syfh9lg91.jpg?width=1080&crop=smart&auto=webp&s=22b18a2459f96b518885f7a49d657c2e25516188" },
  ]);

  const [visibleCards, setVisibleCards] = useState([]);

  useEffect(() => {
    // Gradually make each card visible
    const timer = setTimeout(() => {
      setVisibleCards(redeemedCards.map((_, index) => index));
    }, 100);
    return () => clearTimeout(timer);
  }, [redeemedCards]);

  return (
    <div className="min-h-screen bg-primary p-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Cards Gallery</h1>

      {/* All Cards Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Redeemed Cards</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {redeemedCards.map((card, index) => (
            <div
              key={card.id}
              className={`flex flex-col items-center bg-white shadow-md rounded-lg overflow-hidden transition-opacity duration-1000 ease-in-out ${
                visibleCards.includes(index) ? "opacity-100" : "opacity-0"
              }`}
            >
              <img
                src={card.image}
                alt={card.name}
                className="w-full h-40 object-cover"
              />
              <p className="text-lg font-medium text-gray-700 p-2">{card.name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
