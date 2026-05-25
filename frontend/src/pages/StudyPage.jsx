// imports card stack componenet
import CardStack from "../components/CardStack";

// imports css file
import "../styles/study.css";

function StudyPage({
  savedSets,
  selectedStudySetId,
  selectedCardIndex,
  setSelectedCardIndex,
  setSelectedStudySetId,
  setCurrentView,
  recordHistory
}) {

  // finds selected set
  const selectedSet = savedSets.find(
    (set) => String(set.id) === selectedStudySetId
  );

  const safeIndex = selectedSet
    ? Math.min(
        selectedCardIndex,
        selectedSet.terms.length - 1
      )
    : 0;


  return (
    
    <div className="study-page">

      <div className="study-header">

        {/* Back buttion */}
        <button
          className="back-button"
          onClick={() => {
            setSelectedStudySetId("");
            setSelectedCardIndex(0);
            setCurrentView("landing");
          }}
        >
          ← Back
        </button>
        
        {/* Page title */}
        <div className="pagetitle">
          Study Flashcards
        </div>
      </div>

      <div className="study-selector-container">
        {/* Dropdown */}
        <select
          className="study-dropdown"
          value={selectedStudySetId}
          onChange={(e) => {
            const selectedId = e.target.value;

            setSelectedStudySetId(selectedId);

            // Always start from card 1 when opening a set
            setSelectedCardIndex(0);

            const selectedSet = savedSets.find(
              (set) => String(set.id) === selectedId
            );

            if (selectedSet) {
              recordHistory(
                selectedSet.title,
                "studied"
              );
            }
          }}
        >
          {/* Dropdown options */}
          <option value="">
            Select a flashcard set
          </option>

          {savedSets.map((set) => (
            <option
              key={set.id}
              value={set.id}
            >
              {set.title}
            </option>
          ))}
        </select>
      </div>

      {selectedSet && (
        <div className="study-card-container">
          {/* Renders card stack component */}
          <CardStack
            key={selectedStudySetId}
            title={selectedSet.title}
            description={selectedSet.description}
            terms={selectedSet.terms}
            startIndex={safeIndex}
          />
        </div>
      )}

    </div>
  );
}

export default StudyPage;