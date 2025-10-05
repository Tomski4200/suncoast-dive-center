import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminClient from './AdminClient'
import { getAllBlogPosts } from '@/lib/blog'
import { getAllProducts } from '@/lib/inventory'

export default async function AdminDashboard() {
  const supabase = createClient()

  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Get user profile to check role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  // Check if user is admin or manager
  if (!profile || (profile.role !== 'admin' && profile.role !== 'manager')) {
    redirect('/')
  }

  // Fetch data server-side
  const [blogs, products] = await Promise.all([
    getAllBlogPosts(),
    getAllProducts()
  ])

  return <AdminClient userEmail={user.email || ''} userRole={profile.role} blogs={blogs} products={products} />
}