export type Internship = {
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
	EmployerContact: string | null
	FacultyEmail: string | null
}

export type Tag = {
    TagID: number
    TagTitle: string
    CategoryID: number
    Category: string | null
}

export type InternshipTag = {
    InternshipID: number
    TagID: number
}

export type Faculty = {
    FacultyID: number
    Email: string
    isAdmin: number
    isActive: number
}

export type IndexPageData = {
    Internships: Internship[]
    Tags: Tag[]
    InterTags: InternshipTag[]
}

export type InternshipForm = Omit<
    Internship,
    'Title' | 'Description' | 'ExpDate' | 'Link'
> & {
    Title: string
    Description: string
    ExpDate: string
    Link: string
}