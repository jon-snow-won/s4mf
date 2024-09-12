import { Button, TextField } from '@s4mf/uikit'
import { Box, Divider, Modal, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { useAppDispatch } from '@hooks/useAppDispatch'
import { selectComponents } from '@providers/DynamicManifestProvider/Components/selectors/selectComponents'
import { deleteComponentById } from '@providers/DynamicManifestProvider/Components/thunks/deleteComponentById'
import { getAllComponents } from '@providers/DynamicManifestProvider/Components/thunks/getAllComponents'
import { patchComponentById } from '@providers/DynamicManifestProvider/Components/thunks/patchComponentById'
import { postComponent } from '@providers/DynamicManifestProvider/Components/thunks/postComponent'
import { Component } from '@src/vendor/bff-openapi-client'

export const ComponentsList = () => {
    const dispatch = useAppDispatch()

    const { components, componentsFetchSuccess } = useSelector(selectComponents)

    const [open, setOpen] = useState(false)
    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({})

    const toggleExpand = (idx: string) => {
        setExpandedDetails((prevState) => ({
            ...prevState,
            [idx]: !prevState[idx],
        }))
    }

    const [newDescription, setNewDescription] = useState<Component['description']>('')
    const [newName, setNewName] = useState<Component['name']>('')

    const [inputDescription, setInputDescription] = useState<Record<string, string>>(null)

    const getComponents = async () => {
        await dispatch(getAllComponents({}))
    }

    useEffect(() => {
        getComponents()
    }, [])

    useEffect(() => {
        if (!componentsFetchSuccess) {
            return
        }

        components.forEach((it) => {
            setInputDescription((prevState) => ({ ...prevState, [it.idx]: it.description }))
        })
    }, [componentsFetchSuccess])

    const handleCloseCreateModal = () => {
        setOpen(false)
        setNewName('')
        setNewDescription('')
    }

    const handleCreate = async () => {
        if (!newName || !newDescription) {
            alert('Заполнены не все поля')

            return
        }

        await dispatch(
            postComponent({
                description: newDescription,
                name: newName,
            }),
        )

        handleCloseCreateModal()

        await getComponents()
    }

    const handlePatch = async (evt: any, component: Component) => {
        await dispatch(
            patchComponentById({
                id: String(component.id),
                updateComponentDto: {
                    description: inputDescription[component.idx] ?? component.description,
                },
            }),
        )

        setInputDescription(null)
        await getComponents()
    }

    const handleDelete = async (evt: any, component: Component) => {
        await dispatch(deleteComponentById({ id: String(component.id) }))
        await getComponents()
    }

    return (
        <div style={{ margin: 20, width: 1000 }}>
            <h2>Components</h2>
            <Button onClick={handleOpen} style={{ marginBottom: 20 }}>
                Create New
            </Button>
            <Button
                onClick={() => {
                    getComponents()
                }}
                style={{ marginBottom: 20, marginLeft: 20 }}
            >
                Get All
            </Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="create-component-modal-title"
                aria-describedby="create-component-modal-description"
            >
                <Box
                    bgcolor="background.paper"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        border: '2px solid #000',
                        boxShadow: '24px',
                        padding: 4,
                    }}
                >
                    <Stack direction="column" gap="16px">
                        <h2>Create Component</h2>
                        <Stack direction="column" gap="16px">
                            <TextField
                                label="name"
                                value={newName}
                                onChange={(evt) => {
                                    setNewName(evt.target.value)
                                }}
                            />
                            <TextField
                                label="description"
                                value={newDescription}
                                onChange={(evt) => {
                                    setNewDescription(evt.target.value)
                                }}
                            />
                        </Stack>
                        <Stack direction="row" gap="16px">
                            <Button
                                onClick={() => {
                                    handleCreate()
                                }}
                                style={{ marginTop: 20 }}
                            >
                                Create Component
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Modal>
            <Stack direction="column" gap="16px">
                {components.map((component) => {
                    const { id, idx, name, description } = component

                    return (
                        <>
                            <form key={idx} name={idx}>
                                <h3>{`id: ${id}, name: ${name}`}</h3>
                                <Stack direction="row" gap="16px">
                                    <Stack direction="column" gap="16px">
                                        <div style={{ minWidth: 400 }}>
                                            <Stack direction="column" gap="16px">
                                                <TextField
                                                    label="description"
                                                    value={inputDescription?.[idx] ?? description}
                                                    onChange={(evt) => {
                                                        setInputDescription((prevState) => ({
                                                            ...prevState,
                                                            [idx]: evt.target.value,
                                                        }))
                                                    }}
                                                />
                                            </Stack>
                                            <Stack direction="row" gap="16px" sx={{ marginTop: '20px' }}>
                                                <Button onClick={(evt) => handlePatch(evt, component)}>PATCH</Button>
                                                <Button onClick={(evt) => handleDelete(evt, component)}>DELETE</Button>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction="column" gap="16px">
                                        {expandedDetails[idx] ? (
                                            <PreformattedText>{JSON.stringify(component, null, 2)}</PreformattedText>
                                        ) : (
                                            <PreformattedText>{`${JSON.stringify(component, null, 2).substring(0, 300)}...`}</PreformattedText>
                                        )}
                                        <Button onClick={() => toggleExpand(idx)}>
                                            {expandedDetails[idx] ? 'Collapse' : 'Expand'}
                                        </Button>
                                    </Stack>
                                </Stack>
                            </form>
                            <Divider />
                        </>
                    )
                })}
            </Stack>
        </div>
    )
}

const PreformattedText = styled(Typography)({
    fontFamily: 'monospace',
    whiteSpace: 'pre-wrap',
    fontSize: 'small',
})
