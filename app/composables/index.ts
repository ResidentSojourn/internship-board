import type { Internship, Tag, InternshipTag } from '~/composables/database'

export const useIndexPage = () => {
    const { data, pending, error } = useFetch<IndexPageData>('/api/mainPageData')
    const tagFilters = reactive<Record<number, boolean>>({})

    const tagCategories = computed(() => {
        const categories = new Map<number, { id: number, name: string, tags: Tag[] }>()

        for (const tag of data.value?.Tags ?? []) {
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

    const selectedTagIdsByCategory = computed(() => {
        const selectedByCategory = new Map<number, number[]>()

        for (const tag of data.value?.Tags ?? []) {
            if (!tagFilters[tag.TagID]) {
                continue
            }

            const selectedTagIds = selectedByCategory.get(tag.CategoryID) ?? []
            selectedTagIds.push(tag.TagID)
            selectedByCategory.set(tag.CategoryID, selectedTagIds)
        }

        return [...selectedByCategory.values()]
    })

    const internships = computed(() => {
        const now = Date.now()

        return (data.value?.Internships ?? [])
            .filter(internship => !internship.ExpDate || Date.parse(internship.ExpDate) >= now)
            .filter(internship =>
                selectedTagIdsByCategory.value.every(categoryTagIds =>
                    categoryTagIds.some(tagID =>
                        data.value?.InterTags.some(tag =>
                            tag.InternshipID === internship.InternshipID && tag.TagID === tagID,
                        ),
                    ),
                )
            )
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

    return { pending, error, tagFilters, tagCategories, query, filteredInternships }
}


export function formatDate(value: string | null) {
    if (!value) {
        return 'Not specified'
    }

    const date = /^(\d{4})-(\d{2})-(\d{2})/.exec(value)
    if (!date) {
        return value.split(' ')[0]
    }

    return new Intl.DateTimeFormat('en-US', {
        month: 'long',
        day: 'numeric',
        timeZone: 'UTC',
    }).format(new Date(Date.UTC(Number(date[1]), Number(date[2]) - 1, Number(date[3]))))
}

export function isHttpLink(value: string | null): value is string {
    return value !== null && /^https?:\/\//i.test(value)
}

export function formatDescription(description: string | null) {
		if (!description) {
			return 'No description provided.'
		}

		return description.length > 280
			? `${description.slice(0, 277)}...`
			: description
	}