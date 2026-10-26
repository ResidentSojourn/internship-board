<script setup lang="ts">
    // Grab internship ID from the URL
	const route = useRoute()
	const internshipId = computed(() => {
        const raw = route.params.id
        
        if (!raw)
            return -1

            // Get first index in string if its an array, else just raw
            const str = Array.isArray(raw) ? raw[0] : raw

            return Number(str)
    })

    // Query database.vue for internship
    const result = getInternship(internshipId.value)

    if (!result) {
        throw createError({ statusCode: 404, statusMessage: 'Post not found' })
    }

    const internship : Internship = result

    // Pull out categories for tags
    const tagCategories : TagCategory[] = []
    const categoriesTags = new Map<number, Tag[]>()

    const { tags } = getInternshipTags(internship.id)

    tags.forEach((tag, index) => {
        const tagCatResult = getTagCategory(tag.categoryId)

        if (tagCatResult) {
            const tagCat = tagCatResult

            // Add tag category
            if (!tagCategories.find(tc => tc.id === tagCat.id)) {
                tagCategories.push(tagCat)
            }

            // Fill in tags for category
            if (!categoriesTags.has(tagCat.id)) {
                categoriesTags.set(tagCat.id, [])
            }

            categoriesTags.get(tagCat.id)?.push(tag)
        }
    })
</script>

<template>
    <div class="grid grid-cols-3 min-h-[calc(100vh-4rem)] gap-3">
		<!-- Internships details view -->
		<div class="col-span-2">
			<div class="bg-[var(--secondary-background)]
                    rounded-lg ring-2 ring-[var(--secondary-border)] p-4">
						<h1 class="text-[color:var(--primary-text)]">
                            {{ internship.title }}
                        </h1>

						<span class="gap"></span>

						<div class="text-[color:var(--secondary-text)]">
							{{ internship.description }}
						</div>
					</div>
					<span class="gap"></span>
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

                        <div class="text-[color:var(--primary-text)]">
                            [ ✓ ] {{ tag.text }}
                        </div>
					</li>

					<span class="gap"></span>
				</li>
			</ul>
		</div>
	</div>
</template>