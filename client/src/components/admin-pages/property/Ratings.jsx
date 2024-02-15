import React from 'react';

const Rating = ({ rating }) => {
  // Round the rating to the nearest half star
  const roundedRating = Math.round(rating * 2) / 2;

  // Calculate the number of filled stars
  const filledStars = Math.floor(roundedRating);
  
  // Calculate the number of half stars
  const hasHalfStar = roundedRating - filledStars >= 0.5;

  // Array to store JSX elements for filled stars
  const filledStarsArray = Array.from({ length: filledStars }, (_, index) => (
    <span key={index} className="star filled">&#9733;</span>
  ));

  // Fill half star if applicable
  const halfStar = hasHalfStar && <span className="star half-filled">&#9733;</span>;

  // Fill remaining stars with empty stars
  const emptyStarsArray = Array.from({ length: 5 - filledStars - (hasHalfStar ? 1 : 0) }, (_, index) => (
    <span key={index} className="star">&#9733;</span>
  ));

  return (
    <div>
      {filledStarsArray}
      {halfStar}
      {emptyStarsArray}
    </div>
  );
};

export default Rating;
