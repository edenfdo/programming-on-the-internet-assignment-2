// imports flashcard form componenet
import FlashcardForm from "../components/FlashcardForm";

// imports css file
import "../styles/create.css";

function CreateSetPage(props) {
  return (
    <div
      className={`manage-page ${
        props.darkMode ? "dark" : ""
      }`}
    >
    

      <header className="manage-header">
        {/* Back button */}
        <button
          className="back-button"
          onClick={() =>
            props.setCurrentView("landing")
          }
        >
          ← Back
        </button>

        {/* Page Title */}
        <h1>Create Flashcard Set</h1>
      </header>

      <main className="manage-container">
        {/* Renders flashcard component */}
        <FlashcardForm
          title={props.title}
          setTitle={props.setTitle}
          description={props.description}
          setDescription={props.setDescription}
          terms={props.terms}
          setTerms={props.setTerms}
          addTerm={props.addTerm}
          deleteTerm={props.deleteTerm}
          submitForm={props.submitForm}
        />
      </main>
    </div>
  );
}

export default CreateSetPage;