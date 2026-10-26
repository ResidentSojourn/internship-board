<!-- Default page -->

<script setup lang="ts">
	const { internships } = getInternships()

	const categoriesTags = new Map<number, Tag[]>()
	
	const { tagCategories } = getTagCategories()
	
	const tagButtons = reactive<Record<number, boolean>>(
		Object.fromEntries(tagCategories.map(id => [id, false]))
	)

	tagCategories.forEach(tagCat => {
		const tags = getTags(tagCat).tags

		categoriesTags.set(tagCat.id, tags)
	})
</script>

<template>
	<div class="grid grid-cols-3 min-h-[calc(100vh-4rem)] gap-3">
		<!-- Top internships view -->
		<div class="col-span-2">
			<ul>
				<li v-for="internship in internships" :key="internship.id">
					<div class="bg-[var(--secondary-background)]
							rounded-lg ring-2 ring-[var(--secondary-border)] p-4">
						<NuxtLink :to="`/internships/${internship.id}`">
							<h3 class="text-[color:var(--primary-text)]">
								{{ internship.title }}
							</h3>
						</NuxtLink>

						<span class="gap"></span>

						<div class="text-[color:var(--secondary-text)]">
							{{ internship.description }}
						</div>
					</div>
					<span class="gap"></span>
				</li>
			</ul>
		</div>

		<!-- Tags view -->
		<div class="col-span-1 bg-[var(--secondary-background)]
				rounded-lg ring-2 ring-[var(--secondary-border)]
				p-4 text-[color:var(--secondary-text)]">
			<ul>
				<li v-for="tagCat in tagCategories" :key="tagCat.id">
					{{ tagCat.text }}

					<li v-for="tag in categoriesTags.get(tagCat.id)" :key="tag.id">
						<span class="gap"></span>
						<UCheckbox v-model="tagButtons[tag.id]" :label="tag.text"
								:ui="{ label: 'text-[color:var(--primary-text)]'}" />
					</li>

					<span class="gap"></span>
				</li>
			</ul>
		</div>
	</div>
</template>