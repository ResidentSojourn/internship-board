<script setup lang="ts">
	import { useInternshipPage } from '~/composables/id';
	
	const { data, pending, error, form, updateInternship } = useInternshipPage()

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
	<div class="grid grid-cols-3 min-h-[calc(100vh-4rem)] gap-3">
		<div class="col-span-2">
			<p v-if="pending" class="text-[color:var(--secondary-text)]">Loading internship...</p>
			<p v-else-if="error" class="text-[color:var(--secondary-text)]">
				{{ error.statusCode === 404 ? 'Internship not found.' : 'Could not load this internship. Please try again later.' }}
			</p>
			<article
				v-else-if="data && form"
				class="bg-[var(--secondary-background)] rounded-lg ring-2 ring-[var(--secondary-border)] p-4"
			>
                <div class="mt-4 space-y-2 text-sm text-[color:var(--secondary-text)]">
                    <label class="block">
                        <span class="font-bold">Title</span>
                        <input
                            v-model="form.Title"
                            class="mt-1 w-full rounded border p-2"
                        >
                    </label>

                    <label class="block mt-4">
                        <span class="font-bold">Description</span>
                        <textarea
                            v-model="form.Description"
                            rows="8"
                            class="mt-1 w-full rounded border p-2"
                        />
                    </label>

					<label class="block mt-4">
						<span class="font-bold">Expiration Date </span>
						<input
							v-model="form.ExpDate"
							type="date"
							class="mt-1 rounded border p-2"
						>
					</label>
                    
                    <label class="block mt-4">
                        <span class="font-bold">Employer Name</span>
                        <input
                            v-model="form.EmployerName"
                            class="mt-1 w-full rounded border p-2"
                        >
                    </label>

					<label class="block mt-4">
						<span class="font-bold">Employer Contact</span>
						<input
							v-model="form.EmployerContact"
							type="email"
							class="mt-1 w-full rounded border p-2"
						>
					</label>

					<label class="block mt-4">
						<span class="font-bold">More Information Link</span>
						<input
							v-model="form.Link"
							type="url"
							class="mt-1 w-full rounded border p-2"
						>
					</label>
				</div>

                <div class="flex justify-center mt-6">
                    <button
                        class="rounded bg-[color:var(--deep-background)] px-4 py-2 text-[color:var(--secondary-text)]
                                transition-all duration-200
                                hover:[color:var(--light-background)]
                                hover:shadow-lg
                                active:scale-95"
                        @click="updateInternship"
                    >
                        Save Changes
                    </button>
                </div>
			</article>
		</div>

		<aside class="col-span-1 rounded-lg bg-[var(--secondary-background)]
				ring-2 ring-[var(--secondary-border)] p-4 text-[color:var(--secondary-text)]">
			<h2 class="font-bold text-[color:var(--primary-text)]">Internship Details:</h2>
			<p v-if="pending" class="mt-2">Loading details...</p>
			<p v-else-if="error" class="mt-2">Details are unavailable.</p>
			<p v-else-if="data?.tags.length === 0" class="mt-2">No details available.</p>
			<ul v-else-if="data" class="mt-2 space-y-2">
				<li v-for="tag in data.tags" :key="tag.TagID">
					<!-- <span class="text-[color:var(--secondary-text)]">{{ tag.Category || 'Other' }}:</span> -->
					<span class="ml-1 font-semibold text-[color:var(--primary-text)]">{{ tag.TagTitle }}</span>
				</li>
			</ul>
		</aside>
	</div>
</template>
