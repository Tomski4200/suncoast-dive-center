import { createClient } from '@/lib/supabase/client';

export interface ServiceCategory {
  id: number;
  name: string;
  slug: string;
  icon: string | null;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ServiceSubcategory {
  id: number;
  category_id: number;
  name: string;
  slug: string;
  description: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: number;
  category_id: number;
  subcategory_id: number | null;
  name: string;
  slug: string;
  description: string | null;
  price: number | null;
  price_text: string | null;
  duration: string | null;
  depth: string | null;
  includes: string[] | null;
  service_type: string | null;
  display_order: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

// ==================== CATEGORIES ====================

export async function getAllCategories() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .order('display_order');

  if (error) throw error;
  return data as ServiceCategory[];
}

export async function getCategoryById(id: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('service_categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as ServiceCategory;
}

export async function createCategory(category: Partial<ServiceCategory>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('service_categories')
    .insert([{
      ...category,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data as ServiceCategory;
}

export async function updateCategory(id: number, updates: Partial<ServiceCategory>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('service_categories')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as ServiceCategory;
}

export async function deleteCategory(id: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from('service_categories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== SUBCATEGORIES ====================

export async function getAllSubcategories(categoryId?: number) {
  const supabase = createClient();
  let query = supabase
    .from('service_subcategories')
    .select('*')
    .order('display_order');

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as ServiceSubcategory[];
}

export async function getSubcategoryById(id: number) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('service_subcategories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as ServiceSubcategory;
}

export async function createSubcategory(subcategory: Partial<ServiceSubcategory>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('service_subcategories')
    .insert([{
      ...subcategory,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data as ServiceSubcategory;
}

export async function updateSubcategory(id: number, updates: Partial<ServiceSubcategory>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('service_subcategories')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as ServiceSubcategory;
}

export async function deleteSubcategory(id: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from('service_subcategories')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== SERVICES ====================

export async function getAllServices(categoryId?: number) {
  const supabase = createClient();
  let query = supabase
    .from('services_with_categories')
    .select('*')
    .order('display_order');

  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as Service[];
}

export async function getServiceById(id: number) {
  const supabase = createClient();
  const { data, error} = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Service;
}

export async function createService(service: Partial<Service>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('services')
    .insert([{
      ...service,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }])
    .select()
    .single();

  if (error) throw error;
  return data as Service;
}

export async function updateService(id: number, updates: Partial<Service>) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('services')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Service;
}

export async function deleteService(id: number) {
  const supabase = createClient();
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// ==================== UTILITY FUNCTIONS ====================

export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function updateDisplayOrders(
  type: 'categories' | 'subcategories' | 'services',
  items: { id: number; display_order: number }[]
) {
  const supabase = createClient();
  const tableName = type === 'categories'
    ? 'service_categories'
    : type === 'subcategories'
    ? 'service_subcategories'
    : 'services';

  const updates = items.map(item =>
    supabase
      .from(tableName)
      .update({ display_order: item.display_order, updated_at: new Date().toISOString() })
      .eq('id', item.id)
  );

  await Promise.all(updates);
}
