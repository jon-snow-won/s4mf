import React from 'react'

import FederatedComponent from '../components/FederatedComponent'
import { useMappingComponents } from '../hooks/useMappingComponents'

type GridLayoutProps = {
    layoutContentKeys: string[]
}

export default function GridLayout({ layoutContentKeys }: GridLayoutProps) {
    const components = useMappingComponents(layoutContentKeys)

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr' }}>
            {components &&
                components.map(({ url, scope, module, props }, i) => (
                    <FederatedComponent
                        url={url}
                        scope={scope}
                        module={module}
                        props={props}
                        key={`${url}-${scope}-${module}`}
                    />
                ))}
        </div>
    )
}
