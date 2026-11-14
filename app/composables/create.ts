export const useCreateInternship = () => {
    const { getFacultyID } = authorization()

    const form = ref<InternshipForm>({
        Title: '',
        Description: '',
        ExpDate: '',
        Link: '',
    } as InternshipForm)

    // Fetch all available tags
    const { data: allTags } = useFetch<Tag[]>('/api/tags')

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
    const createInternship = async () => {
        try {
            const response = await $fetch('/api/internships', {
                method: 'POST',
                body: {
                    ...form.value,
                    FacultyID: getFacultyID(),
                    tagIDs: selectedTagIDs.value,
                },
            })

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
        createInternship,
    }
}