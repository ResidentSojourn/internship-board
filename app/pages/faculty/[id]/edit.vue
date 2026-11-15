<script setup lang="ts">
const {
    data,
    loading,
    loadError,
    form,
    pending,
    error,
    updateFaculty,
    deactivateFaculty
} = useEditFaculty()
</script>

<template>
    <p v-if="loading" class="text-[color:var(--secondary-text)]">
        Loading faculty member...
    </p>
    <p v-else-if="loadError || !data" class="text-[color:var(--secondary-text)]">
        Could not load this faculty member. They may no longer be active.
    </p>
    <FacultyForm
        v-else
        :form="form"
        :pending="pending"
        :error="error"
        mode="edit"
        :show-deactivate="true"
        @save="updateFaculty"
        @deactivate="deactivateFaculty"
        @cancel="navigateTo('/adminDashboard')"
    />
</template>
