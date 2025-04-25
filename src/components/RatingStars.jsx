import React, { useEffect, useState } from 'react';

const RatingStars = ({ movieId, onRate, initialRating = 0 }) => {
  const [hovered, setHovered] = useState(0);
  const [rating, setRating] = useState(initialRating);

  useEffect(() => {
    setRating(initialRating);
  }, [initialRating]);

  const handleClick = (value) => {
    setRating(value);
    onRate(movieId, value);
  };

  return (
    <div className="d-flex justify-content-center gap-2">
      {[1, 2, 3, 4, 5].map((val) => (
        <i
          key={val}
          className={`bi ${
            val <= (hovered || rating) ? 'bi-star-fill' : 'bi-star'
          } text-warning`}
          onClick={() => handleClick(val)}
          onMouseEnter={() => setHovered(val)}
          onMouseLeave={() => setHovered(0)}
          style={{ cursor: 'pointer', fontSize: '1.2rem' }}
        ></i>
      ))}
    </div>
  );
};

export default RatingStars;
