export const getDataFromMockedArray = (dataArray: any, pageNumber = 0, pageSize = 10) => {
    const startIndex = pageNumber * pageSize
    const endIndex = startIndex + pageSize

    const currentPageData = dataArray.slice(startIndex, endIndex)

    return {
        data: currentPageData,
        totalPages: Math.ceil(dataArray.length / pageSize),
        totalElements: dataArray.length,
    }
}
