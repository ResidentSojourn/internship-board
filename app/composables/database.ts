// Internship Types and Functions

export type Internship = {
    InternshipID: number
    EmployerID: number
    AdminID: number
    Title: string
    Description: string | null
    PostDate: string | null
    ExpDate: string | null
    Link: string | null
    EmployerName: string | null
    EmployerCompany: string | null
	EmployerContact: string | null
	AdminEmail: string | null
}

export type InternshipResponse = {
	internship: Internship
	tags: Tag[]
}

export function useInternship(id : number) {
    return useFetch<InternshipResponse>(
        `/api/internships/${encodeURIComponent(id)}`,
        { key: `internship-${id}` }
    )
}

export type InternshipForm = Omit<
    Internship,
    'Title' | 'Description' | 'ExpDate' | 'Link'
> & {
    Title: string
    Description: string
    ExpDate: string
    Link: string
}

export function createInternship(form: InternshipForm, selectedTagIDs: number[]) {
    return $fetch('/api/internships', {
                method: 'POST',
                body: {
                    ...form,
                    AdminID: getAdminID(),
                    tagIDs: selectedTagIDs,
                },
            })
}

export function updateInternship(form : InternshipForm, selectedTagIDs : number[], id : number) {
    return $fetch(
                `/api/internships/${encodeURIComponent(id)}`,
                {
                    method: 'PUT',
                    body: {
                        ...form,
                        tagIDs: selectedTagIDs,
                        requesterAdminID: getAdminID(),
                    },
                }
        )
}

export function deleteInternship(internshipId: number) {
    return $fetch(`/api/internships/${encodeURIComponent(internshipId)}`, {
            method: 'DELETE',
            body: { requesterAdminID: getAdminID() }
        })
}

// Tag Types and Functions

export type Tag = {
    TagID: number
    TagTitle: string
    CategoryID: number
    Category: string | null
}

export function useAllTags() {
    return useFetch<Tag[]>('/api/tags', {
    key: 'tags',
  })
}

export type InternshipTag = {
    InternshipID: number
    TagID: number
}

// Admin Types and Functions

export type Admin = {
    AdminID: number
    Email: string
    isSuperAdmin: number
    isActive: number
}

export function useAdmin(adminID: number) {
    return useFetch<Admin>(`/api/admin/${encodeURIComponent(adminID)}`, {
        key: `admin-${adminID}`,
        query: { requesterAdminID: getAdminID() }
    })
}

export type AdminForm = {
    Email : string
    isSuperAdmin : boolean
}

export function createAdmin(form : AdminForm) {
    return $fetch('/api/admin', {
                method: 'POST',
                body: {
                    Email: form.Email,
                    isSuperAdmin: form.isSuperAdmin,
                    requesterAdminID: getAdminID()
                }
            })
}

export function updateAdmin(id : number, form : AdminForm) {
    return $fetch(`/api/admin/${encodeURIComponent(id)}`, {
                method: 'PUT',
                body: {
                    Email: form.Email,
                    isSuperAdmin: form.isSuperAdmin,
                    requesterAdminID: getAdminID()
                }
            })
}

export function deleteAdmin(adminId: number) {
    return $fetch(`/api/admin/${encodeURIComponent(adminId)}`, {
            method: 'DELETE',
            body: { requesterAdminID: getAdminID() }
        })
}

export type AdminsData = {
    isAdmin: boolean
    admins: Admin[]
}

export function useAdminData() {
    return useFetch<AdminsData>('/api/adminDashboardAdmins', {
        key: 'adminDashboardAdmins',
        query: { adminID: getAdminID() }
    })
}

// Specific Page Types and Functions

export type HomeData = {
    Internships: Internship[]
    Tags: Tag[]
    InterTags: InternshipTag[]
}

export function useMainPageData() {
  return useFetch<HomeData>('/api/mainPageData', {
    key: 'mainPageData',
  })
}