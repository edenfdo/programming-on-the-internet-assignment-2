import { useState } from "react";

function CardStack({
  title,
  description,
  terms,
  startIndex = 0
}) {
  const [currentIndex, setCurrentIndex] =
    useState(startIndex);

  const [flipped, setFlipped] =
  useState(false);

  
  

  const hasCards =
    terms && terms.length > 0;

  const currentCard = hasCards
    ? terms[currentIndex]
    : null;

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

      <div className="set-card-title">
        {title}
      </div>

      <div className="set-card-description">
        {description}
      </div>

      <div className="study-card-container">

        <div
          className={`study-card ${
            flipped ? "flipped" : ""
          }`}
          onClick={() =>
            setFlipped(!flipped)
          }
        >
          <span className="study-card-label">
            {flipped
              ? "Definition"
              : "Term"}
          </span>

          <div className="study-card-content">
            {flipped
              ? currentCard.definition
              : currentCard.term}
          </div>

          <p className="study-card-hint">
            Click card to flip
          </p>
        </div>

      </div>

      <div className="stack-navigation-row">

        <button
          className="stack-nav-button"
          onClick={prevCard}
        >
          ← Previous
        </button>

        <span className="stack-counter">
          {currentIndex + 1} /{" "}
          {terms.length}
        </span>

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