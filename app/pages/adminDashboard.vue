<!-- Default page -->
<script setup lang="ts">
	const {
		pending,
		error,
		query,
		superAdmin,
		selectedView,
		filteredInternships,
		filteredAdmins
	} = useAdminDashboardPage()

</script>

<template>
	<p v-if="pending" class="text-[color:var(--secondary-text)]">Loading internships...</p>
	<p v-else-if="error" class="text-[color:var(--secondary-text)]">Could not load dashboard data. Please try again later.</p>
	<div v-else class="space-y-3">
		<div v-if="superAdmin" class="flex gap-2">
			<UButton
				:variant="selectedView === 'internships' ? 'solid' : 'outline'"
				@click="selectedView = 'internships'"
			>
				Internships
			</UButton>

			<UButton
				:variant="selectedView === 'admins' ? 'solid' : 'outline'"
				@click="selectedView = 'admins'"
			>
				Admins
			</UButton>

			<UButton
				:variant="selectedView === 'board' ? 'solid' : 'outline'"
				@click="selectedView = 'board'"
			>
				Board
			</UButton>
		</div>

		<div class="flex items-center gap-3">
			<input
				v-model="query"
				:placeholder="selectedView === 'admins' ? 'Search Admins' : 'Search Internships'"
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
				v-else-if="selectedView === 'admins'"
				class="button bg-[color:var(--new)] hover:[color:var(--light-new)]"
				@click="navigateTo('/admin/new')"
			>
				New
			</UButton>
		</div>

		<!-- Internships View -->
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
                                @click.prevent="confirmDelete(internship.InternshipID);">
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

		<!-- Admins View -->
		<p v-if="selectedView === 'admins' && !filteredAdmins.length" class="text-[color:var(--secondary-text)]">
			No admins found.
		</p>
		<ul v-else-if="selectedView === 'admins'" class="space-y-3">
			<li v-for="admin in filteredAdmins" :key="admin.AdminID">
				<article class="bg-[var(--secondary-background)]
						rounded-lg ring-2 ring-[var(--secondary-border)] p-4">
					<div class="flex items-center gap-3">

						<h3 class="text-xl font-bold text-[color:var(--primary-text)]">{{ admin.Email }}</h3>
						
						<h3 class="link-title">(</h3>
						<NuxtLink :to="`/admin/${admin.AdminID}/edit`">
							<h3 class="link-title">EDIT</h3>
						</NuxtLink>
						
						<h3 class="link-title">|</h3>
						<a href="#" @click.prevent="confirmDeactivateAdmin(admin.AdminID)">
							<h3 class="link-title warningText">DEACTIVATE</h3>
						
						</a>
						<h3 class="link-title">)</h3>
					</div>
					<p class="text-[color:var(--secondary-text)]">Admin ID: {{ admin.AdminID }}</p>
				</article>
			</li>
		</ul>

		<!-- Board View -->
		<div v-else-if="selectedView === 'board'">
			<!-- Add/Edit/Delete Tag Categories and Tags -->
		</div>
	</div>
</template>
