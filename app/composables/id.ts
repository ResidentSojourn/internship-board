export type InternshipResponse = {
	internship: Internship
	tags: Tag[]
}

export const useInternshipPage = () => {
    const route = useRoute()
    const raw = route.params.id
    const id = Array.isArray(raw) ? raw[0] ?? '' : raw ?? ''

    const { data, pending, error } = useFetch<InternshipResponse>(
        `/api/internships/${encodeURIComponent(id)}`,
        { key: `internship-${id}` }
    )

    return { data, pending, error }
}