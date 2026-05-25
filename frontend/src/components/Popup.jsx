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
        {/* Popup title */}
        <div className="popup-box-title">{title}</div>

        {/* Popup message */}
        <div className="popup-box-message">{message}</div>

        {/* Button to close popup */}
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