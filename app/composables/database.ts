export type Employer = {
    id: number
    name: string
    company: string
    contact: string // This could be dealer's choice: email, phone, LinkedIn, fax
}

export type Internship = {
    id: number
    title: string
    description: string
    employerId: number
    postDate: Date
    expDate: Date
    link: string
}

export type TagCategory = {
    id: number
    text: string
}

export type Tag = {
    id: number
    text: string
    categoryId: number // This is the category this tag belongs to
}

export type InternshipTag = { // Intermediate table for many-to-many
    id: number
    internshipId: number
    tagId: number
}

export function getEmployer(id : number) {
    const employers : Employer[] = [
        {
            id: 0,
            name: "Tom",
            company: "DreamWorks & Associates TM",
            contact: "Cell"
        },
        {
            id: 1,
            name: "Tim",
            company: "Buttonology International",
            contact: "Cell"
        },
        {
            id: 2,
            name: "Tam",
            company: "HONK Solutions LLC",
            contact: "Cell"
        },
        {
            id: 3,
            name: "Tem",
            company: "Big Cheese Conglomerate",
            contact: "Cell"
        },
        {
            id: 4,
            name: "Tym",
            company: "Aquatic Algorithms Corp.",
            contact: "Cell"
        },
        {
            id: 5,
            name: "Tum",
            company: "Rainbow Ledger & Partners",
            contact: "Cell"
        },
        {
            id: 6,
            name: "Tlm",
            company: "Leaf It to Us Consulting",
            contact: "Cell"
        },
        {
            id: 7,
            name: "Tmm",
            company: "The Institute of Productive Procrastination",
            contact: "Cell"
        },
        {
            id: 8,
            name: "Tvm",
            company: "Skyward Nonsense Industries",
            contact: "Cell"
        },
        {
            id: 9,
            name: "T!m",
            company: "Missing Sock Investigations Inc.",
            contact: "Cell"
        }
    ]

    employers.forEach((e, index) => {
        if (e.id == id) {
            return { e }
        }
    })

    return null
}

export function getAllInternships() {
    const internships : Internship[] = [
        {
                id: 0,
                title: "Chief Executive Nap Officer",
                description: "Seeking a highly motivated individual to supervise workplace napping, evaluate pillow fluffiness, and ensure all employees achieve optimal snooze productivity. Pajamas are encouraged but not legally required.",
                employerId: 0,
                postDate: new Date("2026-01-12"),
                expDate: new Date("2026-11-30"),
                link: "https://google.com"
            },
            {
                id: 1,
                title: "Junior Director of Unnecessary Buttons",
                description: "Do you enjoy pressing buttons that accomplish absolutely nothing? We need someone to install, test, and occasionally slap decorative buttons on office equipment. Previous experience pushing elevator buttons repeatedly is preferred.",
                employerId: 1,
                postDate: new Date("2026-02-05"),
                expDate: new Date("2026-12-15"),
                link: "https://google.com"
            },
            {
                id: 2,
                title: "Professional Goose Negotiator",
                description: "Our clients have complicated relationships with local geese. You will mediate territorial disputes, negotiate bread-based treaties, and maintain peaceful relations between humans and birds with anger management issues. Must be comfortable making eye contact with geese.",
                employerId: 2,
                postDate: new Date("2026-03-01"),
                expDate: new Date("2026-10-31"),
                link: "https://google.com"
            },
            {
                id: 3,
                title: "Senior Vice President of Cheese Logistics",
                description: "Oversee the strategic transportation of cheese from one room to another. Responsibilities include cheddar inventory management, emergency mozzarella deployment, and investigating suspicious Swiss cheese holes. Lactose tolerance is helpful but not mandatory.",
                employerId: 3,
                postDate: new Date("2026-01-25"),
                expDate: new Date("2026-11-20"),
                link: "https://google.com"
            },
            {
                id: 4,
                title: "Underwater Basket-Weaving Software Engineer",
                description: "Develop cutting-edge algorithms for weaving baskets at the bottom of swimming pools. Must understand basic programming concepts and be willing to explain to management why the computer keeps getting wet. SCUBA certification is a bonus.",
                employerId: 4,
                postDate: new Date("2026-04-10"),
                expDate: new Date("2026-12-01"),
                link: "https://google.com"
            },
            {
                id: 5,
                title: "Chief Unicorn Accounting Officer",
                description: "Manage the finances of an expanding unicorn population. Duties include calculating sparkle depreciation, auditing rainbow production, and determining whether glitter qualifies as a business expense. Must possess strong spreadsheet skills and an open mind regarding mythical livestock.",
                employerId: 5,
                postDate: new Date("2026-02-18"),
                expDate: new Date("2026-11-25"),
                link: "https://google.com"
            },
            {
                id: 6,
                title: "Certified Office Plant Therapist",
                description: "Provide emotional support to office plants experiencing workplace stress. You will listen to ferns complain about fluorescent lighting, help cacti establish healthy boundaries, and mediate conflicts between rival succulents. A soothing voice and a reliable watering schedule are essential.",
                employerId: 6,
                postDate: new Date("2026-05-03"),
                expDate: new Date("2026-12-20"),
                link: "https://google.com"
            },
            {
                id: 7,
                title: "Director of Time-Wasting Research",
                description: "Investigate the scientific potential of staring into refrigerators, watching paint dry, and opening the same email seventeen times. Candidates must demonstrate exceptional procrastination skills while somehow meeting every deadline.",
                employerId: 7,
                postDate: new Date("2026-03-22"),
                expDate: new Date("2026-11-10"),
                link: "https://google.com"
            },
            {
                id: 8,
                title: "Junior Cloud Appreciation Specialist",
                description: "Observe clouds and provide detailed reports on their shapes, vibes, and resemblance to household appliances. You will collaborate with meteorologists to identify clouds that look suspiciously like lasagna. Binoculars and an active imagination required.",
                employerId: 8,
                postDate: new Date("2026-06-14"),
                expDate: new Date("2026-12-28"),
                link: "https://google.com"
            },
            {
                id: 9,
                title: "Executive Director of Lost Socks",
                description: "Lead a nationwide investigation into the mysterious disappearance of socks during laundry operations. Responsibilities include interviewing washing machines, mapping suspected sock dimensions, and maintaining a database of unmatched footwear. Strong detective instincts and an extensive sock drawer are desirable.",
                employerId: 9,
                postDate: new Date("2026-07-01"),
                expDate: new Date("2026-12-31"),
                link: "https://google.com"
            }
    ]

    return { internships }
}

export function getInternship(id : number) {
    const { internships } = getAllInternships()
    
    return internships.find(i => i.id === id) ?? null
}

export function getTagCategory(id : number) {
    const { tagCategories } = getTagCategories()

    return tagCategories.find(tc => tc.id === id) ?? null
}

export function getTagCategories() {
    const tagCategories : TagCategory[] = [
        {
            id: 0,
            text: "Department"
        },
        {
            id: 1,
            text: "Location"
        },
        {
            id: 2,
            text: "Personality Type"
        }
    ]

    return { tagCategories }
}

export function getTags(category : TagCategory) {
    const tags : Tag[] = []
    
    if (category.id == 0) {
        tags.push({
            id: 0,
            text: "CS",
            categoryId: 0
        })
        tags.push({
            id: 1,
            text: "MA",
            categoryId: 0
        })
    } else if (category.id == 1) {
        tags.push({
            id: 2,
            text: "Here",
            categoryId: 1
        })
        tags.push({
            id: 3,
            text: "There",
            categoryId: 1
        })
    } else if (category.id == 2) {
        tags.push({
            id: 4,
            text: "Odd",
            categoryId: 2
        })
        tags.push({
            id: 5,
            text: "Chill Dude",
            categoryId: 2
        })
    }

    return { tags }
}

export function getInternshipTags(id : number) {
    const tags : Tag[] = []

    tags.push({
        id: 0,
        text: "CS",
        categoryId: 0
    })
    tags.push({
        id: 1,
        text: "MA",
        categoryId: 0
    })
    tags.push({
        id: 4,
        text: "Odd",
        categoryId: 2
    })

    return { tags }
}