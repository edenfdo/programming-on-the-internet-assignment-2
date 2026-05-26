import { useState } from "react";

function CardStack({
  title,
  description,
  terms,
  startIndex = 0
}) {
  // State variables

  // Currently displayed card
  const [currentIndex, setCurrentIndex] =
    useState(startIndex);

  // Whether the card is flipped or not
  const [flipped, setFlipped] =
  useState(false);

  // Checks if terms exists and has at least one card
  const hasCards =
    terms && terms.length > 0;

  const safeIndex = hasCards
    ? Math.min(currentIndex, terms.length - 1)
    : 0;

  const currentCard = hasCards
    ? terms[safeIndex]
    : null;

  // Navigation functions
  const nextCard = () => {
    setFlipped(false);

    setCurrentIndex(
      (prev) =>
        (prev + 1) % terms.length
    );
  };

  const prevCard = () => {
    setFlipped(false);

    setCurrentIndex(
      (prev) =>
        (prev - 1 + terms.length) %
        terms.length
    );
  };

  // If there are no cards
  if (!hasCards) {
    return (
      <div className="set-card-stack">
        <div className="set-card-title">
          {title}
        </div>

        <div className="set-card-description">
          {description}
        </div>

        <div className="empty-set-message">
          No flashcards available.
        </div>
      </div>
    );
  }

  return (
    <div className="set-card-stack">

      {/* Title and Description */}
      <div className="set-card-title">
        {title}
      </div>

      <div className="set-card-description">
        {description}
      </div>

      {/* Flashcard display */}
      <div className="study-card-container">

        {/* The card */}
        <div
          className={`study-card ${
            flipped ? "flipped" : ""
          }`}
          onClick={() =>
            setFlipped(!flipped)
          }
        >
          {/* Displays whether it is a term or definition */}
          <span className="study-card-label">
            {flipped
              ? "Definition"
              : "Term"}
          </span>
            
          {/* Card content */}
          <div className="study-card-content">
            {flipped
              ? currentCard.definition
              : currentCard.term}
          </div>
          
          {/* Hint to users */}
          <p className="study-card-hint">
            Click card to flip
          </p>
        </div>

      </div>

      {/* Navigation buttons */}
      <div className="stack-navigation-row">

        {/* Back button */}
        <button
          className="stack-nav-button"
          onClick={prevCard}
        >
          ← Previous
        </button>
        
        {/* Stack count */}
        <span className="stack-counter">
          {safeIndex + 1} /{" "}
          {terms.length}
        </span>
        
        {/* Next button */}
        <button
          className="stack-nav-button"
          onClick={nextCard}
        >
          Next →
        </button>

      </div>

    </div>
  );
}

export default CardStack;