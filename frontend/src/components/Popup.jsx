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
        <div className="popup-box-title">{title}</div>

        <div className="popup-box-message">{message}</div>

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