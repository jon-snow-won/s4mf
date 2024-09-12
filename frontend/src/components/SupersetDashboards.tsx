import React from 'react'
import styled from 'styled-components'

import { ManifestComponent } from '@src/types/manifest'
import { useSupersetDashboards } from '@hooks/useSupersetDashboards'

export default function SupersetDashboards({ tabs }: ManifestComponent) {
    const { supersetParams } = tabs[0]

    useSupersetDashboards(supersetParams)

    return <StyledDashboardsContainer id="superset-dashboards" />
}

const StyledDashboardsContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;

    & iframe {
        height: 100%;
        border: none;
    }
`
