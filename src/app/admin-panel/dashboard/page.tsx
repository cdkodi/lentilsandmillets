'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PlusCircle, Users, FileText, ChefHat, LogOut } from 'lucide-react'

export default function AdminDashboard() {
  const [recipes, setRecipes] = useState([])
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const adminSession = localStorage.getItem('admin_session')
    if (!adminSession) {
      router.push('/admin-panel/login')
      return
    }

    // Fetch data from Payload API
    fetchData()
  }, [router])

  const fetchData = async () => {
    try {
      console.log('Fetching data from Payload API...')
      
      // Fetch recipes and articles using Payload API
      const [recipesRes, articlesRes] = await Promise.all([
        fetch('/api/recipes').then(res => {
          console.log('Recipes response status:', res.status)
          return res
        }),
        fetch('/api/articles').then(res => {
          console.log('Articles response status:', res.status)
          return res
        })
      ])

      if (recipesRes.ok) {
        const recipesData = await recipesRes.json()
        console.log('Recipes data:', recipesData)
        setRecipes(recipesData.docs || [])
      } else {
        console.error('Recipes fetch failed:', recipesRes.status, recipesRes.statusText)
      }

      if (articlesRes.ok) {
        const articlesData = await articlesRes.json()
        console.log('Articles data:', articlesData)
        setArticles(articlesData.docs || [])
      } else {
        console.error('Articles fetch failed:', articlesRes.status, articlesRes.statusText)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_session')
    router.push('/admin-panel/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading dashboard...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Lentils & Millets Content Management</p>
            </div>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Recipes</CardTitle>
              <ChefHat className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recipes.length}</div>
              <p className="text-xs text-muted-foreground">
                Lentils & Millets recipes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Articles</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{articles.length}</div>
              <p className="text-xs text-muted-foreground">
                Educational content
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Content</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{recipes.length + articles.length}</div>
              <p className="text-xs text-muted-foreground">
                All content items
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Content Management */}
        <Tabs defaultValue="articles" className="space-y-4">
          <TabsList>
            <TabsTrigger 
              value="recipes" 
              className="data-[state=active]:bg-orange-100 data-[state=active]:text-orange-800 data-[state=active]:border-orange-300 hover:bg-orange-50"
            >
              Recipes
            </TabsTrigger>
            <TabsTrigger 
              value="articles" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 data-[state=active]:border-amber-300 hover:bg-amber-50"
            >
              Articles
            </TabsTrigger>
          </TabsList>

          <TabsContent value="recipes" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Recipe Management</h3>
              <Button onClick={() => router.push('/admin-panel/recipes/new')}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Recipe
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Recipes</CardTitle>
                <CardDescription>
                  Manage your lentils and millets recipes
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recipes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No recipes found. Create your first recipe!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {recipes.slice(0, 5).map((recipe: any) => (
                      <div key={recipe.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{recipe.title}</h4>
                          <p className="text-sm text-gray-500">{recipe.productLine || 'General'}</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="articles" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Article Management</h3>
              <Button onClick={() => router.push('/admin-panel/articles/new')}>
                <PlusCircle className="w-4 h-4 mr-2" />
                Add Article
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Articles</CardTitle>
                <CardDescription>
                  Manage your educational content
                </CardDescription>
              </CardHeader>
              <CardContent>
                {articles.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No articles found. Create your first article!
                  </p>
                ) : (
                  <div className="space-y-2">
                    {articles.slice(0, 5).map((article: any) => (
                      <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{article.title}</h4>
                          <div className="flex items-center space-x-2">
                            <p className="text-sm text-gray-500">{article.productLine || 'General'}</p>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              article.status === 'published' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {article.status || 'draft'}
                            </span>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => {
                            console.log('Article data:', article)
                            const articleId = article.id || article._id
                            console.log('Navigating to edit:', articleId)
                            if (articleId) {
                              router.push(`/admin-panel/articles/edit/${articleId}`)
                            } else {
                              alert('Article ID not found')
                            }
                          }}
                        >
                          Edit
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}