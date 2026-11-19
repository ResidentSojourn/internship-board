<script setup lang="ts">
const props = defineProps<{
    form: {
        Email: string
        isSuperAdmin: boolean
    }
    mode?: 'create' | 'edit'
    showDeactivate?: boolean
    pending?: boolean
    error?: string | null
}>()

const emit = defineEmits<{
    save: []
    cancel: []
    deactivate: []
}>()
</script>

<template>
    <div class="grid grid-cols-3 min-h-[calc(100vh-4rem)] gap-3">
        <div class="col-span-2">
            <article
                class="bg-[var(--secondary-background)] rounded-lg ring-2 ring-[var(--secondary-border)] p-4"
            >
                <h1 class="text-xl font-bold text-[color:var(--primary-text)]">
                    {{ mode === 'edit' ? 'Edit Admin' : 'New Admin' }}
                </h1>

                <div class="mt-4 space-y-4 text-sm text-[color:var(--secondary-text)]">
                    <label class="block">
                        <span class="font-bold">Email</span>
                        <UInput
                            v-model="props.form.Email"
                            type="email"
                            autocomplete="email"
                            required
                            class="mt-1 w-full"
                        />
                    </label>

                    <UCheckbox
                        v-model="props.form.isSuperAdmin"
                        :label="mode === 'edit' ? 'Super Admin' : 'Grant Super Admin'"
                        :ui="{ label: 'text-[color:var(--primary-text)]' }"
                    />
                </div>

                <p v-if="error" class="mt-4 text-[color:var(--warning)]">
                    {{ error }}
                </p>

                <div class="flex justify-center mt-6 gap-5">
                    <button
                        v-if="showDeactivate"
                        class="button px-4 py-2 bg-[color:var(--warning)] hover:bg-[color:var(--light-warning)]"
                        :disabled="pending"
                        @click="emit('deactivate')"
                    >
                        Deactivate Admin
                    </button>

                    <button
                        class="button px-4 py-2 bg-[color:var(--back)] hover:[color:var(--light-back)]"
                        :disabled="pending"
                        @click="emit('cancel')"
                    >
                        Cancel
                    </button>

                    <button
                        class="button px-4 py-2 bg-[color:var(--deep-background)] hover:[color:var(--light-background)]"
                        :disabled="pending"
                        @click="emit('save')"
                    >
                        {{ pending
                            ? (mode === 'edit' ? 'Saving...' : 'Creating...')
                            : (mode === 'edit' ? 'Save Changes' : 'Create Admin') }}
                    </button>
                </div>
            </article>
        </div>

        <aside
            class="col-span-1 rounded-lg bg-[var(--secondary-background)]
            ring-2 ring-[var(--secondary-border)] p-4 text-[color:var(--secondary-text)]"
        >
            <h2 class="font-bold text-[color:var(--primary-text)]">
                {{ mode === 'edit' ? 'Admin Editing Details:' : 'Admin Creation Details:' }}
            </h2>
            <p class="mt-2">
                Admin emails must be unique. 
            </p>
            <p class="mt-2">
                Super admins can create, edit, and deactivate admins.
            </p>
        </aside>
    </div>
</template>
