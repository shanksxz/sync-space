declare global {
    interface Repo {
        id: number
        name: string
        description: string | null
        html_url: string
        private: boolean
        stargazers_count: number
        topics: string[]
        language: string | null
    }
    interface RepoContent {
        type: "dir" | "file"
        name: string
        path: string
        content?: string
        children?: RepoItem[]
    }
}

export { }