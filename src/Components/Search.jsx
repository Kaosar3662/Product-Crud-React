/* eslint-disable react-hooks/immutability */
import { useState } from "react";

const Search = ({ searchTerm, onSearch }) => {
    const [localTerm, setLocalTerm] = useState(searchTerm);
  let timer;

  const handleDebounce = (e) => {
    setLocalTerm(e.target.value)
    clearTimeout(timer);

    timer = setTimeout(() => {
      onSearch(e.target.value);
    }, 800);
  };

  return (
    <input
      type="text"
      value={localTerm}
      onChange={handleDebounce}
      placeholder="Search products..."
      className="border rounded px-3 py-2 w-full"
      aria-label="Search products"
    />
  );
};

export default Search;