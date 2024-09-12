export type RoleLevel = 'erzl' | 'pump' | 'siszl' | 'kmp' | 'dmp' | 'dtp'

export interface Role {
    code: string
    level: RoleLevel
    title: string
    description: string
}
