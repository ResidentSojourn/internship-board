<!-- Default page -->
<script setup lang="ts">
	import { confirmDeactivateFaculty, useAdminDashboardPage } from '~/composables/adminDashboard.ts';
	
	const {
		pending,
		error,
		query,
		selectedView,
		isAdmin,
		filteredInternships,
		filteredFaculty
	} = useAdminDashboardPage()
</script>

<template>
	<p v-if="pending" class="text-[color:var(--secondary-text)]">Loading internships...</p>
	<p v-else-if="error" class="text-[color:var(--secondary-text)]">Could not load dashboard data. Please try again later.</p>
	<div v-else class="space-y-3">
		<div v-if="isAdmin" class="flex gap-2">
			<UButton
				:variant="selectedView === 'internships' ? 'solid' : 'outline'"
				@click="selectedView = 'internships'"
			>
				Internships
			</UButton>
			<UButton
				:variant="selectedView === 'faculty' ? 'solid' : 'outline'"
				@click="selectedView = 'faculty'"
			>
				Faculty
			</UButton>
		</div>

		<div class="flex items-center gap-3">
			<input
				v-model="query"
				:placeholder="selectedView === 'faculty' ? 'Search Faculty' : 'Search Internships'"
				class="flex-1 min-w-0 bg-[var(--light-background)] text-[color:var(--light-text)]
				rounded-lg ring-2 ring-[var(--light-background)] p-4"
			/>

			<UButton
				v-if="selectedView === 'internships'"
				class="button bg-[color:var(--new)] hover:[color:var(--light-new)]"
				@click="navigateTo('/internships/new')"
			>
				New
			</UButton>
			<UButton
				v-else-if="selectedView === 'faculty' && isAdmin"
				class="button bg-[color:var(--new)] hover:[color:var(--light-new)]"
				@click="navigateTo('/faculty/new')"
			>
				New
			</UButton>
		</div>

		<p v-if="selectedView === 'internships' && !filteredInternships.length" class="text-[color:var(--secondary-text)]">
            No internships found.
        </p>
		<ul v-else-if="selectedView === 'internships'" class="space-y-3">
			<li v-for="internship in filteredInternships" :key="internship.InternshipID">
				<article class="bg-[var(--secondary-background)]
						rounded-lg ring-2 ring-[var(--secondary-border)] p-4">

                    <div class="flex items-center gap-3">
                        <NuxtLink :to="`/internships/${internship.InternshipID}`">
                            <h3 class="link-title">
                                {{ internship.Title }}
                            </h3>
                        </NuxtLink>
                        
                        <h3 class="link-title">
                            (
                        </h3>

                        <NuxtLink :to="`/internships/${internship.InternshipID}/edit`">
                            <h3 class="link-title">
                                EDIT
                            </h3>
                        </NuxtLink>

                        <h3 class="link-title">
                            |
                        </h3>

                        <a href="#"
                                @click.prevent="confirmDelete(internship.InternshipID)">
                            <h3 class="link-title warningText">
                                DELETE
                            </h3>
                        </a>
                        

                        <h3 class="link-title">
                            )
                        </h3>
                    </div>

					<p class="text-[color:var(--secondary-text)]">
						{{ internship.EmployerName }}
						<span v-if="internship.EmployerCompany"> · {{ internship.EmployerCompany }}</span>
					</p>

					<p class="mt-2 text-[color:var(--secondary-text)]">
						{{ formatDescription(internship.Description) }}
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

		<p v-if="selectedView === 'faculty' && !filteredFaculty.length" class="text-[color:var(--secondary-text)]">
			No faculty found.
		</p>
		<ul v-else-if="selectedView === 'faculty'" class="space-y-3">
			<li v-for="faculty in filteredFaculty" :key="faculty.FacultyID">
				<article class="bg-[var(--secondary-background)]
						rounded-lg ring-2 ring-[var(--secondary-border)] p-4">
					<div class="flex items-center gap-3">
						<h3 class="text-xl font-bold text-[color:var(--primary-text)]">{{ faculty.Email }}</h3>
						<h3 class="link-title">(</h3>
						<NuxtLink :to="`/faculty/${faculty.FacultyID}/edit`">
							<h3 class="link-title">EDIT</h3>
						</NuxtLink>
						<h3 class="link-title">|</h3>
						<a href="#" @click.prevent="confirmDeactivateFaculty(faculty.FacultyID)">
							<h3 class="link-title warningText">DEACTIVATE</h3>
						</a>
						<h3 class="link-title">)</h3>
					</div>
					<p class="text-[color:var(--secondary-text)]">Faculty ID: {{ faculty.FacultyID }}</p>
				</article>
			</li>
		</ul>
	</div>
</template>
