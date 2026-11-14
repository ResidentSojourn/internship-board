<script setup lang="ts">
const {
    form,
    tagCategories,
    selectedTags,
    createInternship
} = useCreateInternship()
</script>

<template>
    <InternshipForm
        :form="form"
        :tag-categories="tagCategories"
        :selected-tags="selectedTags"
        submit-label="Create Internship"
        @save="createInternship"
        @cancel="navigateTo('/adminDashboard')"
    />
</template>