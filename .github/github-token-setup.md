# GitHub Personal Access Token Setup

## Create Token for MCP Access

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Fill in the form:
   - **Note**: `MCP Server for Lentils & Millets Project`
   - **Expiration**: `90 days` (or custom)
   
4. Select these scopes:
   - ✅ `repo` - Full control of private repositories
   - ✅ `workflow` - Update GitHub Action workflows
   - ✅ `write:packages` - Upload packages to GitHub Package Registry
   - ✅ `delete:packages` - Delete packages from GitHub Package Registry
   - ✅ `admin:org` - Full control of orgs and teams, read and write org projects
   - ✅ `public_repo` - Access public repositories
   - ✅ `repo:status` - Access commit status
   - ✅ `repo_deployment` - Access deployment status
   - ✅ `user:email` - Access user email addresses (read-only)
   - ✅ `read:user` - Read ALL user profile data
   - ✅ `project` - Full control of projects

5. Click **"Generate token"**
6. **IMPORTANT**: Copy the token immediately - you won't be able to see it again!

## Security Note
Store the token securely and never commit it to your repository. We'll add it to your environment variables.