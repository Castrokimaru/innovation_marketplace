'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Search,
  Plus,
  Edit,
  Trash2,
  TrendingUp,
  ShoppingBag,
  DollarSign,
} from 'lucide-react'

const merchandise = [
  {
    id: 1,
    name: 'Moringa T-Shirt',
    sku: 'TSHIRT-001',
    category: 'Apparel',
    price: 15.99,
    stock: 145,
    sold: 342,
    revenue: 5466.58,
    status: 'active',
  },
  {
    id: 2,
    name: 'Innovation Hoodie',
    sku: 'HOODIE-001',
    category: 'Apparel',
    price: 39.99,
    stock: 67,
    sold: 189,
    revenue: 7558.11,
    status: 'active',
  },
  {
    id: 3,
    name: 'Sticker Pack',
    sku: 'STICKER-001',
    category: 'Accessories',
    price: 4.99,
    stock: 523,
    sold: 1204,
    revenue: 6005.96,
    status: 'active',
  },
  {
    id: 4,
    name: 'Water Bottle',
    sku: 'BOTTLE-001',
    category: 'Drinkware',
    price: 24.99,
    stock: 89,
    sold: 256,
    revenue: 6397.44,
    status: 'active',
  },
  {
    id: 5,
    name: 'Baseball Cap',
    sku: 'CAP-001',
    category: 'Headwear',
    price: 22.99,
    stock: 0,
    sold: 178,
    revenue: 4091.22,
    status: 'inactive',
  },
  {
    id: 6,
    name: 'Notebook',
    sku: 'NOTE-001',
    category: 'Stationery',
    price: 8.99,
    stock: 234,
    sold: 567,
    revenue: 5096.33,
    status: 'active',
  },
]

const getStatusColor = (status: string) => {
  return status === 'active'
    ? 'bg-green-500/10 text-green-700 dark:text-green-400'
    : 'bg-red-500/10 text-red-700 dark:text-red-400'
}

export default function MerchandiseManagement() {
  const [searchTerm, setSearchTerm] = useState('')

  const filteredMerchandise = merchandise.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const totalRevenue = merchandise.reduce((sum, item) => sum + item.revenue, 0)
  const totalSold = merchandise.reduce((sum, item) => sum + item.sold, 0)
  const totalStock = merchandise.reduce((sum, item) => sum + item.stock, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Merchandise</h1>
          <p className="mt-2 text-muted-foreground">Manage products and inventory</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90 gap-2">
          <Plus className="h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                ${totalRevenue.toFixed(2)}
              </p>
            </div>
            <div className="rounded-lg bg-green-500/10 p-3">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Items Sold</p>
              <p className="mt-2 text-3xl font-bold text-foreground">{totalSold}</p>
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
      </div>

      {/* Search */}
      <Card className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name or SKU..."
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
                <th className="px-6 py-4 text-left font-semibold text-foreground">Product</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">SKU</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Category</th>
                <th className="px-6 py-4 text-right font-semibold text-foreground">Price</th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Stock</th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Sold</th>
                <th className="px-6 py-4 text-right font-semibold text-foreground">Revenue</th>
                <th className="px-6 py-4 text-left font-semibold text-foreground">Status</th>
                <th className="px-6 py-4 text-center font-semibold text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMerchandise.map((item) => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="px-6 py-4">
                    <p className="font-medium text-foreground">{item.name}</p>
                  </td>
                  <td className="px-6 py-4 text-foreground/70 font-mono text-xs">{item.sku}</td>
                  <td className="px-6 py-4 text-foreground/70">{item.category}</td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">
                    ${item.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={cn(
                        'inline-block px-2.5 py-0.5 rounded text-xs font-medium',
                        item.stock === 0
                          ? 'bg-red-500/10 text-red-700 dark:text-red-400'
                          : 'bg-blue-500/10 text-blue-700 dark:text-blue-400'
                      )}
                    >
                      {item.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center font-medium text-foreground">{item.sold}</td>
                  <td className="px-6 py-4 text-right font-medium text-foreground">
                    ${item.revenue.toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn('inline-block px-2.5 py-0.5 rounded-full text-xs font-medium', getStatusColor(item.status))}>
                      {item.status}
                    </span>
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
              ))}
            </tbody>
          </table>
        </div>
      </Card>

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
