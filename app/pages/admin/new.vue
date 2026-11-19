<script setup lang="ts">
import { useCreateAdmin } from '~/composables/adminDashboard'

const { data: adminData, pending: adminCheckPending, error: adminCheckError } = await useFetch<{
    isAdmin: boolean
    admins: Admin[]
}>('/api/adminDashboardAdmins', {
    query: { adminID: getAdminID() }
})

if (adminCheckError.value || !adminData.value?.isAdmin) {
    await navigateTo('/adminDashboard')
}

const { form, pending, error, createAdmin } = useCreateAdmin()
</script>

<template>
    <p v-if="adminCheckPending" class="text-[color:var(--secondary-text)]">
        Verifying admin access...
    </p>
    <AdminForm
        v-else-if="adminData?.isAdmin"
        :form="form"
        :pending="pending"
        :error="error"
        mode="create"
        @save="createAdmin"
        @cancel="navigateTo('/adminDashboard')"
    />
</template>
