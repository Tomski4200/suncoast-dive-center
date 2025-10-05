'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'

type Category = {
  id: number
  name: string
  slug: string
}

type Product = {
  id: number
  name: string
  description: string | null
  price: number | null
  category_id: number | null
  category_name?: string | null
  category_slug?: string | null
  brand: string | null
  in_stock: boolean
  image_url: string | null
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState<number | 'all'>('all')
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    fetchProductsAndCategories()
  }, [])

  async function fetchProductsAndCategories() {
    // Fetch products with category details from the view
    const { data: productsData, error: productsError } = await supabase
      .from('products_with_categories')
      .select('*')
      .order('id')

    // Fetch categories separately
    const { data: categoriesData, error: categoriesError } = await supabase
      .from('product_categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order')

    if (productsError) {
      console.error('Error fetching products:', productsError)
    } else if (productsData) {
      setProducts(productsData)
    }

    if (categoriesError) {
      console.error('Error fetching categories:', categoriesError)
    } else if (categoriesData) {
      setCategories(categoriesData)
    }
    
    setLoading(false)
  }

  const filteredProducts = selectedCategory === 'all' 
    ? products 
    : products.filter(p => p.category_id === selectedCategory)

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading products...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Our Products</h1>
      
      {/* Category Filter */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg transition ${
            selectedCategory === 'all'
              ? 'bg-[#ffefbf] text-black'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
        >
          All Products ({products.length})
        </button>
        {categories.map(category => {
          const count = products.filter(p => p.category_id === category.id).length
          return (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-lg transition ${
                selectedCategory === category.id
                  ? 'bg-[#ffefbf] text-black'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              {category.name} ({count})
            </button>
          )
        })}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
          >
            {product.image_url ? (
              <div className="relative h-64 bg-gray-100">
                <Image
                  src={product.image_url}
                  alt={product.name}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
            ) : (
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image</span>
              </div>
            )}
            
            <div className="p-4">
              <h3 className="font-semibold text-lg mb-2 line-clamp-2">
                {product.name}
              </h3>
              
              <div className="flex justify-between items-start mb-2">
                {product.brand && (
                  <span className="text-sm text-gray-600">{product.brand}</span>
                )}
                {product.category_name && (
                  <span className="text-xs bg-[#8cda3f] text-white px-2 py-1 rounded">
                    {product.category_name}
                  </span>
                )}
              </div>
              
              {product.price && (
                <p className="text-xl font-bold text-[#ffefbf]">
                  ${product.price.toFixed(2)}
                </p>
              )}
              
              <div className="mt-3">
                <span className={`text-sm ${product.in_stock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.in_stock ? '✓ In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}