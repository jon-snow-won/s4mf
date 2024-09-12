import { FC } from 'react'

import { IconProps } from '@utils/icons'

export const WorkflowDesignerIcon: FC<IconProps> = ({ size = '20' }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.3333 10.8333H10.8333V16.6666H18.3333V10.8333Z" fill="currentColor" />
        <path
            d="M18.3333 9.16659V3.33325H10.8333V9.16659H18.3333ZM16.6667 7.49992H12.5V4.99992H16.6667V7.49992Z"
            fill="currentColor"
        />
        <path
            d="M2.5 9.16659C2.5 11.2083 3.96667 12.8916 5.9 13.2583L4.65833 12.0166L5.83333 10.8333L9.16667 14.1749L5.83333 17.4999L4.65833 16.3249L5.975 15.0083V14.9583C3.08333 14.6166 0.833332 12.1499 0.833332 9.16659C0.833332 5.94159 3.44167 3.33325 6.66667 3.33325H9.16667V4.99992H6.66667C4.36667 4.99992 2.5 6.86659 2.5 9.16659Z"
            fill="currentColor"
        />
    </svg>
)
