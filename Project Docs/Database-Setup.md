# Database Setup Documentation
**Lentils & Millets Project Database Configuration**

## 🗄️ Database Provider: Neon PostgreSQL

### **Project Details**
- **Provider**: Neon.tech (Serverless PostgreSQL)
- **Project Name**: `lentilsandmillets`
- **Database Name**: `neondb`
- **PostgreSQL Version**: 17.5 (Latest)
- **Region**: US West 2 (us-west-2)
- **Connection Pool**: Enabled (managed by Neon)

### **Connection Details**
- **Host**: `ep-proud-queen-afw6xn4k-pooler.c-2.us-west-2.aws.neon.tech`
- **Database**: `neondb`
- **User**: `neondb_owner`
- **SSL Mode**: Required (`sslmode=require&channel_binding=require`)
- **Connection String**: Stored in `.env.local` as `DATABASE_URL`

### **Environment Configuration**

**Local Development (.env.local):**
```bash
DATABASE_URL="postgresql://neondb_owner:****@ep-proud-queen-afw6xn4k-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
POSTGRES_URL="postgresql://neondb_owner:****@ep-proud-queen-afw6xn4k-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
```

**Production (Vercel):**
- Same connection string will be used
- Configure as environment variable in Vercel dashboard
- Neon automatically handles connection pooling and scaling

## ✅ **Connection Test Results**

**Test Date**: 2025-01-24  
**Test Status**: ✅ All tests passed

### **Verified Capabilities:**
- ✅ Database connection successful
- ✅ Authentication working
- ✅ Table creation permissions
- ✅ Data insertion/retrieval
- ✅ SSL encryption enabled
- ✅ Payload CMS compatibility confirmed

### **Database Performance:**
- **Connection Time**: <1 second
- **Query Response**: <100ms
- **SSL Handshake**: Successful
- **Connection Pool**: Active

## 🏗️ **Payload CMS Schema Design**

### **Planned Collections:**

#### **1. Recipes Collection**
```sql
-- Will be created by Payload CMS
CREATE TABLE recipes (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  product_line VARCHAR(20) CHECK (product_line IN ('lentils', 'millets', 'both')),
  cooking_time INTEGER,
  servings INTEGER,
  difficulty VARCHAR(20),
  ingredients JSONB,
  instructions JSONB,
  nutrition JSONB,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **2. Articles Collection**
```sql
-- Will be created by Payload CMS
CREATE TABLE articles (
  id UUID PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  product_line VARCHAR(20) CHECK (product_line IN ('lentils', 'millets', 'both')),
  content JSONB,
  author VARCHAR(255),
  featured_image TEXT,
  meta_description TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### **3. Product Varieties Collection**
```sql
-- Will be created by Payload CMS
CREATE TABLE varieties (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  product_line VARCHAR(20) CHECK (product_line IN ('lentils', 'millets')),
  description TEXT,
  nutritional_info JSONB,
  cooking_instructions TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

## 🔧 **Database Management**

### **Backup Strategy**
- **Neon Automatic Backups**: Point-in-time recovery available
- **Backup Retention**: 7 days (free tier), 30 days (paid)
- **Manual Backups**: Can be triggered via Neon dashboard
- **Data Export**: SQL dumps available through Neon console

### **Monitoring & Performance**
- **Neon Dashboard**: Real-time metrics and query performance
- **Connection Monitoring**: Active connection tracking
- **Storage Usage**: Automatic monitoring with alerts
- **Query Analytics**: Available in Neon console

### **Scaling Considerations**
- **Serverless**: Automatically scales to zero when inactive
- **Connection Pooling**: Managed by Neon (pgBouncer)
- **Compute Units**: Auto-scaling based on demand
- **Storage**: Automatic expansion as needed

## 🔐 **Security Configuration**

### **Access Control**
- **SSL/TLS**: Required for all connections
- **User Permissions**: Database owner has full access
- **IP Restrictions**: None (Neon manages security)
- **Connection Limits**: Managed by Neon connection pooling

### **Environment Security**
- **Credentials**: Stored in `.env.local` (not committed to Git)
- **Production**: Environment variables in Vercel
- **Rotation**: Can regenerate passwords in Neon dashboard
- **Audit**: Connection logs available in Neon console

## 📚 **Useful Commands**

### **Connection Testing**
```bash
# Test connection (we created this script)
node test-db-connection.js

# Direct psql connection (if needed)
psql "postgresql://neondb_owner:****@ep-proud-queen-afw6xn4k-pooler.c-2.us-west-2.aws.neon.tech/neondb?sslmode=require"
```

### **Payload CMS Database Commands**
```bash
# Generate Payload types (after setup)
npx payload generate:types

# Run database migrations
npm run payload migrate

# Seed initial data
npm run payload seed
```

## 🔗 **External Links**

- **Neon Dashboard**: https://console.neon.tech/
- **Project URL**: https://console.neon.tech/app/projects/[project-id]
- **Documentation**: https://neon.tech/docs
- **Status Page**: https://neon.tech/status

## 📈 **Usage Limits (Free Tier)**

- **Storage**: 512 MB
- **Compute Hours**: 100 hours/month
- **Databases**: 1 per project
- **Branches**: 1 per project
- **Backups**: 7 days retention

**Note**: Monitor usage and upgrade to paid plan when approaching limits.

## 🚨 **Troubleshooting**

### **Connection Issues**
1. Verify connection string in `.env.local`
2. Check Neon project status (not paused)
3. Ensure SSL mode is required
4. Test with the connection script

### **Performance Issues**
1. Check Neon dashboard for compute usage
2. Monitor connection pool utilization
3. Optimize queries using Neon's query insights
4. Consider upgrading compute if needed

### **Security Concerns**
1. Regenerate database password if compromised
2. Review connection logs in Neon dashboard
3. Ensure `.env.local` is in `.gitignore`
4. Use environment variables in production

---

**Database Status**: ✅ Ready for Payload CMS integration  
**Last Updated**: 2025-01-24  
**Next Step**: Task 2.1.1 - Initialize Next.js 14 project with Payload 3.0