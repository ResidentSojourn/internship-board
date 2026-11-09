<script setup lang="ts">
	const { items } = getNavigationItems()
	const { isSuperAdmin } = authorization()

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
				<div v-if="!isSuperAdmin()" class="flex items-center justify-center gap-3">
					<img src="/assets/images/LETUlogo.png" alt="Left logo" class="h-8 w-auto" />
					<h1 class="text-xl text-[var(--primary-text)] font-bold tracking-tight">
						INTERNSHIP BOARD
					</h1>
					<img src="/assets/images/LETUlogo.png" alt="Right logo" class="h-8 w-auto" />
				</div>

				<template #right>
					<UNavigationMenu :items="items" :ui="{ linkLabel: 'text-lg text-[var(--secondary-text)] font-bold tracking-wider' }"/>
				</template>
			</UHeader>

			<!-- Remainder of page (app/pages/index.vue) -->
			<div class="p-8">
				<NuxtPage />
			</div>
		</div>
	</UApp>
</template>
