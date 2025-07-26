import { NextResponse } from 'next/server'

// Force dynamic rendering to prevent static generation during build
export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    // Check environment variables
    const envCheck = {
      DB_USER: process.env.DB_USER ? 'Set' : 'Missing',
      DB_PASSWORD: process.env.DB_PASSWORD ? 'Set' : 'Missing',
      DB_HOST: process.env.DB_HOST ? 'Set' : 'Missing', 
      DB_NAME: process.env.DB_NAME ? 'Set' : 'Missing',
      DATABASE_URL: process.env.DATABASE_URL ? 'Set' : 'Missing',
    }

    // Construct URL like payload.config.ts does
    const constructedUrl = process.env.DATABASE_URL || 
      `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:5432/${process.env.DB_NAME}?sslmode=require`

    const maskedUrl = constructedUrl.replace(/:[^:]*@/, ':***@')

    return NextResponse.json({
      environment: envCheck,
      constructedUrl: maskedUrl,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}