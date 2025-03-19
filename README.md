# SyncSpace - Real-time Collaborative Code Editor

SyncSpace is an online real-time collaborative code editor that allows teams to work together on code repositories in a seamless environment.

## Core Features

- **GitHub Repository Integration**: Import repositories directly from GitHub
- **Team Management**: Create and manage teams for collaborative work
- **Workspace Management**: Organize different coding projects with team access
- **Real-time Collaboration**: Code together with multiple team members simultaneously
- **Terminal Access**: Access a terminal within your development environment
- **Docker-based Isolation**: Each workspace runs in its own isolated container

## System Architecture

### User Workflow

1. **Authentication**
   - Users sign in using GitHub OAuth
   - Access permissions for repositories are managed through GitHub scopes

2. **Team Management**
   - Create teams and invite members
   - Manage team permissions and settings
   - Teams provide access control for workspaces

3. **Workspace Creation**
   - Select GitHub repository to import
   - Choose the team that can access the workspace
   - Configure environment settings (optional)
   - System clones the repository and stores in S3

4. **Development Environment**
   - When a workspace is accessed, a Docker container is created
   - Code is mounted from S3 into the container
   - Users can edit code with the collaborative editor
   - Terminal access allows for running commands in the container
   - Changes are synchronized in real-time between team members

5. **Persistence and Synchronization**
   - Workspace state is periodically backed up to S3
   - Changes can be committed back to GitHub manually or automatically
   - Container state is preserved between sessions

### Technical Architecture

## 🚀 Tech Stack
[Turborepo](https://turborepo.dev/) 
- [Next.js 15](https://nextjs.org/)
- [tRPC](https://trpc.io/)
- [Shadcn UI](https://ui.shadcn.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [Drizzle ORM](https://orm.drizzle.team/)
- [PostgreSQL](https://www.postgresql.org/)
- [Socket.io](https://socket.io/)
- [Redis](https://redis.io/)
- [Docker](https://docker.com/)
- [AWS](https://aws.amazon.com/)
  - S3 - Storage
  - EC2 - Compute

## Development Status

See [CHANGELOG.md](./CHANGELOG.md) for current development status and progress.
