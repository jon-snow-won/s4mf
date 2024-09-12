export const parseJson = (str: string) => {
    try {
        return JSON.parse(JSON.stringify(str))
    } catch (e) {
        return null
    }
}
