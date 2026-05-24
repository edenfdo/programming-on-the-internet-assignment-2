function Popup({
  show,
  message,
  onClose
}) {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h3>Oops!</h3>

        <p>{message}</p>

        <button
          className="popup-close"
          onClick={onClose}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}

export default Popup;