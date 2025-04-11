interface PaginationProps {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

const Pagination = ({
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: PaginationProps) => {
  const renderPageNumbers = () => {
    const pageButtons = [];
    const maxButtons = 5;
    const half = Math.floor(maxButtons / 2);

    let start = Math.max(1, currentPage - half);
    let end = Math.min(totalPages, currentPage + half);

    if (currentPage <= half) {
      end = Math.min(totalPages, maxButtons);
    }

    if (currentPage + half > totalPages) {
      start = Math.max(1, totalPages - maxButtons + 1);
    }

    if (start > 1) {
      pageButtons.push(
        <button
          key="first"
          className="btn btn-outline-secondary"
          onClick={() => onPageChange(1)}
        >
          1
        </button>
      );
      if (start > 2) {
        pageButtons.push(<span key="start-ellipsis" className="mx-1">...</span>);
      }
    }

    for (let i = start; i <= end; i++) {
      pageButtons.push(
        <button
          key={i}
          className={` ${currentPage === i ? 'paginationActive' : 'paginationNonActive'}`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }

    if (end < totalPages) {
      if (end < totalPages - 1) {
        pageButtons.push(<span key="end-ellipsis" className="mx-1">...</span>);
      }
      pageButtons.push(
        <button
          key="last"
          className="btn btn-outline-secondary"
          onClick={() => onPageChange(totalPages)}
        >
          {totalPages}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="pagination-container d-flex flex-column align-items-center mt-4 gap-3">
      <div className="pagination-buttons btn-group flex-wrap" role="group" aria-label="Pagination Buttons">
        <button
          className="pagination-btn"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Previous
        </button>
  
        {renderPageNumbers()}
  
        <button
          className="pagination-btn"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
  
      <div className="d-flex align-items-center mt-2">
        <label className="me-2">Results per page:</label>
        <select
          className="pagination-select"
          value={pageSize}
          onChange={(e) => {
            onPageSizeChange(Number(e.target.value));
            onPageChange(1); // Reset to first page
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="12">12</option>
          <option value="20">20</option>
        </select>
      </div>
    </div>
  );
  
};

export default Pagination;
