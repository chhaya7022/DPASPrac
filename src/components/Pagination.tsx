
import React from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  ChevronsLeft, 
  ChevronsRight,
  MoreHorizontal
} from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  // Calculate visible page numbers (max 6)
  const getVisiblePages = () => {
    const maxVisiblePages = 6;
    
    // If total pages is less than or equal to maxVisiblePages, show all pages
    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    // Always include first and last page
    const visiblePages = [1];
    
    // Calculate middle range based on current page
    let startPage = Math.max(2, currentPage - 2);
    let endPage = Math.min(totalPages - 1, startPage + 3);
    
    // Adjust if we're near the end
    if (endPage === totalPages - 1) {
      startPage = Math.max(2, endPage - 3);
    }
    
    // Add ellipsis before middle range if needed
    if (startPage > 2) {
      visiblePages.push(-1); // -1 represents ellipsis
    }
    
    // Add middle range
    for (let i = startPage; i <= endPage; i++) {
      visiblePages.push(i);
    }
    
    // Add ellipsis after middle range if needed
    if (endPage < totalPages - 1) {
      visiblePages.push(-2); // -2 represents ellipsis
    }
    
    // Add last page
    visiblePages.push(totalPages);
    
    return visiblePages;
  };

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        className="p-2 rounded-md hover:bg-gray-200"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>
      <button
        className="p-2 rounded-md hover:bg-gray-200"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
      
      {getVisiblePages().map((page, index) => (
        page < 0 ? (
          <span 
            key={`ellipsis-${page}`} 
            className="w-8 h-8 flex items-center justify-center"
          >
            <MoreHorizontal className="h-4 w-4 text-gray-400" />
          </span>
        ) : (
          <button
            key={`page-${page}`}
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentPage === page
                ? "bg-blue-100 text-blue-600"
                : "hover:bg-gray-200"
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        )
      ))}
      
      <button
        className="p-2 rounded-md hover:bg-gray-200"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </button>
      <button
        className="p-2 rounded-md hover:bg-gray-200"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default Pagination;
