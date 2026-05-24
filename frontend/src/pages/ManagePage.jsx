import FlashcardForm from "../components/FlashcardForm";

function ManagePage(props) {
  return (
    <div className={`wrapper ${props.darkMode ? "dark" : ""}`}>
      <div className="manage-topbar">
        <button
          className="back-button"
          onClick={() => props.setCurrentView("landing")}
        >
          ← Back
        </button>
      </div>

      <h1>Cardio</h1>
      <p>Flash Card Creation Website</p>

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
    </div>
  );
}

export default ManagePage;