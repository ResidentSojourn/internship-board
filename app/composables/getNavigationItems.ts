import type { NavigationMenuItem } from '@nuxt/ui'

export function getNavigationItems() {
    const route = useRoute()

    // Pull authorization / login state
    const { isAdmin, isSuperAdmin, logout } = authorization()

    const items = computed<NavigationMenuItem[]>(() => {
        const itemList: NavigationMenuItem[] = []

        if (isSuperAdmin()) {
            itemList.push(
                {
                    label: 'BOARD CONFIGURATION',
                    to: '/boardConfiguration',
                    active: false
                },
                {
                    label: 'BOARD ADMINS',
                    to: '/admins',
                    active: false
                }
            )
        }
        
        if (isAdmin()) {
            itemList.push(
                {
                    label: 'ADMIN DASHBOARD',
                    to: '/adminDashboard',
                    active: false
                },
                {
                    label: 'LOGOUT',
                    onClick: () => logout()
                }
            )
        } else { // If user is not an admin
            itemList.push(
                {
                    label: 'ADMIN LOGIN',
                    to: '/login',
                    active: false
                }
            )
        }

        return itemList
    })

    return { items, isSuperAdmin }
}