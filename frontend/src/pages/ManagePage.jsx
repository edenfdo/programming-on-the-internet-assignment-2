import FlashcardForm from "../components/FlashcardForm";
import "../styles/manage.css";

function ManagePage(props) {

  console.log("showPopup:", props.showPopup);
  console.log("popupTitle:", props.popupTitle);
  return (
    <div
      className={`manage-page ${
        props.darkMode ? "dark" : ""
      }`}
    >
    

      <header className="manage-header">
        <button
          className="back-button"
          onClick={() =>
            props.setCurrentView("landing")
          }
        >
          ← Back
        </button>
        <h1>Create Flashcard Set</h1>
      </header>

      <main className="manage-container">
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

export default ManagePage;