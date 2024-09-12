interface Pageable {
    totalElements: number
    totalPages: number
    number: number
    numberOfElements: number
    size: number
    first: boolean
    last: boolean
    empty: boolean
    sort: any[]
    pageable: {
        sort: string[]
        pageNumber: number
        pageSize: number
        offset: number
        paged: boolean
        unpaged: boolean
    }
}

interface CommentBodyBaseParams {
    updateDate: string // "2023-12-08T08:07:35.783+00:00"
    idDeleted: boolean
    externalId: string
    id: number
    authorId: string
    createDate: string // "2023-12-08T08:07:35.783+00:00"
    status: null
}

export interface CommentBody extends CommentBodyBaseParams {
    author: string
    comment: string
    date: string // "2023-01-01 00:00:00
    fullpath: string
    fulltext: string
    key: string
    left: string
    node: string
    right: string
    system: string
    externalId: string
}

export interface Comment {
    tableName: 'Comment'
    id: string
    data: CommentBody
}

export interface FetchCommentServiceResponse extends Pageable {
    content: Comment[]
}
