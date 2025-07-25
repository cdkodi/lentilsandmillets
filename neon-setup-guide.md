# Neon PostgreSQL Setup Instructions

## Step-by-Step Setup

### 1. Create Neon Account
- Go to: https://neon.tech
- Sign up with GitHub (recommended)
- Verify your email if required

### 2. Create Project
- Click "Create Project"
- **Project Name**: `lentilsandmillets`
- **Database Name**: `lentilsandmillets` (or keep default)
- **Region**: Choose closest to your location
- **PostgreSQL Version**: Latest (16.x)
- Click "Create Project"

### 3. Copy Connection Details
After project creation, you'll see a page with connection details:

**Look for these connection strings:**
- **Connection String**: `postgresql://username:password@ep-xxx.region.aws.neon.tech/lentilsandmillets?sslmode=require`
- **Host**: `ep-xxx.region.aws.neon.tech`
- **Database**: `lentilsandmillets`
- **Username**: `username`
- **Password**: `generated_password`

### 4. Update .env.local File

**Create/edit your .env.local file:**

```bash
# Copy your .env.example to .env.local first
cp .env.example .env.local

# Then edit .env.local with your Neon connection string
cursor .env.local
```

**Replace these lines in .env.local:**
```bash
# Database Configuration - REPLACE WITH YOUR NEON DETAILS
DATABASE_URL="postgresql://your_username:your_password@ep-xxx.region.aws.neon.tech/lentilsandmillets?sslmode=require"
POSTGRES_URL="postgresql://your_username:your_password@ep-xxx.region.aws.neon.tech/lentilsandmillets?sslmode=require"
```

### 5. Test Connection (We'll do this together)

Once you have the connection string, we'll test it during Payload CMS setup.

## Important Notes:

### Security:
- ✅ `.env.local` is already in `.gitignore` - won't be committed to GitHub
- ✅ Connection string includes SSL mode for security
- ✅ Neon provides automatic connection pooling

### Neon Benefits:
- **Serverless**: Automatically scales to zero when not in use
- **Branching**: Can create database branches for different environments
- **Backups**: Automatic point-in-time recovery
- **Free Tier**: Generous limits for development

### What You'll See in Neon Dashboard:
- **Connection Details**: Host, database name, username, password
- **Query Editor**: Run SQL directly in the browser
- **Monitoring**: Database usage and performance metrics
- **Settings**: Manage compute, storage, and access

## Next Steps:
1. Complete the Neon setup above
2. Update your .env.local file with the connection string
3. Let me know when it's ready
4. We'll test the connection during Task 2.1 (Payload CMS setup)

## Troubleshooting:
- If connection fails, check that sslmode=require is in the connection string
- Ensure you're using the exact connection string from Neon (includes proper encoding)
- Make sure .env.local is in the project root directory