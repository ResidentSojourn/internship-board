export const useInternshipPage = () => {
    // Get internship
    const route = useRoute()
    const raw = route.params.id
    const id = Array.isArray(raw) ? raw[0] ?? '' : raw ?? ''

    const { data, pending, error } = useInternship(Number(id))

    // Get editing capabilities
    const canEdit = computed(() =>
        data.value?.internship.AdminID == getAdminID() || isSuperAdmin()
    );

    return { data, pending, error, canEdit }
}