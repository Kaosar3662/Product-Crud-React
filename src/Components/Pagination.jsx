import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (currentPage === totalPages) {
    return;
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePageClick = (page) => {
    if (page !== currentPage) {
      onPageChange(page);
    }
  };

  return (
    <div className="flex gap-2 items-center justify-center max-w-full">
      {/* Prev Button */}
      <button
        onClick={handlePrev}
        disabled={currentPage === 1}
        className={`px-2 py-1 border rounded transition-colors
          ${
            currentPage === 1
              ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
              : 'bg-black text-white hover:bg-blue-600 cursor-pointer'
          }`}
      >
        Prev
      </button>

      {/* Page Buttons */}
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => handlePageClick(page)}
          className={`px-2 py-1 min-w-8.5 border rounded transition-colors
            ${
              page === currentPage
                ? 'bg-blue-600 text-white font-bold cursor-default'
                : 'bg-black text-white hover:bg-blue-600 cursor-pointer'
            }`}
          disabled={page === currentPage}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className={`px-2 py-1 border rounded transition-colors
          ${
            currentPage === totalPages
              ? 'bg-gray-300 text-gray-500 opacity-50 cursor-not-allowed'
              : 'bg-black text-white hover:bg-blue-600 cursor-pointer'
          }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
