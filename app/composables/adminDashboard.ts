export const useAdminDashboardPage = () => {
    const { data, pending, error } = useMainPageData()
    
    // Get admin ID and whether they are super admin
    const {
        data: adminsData,
        pending: adminsPending,
        error: adminsError
    } = useAdminData()

    const superAdmin = isSuperAdmin()

    // Get the active view
    const selectedView = useState<'internships' | 'admins' | 'board'>(
        'adminDashboardSelectedView',
        () => 'internships'
    )

    // Filter internships
    const internships = computed(() => {
        return (data.value?.Internships ?? [])
            .filter((internship : Internship) =>
                superAdmin || internship.AdminID === getAdminID()
            )
            .sort((a : Internship, b : Internship) => Date.parse(b.PostDate ?? '') - Date.parse(a.PostDate ?? ''))
    })

    // Use the query reactive to the search bar to filter
    const query = ref('')

    const filteredInternships = computed(() =>
        internships.value.filter( (internship : Internship) =>
            // Include all matching titles, employer names, and employer companies
            internship.Title.toLowerCase().includes(query.value.toLowerCase()) ||
            internship.EmployerName?.toLowerCase().includes(query.value.toLowerCase()) ||
            internship.EmployerCompany?.toLowerCase().includes(query.value.toLowerCase())
        )
    )

    // Use the query for reactive to the search bar to filter admins
    const filteredAdmins = computed(() => {
        const searchQuery = query.value.toLowerCase()

        return (adminsData.value?.admins ?? []).filter((admin : Admin) =>
            admin.Email.toLowerCase().includes(searchQuery) ||
            String(admin.AdminID).includes(searchQuery)
        )
    })

    return {
        pending: computed(() => pending.value || adminsPending.value),
        error: computed(() => error.value || adminsError.value),
        query,
        superAdmin,
        selectedView,
        filteredInternships,
        filteredAdmins
    }
}

export async function confirmDelete(internshipId: number) {
    const confirmed = window.confirm(
        'Are you sure you want to delete this internship?'
    )

    if (!confirmed) return

    try {
        await deleteInternship(internshipId)

        await navigateTo('/adminDashboard')
        await refreshNuxtData()
    } catch (error) {
        console.error('Error deleting internship:', error)
        window.alert('Could not delete internship. Please try again later.')
    }
}

export async function confirmDeactivateAdmin(adminId: number) {
    const confirmed = window.confirm(
        'Are you sure you want to deactivate this admin? Their record will be kept.'
    )

    if (!confirmed) return

    try {
        await deleteAdmin(adminId)

        await refreshNuxtData()
    } catch (error) {
        console.error('Error deactivating admin:', error)
        window.alert('Could not deactivate admin. Please try again later.')
    }
}

export const useCreateInternship = () => {
    const form = ref<InternshipForm>({
        Title: '',
        Description: '',
        ExpDate: '',
        Link: '',
    } as InternshipForm)

    // Fetch all available tags
    const { data: allTags } = useAllTags()

    // Track selected tags
    const selectedTags = reactive<Record<number, boolean>>({})

    // Organize tags by category
    const tagCategories = computed(() => {
        const categories = new Map<
            number,
            { id: number, name: string, tags: Tag[] }
        >()

        for (const tag of allTags.value ?? []) {
            let category = categories.get(tag.CategoryID)

            if (!category) {
                category = {
                    id: tag.CategoryID,
                    name: tag.Category ?? 'Other',
                    tags: [],
                }

                categories.set(tag.CategoryID, category)
            }

            category.tags.push(tag)
        }

        return [...categories.values()]
    })

    // Get selected tag IDs
    const selectedTagIDs = computed(() =>
        Object.entries(selectedTags)
            .filter(([_, selected]) => selected)
            .map(([tagID]) => Number(tagID))
    )

    // Create internship
    const createInternshipByForm = async () => {
        try {
            const response = await createInternship(form.value, selectedTagIDs.value)

            console.log('Internship created:', response)

            await navigateTo('/adminDashboard')
        } catch (error) {
            console.error('Error creating internship:', error)
        }
    }

    return {
        form,
        tagCategories,
        selectedTags,
        selectedTagIDs,
        createInternship: createInternshipByForm,
    }
}

export const useCreateAdmin = () => {
    const form = reactive({
        Email: '',
        isSuperAdmin: false
    })
    const pending = ref(false)
    const error = ref<string | null>(null)

    const createAdminByForm = async () => {
        error.value = null
        pending.value = true

        try {
            await createAdmin(form)

            await refreshNuxtData()
            await navigateTo('/adminDashboard')
        } catch (requestError) {
            const statusCode = requestError &&
                typeof requestError === 'object' &&
                'statusCode' in requestError &&
                typeof requestError.statusCode === 'number'
                ? requestError.statusCode
                : undefined
            error.value = statusCode === 409
                ? 'An admin with this email already exists.'
                : statusCode === 400
                    ? 'Enter a valid email address.'
                    : 'Could not create admin. Please try again.'
        } finally {
            pending.value = false
        }
    }

    return { form, pending, error, createAdmin: createAdminByForm }
}
