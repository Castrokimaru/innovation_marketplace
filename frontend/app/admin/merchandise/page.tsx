'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  ShoppingBag,
  DollarSign,
} from 'lucide-react'
import { fetchMerchandise, createMerchandise } from '@/lib/api'
import { useSession } from 'next-auth/react'

export default function MerchandiseManagement() {
  const { data: session } = useSession()
  const [merchandise, setMerchandise] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    image_url: ''
  })

  useEffect(() => {
    fetchMerchandise()
      .then(setMerchandise)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const handleAddProduct = async () => {
    if (!session?.accessToken) {
      alert('Please log in to add products')
      return
    }
    try {
      await createMerchandise({
        name: newProduct.name,
        description: newProduct.description,
        price: parseFloat(newProduct.price),
        stock: parseInt(newProduct.stock),
        image_url: newProduct.image_url
      }, session.accessToken)
      setNewProduct({ name: '', description: '', price: '', stock: '', image_url: '' })
      setShowAddForm(false)
      // Refresh the list
      const updated = await fetchMerchandise()
      setMerchandise(updated)
    } catch (error) {
      alert('Failed to add product: ' + (error as Error).message)
    }
  }

  const filteredMerchandise = merchandise.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.id.toString().includes(searchTerm)
  )

  const totalStock = merchandise.reduce((sum, item) => sum + item.stock, 0)
  const totalProducts = merchandise.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Merchandise</h1>
          <p className="mt-2 text-muted-foreground">Manage products and inventory</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="bg-primary hover:bg-primary/90 gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Products</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{totalProducts}</p>
            </div>
            <div className="rounded-lg bg-blue-500/10 p-3">
              <ShoppingBag className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Stock</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{totalStock}</p>
            </div>
            <div className="rounded-lg bg-orange-500/10 p-3">
              <TrendingUp className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Average Price</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {merchandise.length > 0 ? (merchandise.reduce((sum, item) => sum + item.price, 0) / merchandise.length).toLocaleString() : '0'} KES
              </p>
            </div>
            <div className="rounded-lg bg-green-500/10 p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </Card>

      {/* Merchandise Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-left font-semibold text-foreground">ID</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Product</th>
                <th className="px-6 py-4 text-right font-semibold text-foreground">Price</th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Stock</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Image</th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">Loading...</td>
                </tr>
              ) : (
                filteredMerchandise.map((item) => (
                  <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="px-6 py-4 text-foreground/70 font-mono text-xs">{item.id}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{item.name}</p>
                    </td>
                    <td className="px-6 py-4 text-right font-medium text-foreground">
                      {item.price.toLocaleString()} KES
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded text-xs font-medium ${
                          item.stock === 0
                            ? 'bg-red-500/10 text-red-700 dark:text-red-400'
                            : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                        }`}
                      >
                        {item.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <img src={item.image_url} alt={item.name} className="w-12 h-12 object-cover rounded" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <Button variant="ghost" size="sm" title="Edit">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" title="Delete" className="text-destructive hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                placeholder="Enter product name"
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                placeholder="Enter product description"
              />
            </div>
            <div>
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                placeholder="Enter price"
              />
            </div>
            <div>
              <Label htmlFor="stock">Stock</Label>
              <Input
                id="stock"
                type="number"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                placeholder="Enter stock quantity"
              />
            </div>
            <div>
              <Label htmlFor="image_url">Image URL</Label>
              <Input
                id="image_url"
                value={newProduct.image_url}
                onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                placeholder="Enter image URL"
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddProduct}>
                Add Product
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredMerchandise.length} of {merchandise.length} products
        </p>
        <div className="flex gap-2">
          <Button variant="outline" disabled>
            Previous
          </Button>
          <Button variant="outline">Next</Button>
        </div>
      </div>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ')
}
