"use client";

import { useState } from "react";

interface PortfolioItem {
  id: string;
  img: string;
  [key: string]: any;
}

interface WorksCarouselProps {
  items: PortfolioItem[];
  onSelect: (item: PortfolioItem) => void;
}

export default function WorksCarousel({ items, onSelect }: WorksCarouselProps) {
  const [isPaused, setIsPaused] = useState(false);

  // Duplicate items for seamless infinite loop
  const displayItems = [...items, ...items];

  return (
    <div
      className="carousel-container"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div
        className="carousel-track"
        style={{ animationPlayState: isPaused ? 'paused' : 'running' }}
      >
        {displayItems.map((item, i) => (
          <div
            key={`carousel-${item.id}-${i}`}
            className="carousel-card"
            onClick={() => onSelect(item)}
          >
            <img
              src={item.img}
              alt={`Project ${item.id}`}
              loading="lazy"
              draggable={false}
            />
            <div className="carousel-card-overlay">
              <div className="carousel-card-label">
                <span className="carousel-card-index">
                  {String(parseInt(item.id)).padStart(2, '0')}
                </span>
                <span className="carousel-card-action">View Project →</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
