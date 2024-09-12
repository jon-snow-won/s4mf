export interface NodeSearchParamsType {
    key: string
    fullPath: string
    fullText: string
    nodeList: NodeListOf<Element>
    system: string
}

export type CommentModifyType = {
    text: string
    author: string
    date: string
    objectId: string
    nodeRect: DOMRect
}

export type CommentModeType = 'comment' | null

export type SelectedTextInfoType = {
    selectedText: string
    selectorPath: string
    nodeText: string
    nodeRect: DOMRect
}
