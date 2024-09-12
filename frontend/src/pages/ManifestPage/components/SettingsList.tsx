import { Autocomplete, AutocompleteItem, Button } from '@s4mf/uikit'
import { Box, Divider, FormLabel, Modal, Stack, TextareaAutosize, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'

import { fetchTypesSetting } from '@providers/DynamicManifestProvider/Types/thunks/fetchTypesSetting'
import { useAppDispatch } from '@hooks/useAppDispatch'
import { getAllRoles } from '@providers/DynamicManifestProvider/Roles/thunks/getAllRoles'
import { selectSettings } from '@providers/DynamicManifestProvider/Settings/selectors/selectSettings'
import { deleteSettingById } from '@providers/DynamicManifestProvider/Settings/thunks/deleteSettingById'
import { getAllSettings } from '@providers/DynamicManifestProvider/Settings/thunks/getAllSettings'
import { patchSettingById } from '@providers/DynamicManifestProvider/Settings/thunks/patchSettingById'
import { postSetting } from '@providers/DynamicManifestProvider/Settings/thunks/postSetting'
import { selectTypesSetting } from '@providers/DynamicManifestProvider/Types/selectors/selectTypesSetting'
import { fetchTypesService } from '@providers/DynamicManifestProvider/Types/thunks/fetchTypesService'
import { Setting } from '@src/vendor/bff-openapi-client'

export const SettingsList = () => {
    const dispatch = useAppDispatch()

    const { settings, settingsFetchSuccess } = useSelector(selectSettings)
    const extendsOptions =
        settings.map(({ id, revision }) => ({
            id: String(id),
            label: `id: ${id}; rev: ${revision?.toString() ?? '-'}`,
        })) ?? []

    const { typesSetting, typesSettingFetchSuccess } = useSelector(selectTypesSetting)
    const typesServiceOptions =
        typesSetting.map(({ id, name }) => ({
            id: String(id),
            label: name,
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

    const [newTypeService, setNewTypeService] = useState<AutocompleteItem>(null)
    const [newProperties, setNewProperties] = useState<string>('')
    const [newExtends, setNewExtends] = useState<AutocompleteItem[]>([])

    const [inputType, setInputType] = useState<Record<string, AutocompleteItem>>({})
    const [inputProperties, setInputProperties] = useState<Record<string, string>>({})
    const [inputExtends, setInputExtends] = useState<Record<string, AutocompleteItem[]>>({})

    const getSettings = async () => {
        await dispatch(getAllSettings({}))
    }

    useEffect(() => {
        dispatch(fetchTypesSetting({}))
        dispatch(getAllRoles({}))
        getSettings()
    }, [])

    useEffect(() => {
        if (!typesSettingFetchSuccess || !settingsFetchSuccess) {
            return
        }

        settings.forEach((it) => {
            setInputType((prevState) => ({
                ...prevState,
                [it.idx]: typesServiceOptions.find(({ id }) => Number(id) === it.type.id),
            }))
            setInputProperties((prevState) => ({ ...prevState, [it.idx]: JSON.stringify(it.properties, null, 2) }))
            setInputExtends((prevState) => ({
                ...prevState,
                [it.idx]: extendsOptions.filter(({ id }) => it._extends.some((extendId) => Number(id) === extendId)),
            }))
        })
    }, [settingsFetchSuccess, typesSettingFetchSuccess])

    const parseJsonFromString = (str: string): object => {
        try {
            return JSON.parse(str)
        } catch (e) {
            throw Error('Unable to parse')
        }
    }

    const handleCloseCreateModal = () => {
        setOpen(false)
        setNewTypeService(null)
        setNewProperties('')
        setNewExtends([])
    }

    const handleCreate = async () => {
        if (!newTypeService || !newProperties) {
            alert('Заполнены не все поля')

            return
        }
        await dispatch(
            postSetting({
                createSettingDto: {
                    type: Number(newTypeService.id),
                    properties: parseJsonFromString(newProperties),
                    _extends: newExtends.map(({ id }) => Number(id)),
                },
            }),
        )

        handleCloseCreateModal()

        await getSettings()
    }

    const handlePatch = async (evt: any, setting: Setting) => {
        await dispatch(
            patchSettingById({
                id: String(setting.id),
                toReplace: true,
                updateSettingDto: {
                    type: Number(inputType[setting.idx]?.id) ?? setting.type.id,
                    properties: parseJsonFromString(inputProperties[setting.idx]) ?? setting.properties,
                    _extends: inputExtends[setting.idx].map(({ id }) => Number(id)),
                },
            }),
        )

        await getSettings()
    }

    const handleDelete = async (evt: any, setting: Setting) => {
        await dispatch(deleteSettingById({ id: String(setting.id), isHardDelete: false }))
        await getSettings()
    }

    return (
        <div style={{ margin: 20, width: 1000 }}>
            <h2>Settings</h2>
            <Button onClick={handleOpen} style={{ marginBottom: 20 }}>
                Create New
            </Button>
            <Button
                onClick={() => {
                    getSettings()
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
                        <h2>Create Setting</h2>
                        <Stack direction="column" gap="16px">
                            <Autocomplete
                                label="type"
                                options={typesServiceOptions}
                                value={newTypeService}
                                onChange={(_, value) => {
                                    setNewTypeService(value)
                                }}
                            />
                            <FormLabel>properties (JSON format!)</FormLabel>
                            <TextareaAutosize
                                placeholder="properties (JSON format!)"
                                value={newProperties}
                                onChange={(evt) => {
                                    setNewProperties(evt.target.value)
                                }}
                            />
                            <Autocomplete
                                label="extends"
                                options={extendsOptions}
                                value={newExtends}
                                multiple
                                onChange={(_, value) => {
                                    setNewExtends(value)
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
                {settings.map((it) => {
                    const { id, idx } = it

                    return (
                        <>
                            <form key={idx} name={idx}>
                                <h3>{`id: ${id}`}</h3>
                                <Stack direction="row" gap="16px">
                                    <Stack direction="column" gap="16px">
                                        <div style={{ minWidth: 400 }}>
                                            <Stack direction="column" gap="16px">
                                                <Autocomplete
                                                    label="type"
                                                    options={typesServiceOptions}
                                                    value={inputType[idx] ?? null}
                                                    onChange={(_, value) => {
                                                        setInputType((prevState) => ({ ...prevState, [idx]: value }))
                                                    }}
                                                />
                                                <FormLabel>properties (JSON format!)</FormLabel>
                                                <TextareaAutosize
                                                    placeholder="properties (JSON format!)"
                                                    value={inputProperties[idx]}
                                                    onChange={(evt) => {
                                                        setInputProperties((prevState) => ({
                                                            ...prevState,
                                                            [idx]: evt.target.value,
                                                        }))
                                                    }}
                                                />
                                                <Autocomplete
                                                    label="extends"
                                                    options={extendsOptions}
                                                    value={inputExtends[idx] ?? []}
                                                    multiple
                                                    onChange={(_, value) => {
                                                        setInputExtends((prevState) => ({ ...prevState, [idx]: value }))
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
