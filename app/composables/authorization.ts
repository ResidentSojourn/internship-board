export type Role = 'none' | 'admin' | 'superAdmin'

const role = ref<Role>('none')

const adminID = ref(0)

export function login(): void {
  role.value = 'superAdmin'
  adminID.value = 3
}

export function logout(): void {
  role.value = 'none'
  adminID.value = 0
}

export function isAdmin(): boolean {
  return role.value === 'admin' || role.value === 'superAdmin'
}

export function isSuperAdmin(): boolean {
  return role.value === 'superAdmin'
}

export function getAdminID(): number {
  return adminID.value
}