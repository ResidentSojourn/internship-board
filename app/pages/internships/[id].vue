<script setup lang="ts">
	import { useInternshipPage } from '~/composables/id';
	
	const { data, pending, error } = useInternshipPage()
</script>

<template>
	<div class="grid grid-cols-3 min-h-[calc(100vh-4rem)] gap-3">
		<div class="col-span-2">
			<p v-if="pending" class="text-[color:var(--secondary-text)]">Loading internship...</p>
			<p v-else-if="error" class="text-[color:var(--secondary-text)]">
				{{ error.statusCode === 404 ? 'Internship not found.' : 'Could not load this internship. Please try again later.' }}
			</p>
			<article
				v-else-if="data"
				class="bg-[var(--secondary-background)] rounded-lg ring-2 ring-[var(--secondary-border)] p-4"
			>
				<h1 class="text-xl font-bold text-[color:var(--primary-text)]">
					{{ data.internship.Title }}
				</h1>

				<p class="mt-1 font-semibold text-[color:var(--secondary-text)]">
					{{ data.internship.EmployerName }}
					<span v-if="data.internship.EmployerCompany"> · {{ data.internship.EmployerCompany }}</span>
				</p>

				<p class="mt-4 whitespace-pre-line text-[color:var(--secondary-text)]">
					{{ data.internship.Description || 'No description provided.' }}
				</p>

				<dl class="mt-4 space-y-2 text-sm text-[color:var(--secondary-text)]">
					<div>
						<dt class="inline font-bold">Posted: </dt>
						<dd class="inline">{{ formatDate(data.internship.PostDate) }}</dd>
					</div>
					<div>
						<dt class="inline font-bold">Expires: </dt>
						<dd class="inline">{{ formatDate(data.internship.ExpDate) }}</dd>
					</div>
					<div v-if="data.internship.EmployerContact">
						<dt class="inline font-bold">Employer contact: </dt>
						<dd class="inline">{{ data.internship.EmployerContact }}</dd>
					</div>
					<div v-if="data.internship.FacultyEmail">
						<dt class="inline font-bold">Faculty contact: </dt>
						<dd class="inline">{{ data.internship.FacultyEmail }}</dd>
					</div>
					<div v-if="isHttpLink(data.internship.Link)">
						<dt class="inline font-bold">More information: </dt>
						<dd class="inline">
							<a
								:href="data.internship.Link"
								target="_blank"
								rel="noopener noreferrer"
								class="text-[color:var(--primary-text)] underline"
							>
								View internship
							</a>
						</dd>
					</div>
				</dl>
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
