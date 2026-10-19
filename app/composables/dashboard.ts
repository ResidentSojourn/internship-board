export function getInternships() {
    const internships = computed<Internship[]>(() => {
        const buildingInternships : Internship[] = getAllInternships().internships // Stub for database call to get all internships

        // Collect active internships
        const activeInternships : Internship[] = []
        buildingInternships.forEach((intern, index) => {
            if (intern.expDate >= new Date()) { // If has not expired
                activeInternships.push(intern) // Add to active internships
            }
        })

        // Sort internships based on date posted
        activeInternships.sort((a, b) => b.postDate.getTime() - a.postDate.getTime())

        return activeInternships
    })

    return { internships }
}