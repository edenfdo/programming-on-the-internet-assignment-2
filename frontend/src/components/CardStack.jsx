import { useState } from "react";

function CardStack({ title, description, terms }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);

  const hasCards = terms && terms.length > 0;
  const currentCard = hasCards
    ? terms[currentIndex]
    : null;

  const nextCard = (e) => {
    e.stopPropagation();
    setFlipped(false);

    setCurrentIndex(
      (prev) => (prev + 1) % terms.length
    );
  };

  const prevCard = (e) => {
    e.stopPropagation();
    setFlipped(false);

    setCurrentIndex(
      (prev) =>
        (prev - 1 + terms.length) %
        terms.length
    );
  };

  return (
    <div className="set-card-stack">
      <h3 className="set-card-title">
        {title}
      </h3>

      <p className="set-card-description">
        {description}
      </p>

      {hasCards ? (
        <div className="stack-inner-container">

          <div className="stack-perspective-wrapper">
            <div className="stack-bg-layer-1"></div>
            <div className="stack-bg-layer-2"></div>

            <div
              className={`main-flashcard ${
                flipped ? "flipped" : ""
              }`}
              onClick={() =>
                setFlipped(!flipped)
              }
            >
              <span className="card-side-indicator">
                {flipped
                  ? "Definition"
                  : "Term"}
              </span>

              <strong className="card-text-content">
                {flipped
                  ? currentCard.definition
                  : currentCard.term}
              </strong>
            </div>
          </div>

          <div className="stack-navigation-row">
            <button
              className="stack-nav-button"
              onClick={prevCard}
            >
              ← Back
            </button>

            <span className="stack-counter">
              {currentIndex + 1} / {terms.length}
            </span>

            <button
              className="stack-nav-button"
              onClick={nextCard}
            >
              Next →
            </button>
          </div>

        </div>
      ) : (
        <p className="empty-set-message">
          No matching flashcards found.
        </p>
      )}
    </div>
  );
}

export default CardStack;