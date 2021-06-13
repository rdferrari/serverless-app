function Pagination({ next, prev }) {

    return (
        <div>
            <button
                onClick={prev}
            >
                <span>Previous</span>
            </button>
            <button
                onClick={next}
            >
                <span>Next</span>

            </button>
        </div>
    )
}

export default Pagination;