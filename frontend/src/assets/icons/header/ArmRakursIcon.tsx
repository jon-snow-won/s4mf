import { FC } from 'react'

import { IconProps } from '@utils/icons'

export const ArmRakursIcon: FC<IconProps> = ({ size = '20' }) => (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M10 0.833252L2.5 4.16658V9.16658C2.5 13.7916 5.7 18.1166 10 19.1666C14.3 18.1166 17.5 13.7916 17.5 9.16658V4.16658L10 0.833252ZM15.8333 9.16658C15.8333 12.9333 13.35 16.4083 10 17.4416C6.65 16.4083 4.16667 12.9333 4.16667 9.16658V5.24992L10 2.65825L15.8333 5.24992V9.16658ZM6.175 9.65825L5 10.8333L8.33333 14.1666L15 7.49992L13.825 6.31658L8.33333 11.8083L6.175 9.65825Z"
            fill="currentColor"
        />
    </svg>
)
