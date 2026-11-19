export const useEditAdmin = () => {
    const route = useRoute()
    const rawId = route.params.id
    const id = Array.isArray(rawId) ? rawId[0] ?? '' : rawId ?? ''
    const form = reactive({
        Email: '',
        isSuperAdmin: false
    })
    const pending = ref(false)
    const error = ref<string | null>(null)

    const {
        data,
        pending: loading,
        error: loadError
    } = useAdmin(Number(id))

    watch(data, (admin) => {
        if (!admin) return

        form.Email = admin.Email
        form.isSuperAdmin = admin.isSuperAdmin === 1
    }, { immediate: true })

    const updateAdminByForm = async () => {
        error.value = null
        pending.value = true

        try {
            await updateAdmin(Number(id), form)

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
                : statusCode === 404
                    ? 'This admin is no longer active.'
                    : statusCode === 400
                        ? 'Enter a valid email address.'
                        : 'Could not update admin. Please try again.'
        } finally {
            pending.value = false
        }
    }

    const deactivateAdmin = async () => {
        const confirmed = window.confirm(
            'Are you sure you want to deactivate this admin? Their record will be kept.'
        )

        if (!confirmed) return

        error.value = null
        pending.value = true

        try {
            await deleteAdmin(Number(id))

            await refreshNuxtData()
            await navigateTo('/adminDashboard')
        } catch (requestError) {
            console.error('Error deactivating admin:', requestError)
            error.value = 'Could not deactivate admin. Please try again.'
        } finally {
            pending.value = false
        }
    }

    return { data, loading, loadError, form, pending, error, updateAdminByForm, deactivateAdmin }
}
