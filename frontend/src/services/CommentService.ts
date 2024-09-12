import axios from 'axios'

import { envConfigByManifestVersionService } from '@hooks/useManifestVersion'
import { FetchCommentServiceResponse } from '@services/CommentService.types'

const apiClient = axios.create({
    baseURL: `${envConfigByManifestVersionService.BASE_URL}/api/comments`,
})

export const transformationIdEnv = 'a76f1e2d-c8fa-43b5-8afe-808f56411f63'

interface FetchCommentsParams {
    transformationId: string
}

export const fetchComments = async (params: FetchCommentsParams) => {
    const { transformationId } = params

    try {
        const response = await apiClient.post<FetchCommentServiceResponse>(
            `/transformation/${transformationId}?isOnlyMeta=false&isWithSubObjects=true&page=0&size=500`,
            {}, // TODO: specify fetching. Find by current "system"! Example of body: {"item":{"parameterName":"key","operation":"EQUALS","values":["B35-B49"]}}
        )

        if (!response.data) {
            throw new Error()
        }

        return response.data
    } catch (err) {
        console.log(err)
    }
}

interface PostCommentBody {
    key: string
    left: string
    right: string
    comment: string
    author: string
    date: string
    system: string
    fullpath: string
    fulltext: string
}

interface PostCommentParams {
    transformationId: string
    body: PostCommentBody
    onSuccess: () => void
    onError: () => void
}

export const postComment = async (params: PostCommentParams) => {
    const { transformationId, body, onSuccess, onError } = params

    try {
        const response = await apiClient.post<FetchCommentServiceResponse>(`/${transformationId}`, body)

        if (!response.data) {
            throw new Error()
        }

        onSuccess()

        return response.data
    } catch (err) {
        onError()
    }
}

interface DeleteCommentParams {
    objectId: string
    onSuccess: () => void
    onError: () => void
}

export const deleteComment = async (params: DeleteCommentParams) => {
    const { objectId, onSuccess, onError } = params

    try {
        const response = await apiClient.delete(`/${objectId}`)

        onSuccess()

        return response.data
    } catch (err) {
        onError()
    }
}
