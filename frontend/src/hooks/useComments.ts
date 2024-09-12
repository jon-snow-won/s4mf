import { useEffect, useRef, useState } from 'react'

import { excludedClasses } from '@components/comments/const'
import { CommentModeType, CommentModifyType, SelectedTextInfoType } from '@hooks/useComments.types'
import { useDidMountEffect } from '@hooks/useDidMountEffect'
import { useManifestVersion } from '@hooks/useManifestVersion'
import { useNotification } from '@hooks/useNotification'
import { useCommentsContext } from '@providers/comments/CommentsProvider'
import { useProfile } from '@providers/profile/ProfileProvider'
import { deleteComment, fetchComments, postComment, transformationIdEnv } from '@services/CommentService'
import { getCurrentDateString, getPageNameByLocation, getSelectorPath, renderComments } from '@utils/comments'
import { debounce } from '@utils/debounce'

export type NodeCacheValueType = {
    node: Node
    textContent: string
}

const selectedTextInfoDefault: SelectedTextInfoType = {
    selectedText: '',
    selectorPath: '',
    nodeText: '',
    nodeRect: null,
}

const nodeCache = new Map<string, NodeCacheValueType>()

interface Props {
    disabled: boolean
}

export const useComments = ({ disabled }: Props) => {
    const mouseButtonPressedRef = useRef(false)

    const { envConfigByManifestVersion } = useManifestVersion()
    const notification = useNotification()
    const { userProfile } = useProfile()
    const { isShowComments, setShowComments, toggleShowComments, systems } = useCommentsContext()

    const fullName = [userProfile?.firstName, userProfile.lastName].filter(Boolean).join(' ')
    const currentSystem =
        systems?.[0] ?? getPageNameByLocation(window.location.href, envConfigByManifestVersion.BASE_URL)

    const [commentMode, setCommentMode] = useState<CommentModeType>(null)
    const [initialLoadCompleted, setInitialLoadCompleted] = useState(false)
    const [selectedTextInfo, setSelectedTextInfo] = useState<SelectedTextInfoType | null>(selectedTextInfoDefault)
    const [popoverAnchor, setPopoverAnchor] = useState<Element | null>(null)
    const [shouldPostComment, setShouldPostComment] = useState('')

    const [showCommentsPopoverAnchor, setShowCommentsPopoverAnchor] = useState<Element | null>(null)
    const [showCommentsData, setShowCommentsData] = useState<CommentModifyType | null>(null)

    const handlePopoverOpen = (parentNode: Element) => {
        setPopoverAnchor(parentNode)
    }

    const handlePopoverClose = () => {
        setPopoverAnchor(null)
    }

    const handleCommentsPopoverOpen = (node: Node, commentData: CommentModifyType) => {
        setShowCommentsPopoverAnchor(node as Element)
        setShowCommentsData(commentData)
    }

    const handleCommentsPopoverClose = () => {
        setShowCommentsPopoverAnchor(null)
        setShowCommentsData(null)
    }

    const handleSelectText = (event: MouseEvent) => {
        // Disable double clicks and triple click because they break a selection logic
        if (event.detail > 1) {
            return
        }

        const selection = window.getSelection()

        if (selection && selection.toString().length >= 5) {
            const range = selection.getRangeAt(0)
            const selectedNode = range.commonAncestorContainer

            // Check if selectedNode is a text node
            if (selectedNode.nodeType !== 3) {
                return // Ignore selections that are not from a text node
            }

            // @ts-expect-error
            if (selectedNode.classList) {
                const hasExcludedClass = excludedClasses.some((excludedClass) =>
                    // @ts-expect-error
                    selectedNode.classList.contains(excludedClass),
                )

                if (hasExcludedClass) {
                    // If the selectedNode has an excluded class, return early
                    return
                }
            }

            const { parentNode } = range.commonAncestorContainer

            // Get the full selector path
            const selectorPath = getSelectorPath(selectedNode)

            const hasFullPathExcludedSubstring = excludedClasses.some((excludedClass) =>
                selectorPath.includes(excludedClass),
            )

            if (hasFullPathExcludedSubstring) {
                return
            }

            // Get the full text of the DOM node
            const nodeText = selectedNode.textContent

            // Get the bounding rect of the text node range
            const textNodeRange = document.createRange()

            textNodeRange.selectNodeContents(range.commonAncestorContainer)
            const textNodeRect = textNodeRange.getBoundingClientRect()

            setSelectedTextInfo({
                selectedText: selection.toString(),
                selectorPath,
                nodeText,
                nodeRect: textNodeRect,
            })

            // Open the Popover
            handlePopoverOpen(parentNode as Element)
        }
    }

    const debouncedHandleSelectText = debounce(handleSelectText, 500)

    const getComments = async () => {
        if (disabled) return
        const commentsResponse = await fetchComments({ transformationId: transformationIdEnv })
        const commentsContent = commentsResponse?.content ?? []
        const comments = commentsContent.map(({ data, id }) => ({ ...data, externalId: id }))

        await renderComments(
            comments,
            onRenderComments,
            initialLoadCompleted,
            handleCommentsPopoverOpen,
            currentSystem,
            mouseButtonPressedRef,
            nodeCache,
        )
    }

    const debouncedGetComments = debounce(getComments, 1000)

    const onRenderComments = () => {
        setInitialLoadCompleted(true)
    }

    const onDeleteComment = async (objectId: string) => {
        handleCommentsPopoverClose()
        await deleteComment({
            objectId,
            onSuccess: () => {
                notification('success', 'Успешно удален!', 'Комментарий был удален')
            },
            onError: () => {
                notification('error', 'Ошибка', 'При удалении комментария произошла ошибка')
            },
        })
        const nodeObject = nodeCache.get(objectId)

        // @ts-expect-error
        nodeObject.node.innerHTML = nodeObject.textContent
        nodeCache.delete(objectId)
        getComments()
    }

    useEffect(() => {
        // с событием selectend - не смог подружиться, не срабатывает такой event
        document.addEventListener('mouseup', debouncedHandleSelectText)

        // Если кнопка мыши нажата - не показываем всплывашку с комментариями
        document.addEventListener('mousedown', () => {
            mouseButtonPressedRef.current = true
        })
        document.addEventListener('mouseup', () => {
            mouseButtonPressedRef.current = false
        })

        getComments()
    }, [])

    useDidMountEffect(() => {
        if (isShowComments) {
            getComments()
        }

        if (!isShowComments) {
            nodeCache.forEach((object, objectId) => {
                // @ts-expect-error
                object.node.innerHTML = object.node.textContent // eslint-disable-line
            })
            nodeCache.clear()
        }
    }, [isShowComments])

    useEffect(() => {
        if (!shouldPostComment) {
            return
        }

        setShowComments(true)

        const { selectedText, nodeText, selectorPath } = selectedTextInfo

        postComment({
            transformationId: transformationIdEnv,
            body: {
                key: selectedText,
                author: fullName,
                comment: shouldPostComment,
                date: getCurrentDateString(),
                fulltext: nodeText,
                fullpath: selectorPath,
                system: currentSystem,
                left: '',
                right: '',
            },
            onSuccess: () => {
                notification('success', 'Успешно добавлен!', 'Ваш комментарий добавлен')
            },
            onError: () => {
                notification('error', 'Ошибка', 'При добавлении комментария произошла ошибка')
            },
        })
        setShouldPostComment('')
        setCommentMode(null)
        debouncedGetComments()
    }, [shouldPostComment])

    return {
        popoverAnchor,
        handlePopoverClose,
        selectedTextInfo,
        commentMode,
        setCommentMode,
        setShouldPostComment,
        showCommentsPopoverAnchor,
        showCommentsData,
        handleCommentsPopoverClose,
        onDeleteComment,
    }
}
