<!-- Default page -->

<script setup lang="ts">
type InternshipRecord = {
	InternshipID: number
	EmployerID: number
	FacultyID: number
	Title: string
	Description: string | null
	PostDate: string | null
	ExpDate: string | null
	Link: string | null
	EmployerName: string | null
	EmployerCompany: string | null
}

type TagRecord = {
	TagID: number
	TagTitle: string
	CategoryID: number
	Category: string | null
}

type InternshipTagRecord = {
	InternshipID: number
	TagID: number
}

type MainPageData = {
	Internships: InternshipRecord[]
	Tags: TagRecord[]
	InterTags: InternshipTagRecord[]
}

const { data, pending, error } = await useFetch<MainPageData>('/api/mainPageData')
const tagFilters = reactive<Record<number, boolean>>({})

const tagCategories = computed(() => {
	const categories = new Map<number, { id: number, name: string, tags: TagRecord[] }>()

	for (const tag of data.value?.Tags ?? []) {
		let category = categories.get(tag.CategoryID)
		if (!category) {
			category = {
				id: tag.CategoryID,
				name: tag.Category ?? 'Other',
				tags: [],
			}
			categories.set(tag.CategoryID, category)
		}
		category.tags.push(tag)
	}

	return [...categories.values()]
})

const selectedTagIdsByCategory = computed(() => {
	const selectedByCategory = new Map<number, number[]>()

	for (const tag of data.value?.Tags ?? []) {
		if (!tagFilters[tag.TagID]) {
			continue
		}

		const selectedTagIds = selectedByCategory.get(tag.CategoryID) ?? []
		selectedTagIds.push(tag.TagID)
		selectedByCategory.set(tag.CategoryID, selectedTagIds)
	}

	return [...selectedByCategory.values()]
})

const internships = computed(() => {
	const now = Date.now()

	return (data.value?.Internships ?? [])
		.filter(internship => !internship.ExpDate || Date.parse(internship.ExpDate) >= now)
		.filter(internship =>
			selectedTagIdsByCategory.value.every(categoryTagIds =>
				categoryTagIds.some(tagID =>
					data.value?.InterTags.some(tag =>
						tag.InternshipID === internship.InternshipID && tag.TagID === tagID,
					),
				),
			)
		)
		.sort((a, b) => Date.parse(b.PostDate ?? '') - Date.parse(a.PostDate ?? ''))
})

function formatDate(value: string | null) {
	return value ? value.split(' ')[0] : 'Not specified'
}

function isHttpLink(value: string | null): value is string {
	return value !== null && /^https?:\/\//i.test(value)
}
</script>

<template>
	<div class="grid grid-cols-3 min-h-[calc(100vh-4rem)] gap-3">
		<!-- Top internships view -->
		<div class="col-span-2">
			<p v-if="pending" class="text-[color:var(--secondary-text)]">Loading internships...</p>
			<p v-else-if="error" class="text-[color:var(--secondary-text)]">Could not load internships. Please try again later.</p>
			<p v-else-if="internships.length === 0" class="text-[color:var(--secondary-text)]">No internships found.</p>
			<ul v-else class="space-y-3">
				<li v-for="internship in internships" :key="internship.InternshipID">
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
