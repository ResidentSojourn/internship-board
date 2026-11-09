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

    const form = ref<Internship>()

    watchEffect(() => {
        if (data.value?.internship) {
            form.value = { ...data.value.internship }
        }
    })

    const updateInternship = async () => {
        await $fetch(`/api/internships/${route.params.id}`, {
            method: 'PUT',
            body: form
        })
    }

    return { data, pending, error, form, updateInternship }
}