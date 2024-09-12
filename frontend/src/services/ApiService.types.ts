export type ApiPagination = {
    number: number
    size: number
    totalElements?: number
    totalPages?: number
}

export enum ApiErrorMessage {
    auth = 'Ошибка авторизации!',
    json = 'JSON response parsing error',
    string = 'String api response error',
    null = 'Null api response error',
    client = 'Client unresolved error',
    server = 'Server unresolved error',
}
