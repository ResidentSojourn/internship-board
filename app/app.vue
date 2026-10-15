<script setup lang="ts">
	const { items, isSuperAdmin } = getNavigationItems()
</script>

<template>
	<UApp>
		<div class="min-h-screen bg-[var(--background)]"> <!-- Wrapper for all pages -->

			<!-- Header / Navigation Bar -->
			<UHeader :toggle="false" :ui="{ root: 'bg-[var(--deep-background)] border-b-2 border-[var(--deep-border)]' }"> <!-- This toggles the hamburger menu/icon on the right off -->
				<template #left>
					<NuxtLink to="/" class="text-lg text-[var(--primary-text)] font-bold tracking-wider">
						HOME
					</NuxtLink>
				</template>

				<!-- Hide the middle title if isSuperAdmin since there are too many buttons -->>
				<h1 v-if="!isSuperAdmin()" class="text-xl text-[var(--primary-text)] font-bold tracking-tight">
					INTERNSHIP BOARD
				</h1>

				<template #right>
					<UNavigationMenu :items="items" :ui="{ linkLabel: 'text-lg text-[var(--secondary-text)] font-bold tracking-wider' }"/>
				</template>
			</UHeader>

			<!-- Remainder of page (app/pages/index.vue) -->
			<NuxtPage />
		</div>
	</UApp>
</template>
