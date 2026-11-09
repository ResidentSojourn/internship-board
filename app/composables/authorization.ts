export type Role = 'none' | 'admin' | 'superAdmin'

export function authorization() {
  const role = useState<Role>('role', () => 'admin') // Should be 'none' outside of testing
  
  const facID : number = 1 // Should be blank by default

  function logout() {
    role.value = 'none'
  }

  function isAdmin() {
    return role.value === 'admin' || role.value === 'superAdmin'
  }

  function isSuperAdmin() {
    return role.value === 'superAdmin'
  }

  function getFacultyID() {
    return facID
  }

  return { role, logout, isAdmin, isSuperAdmin, getFacultyID }
}   