<script setup lang="ts">
const {
    data,
    pending,
    error,
    form,
    tagCategories,
    selectedTags,
    adminPending,
    isAdmin,
    updateInternshipByForm
} = useEditInternship()

import { confirmDelete } from '~/composables/adminDashboard'

watchEffect(() => {
    if (
        !adminPending.value &&
        data.value?.internship &&
        !isAdmin.value &&
        data.value.internship.AdminID !== getAdminID()
    ) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden'
        })
    }
})
</script>

<template>
    <p v-if="adminPending" class="text-[color:var(--secondary-text)]">
        Verifying admin access...
    </p>
    <InternshipForm
        v-else-if="form"
        :form="form"
        :tag-categories="tagCategories"
        :selected-tags="selectedTags"
        :pending="pending"
        :error="error"
        :show-delete="true"
        submit-label="Save Changes"
        @save="updateInternshipByForm"
        @delete="confirmDelete(form.InternshipID)"
        @cancel="navigateTo('/adminDashboard')"
    />
</template>