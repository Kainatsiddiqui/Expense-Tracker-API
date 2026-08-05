type PaginationProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  limit: number;
  onPageChange: (page: number) => void;
};

function Pagination({
  page,
  totalPages,
  totalItems,
  limit,
  onPageChange,
}: PaginationProps) {
  const startItem =
    totalItems === 0
      ? 0
      : (page - 1) * limit + 1;

  const endItem = Math.min(
    page * limit,
    totalItems
  );

  function getVisiblePages() {
    const pages: (number | string)[] = [];
    const windowSize = 2; // pages before and after current

    const start = Math.max(
        2,
        page - windowSize
    );
    const end = Math.min(
        totalPages - 1,
        page + windowSize
    );

    pages.push(1);

    if (start > 2) {
        pages.push("...");
    }

    for (
        let i = start;
        i <= end;
        i++
        ) {
        pages.push(i);
    }

    if (end < totalPages - 1) {
        pages.push("...");
    }

    if (totalPages > 1) {
        pages.push(totalPages);
    }

    return pages;

    }
    const visiblePages = getVisiblePages();

  return (
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-2 mt-2">
            <p className="text-sm text-gray-600">
                Showing  {startItem}-{endItem} of {totalItems} expenses
            </p>

            <div className="flex-wrap justify-center sm:justify-end text-xs">
                <button
                onClick={() =>
                    onPageChange(page - 1)
                }
                disabled={page === 1}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                Previous
                </button>
                {visiblePages.map( 
                    (item, index) => 
                        item === "..." ? ( 
                        <span 
                            key={`ellipsis-${index}`} 
                            className="px-2 text-gray-400" 
                        > 
                            ... 
                        </span> 
                    ) : ( 
                    <button 
                        key={item} 
                        onClick={() => 
                            onPageChange( 
                                item as number 
                            ) 
                        } 
                        className={`min-w-[40px] h-10 rounded-lg text-sm font-medium transition-colors ${ 
                            page === item 
                                ? "bg-blue-600 text-white" 
                                : "border border-gray-200 text-gray-700 hover:bg-gray-50" 
                            }`} 
                    > 
                        {item} 
                    </button> 
                    ) 
                )}
                <button 
                    onClick={() => 
                        onPageChange(page + 1) 
                    } 
                    disabled={ 
                        page === totalPages 
                    } 
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed" 
                > 
                    Next 
                </button> 
            </div> 
        </div>
    );
}

export default Pagination;