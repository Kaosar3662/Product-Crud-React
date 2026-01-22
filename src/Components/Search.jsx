import React, { useCallback } from "react";

const Search = ({ searchTerm, onSearch }) => {

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      onSearch(value);
    },
    [onSearch]
  );

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={handleChange}
      placeholder="Search products..."
      className="border rounded px-3 py-2 w-full"
      aria-label="Search products"
    />
  );
};

export default Search;