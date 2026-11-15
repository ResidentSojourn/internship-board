import type { Faculty } from '~/composables/database'

export const useEditFaculty = () => {
    const { getFacultyID } = authorization()
    const route = useRoute()
    const rawId = route.params.id
    const id = Array.isArray(rawId) ? rawId[0] ?? '' : rawId ?? ''
    const form = reactive({
        Email: '',
        isAdmin: false
    })
    const pending = ref(false)
    const error = ref<string | null>(null)

    const {
        data,
        pending: loading,
        error: loadError
    } = useFetch<Faculty>(`/api/faculty/${encodeURIComponent(id)}`, {
        key: `faculty-${id}`,
        query: { requesterFacultyID: getFacultyID() }
    })

    watch(data, (faculty) => {
        if (!faculty) return

        form.Email = faculty.Email
        form.isAdmin = faculty.isAdmin === 1
    }, { immediate: true })

    const updateFaculty = async () => {
        error.value = null
        pending.value = true

        try {
            await $fetch(`/api/faculty/${encodeURIComponent(id)}`, {
                method: 'PUT',
                body: {
                    Email: form.Email,
                    isAdmin: form.isAdmin,
                    requesterFacultyID: getFacultyID()
                }
            })

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
                ? 'A faculty member with this email already exists.'
                : statusCode === 404
                    ? 'This faculty member is no longer active.'
                    : statusCode === 400
                        ? 'Enter a valid email address.'
                        : 'Could not update faculty. Please try again.'
        } finally {
            pending.value = false
        }
    }

    const deactivateFaculty = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to deactivate this faculty member? Their record will be kept.'
        )

        if (!confirmed) return

        error.value = null
        pending.value = true

        try {
            await $fetch(`/api/faculty/${encodeURIComponent(id)}`, {
                method: 'DELETE',
                body: { requesterFacultyID: getFacultyID() }
            })

            await refreshNuxtData()
            await navigateTo('/adminDashboard')
        } catch (requestError) {
            console.error('Error deactivating faculty:', requestError)
            error.value = 'Could not deactivate faculty. Please try again.'
        } finally {
            pending.value = false
        }
    }

    return { data, loading, loadError, form, pending, error, updateFaculty, deactivateFaculty }
}
