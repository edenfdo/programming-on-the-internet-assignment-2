function SearchBar({
  value,
  onChange,
  placeholder = "Search all flashcards..."
}) {
  return (
    // Search input
    <div className="global-search-container">
      <input
        type="text"
        className="global-search-input"
        placeholder={placeholder}
        value={value}
        // Runs whenever the user types
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;