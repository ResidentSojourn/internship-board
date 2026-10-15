export type Role = 'none' | 'admin' | 'superAdmin'

export function authorization() {
  const role = useState<Role>('role', () => 'none')

  function logout() {
    role.value = 'none'
  }

  function isAdmin() {
    return role.value === 'admin' || role.value === 'superAdmin'
  }

  function isSuperAdmin() {
    return role.value === 'superAdmin'
  }

  return { role, logout, isAdmin, isSuperAdmin }
}   