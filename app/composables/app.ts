import type { NavigationMenuItem } from '@nuxt/ui'

export function getNavigationItems() {
    // Pull authorization / login state
    const items = computed<NavigationMenuItem[]>(() => {
        const itemList: NavigationMenuItem[] = []
        
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

    return { items }
}