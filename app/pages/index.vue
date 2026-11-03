<!-- Default page -->
<script setup lang="ts">
	import { useIndexPage } from '~/composables/index';
	
	const { pending, error, tagFilters, tagCategories, query, filteredInternships } = useIndexPage()
</script>

<template>
	<div class="grid grid-cols-3 min-h-[calc(100vh-4rem)] gap-3">
		<!-- Top internships view -->
		<div class="col-span-2">
			<p v-if="pending" class="text-[color:var(--secondary-text)]">Loading internships...</p>
			<p v-else-if="error" class="text-[color:var(--secondary-text)]">Could not load internships. Please try again later.</p>
			<div v-else class="space-y-3">
				<input v-model="query" placeholder="Search Internships" style="width: 100%"
						class="bg-[var(--light-background)] text-[color:var(--light-text)]
						rounded-lg ring-2 ring-[var(--light-background)] p-4" />

				<p v-if="filteredInternships.length === 0" class="text-[color:var(--secondary-text)]">No internships found.</p>
				<ul v-else class="space-y-3">
					<li v-for="internship in filteredInternships" :key="internship.InternshipID">
						<article class="bg-[var(--secondary-background)]
								rounded-lg ring-2 ring-[var(--secondary-border)] p-4">

							<NuxtLink :to="`/internships/${internship.InternshipID}`">
								<h3 class="text-xl font-bold text-[color:var(--primary-text)]">
									{{ internship.Title }}
								</h3>
							</NuxtLink>

							<p class="text-[color:var(--secondary-text)]">
								{{ internship.EmployerName }}
								<span v-if="internship.EmployerCompany"> · {{ internship.EmployerCompany }}</span>
							</p>

							<p class="mt-2 text-[color:var(--secondary-text)]">
								{{ internship.Description || 'No description provided.' }}
							</p>

							<div class="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[color:var(--secondary-text)]">
								<span>Posted: {{ formatDate(internship.PostDate) }}</span>
								<span>Expires: {{ formatDate(internship.ExpDate) }}</span>
								<a
									v-if="isHttpLink(internship.Link)"
									:href="internship.Link"
									target="_blank"
									rel="noopener noreferrer"
									class="text-[color:var(--primary-text)] underline"
								>
									View internship
								</a>
							</div>
						</article>
					</li>
				</ul>
			</div>
		</div>

		<!-- Tags view -->
		<div class="col-span-1 bg-[var(--secondary-background)]
				rounded-lg ring-2 ring-[var(--secondary-border)]
				p-4 text-[color:var(--secondary-text)]">
			<p v-if="pending">Loading filters...</p>
			<ul v-else class="space-y-4">
				<li v-for="category in tagCategories" :key="category.id">
					<h2 class="font-bold">{{ category.name }}</h2>
					<ul class="mt-2 space-y-1">
						<li v-for="tag in category.tags" :key="tag.TagID">
							<UCheckbox
								v-model="tagFilters[tag.TagID]"
								:label="tag.TagTitle"
								:ui="{ label: 'text-[color:var(--primary-text)]' }"
							/>
						</li>
					</ul>
				</li>
			</ul>
		</div>
	</div>
</template>
