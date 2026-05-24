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
  return (
    <div className="form-wrapper">
      <div className="form-container">

        <div className="title-description-grid">

          <div className="grid-item">
            <label className="input-label">
              Title
            </label>

            <input
              className="title-input"
              type="text"
              placeholder="Enter your title e.g. Biology Chapter 5"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
            />
          </div>

          <div className="grid-item">
            <label className="input-label">
              Description
            </label>

            <textarea
              className="description-input"
              placeholder="Describe what this flashcard set covers..."
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />
          </div>

        </div>

        <div className="terms-list">
          {terms.map((item, index) => (
            <div
              key={index}
              className="term-row"
            >
              <div className="term-number">
                {index + 1}
              </div>

              <input
                className="term-input"
                placeholder="Term"
                value={item.term}
                onChange={(e) => {
                  const updated = [...terms];
                  updated[index].term = e.target.value;
                  setTerms(updated);
                }}
              />

              <textarea
                className="description-input"
                placeholder="Definition"
                value={item.definition}
                onChange={(e) => {
                  const updated = [...terms];
                  updated[index].definition =
                    e.target.value;
                  setTerms(updated);
                }}
              />

              <button
                className={`delete-term-button ${
                  terms.length > 1 ? "" : "hide"
                }`}
                onClick={() =>
                  deleteTerm(index)
                }
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        <div className="form-footer">
          <button
            className="add-term-button"
            onClick={addTerm}
          >
            +
          </button>

          <button
            className="done-button"
            onClick={submitForm}
          >
            Save Set
          </button>
        </div>

      </div>
    </div>
  );
}

export default FlashcardForm;