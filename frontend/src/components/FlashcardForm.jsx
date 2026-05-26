import { useRef, useEffect } from "react";

function FlashcardForm({
  title,
  setTitle,
  description,
  setDescription,
  terms,
  setTerms,
  addTerm,
  deleteTerm,
  submitForm
}) {

  // Points to the last card in the list
  const newestCardRef = useRef(null);

  // Points to the term input inside the newest card
  const newestTermInputRef = useRef(null);

  // Auto‑scroll when a new card is added
  useEffect(() => {
    newestCardRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, [terms.length]);

  // adding cards
  const handleAddCard = () => {
    addTerm();

    setTimeout(() => {
      newestTermInputRef.current?.focus();

      newestTermInputRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 0);
  };
  return (
    <div className="flashcard-form">

      {/* Deck Information */}
      <section className="form-section">

        {/* Page Title */}
        <h2>Deck Information</h2>

        <div className="field">
          <label>Title</label>
          {/* Title input */}
          <input
            type="text"
            placeholder="What would you like to name this set?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Description input */}
        <div className="field">
          <label>Description</label>
          <textarea
            placeholder="What does this flashcard set cover?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </section>

      {/* Terms */}
      <section className="form-section">
        <div className="section-header">
          <h2>Flashcards</h2>
          <span>{terms.length} cards</span>
        </div>
        
        {/* Loops through all cards */}
        {terms.map((item, index) => (
          <div
            key={index}
            ref={
              index === terms.length - 1
                ? newestCardRef
                : null
            }
            className="term-card"
          >
            <div className="card-header">

              {/* Card heading */}
              <h3>Card {index + 1}</h3>

              {/* Delete Button */}
                <button
                  className="delete-btn"
                  onClick={() => deleteTerm(index)}
                >
                  {/* trash can */}
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6l-1 14H6L5 6" />
                    <path d="M10 11v6" />
                    <path d="M14 11v6" />
                    <path d="M9 6V4h6v2" />
                  </svg>
                </button>
              
            </div>

            <div className="card-body">

              {/* Term input */}
              <div className="input-panel">
                <label>Term</label>

                <input
                  ref={
                    index === terms.length - 1
                      ? newestTermInputRef
                      : null
                  }
                  type="text"
                  placeholder="Fill in the term"
                  value={item.term}
                  onChange={(e) => {
                    const updated = [...terms];
                    updated[index].term = e.target.value;
                    setTerms(updated);
                  }}
                />
              </div>
              
              {/* Definition input */}
              <div className="input-panel">
                <label>Definition</label>

                <textarea
                  placeholder="Fill in the definition"
                  value={item.definition}
                  onChange={(e) => {
                    const updated = [...terms];
                    updated[index].definition = e.target.value;
                    setTerms(updated);
                  }}
                />
              </div>

            </div>
          </div>
        ))}

        {/* Add flashcard button */}
        <button
          className="add-card-btn"
          onClick={handleAddCard}
        >
          + Add Flashcard
        </button>
      </section>
      
      {/* Save flashcard set button */}
      <button
        className="save-btn"
        onClick={submitForm}
      >
        Save Flashcard Set
      </button>
    </div>
  );
}

export default FlashcardForm;