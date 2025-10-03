"use client"

import { useEffect, useState } from "react"
import { useSession } from "@/lib/auth-client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "sonner"
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react"

interface Category {
  id: number
  name: string
  slug: string
  description: string | null
}

interface Story {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  author: string
  image: string
  featured: boolean
  publishedAt: string
  categoryId: number
  categoryName?: string
}

export default function AdminPage() {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [stories, setStories] = useState<Story[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingStory, setEditingStory] = useState<Story | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    image: "",
    featured: false,
    categoryId: "",
  })

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/login")
    }
  }, [session, isPending, router])

  useEffect(() => {
    if (session?.user) {
      fetchData()
    }
  }, [session])

  const getAuthHeaders = () => {
    const token = localStorage.getItem("bearer_token")
    return {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }
  }

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [storiesRes, categoriesRes] = await Promise.all([
        fetch("/api/stories", {
          headers: getAuthHeaders(),
        }),
        fetch("/api/categories", {
          headers: getAuthHeaders(),
        }),
      ])

      if (storiesRes.ok) {
        const storiesData = await storiesRes.json()
        setStories(storiesData)
      }

      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json()
        setCategories(categoriesData)
      }
    } catch (error) {
      toast.error("Failed to fetch data")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const payload = {
        ...formData,
        categoryId: parseInt(formData.categoryId),
        publishedAt: new Date().toISOString(),
      }

      const url = editingStory ? `/api/stories/${editingStory.id}` : "/api/stories"
      const method = editingStory ? "PUT" : "POST"

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        toast.success(editingStory ? "Story updated!" : "Story created!")
        setIsDialogOpen(false)
        resetForm()
        fetchData()
      } else {
        toast.error("Failed to save story")
      }
    } catch (error) {
      toast.error("An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (story: Story) => {
    setEditingStory(story)
    setFormData({
      title: story.title,
      slug: story.slug,
      excerpt: story.excerpt,
      content: story.content,
      author: story.author,
      image: story.image,
      featured: story.featured,
      categoryId: story.categoryId.toString(),
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this story?")) return

    try {
      const res = await fetch(`/api/stories/${id}`, { 
        method: "DELETE",
        headers: getAuthHeaders(),
      })
      if (res.ok) {
        toast.success("Story deleted!")
        fetchData()
      } else {
        toast.error("Failed to delete story")
      }
    } catch (error) {
      toast.error("An error occurred")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      author: "",
      image: "",
      featured: false,
      categoryId: "",
    })
    setEditingStory(null)
  }

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
  }

  if (isPending || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage your news stories and categories</p>
      </div>

      <Tabs defaultValue="stories" className="space-y-6">
        <TabsList>
          <TabsTrigger value="stories">Stories</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="stories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Manage Stories</h2>
            <Dialog open={isDialogOpen} onOpenChange={(open) => {
              setIsDialogOpen(open)
              if (!open) resetForm()
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Story
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingStory ? "Edit Story" : "Create New Story"}</DialogTitle>
                  <DialogDescription>
                    {editingStory ? "Update story details below" : "Fill in the details to create a new story"}
                  </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => {
                          const title = e.target.value
                          setFormData({ ...formData, title, slug: generateSlug(title) })
                        }}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="slug">Slug</Label>
                      <Input
                        id="slug"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="excerpt">Excerpt</Label>
                    <Textarea
                      id="excerpt"
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      required
                      disabled={isSubmitting}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      required
                      disabled={isSubmitting}
                      rows={8}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="author">Author</Label>
                      <Input
                        id="author"
                        value={formData.author}
                        onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        required
                        disabled={isSubmitting}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={formData.categoryId}
                        onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                        disabled={isSubmitting}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id.toString()}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image">Image URL</Label>
                    <Input
                      id="image"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) =>
                        setFormData({ ...formData, featured: checked as boolean })
                      }
                      disabled={isSubmitting}
                    />
                    <Label htmlFor="featured" className="font-normal cursor-pointer">
                      Featured story (appears on homepage)
                    </Label>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : editingStory ? (
                        "Update Story"
                      ) : (
                        "Create Story"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsDialogOpen(false)
                        resetForm()
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Published</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      No stories yet. Create your first story!
                    </TableCell>
                  </TableRow>
                ) : (
                  stories.map((story) => (
                    <TableRow key={story.id}>
                      <TableCell className="font-medium">{story.title}</TableCell>
                      <TableCell>{story.categoryName}</TableCell>
                      <TableCell>{story.author}</TableCell>
                      <TableCell>{story.featured ? "✓" : ""}</TableCell>
                      <TableCell>{new Date(story.publishedAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(story)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(story.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Categories</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="border rounded-lg p-4 space-y-2">
                <h3 className="font-bold text-lg">{category.name}</h3>
                <p className="text-sm text-muted-foreground">{category.slug}</p>
                {category.description && (
                  <p className="text-sm">{category.description}</p>
                )}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}