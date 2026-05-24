function SearchBar({
  value,
  onChange,
  placeholder = "Search all flashcards..."
}) {
  return (
    <div className="global-search-container">
      <input
        type="text"
        className="global-search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;