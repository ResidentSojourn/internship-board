<script setup lang="ts">
import { useEditAdmin } from '~/composables/editAdmin'

const {
    data,
    loading,
    loadError,
    form,
    pending,
    error,
    updateAdminByForm,
    deactivateAdmin
} = useEditAdmin()
</script>

<template>
    <p v-if="loading" class="text-[color:var(--secondary-text)]">
        Loading admin...
    </p>
    <p v-else-if="loadError || !data" class="text-[color:var(--secondary-text)]">
        Could not load this admin. They may no longer be active.
    </p>
    <AdminForm
        v-else
        :form="form"
        :pending="pending"
        :error="error"
        mode="edit"
        :show-deactivate="true"
        @save="updateAdminByForm"
        @deactivate="deactivateAdmin"
        @cancel="navigateTo('/adminDashboard')"
    />
</template>
