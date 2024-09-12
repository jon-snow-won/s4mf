import { DeepPartial, ReducersMapObject } from '@reduxjs/toolkit'
import { FC, ReactNode, useMemo } from 'react'
import { Provider } from 'react-redux'

import { StateSchema } from '@providers/StoreProvider/config/StateSchema'
import { createReduxStore } from '@providers/StoreProvider'

interface StoreProviderProps {
    children?: ReactNode
    initialState?: DeepPartial<StateSchema>
    asyncReducers?: DeepPartial<ReducersMapObject<StateSchema>>
}

export const StoreProvider: FC<StoreProviderProps> = (props) => {
    const { children, initialState, asyncReducers } = props

    const store = useMemo(
        () => createReduxStore(initialState as StateSchema, asyncReducers as ReducersMapObject<StateSchema>),
        [initialState, asyncReducers],
    )

    return store ? <Provider store={store}>{children}</Provider> : null
}
