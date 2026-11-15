<script setup lang="ts">
import type { Faculty } from '~/composables/database'

const { getFacultyID } = authorization()
const { data: adminData, pending: adminCheckPending, error: adminCheckError } = await useFetch<{
    isAdmin: boolean
    faculty: Faculty[]
}>('/api/adminDashboardFaculty', {
    query: { facultyID: getFacultyID() }
})

if (adminCheckError.value || !adminData.value?.isAdmin) {
    await navigateTo('/adminDashboard')
}

const { form, pending, error, createFaculty } = useCreateFaculty()
</script>

<template>
    <p v-if="adminCheckPending" class="text-[color:var(--secondary-text)]">
        Verifying admin access...
    </p>
    <FacultyForm
        v-else-if="adminData?.isAdmin"
        :form="form"
        :pending="pending"
        :error="error"
        mode="create"
        @save="createFaculty"
        @cancel="navigateTo('/adminDashboard')"
    />
</template>
