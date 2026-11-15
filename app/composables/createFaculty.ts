export const useCreateFaculty = () => {
    const { getFacultyID } = authorization()
    const form = reactive({
        Email: '',
        isAdmin: false
    })
    const pending = ref(false)
    const error = ref<string | null>(null)

    const createFaculty = async () => {
        error.value = null
        pending.value = true

        try {
            await $fetch('/api/faculty', {
                method: 'POST',
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
                : statusCode === 400
                    ? 'Enter a valid email address.'
                    : 'Could not create faculty. Please try again.'
        } finally {
            pending.value = false
        }
    }

    return { form, pending, error, createFaculty }
}
