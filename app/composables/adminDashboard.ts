import type { Faculty, Internship, Tag, InternshipTag } from '~/composables/database'

type IndexPageData = {
    Internships: Internship[]
    Tags: Tag[]
    InterTags: InternshipTag[]
}

type AdminDashboardFacultyData = {
    isAdmin: boolean
    faculty: Faculty[]
}

export const useAdminDashboardPage = () => {
    const { data, pending, error } = useFetch<IndexPageData>('/api/mainPageData')
    const { getFacultyID } = authorization()
    const {
        data: facultyData,
        pending: facultyPending,
        error: facultyError
    } = useFetch<AdminDashboardFacultyData>('/api/adminDashboardFaculty', {
        query: { facultyID: getFacultyID() }
    })

    const internships = computed(() => {
        return (data.value?.Internships ?? [])
            .filter(internship =>
                isAdmin.value || internship.FacultyID === getFacultyID()
            )
            .sort((a, b) => Date.parse(b.PostDate ?? '') - Date.parse(a.PostDate ?? ''))
    })

    // Use the query reactive to the search bar to filter
    const query = ref('')
    const selectedView = useState<'internships' | 'faculty'>(
        'adminDashboardSelectedView',
        () => 'internships'
    )
    const isAdmin = computed(() => facultyData.value?.isAdmin === true)

    const filteredInternships = computed(() =>
        internships.value.filter( internship =>
            // Include all matching titles, employer names, and employer companies
            internship.Title.toLowerCase().includes(query.value.toLowerCase()) ||
            internship.EmployerName?.toLowerCase().includes(query.value.toLowerCase()) ||
            internship.EmployerCompany?.toLowerCase().includes(query.value.toLowerCase())
        )
    )

    const filteredFaculty = computed(() => {
        const searchQuery = query.value.toLowerCase()

        return (facultyData.value?.faculty ?? []).filter(faculty =>
            faculty.Email.toLowerCase().includes(searchQuery) ||
            String(faculty.FacultyID).includes(searchQuery)
        )
    })

    return {
        pending: computed(() => pending.value || facultyPending.value),
        error: computed(() => error.value || facultyError.value),
        query,
        selectedView,
        isAdmin,
        filteredInternships,
        filteredFaculty
    }
}

export async function confirmDelete(internshipId: number) {
    const confirmed = window.confirm(
        'Are you sure you want to delete this internship?'
    )

    if (!confirmed) return

    const { getFacultyID } = authorization()

    try {
        await $fetch(`/api/internships/${encodeURIComponent(internshipId)}`, {
            method: 'DELETE',
            body: { requesterFacultyID: getFacultyID() }
        })

        await navigateTo('/adminDashboard')
    } catch (error) {
        console.error('Error deleting internship:', error)
        window.alert('Could not delete internship. Please try again later.')
    }
}

export async function confirmDeactivateFaculty(facultyId: number) {
    const confirmed = window.confirm(
        'Are you sure you want to deactivate this faculty member? Their record will be kept.'
    )

    if (!confirmed) return

    const { getFacultyID } = authorization()

    try {
        await $fetch(`/api/faculty/${encodeURIComponent(facultyId)}`, {
            method: 'DELETE',
            body: { requesterFacultyID: getFacultyID() }
        })

        await refreshNuxtData()
    } catch (error) {
        console.error('Error deactivating faculty:', error)
        window.alert('Could not deactivate faculty. Please try again later.')
    }
}