import { Autocomplete, AutocompleteItem, Button, TextField } from '@s4mf/uikit'
import { Box, Divider, Modal, Stack, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { useAppDispatch } from '@hooks/useAppDispatch'
import { selectRoles } from '@providers/DynamicManifestProvider/Roles/selectors/selectRoles'
import { getAllRoles } from '@providers/DynamicManifestProvider/Roles/thunks/getAllRoles'
import { selectServices } from '@providers/DynamicManifestProvider/Services/selectors/selectServices'
import { deleteServiceById } from '@providers/DynamicManifestProvider/Services/thunks/deleteServiceById'
import { getAllServices } from '@providers/DynamicManifestProvider/Services/thunks/getAllServices'
import { postService } from '@providers/DynamicManifestProvider/Services/thunks/postService'
import { selectSettings } from '@providers/DynamicManifestProvider/Settings/selectors/selectSettings'
import { getAllSettings } from '@providers/DynamicManifestProvider/Settings/thunks/getAllSettings'
import { selectTypesService } from '@providers/DynamicManifestProvider/Types/selectors/selectTypesService'
import { fetchTypesService } from '@providers/DynamicManifestProvider/Types/thunks/fetchTypesService'
import { patchServiceById } from '@src/providers/DynamicManifestProvider/Services/thunks/patchServiceById'
import { Component, Service } from '@src/vendor/bff-openapi-client'

export const ServicesList = () => {
    const dispatch = useAppDispatch()

    const { services, servicesFetchSuccess } = useSelector(selectServices)
    const servicesOptions =
        services.map(({ id, revision, type }) => ({
            id: String(id),
            label: `id: ${id}; rev: ${revision?.toString() ?? '-'}; type: ${type?.name?.toString() ?? '-'}`,
        })) ?? []

    const { typesService } = useSelector(selectTypesService)
    const typesServiceOptions =
        typesService.map(({ id, name }) => ({
            id: String(id),
            label: name,
        })) ?? []

    const { roles, rolesFetchSuccess } = useSelector(selectRoles)
    const rolesOptions =
        roles.map(({ id, name }) => ({
            id: String(id),
            label: name,
        })) ?? []

    const { settings, settingsFetchSuccess } = useSelector(selectSettings)
    const settingsOptions =
        settings.map(({ id, type, revision }) => ({
            id: String(id),
            label: `id: ${id}; rev: ${revision?.toString() ?? '-'}; type: ${type?.name?.toString() ?? '-'}`,
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

    const [newDescription, setNewDescription] = useState<Component['description']>('')
    const [newName, setNewName] = useState<Component['name']>('')
    const [newTypeService, setNewTypeService] = useState<AutocompleteItem>(null)
    const [newRoles, setNewRoles] = useState<AutocompleteItem[]>([])
    const [newSettings, setNewSettings] = useState<AutocompleteItem[]>([])
    const [newDescendants, setNewDescendants] = useState<AutocompleteItem[]>([])

    const [inputName, setInputName] = useState<Record<string, string>>(null)
    const [inputDescription, setInputDescription] = useState<Record<string, string>>(null)
    const [inputType, setInputType] = useState<Record<string, AutocompleteItem>>({})
    const [inputRoles, setInputRoles] = useState<Record<string, AutocompleteItem[]>>({})
    const [inputSettings, setInputSettings] = useState<Record<string, AutocompleteItem[]>>({})
    const [inputDescendants, setInputDescendants] = useState<Record<string, AutocompleteItem[]>>({})

    const getServices = async () => {
        await dispatch(getAllServices({}))
    }

    useEffect(() => {
        dispatch(fetchTypesService({}))
        dispatch(getAllRoles({}))
        dispatch(getAllSettings({}))
        getServices()
    }, [])

    useEffect(() => {
        if (!servicesFetchSuccess || !rolesFetchSuccess || !settingsFetchSuccess || !servicesOptions) {
            return
        }

        services.forEach((it) => {
            setInputName((prevState) => ({ ...prevState, [it.idx]: it.name }))
            setInputDescription((prevState) => ({ ...prevState, [it.idx]: it.description }))
            setInputType((prevState) => ({
                ...prevState,
                [it.idx]: typesServiceOptions.find(({ id }) => Number(id) === it.type.id),
            }))
            setInputRoles((prevState) => ({
                ...prevState,
                [it.idx]: rolesOptions.filter(({ id }) => it.roles.some((role) => Number(id) === role.id)),
            }))
            setInputSettings((prevState) => ({
                ...prevState,
                [it.idx]: settingsOptions.filter(({ id }) => it.settings.some((setting) => Number(id) === setting.id)),
            }))
            setInputDescendants((prevState) => ({
                ...prevState,
                [it.idx]: servicesOptions.filter(({ id }) =>
                    it.descendants.some((setting) => Number(id) === setting.id),
                ),
            }))
        })
    }, [servicesFetchSuccess, rolesFetchSuccess, settingsFetchSuccess, servicesFetchSuccess])

    const handleCloseCreateModal = () => {
        setOpen(false)
        setNewName('')
        setNewDescription('')
        setNewTypeService(null)
        setNewRoles([])
        setNewSettings([])
        setNewDescendants([])
    }

    const handleCreate = async () => {
        if (!newName || !newDescription || !newTypeService || !newRoles.length) {
            alert('Заполнены не все поля')

            return
        }

        await dispatch(
            postService({
                createServiceDto: {
                    name: newName,
                    description: newDescription,
                    type: Number(newTypeService.id),
                    descendants: [],
                    roles: newRoles.map(({ id }) => Number(id)),
                    settings: newSettings.map(({ id }) => Number(id)),
                },
            }),
        )

        handleCloseCreateModal()
        await getServices()
    }

    const handlePatch = async (evt: any, component: Service) => {
        await dispatch(
            patchServiceById({
                id: String(component.id),
                toReplace: true,
                updateServiceDto: {
                    description: inputDescription[component.idx] ?? component.description,
                    name: inputName[component.idx] ?? component.name,
                    type: Number(inputType[component.idx].id) ?? component.type.id,
                    roles: inputRoles[component.idx].map(({ id }) => Number(id)) ?? component.roles.map(({ id }) => id),
                    settings:
                        inputSettings[component.idx].map(({ id }) => Number(id)) ??
                        component.settings.map(({ id }) => id),
                    descendants:
                        inputDescendants[component.idx]?.map(({ id }) => Number(id)) ??
                        component.descendants.map(({ id }) => id),
                },
            }),
        )

        await getServices()
    }

    const handleDelete = async (evt: any, service: Service) => {
        await dispatch(deleteServiceById({ id: String(service.id), isHardDelete: false }))
        await getServices()
    }

    return (
        <div style={{ margin: 20, width: 1000 }}>
            <h2>Services</h2>
            <Button onClick={handleOpen} style={{ marginBottom: 20 }}>
                Create New
            </Button>
            <Button
                onClick={() => {
                    getServices()
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
                        <h2>Create Service</h2>
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
                                label="type"
                                options={typesServiceOptions}
                                value={newTypeService}
                                onChange={(_, value) => {
                                    setNewTypeService(value)
                                }}
                            />
                            <Autocomplete
                                label="roles"
                                options={rolesOptions}
                                value={newRoles}
                                multiple
                                onChange={(_, value) => {
                                    setNewRoles(value)
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
                            <Autocomplete
                                label="descendants"
                                options={servicesOptions}
                                value={newDescendants}
                                multiple
                                onChange={(_, value) => {
                                    setNewDescendants(value)
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
                {services.map((it) => {
                    const { id, idx, name, description } = it

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
                                                    value={inputDescription?.[idx] ?? description}
                                                    onChange={(evt) => {
                                                        setInputDescription((prevState) => ({
                                                            ...prevState,
                                                            [idx]: evt.target.value,
                                                        }))
                                                    }}
                                                />
                                                <Autocomplete
                                                    label="type"
                                                    options={typesServiceOptions}
                                                    value={inputType[idx] ?? null}
                                                    onChange={(_, value) => {
                                                        setInputType((prevState) => ({ ...prevState, [idx]: value }))
                                                    }}
                                                />
                                                <Autocomplete
                                                    label="roles"
                                                    options={rolesOptions}
                                                    value={inputRoles[idx] ?? []}
                                                    multiple
                                                    onChange={(_, value) => {
                                                        setInputRoles((prevState) => ({ ...prevState, [idx]: value }))
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
                                                <Autocomplete
                                                    label="descendants"
                                                    options={servicesOptions.filter((it) => Number(it.id) !== id)}
                                                    value={inputDescendants[idx] ?? []}
                                                    multiple
                                                    onChange={(_, value) => {
                                                        setInputDescendants((prevState) => ({
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
