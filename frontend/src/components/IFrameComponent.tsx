import IframeResizer from 'iframe-resizer-react'
import React, { useRef } from 'react'

import { ManifestComponent, ManifestComponentTabs } from '@src/types/manifest'

export default function IFrameComponent({ mode, url, tabs }: ManifestComponent) {
    const iframeRef = useRef(null)

    // ДЕЛО: доработать выборку табов, не успел реализовать
    // (заготовку кода можно восстановить из коммита "c452adc2")

    const firstTab = tabs?.[0] ?? ({} as ManifestComponentTabs)

    return (
        <div
            id="app"
            style={{
                display: 'flex',
                flexDirection: 'column',
                flex: 1,
            }}
        >
            {/* <SubMenu menuItems={menuItems} /> */}
            {/* ДЕЛО: не работает heightCalculationMethod, захардкодил высоту, но вроде отображается ок */}
            <IframeResizer
                forwardRef={iframeRef}
                heightCalculationMethod="lowestElement"
                minHeight={500}
                scrolling
                inPageLinks
                log={false}
                src={firstTab.source}
                style={{ width: '1px', minWidth: '100%', height: '100%', border: 'none' }}
                // @ts-ignore
                warningTimeout={0}
            />
        </div>
    )
}
