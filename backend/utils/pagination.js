/**
 * Reusable pagination utility
 * @param {Object} query - Express request query object
 * @param {number} defaultLimit - Default number of items per page
 * @returns {Object} { page, limit, skip, getMetadata }
 */
const paginate = (query, defaultLimit = 10) => {
    const page = Math.abs(parseInt(query.page)) || 1;
    const limit = Math.abs(parseInt(query.limit)) || defaultLimit;
    const skip = (page - 1) * limit;

    /**
     * Generates pagination metadata
     * @param {number} totalCount - Total number of documents
     * @returns {Object} Metadata object
     */
    const getMetadata = (totalCount) => {
        const totalPages = Math.ceil(totalCount / limit);
        return {
            total: totalCount,
            totalPages,
            currentPage: page,
            itemsPerPage: limit,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        };
    };

    return { page, limit, skip, getMetadata };
};

module.exports = paginate;
