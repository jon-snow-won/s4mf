import { format, parse } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Ref } from 'react'

import { excludedClasses } from '@components/comments/const'
import { NodeCacheValueType } from '@hooks/useComments'
import { CommentModifyType, NodeSearchParamsType } from '@hooks/useComments.types'
import { CommentBody } from '@services/CommentService.types'

export const renderComments = async (
    comments: CommentBody[],
    onCompleted: () => void,
    initialLoadCompleted: boolean,
    onHover: (node: Node, commentData: CommentModifyType) => void,
    currentSystem: string,
    mouseButtonPressedRef: Ref<boolean>,
    nodeCache: Map<string, NodeCacheValueType>,
) => {
    const resultFoundNodes: any[] = []

    // console.log('deb-comments-comments', comments.length)
    await Promise.all(
        comments.map(async (it) => {
            const { author, comment, date, fullpath, fulltext, key, system, left, right, node, externalId } = it

            if (!key || !fullpath || !fulltext || currentSystem !== system) {
                return
            }

            const hasFullPathHasExcludedSubstring = excludedClasses.some((excludedClass) =>
                fullpath.includes(excludedClass),
            )

            if (hasFullPathHasExcludedSubstring) {
                // If fullPath contains an excluded substring, return early
                return
            }

            const commentObj = { text: comment, author, date, objectId: externalId }

            const nodeListByFullPath = document.querySelectorAll(fullpath)

            nodeListByFullPath.forEach((node) => {
                resultFoundNodes.push({ node, key, comment: commentObj })
            })
            // console.log('deb-comments-nodeListByFullPath', nodeListByFullPath, nodeListByFullPath.length)
            // if (nodeListByFullPath.length) {
            //     const foundNodes = findNodesByKey({ key, fullPath, fullText, nodeList: nodeListByFullPath, system })
            //     foundNodes.forEach((node) => {
            //         resultFoundNodes.push({node, key})
            //     })
            //     // resultFoundNodes.push(...foundNodes)
            //     if (foundNodes.length === nodeListByFullPath.length) {
            //         // Все ноды по пути были найдены, далее траверсить DOM-дерево не имеет смысла
            //         return
            //     }
            // }

            // Если нашли не все ноды, то пойдем поищем по полнотекстовому совпадению
            if (!nodeListByFullPath.length) {
                const nodeListByFullText = async (fullText: string) => {
                    const foundNodesByFullText = findNodesByText(fullText)

                    foundNodesByFullText.forEach((node) => {
                        resultFoundNodes.push({ node, key, comment: commentObj })
                    })
                    // console.log('deb-comments-foundNodesByFullText', foundNodesByFullText)
                }

                await nodeListByFullText(fulltext)
            }
        }),
    )
    onCompleted()
    resultFoundNodes.forEach(({ node, key, comment }) => {
        modifyNode(node, key, comment, nodeCache, onHover, mouseButtonPressedRef)
    })
}

// eslint-disable-next-line sonarjs/cognitive-complexity
export const getSelectorPath = (node: Node): string => {
    const path: string[] = []

    const isElement = (node: Node): node is Element => node.nodeType === Node.ELEMENT_NODE

    while (node && node !== document.body) {
        let selector: string

        if (isElement(node)) {
            const element = node

            selector = element.nodeName.toLowerCase()

            if (element.id && element.id === 'root') {
                selector += `#${element.id}`
                path.unshift(selector)

                break
            }

            const classes = element.classList

            if (classes && classes.length) {
                const classList = Array.from(classes)
                    .map((className) => `.${className}`)
                    .join('')

                selector += classList
            }

            if (element.parentNode) {
                const siblings = Array.from(element.parentNode.childNodes)
                const index = siblings.indexOf(element) + 1

                // Exclude ":nth-child(index)" for text nodes
                selector += node.nodeType === Node.TEXT_NODE ? '' : `:nth-child(${index})`
            }
        } else if (node.nodeType === Node.TEXT_NODE) {
            // Handle Text nodes
            selector = '#text'
        } else {
            // Handle other node types (unexpected)
            break
        }

        if (selector !== '#text') {
            path.unshift(selector)
        }

        // eslint-disable-next-line
        node = node.parentNode
    }

    path.unshift('body')

    return path.join(' > ')
}

export const getCurrentDateString = () => {
    const currentDate = new Date()

    return format(currentDate, 'yyyy-MM-dd HH:mm:ss')
}

// from "yyyy-MM-dd HH:mm:ss" to "DD Month YYYY" in Russian
export const convertDigitsDateToStringDate = (digitsDate: string) => {
    if (!digitsDate) {
        return digitsDate
    }

    const date = parse(digitsDate, 'yyyy-MM-dd HH:mm:ss', new Date())

    return format(date, 'dd MMMM yyyy', { locale: ru })
}

export const findNodesByKey = ({ key, fullPath, fullText, nodeList, system }: NodeSearchParamsType) => {
    const foundNodes: Node[] = []

    nodeList.forEach((node) => {
        const nodeListWithKey = node.querySelectorAll(key)

        if (!nodeListWithKey.length) return

        nodeListWithKey.forEach((nodeWithKey) => {
            foundNodes.push(nodeWithKey)
        })
    })

    return foundNodes
}

export function findNodesByText(searchText: string): (Element | Text)[] {
    const xpath = `//*[contains(text(),'${searchText}')]`
    const matchingNodesSnapshot = document.evaluate(xpath, document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null)

    const matchingNodes = []

    for (let i = 0; i < matchingNodesSnapshot.snapshotLength; i++) {
        const node = matchingNodesSnapshot.snapshotItem(i)

        if (node instanceof Element || node instanceof Text) {
            matchingNodes.push(node)
        }
    }

    return matchingNodes
}

export const modifyNode = (
    node: Node,
    key: string,
    comment: CommentModifyType,
    nodeCache: Map<string, NodeCacheValueType>,
    onHover: (node: Node, commentData: CommentModifyType) => void,
    mouseButtonPressedRef: Ref<boolean>,
) => {
    nodeCache.set(comment.objectId, {
        node,
        textContent: node.textContent,
    })

    const originalText = node.textContent
    const startIndex = originalText.indexOf(key)
    const endIndex = startIndex + key.length

    const textBefore = originalText.substring(0, startIndex)
    const textAfter = originalText.substring(endIndex)

    const spanElement = document.createElement('span')

    spanElement.style.backgroundColor = 'yellow'
    spanElement.style.cursor = 'pointer'
    spanElement.className = 'fedapp-comment-wrapper'
    spanElement.innerHTML = originalText.substring(startIndex, endIndex)

    let hoverTimeout: NodeJS.Timeout | null = null

    spanElement.addEventListener('mouseenter', (evt) => {
        hoverTimeout = setTimeout(() => {
            const { target } = evt
            // @ts-expect-error
            const nodeRect = target.getBoundingClientRect()

            // Trigger onHover only if no mouse buttons are pressed
            // @ts-expect-error
            if (!mouseButtonPressedRef.current) {
                onHover(node, {
                    author: comment.author,
                    date: comment.date,
                    text: comment.text,
                    objectId: comment.objectId,
                    nodeRect,
                })
            }
        }, 700)
    })

    // Clear the timeout if the mouse leaves the span before the delay
    spanElement.addEventListener('mouseleave', () => {
        if (hoverTimeout) {
            clearTimeout(hoverTimeout)
            hoverTimeout = null
        }
    })

    const fragment = document.createDocumentFragment()

    fragment.appendChild(document.createTextNode(textBefore))
    fragment.appendChild(spanElement)
    fragment.appendChild(document.createTextNode(textAfter))

    // Clear existing content and append the fragment
    while (node.firstChild) {
        node.removeChild(node.firstChild)
    }

    node.appendChild(fragment)
}

export const getPageNameByLocation = (pathname: string, baseUrl: string) => {
    if (!baseUrl.endsWith('/')) {
        // eslint-disable-next-line no-param-reassign
        baseUrl += '/'
    }

    // Remove baseUrl from the beginning of the pathname
    const relativePath = pathname.replace(baseUrl, '')

    // Extract the substring until the first slash
    const firstSlashIndex = relativePath.indexOf('/')

    return firstSlashIndex !== -1 ? relativePath.substring(0, firstSlashIndex) : relativePath
}

export type GetPopoverPositionDimensionsType = {
    width: number
    height: number
}

export type GetPopoverPositionRulesType = {
    shouldCalcHeight: boolean
}

export const getPopoverPosition = (
    rect: DOMRect,
    dimensions: GetPopoverPositionDimensionsType,
    rules: GetPopoverPositionRulesType,
) => {
    const { width: popoverWidth, height: popoverHeight } = dimensions
    const { shouldCalcHeight } = rules

    // Window dimensions
    const windowWidth = window.innerWidth
    const windowHeight = window.innerHeight

    // Calculate left and top positions considering window boundaries
    const left = Math.min(Math.max(rect.left, 0), windowWidth - popoverWidth)

    const top = shouldCalcHeight
        ? Math.min(Math.max(rect.top + rect.height + 5, 0), windowHeight - popoverHeight)
        : rect.top + rect.height + 5

    return { left, top }
}
