import type { Internship, Tag, InternshipTag } from '~/composables/database'

type IndexPageData = {
    Internships: Internship[]
    Tags: Tag[]
    InterTags: InternshipTag[]
}

export const useAdminDashboardPage = () => {
    const { data, pending, error } = useFetch<IndexPageData>('/api/mainPageData')

    const { getFacultyID } = authorization()

    const internships = computed(() => {
        console.log('Internships:', data.value?.Internships)

        return (data.value?.Internships ?? [])
            .filter(internship => internship.FacultyID == getFacultyID())
            .sort((a, b) => Date.parse(b.PostDate ?? '') - Date.parse(a.PostDate ?? ''))
    })

    // Use the query reactive to the search bar to filter
    const query = ref('')

    const filteredInternships = computed(() =>
        internships.value.filter( internship =>
            // Include all matching titles, employer names, and employer companies
            internship.Title.toLowerCase().includes(query.value.toLowerCase()) ||
            internship.EmployerName?.toLowerCase().includes(query.value.toLowerCase()) ||
            internship.EmployerCompany?.toLowerCase().includes(query.value.toLowerCase())
        )
    )

    // Internship deletion logic
    const confirmDelete = async (internshipId: number) => {
        const confirmed = window.confirm(
            'Are you sure you want to delete this internship?'
        )

        if (!confirmed) return

        // Delete internship stub
    }

    return { pending, error, query, filteredInternships, confirmDelete }
}