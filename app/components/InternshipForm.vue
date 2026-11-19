<script setup lang="ts">
type TagCategory = {
    id: number
    name: string
    tags: Tag[]
}

const props = defineProps<{
    form: InternshipForm
    tagCategories: TagCategory[]
    selectedTags: Record<number, boolean>
    pending?: boolean
    error?: { statusCode?: number } | null
    submitLabel?: string
    showDelete?: boolean
}>()

const emit = defineEmits<{
    save: []
    delete: []
    cancel: []
}>()
</script>

<template>
    <div class="grid grid-cols-3 min-h-[calc(100vh-4rem)] gap-3">
        <div class="col-span-2">
            <p v-if="pending" class="text-[color:var(--secondary-text)]">
                Loading internship...
            </p>

            <p v-else-if="error" class="text-[color:var(--secondary-text)]">
                {{ error.statusCode === 404
                    ? 'Internship not found.'
                    : 'Could not load this internship. Please try again later.' }}
            </p>

            <article
                v-else
                class="bg-[var(--secondary-background)] rounded-lg ring-2 ring-[var(--secondary-border)] p-4"
            >
                <div class="mt-4 space-y-2 text-sm text-[color:var(--secondary-text)]">
                    <label class="block">
                        <span class="font-bold">Title</span>
                        <UInput v-model="form.Title" class="mt-1 w-full rounded border p-2" />
                    </label>

                    <label class="block mt-4">
                        <span class="font-bold">Description</span>
                        <UTextarea
                            v-model="form.Description"
                            :rows="8"
                            class="mt-1 w-full rounded border p-2"
                        />
                    </label>

                    <label class="block mt-4">
                        <span class="font-bold">Expiration Date</span>
                        <UInput
                            v-model="form.ExpDate"
                            type="date"
                            class="mt-1 rounded border p-2"
                        />
                    </label>

                    <label class="block mt-4">
                        <span class="font-bold">More Information Link</span>
                        <UInput
                            v-model="form.Link"
                            type="url"
                            class="mt-1 w-full rounded border p-2"
                        />
                    </label>
                </div>

                <div class="flex justify-center mt-6 gap-5">
                    <button
                        class="button px-4 py-2 bg-[color:var(--new)] hover:[color:var(--light-new)]"
                        @click="emit('save')"
                    >
                        {{ submitLabel ?? 'Save Changes' }}
                    </button>
                    
                    <button
                        class="button px-4 py-2 bg-[color:var(--back)] hover:[color:var(--light-back)]"
                        @click="emit('cancel')"
                    >
                        Cancel
                    </button>

                    <button
                        v-if="showDelete"
                        class="button px-4 py-2 bg-[color:var(--warning)] hover:[color:var(--light-warning)]"
                        @click="emit('delete')"
                    >
                        Delete Internship
                    </button>
                </div>
            </article>
        </div>

        <aside
            class="col-span-1 rounded-lg bg-[var(--secondary-background)]
            ring-2 ring-[var(--secondary-border)] p-4 text-[color:var(--secondary-text)]"
        >
            <h2 class="font-bold text-[color:var(--primary-text)]">
                Internship Details:
            </h2>

            <ul v-if="tagCategories.length" class="mt-2 space-y-4">
                <li v-for="category in tagCategories" :key="category.id">
                    <details open>
                        <summary class="cursor-pointer font-bold">
                            {{ category.name }}
                        </summary>

                        <ul class="mt-2 space-y-1">
                            <li v-for="tag in category.tags" :key="tag.TagID">
                                <UCheckbox
                                    v-model="selectedTags[tag.TagID]"
                                    :label="tag.TagTitle"
                                    :ui="{ label: 'text-[color:var(--primary-text)]' }"
                                />
                            </li>
                        </ul>
                    </details>
                </li>
            </ul>

            <p v-else class="mt-2">
                No details available.
            </p>
        </aside>
    </div>
</template>