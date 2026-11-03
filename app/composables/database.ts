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