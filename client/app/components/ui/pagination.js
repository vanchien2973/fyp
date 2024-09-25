import React from 'react';
import { Button } from './button';

const Pagination= ({ currentPage, totalPages, onPageChange }) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button 
          key={i} 
          onClick={() => onPageChange(i)}
          variant={i === currentPage ? "default" : "outline"}
          className="mx-1"
        >
          {i}
        </Button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-6">
      <Button 
        onClick={handlePrevious} 
        disabled={currentPage === 1}
        variant="outline"
      >
        Previous
      </Button>
      
      <div className="flex">
        {renderPageNumbers()}
      </div>

      <Button 
        onClick={handleNext} 
        disabled={currentPage === totalPages}
        variant="outline"
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
