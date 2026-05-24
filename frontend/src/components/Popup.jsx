function Popup({
  show,
  title,
  message,
  buttonText,
  onClose
}) {
  if (!show) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-box">
        <h2>{title}</h2>

        <p>{message}</p>

        <button
          className="popup-close"
          onClick={onClose}
        >
          {buttonText}
        </button>
      </div>
    </div>
  );
}

export default Popup;