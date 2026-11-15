<script setup lang="ts">
const {
    data,
    pending,
    error,
    form,
    tagCategories,
    selectedTags,
    facultyPending,
    isAdmin,
    updateInternship
} = useEditInternship()

import { confirmDelete } from '~/composables/adminDashboard'

const { getFacultyID } = authorization()

watchEffect(() => {
    if (
        !facultyPending.value &&
        data.value?.internship &&
        !isAdmin.value &&
        data.value.internship.FacultyID !== getFacultyID()
    ) {
        throw createError({
            statusCode: 403,
            statusMessage: 'Forbidden'
        })
    }
})
</script>

<template>
    <p v-if="facultyPending" class="text-[color:var(--secondary-text)]">
        Verifying faculty access...
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
        @save="updateInternship"
        @delete="confirmDelete(form.InternshipID)"
        @cancel="navigateTo('/adminDashboard')"
    />
</template>