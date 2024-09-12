import { Autocomplete, AutocompleteItem, Button, TextField } from '@s4mf/uikit'
import { Box, Divider, Modal, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { useAppDispatch } from '@hooks/useAppDispatch'
import { selectServices } from '@providers/DynamicManifestProvider/Services/selectors/selectServices'
import { getAllServices } from '@providers/DynamicManifestProvider/Services/thunks/getAllServices'
import { selectSettings } from '@providers/DynamicManifestProvider/Settings/selectors/selectSettings'
import { getAllSettings } from '@providers/DynamicManifestProvider/Settings/thunks/getAllSettings'
import { selectStructures } from '@providers/DynamicManifestProvider/Structures/selectors/selectStructures'
import { deleteStructureById } from '@providers/DynamicManifestProvider/Structures/thunks/deleteStructureById'
import { getAllStructures } from '@providers/DynamicManifestProvider/Structures/thunks/getAllStructures'
import { patchStructureById } from '@providers/DynamicManifestProvider/Structures/thunks/patchStructureById'
import { postStructure } from '@providers/DynamicManifestProvider/Structures/thunks/postStructure'
import { Component, Structure } from '@src/vendor/bff-openapi-client'

export const StructuresList = () => {
    const dispatch = useAppDispatch()

    const { structures, structuresFetchSuccess } = useSelector(selectStructures)

    const { services, servicesFetchSuccess } = useSelector(selectServices)
    const servicesOptions =
        services.map(({ id, revision }) => ({
            id: String(id),
            label: `id: ${id}; rev: ${revision?.toString() ?? '-'}`,
        })) ?? []

    const { settings, settingsFetchSuccess } = useSelector(selectSettings)
    const settingsOptions =
        settings.map(({ id, revision }) => ({
            id: String(id),
            label: `id: ${id}; rev: ${revision?.toString() ?? '-'}`,
        })) ?? []

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

    const [newName, setNewName] = useState<Component['name']>('')
    const [newDescription, setNewDescription] = useState<Component['description']>('')
    const [newServices, setNewServices] = useState<AutocompleteItem[]>([])
    const [newSettings, setNewSettings] = useState<AutocompleteItem[]>([])

    const [inputName, setInputName] = useState<Record<string, string>>(null)
    const [inputDescription, setInputDescription] = useState<Record<string, string>>(null)
    const [inputServices, setInputServices] = useState<Record<string, AutocompleteItem[]>>({})
    const [inputSettings, setInputSettings] = useState<Record<string, AutocompleteItem[]>>({})

    const getStructures = async () => {
        await dispatch(getAllStructures({}))
    }

    useEffect(() => {
        dispatch(getAllSettings({}))
        dispatch(getAllServices({}))
        getStructures()
    }, [])

    useEffect(() => {
        if (!structuresFetchSuccess || !servicesFetchSuccess || !settingsFetchSuccess) {
            return
        }

        structures.forEach((it) => {
            setInputName((prevState) => ({ ...prevState, [it.idx]: it.name }))
            setInputDescription((prevState) => ({ ...prevState, [it.idx]: it.description }))

            setInputServices((prevState) => ({
                ...prevState,
                [it.idx]: servicesOptions.filter(({ id }) => it.services.some((setting) => Number(id) === setting.id)),
            }))
            setInputSettings((prevState) => ({
                ...prevState,
                [it.idx]: settingsOptions.filter(({ id }) => it.settings.some((setting) => Number(id) === setting.id)),
            }))
        })
    }, [structuresFetchSuccess, servicesFetchSuccess, settingsFetchSuccess])

    const handleCloseCreateModal = () => {
        setOpen(false)
        setNewName('')
        setNewDescription('')
        setNewServices([])
        setNewSettings([])
    }

    const handleCreate = async () => {
        if (!newName || !newDescription || !newServices.length || !newSettings.length) {
            alert('Заполнены не все поля')

            return
        }
        await dispatch(
            postStructure({
                createStructureDto: {
                    name: newName,
                    description: newDescription,
                    services: newServices.map(({ id }) => Number(id)),
                    settings: newSettings.map(({ id }) => Number(id)),
                },
            }),
        )

        handleCloseCreateModal()

        await getStructures()
    }

    const handlePatch = async (evt: any, structure: Structure) => {
        await dispatch(
            patchStructureById({
                id: String(structure.id),
                toReplace: true,
                updateStructureDto: {
                    name: inputName[structure.idx] ?? structure.name,
                    description: inputDescription[structure.idx] ?? structure.description,
                    services:
                        inputServices[structure.idx].map(({ id }) => Number(id)) ??
                        structure.services.map(({ id }) => id),
                    settings:
                        inputSettings[structure.idx].map(({ id }) => Number(id)) ??
                        structure.settings.map(({ id }) => id),
                },
            }),
        )

        await getStructures()
    }

    const handleDelete = async (evt: any, structure: Structure) => {
        await dispatch(deleteStructureById({ id: String(structure.id), isHardDelete: false }))
        await getStructures()
    }

    return (
        <div style={{ margin: 20, width: 1000 }}>
            <h2>Structures</h2>
            <Button onClick={handleOpen} style={{ marginBottom: 20 }}>
                Create New
            </Button>
            <Button
                onClick={() => {
                    getStructures()
                }}
                style={{ marginBottom: 20, marginLeft: 20 }}
            >
                Get All
            </Button>
            <Modal open={open} onClose={handleClose}>
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
                        <h2>Create Structure</h2>
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
                            <Autocomplete
                                label="services"
                                options={servicesOptions}
                                value={newServices}
                                multiple
                                onChange={(_, value) => {
                                    setNewServices(value)
                                }}
                            />
                            <Autocomplete
                                label="settings"
                                options={settingsOptions}
                                value={newSettings}
                                multiple
                                onChange={(_, value) => {
                                    setNewSettings(value)
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
                                Create
                            </Button>
                        </Stack>
                    </Stack>
                </Box>
            </Modal>
            <Stack direction="column" gap="16px">
                {structures.map((it) => {
                    const { id, idx, name } = it

                    return (
                        <>
                            <form key={idx} name={idx}>
                                <h3>{`id: ${id}, name: ${name}`}</h3>
                                <Stack direction="row" gap="16px">
                                    <Stack direction="column" gap="16px">
                                        <div style={{ minWidth: 400 }}>
                                            <Stack direction="column" gap="16px">
                                                <TextField
                                                    label="name"
                                                    value={inputName?.[idx] ?? name}
                                                    onChange={(evt) => {
                                                        setInputName((prevState) => ({
                                                            ...prevState,
                                                            [idx]: evt.target.value,
                                                        }))
                                                    }}
                                                />
                                                <TextField
                                                    label="description"
                                                    value={inputDescription?.[idx] ?? it.description}
                                                    onChange={(evt) => {
                                                        setInputDescription((prevState) => ({
                                                            ...prevState,
                                                            [idx]: evt.target.value,
                                                        }))
                                                    }}
                                                />
                                                <Autocomplete
                                                    label="services"
                                                    options={servicesOptions}
                                                    value={inputServices[idx] ?? []}
                                                    multiple
                                                    onChange={(_, value) => {
                                                        setInputServices((prevState) => ({
                                                            ...prevState,
                                                            [idx]: value,
                                                        }))
                                                    }}
                                                />
                                                <Autocomplete
                                                    label="settings"
                                                    options={settingsOptions}
                                                    value={inputSettings[idx] ?? []}
                                                    multiple
                                                    onChange={(_, value) => {
                                                        setInputSettings((prevState) => ({
                                                            ...prevState,
                                                            [idx]: value,
                                                        }))
                                                    }}
                                                />
                                            </Stack>
                                            <Stack direction="row" gap="16px" sx={{ marginTop: '20px' }}>
                                                <Button onClick={(evt) => handlePatch(evt, it)}>PATCH</Button>
                                                <Button onClick={(evt) => handleDelete(evt, it)}>DELETE</Button>
                                            </Stack>
                                        </div>
                                    </Stack>
                                    <Stack direction="column" gap="16px">
                                        {expandedDetails[idx] ? (
                                            <PreformattedText>{JSON.stringify(it, null, 2)}</PreformattedText>
                                        ) : (
                                            <PreformattedText>{`${JSON.stringify(it, null, 2).substring(0, 300)}...`}</PreformattedText>
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
