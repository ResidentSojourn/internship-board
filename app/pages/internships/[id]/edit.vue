<script setup lang="ts">
const {
    data,
    pending,
    error,
    form,
    tagCategories,
    selectedTags,
    updateInternship
} = useEditInternship()

import { confirmDelete } from '~/composables/adminDashboard'

const { getFacultyID } = authorization()

watchEffect(() => {
    if (
        data.value?.internship &&
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
    <InternshipForm
        v-if="form"
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