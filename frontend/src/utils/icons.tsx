import {
    AccountCircleOutlined,
    AssignmentOutlined,
    HelpOutlineOutlined,
    HomeOutlined,
    NotificationsNoneOutlined,
    SettingsOutlined,
    TaskOutlined,
} from '@mui/icons-material'
import { ReactNode } from 'react'

import { ArmRakursIcon } from '@assets/icons/header/ArmRakursIcon'
import { ConstructorIcon } from '@assets/icons/header/ConstructorIcon'
import { DictionaryIcon } from '@assets/icons/header/DictionaryIcon'
import { GlossaryIcon } from '@assets/icons/header/GlossaryIcon'
import { ManifestConstructorIcon } from '@assets/icons/header/ManifestConstructorIcon'
import { MetadataMapperIcon } from '@assets/icons/header/MetadataMapperIcon'
import { ProcessDigitalTwinIcon } from '@assets/icons/header/ProcessDigitalTwinIcon'
import { PublicationsIcon } from '@assets/icons/header/PublicationsIcon'
import { RiskCalculatorIcon } from '@assets/icons/header/RiskCalculatorIcon'
import { StreamingIcon } from '@assets/icons/header/StreamingIcon'
import { Lab4omsIcon } from '@assets/icons/header/Lab4oms'
import { WorkflowDesignerIcon } from '@assets/icons/header/WorkflowDesignerIcon'
import { TaskAltIcon } from '@assets/icons/header/TaskAltIcon'
import { ManifestRouteMetadata } from '@src/types/manifest'
import { ExtensionOutlinedIcon } from '@assets/icons/header/ExtensionOutlinedIcon'
import { DashboardOutlinedIcon } from '@assets/icons/header/DashboardOutlinedIcon'

export interface IconProps {
    size?: string
    color?: string
}

const randomIcons = [
    AccountCircleOutlined,
    AssignmentOutlined,
    HelpOutlineOutlined,
    HomeOutlined,
    NotificationsNoneOutlined,
    SettingsOutlined,
    TaskOutlined,
]

type IconByRouteMappingsType = {
    [key: string]: React.FC<IconProps>
}

const iconByRouteMappings: IconByRouteMappingsType = {
    DictionaryIcon,
    ConstructorIcon,
    WorkflowDesignerIcon,
    ManifestConstructorIcon,
    MetadataMapperIcon,
    GlossaryIcon,
    RiskCalculatorIcon,
    ArmRakursIcon,
    StreamingIcon,
    Lab4omsIcon,
    ExtensionOutlinedIcon,
    DashboardOutlinedIcon,
    PublicationsIcon,
    ProcessDigitalTwinIcon,
    TaskAltIcon,
}

export const getRandomIcon = (): ReactNode => {
    const rand = crypto.getRandomValues(new Uint32Array(1))[0] * 2 ** -32
    const randomIndex = Math.floor(rand * randomIcons.length)
    const RandomIcon = randomIcons[randomIndex]

    return <RandomIcon />
}

export const getIconByRouteName = (routeName: ManifestRouteMetadata['name']): ReactNode => {
    if (routeName in iconByRouteMappings) {
        const IconComponent = iconByRouteMappings[routeName]

        return <IconComponent size="20" />
    }

    return null
}
