'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Test Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-4">If you can see this, the routing and components are working!</p>
          <Button onClick={() => console.log('Button clicked!')}>
            Test Button
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}