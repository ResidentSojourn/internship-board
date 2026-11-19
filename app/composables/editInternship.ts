export const useEditInternship = () => {
    const form = ref<InternshipForm>()
    const {
        data: currentAdmin,
        pending: adminPending
    } = useAdminData()
    const isAdmin = computed(() => currentAdmin.value?.isSuperAdmin === true)
    
    // Get internship from URL
    const route = useRoute()
    const raw = route.params.id
    const id = Array.isArray(raw) ? raw[0] ?? '' : raw ?? ''

    // Fetch internship
    const { data, pending, error, refresh } = useInternship(Number(id))

    // Fetch all tags
    const { data: allTags, pending: tagsPending, error: tagsError } = useAllTags()

    // Track currently selected tags
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

    // Initialize checkbox values from existing internship tags
    watch(
        () => data.value?.tags,
        (tags) => {
            if (!tags) return

            // Clear previous selections
            Object.keys(selectedTags).forEach(key => {
                delete selectedTags[Number(key)]
            })

            tags.forEach(tag => {
                selectedTags[tag.TagID] = true
            })
        },
        { immediate: true }
    )

    // Get all selected tag IDs
    const selectedTagIDs = computed(() =>
        Object.entries(selectedTags)
            .filter(([_, selected]) => selected)
            .map(([tagID]) => Number(tagID))
    )

    // Make editable internship fields
    watch(
    () => data.value?.internship,
    (internship) => {
        if (internship && !form.value) {
            form.value = {
                ...internship,
                Title: internship.Title ?? '',
                EmployerName: internship.EmployerName ?? '',
                EmployerContact: internship.EmployerContact ?? '',
                Description: internship.Description ?? '',
                ExpDate: internship.ExpDate ?? '',
                Link: internship.Link ?? '',
            }
        }
    },
    { immediate: true }
)

    // Update internship
    const updateInternshipByForm = async () => {
        if (!form.value) return

        try {
            const response = await updateInternship(form.value, selectedTagIDs.value, Number(id))

            console.log('Internship updated:', response)
            
            await navigateTo('/adminDashboard')
        } catch (error) {
            console.error('Error updating internship:', error)
            window.alert('Could not update internship. Please try again later.')
        }
    }

    return {
        data,
        pending,
        error,
        form,
        tagCategories,
        selectedTags,
        selectedTagIDs,
        adminPending,
        isAdmin,
        updateInternshipByForm
    }
}
