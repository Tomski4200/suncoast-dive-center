'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, Plus, Search, Calendar, User, Edit2, Trash2, 
  FileText, Eye, Save, X, Clock, Tag, Upload, Image
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useAuth } from '@/contexts/AuthContext';
import { getAllBlogPosts, BlogPost } from '@/lib/blog';

export default function BlogManagement() {
  const router = useRouter();
  const { user, isAdmin } = useAuth();
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [isAddingBlog, setIsAddingBlog] = useState(false);
  
  // Form state for editing/adding
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    date: '',
    excerpt_text: '',
    short_blog_entry: '',
    category: '',
    featuredImage: '',
    images: [] as string[]
  });
  
  // Redirect if not admin
  useEffect(() => {
    if (!user) {
      router.push('/auth');
    } else if (!isAdmin()) {
      router.push('/dashboard');
    }
  }, [user, router, isAdmin]);
  
  // Load blogs
  useEffect(() => {
    const allBlogs = getAllBlogPosts();
    setBlogs(allBlogs);
    setFilteredBlogs(allBlogs);
  }, []);
  
  // Filter blogs
  useEffect(() => {
    let filtered = blogs;
    
    if (searchQuery) {
      filtered = filtered.filter(b => 
        b.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.excerpt_text.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredBlogs(filtered);
  }, [searchQuery, blogs]);
  
  if (!user || !isAdmin()) {
    return null;
  }
  
  const handleEdit = (blog: BlogPost) => {
    setEditingBlog(blog);
    const category = blog.title.toLowerCase().includes('scallop') ? 'Scalloping' :
                     blog.title.toLowerCase().includes('lobster') ? 'Lobstering' :
                     blog.title.toLowerCase().includes('whale') ? 'Wildlife' :
                     blog.title.toLowerCase().includes('water') ? 'Conditions' :
                     'Diving';
    
    setFormData({
      title: blog.title,
      author: blog.author,
      date: blog.date,
      excerpt_text: blog.excerpt_text,
      short_blog_entry: blog.short_blog_entry,
      category,
      featuredImage: (blog as any).featuredImage || '',
      images: (blog as any).images || []
    });
  };
  
  const handleAdd = () => {
    setIsAddingBlog(true);
    setFormData({
      title: '',
      author: user?.name || 'Admin',
      date: new Date().toISOString().split('T')[0],
      excerpt_text: '',
      short_blog_entry: '',
      category: 'Diving',
      featuredImage: '',
      images: []
    });
  };
  
  const handleSave = () => {
    // In a real app, this would save to a database
    alert('Blog post saved! (In production, this would update the database)');
    setEditingBlog(null);
    setIsAddingBlog(false);
  };
  
  const handleDelete = (slug: string) => {
    if (confirm('Are you sure you want to delete this blog post?')) {
      // In a real app, this would delete from database
      alert('Blog post deleted! (In production, this would update the database)');
    }
  };
  
  const handleCancel = () => {
    setEditingBlog(null);
    setIsAddingBlog(false);
    setFormData({
      title: '',
      author: '',
      date: '',
      excerpt_text: '',
      short_blog_entry: '',
      category: '',
      featuredImage: '',
      images: []
    });
  };
  
  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isFeatured: boolean = false) => {
    const files = e.target.files;
    if (files) {
      // In a real app, this would upload to a server
      // For demo, we'll just create object URLs
      const newImages = Array.from(files).map(file => URL.createObjectURL(file));
      
      if (isFeatured && newImages.length > 0) {
        setFormData({ ...formData, featuredImage: newImages[0] });
      } else {
        setFormData({ ...formData, images: [...formData.images, ...newImages] });
      }
    }
  };
  
  // Remove image
  const handleRemoveImage = (index: number) => {
    const updatedImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: updatedImages });
  };
  
  // Calculate reading time
  const calculateReadTime = (text: string) => {
    const wordCount = text.split(' ').length;
    return Math.ceil(wordCount / 200);
  };
  
  return (
    <div style={{ minHeight: '100vh', background: '#0a1628' }}>
      <Navigation />
      
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        padding: '120px 2rem 4rem'
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: '2rem' }}
        >
          <Link
            href="/admin"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: '#8cda3f',
              textDecoration: 'none',
              marginBottom: '1rem',
              fontSize: '0.875rem',
              fontWeight: 500
            }}
          >
            <ArrowLeft size={16} />
            Back to Dashboard
          </Link>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{
                fontSize: '2.5rem',
                fontWeight: 700,
                color: '#ffefbf',
                marginBottom: '0.5rem'
              }}>
                Blog Management
              </h1>
              <p style={{ color: 'rgba(255, 239, 191, 0.7)' }}>
                Create and manage blog posts for your dive shop
              </p>
            </div>
            
            <button
              onClick={handleAdd}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                borderRadius: '8px',
                border: 'none',
                color: 'white',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              <Plus size={20} />
              New Blog Post
            </button>
          </div>
        </motion.div>
        
        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{
              background: 'rgba(30, 58, 95, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid rgba(255, 239, 191, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Total Posts
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 700 }}>
                  {blogs.length}
                </p>
              </div>
              <FileText size={24} color="#8cda3f" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            style={{
              background: 'rgba(30, 58, 95, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid rgba(255, 239, 191, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  This Month
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 700 }}>
                  {blogs.filter(b => {
                    const blogDate = new Date(b.date);
                    const thisMonth = new Date();
                    return blogDate.getMonth() === thisMonth.getMonth() &&
                           blogDate.getFullYear() === thisMonth.getFullYear();
                  }).length}
                </p>
              </div>
              <Calendar size={24} color="#8cda3f" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              background: 'rgba(30, 58, 95, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid rgba(255, 239, 191, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Authors
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 700 }}>
                  {Array.from(new Set(blogs.map(b => b.author))).length}
                </p>
              </div>
              <User size={24} color="#8cda3f" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            style={{
              background: 'rgba(30, 58, 95, 0.3)',
              borderRadius: '12px',
              padding: '1.25rem',
              border: '1px solid rgba(255, 239, 191, 0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  Avg Read Time
                </p>
                <p style={{ color: '#ffefbf', fontSize: '1.75rem', fontWeight: 700 }}>
                  {Math.round(blogs.reduce((acc, b) => 
                    acc + calculateReadTime(b.excerpt_text + b.short_blog_entry), 0
                  ) / blogs.length)} min
                </p>
              </div>
              <Clock size={24} color="#8cda3f" />
            </div>
          </motion.div>
        </div>
        
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{
            background: 'rgba(30, 58, 95, 0.2)',
            borderRadius: '12px',
            padding: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          <div style={{ position: 'relative' }}>
            <Search size={20} style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 239, 191, 0.5)'
            }} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search blog posts..."
              style={{
                width: '100%',
                padding: '12px 12px 12px 44px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 239, 191, 0.2)',
                borderRadius: '8px',
                color: '#ffefbf',
                fontSize: '1rem'
              }}
            />
          </div>
          
          <p style={{
            color: 'rgba(255, 239, 191, 0.6)',
            fontSize: '0.875rem',
            marginTop: '1rem'
          }}>
            Showing {filteredBlogs.length} of {blogs.length} posts
          </p>
        </motion.div>
        
        {/* Blog List or Edit Form */}
        {(editingBlog || isAddingBlog) ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: 'rgba(30, 58, 95, 0.2)',
              borderRadius: '12px',
              padding: '2rem'
            }}
          >
            <h2 style={{ 
              color: '#ffefbf', 
              fontSize: '1.5rem', 
              fontWeight: 600, 
              marginBottom: '1.5rem' 
            }}>
              {isAddingBlog ? 'Create New Blog Post' : 'Edit Blog Post'}
            </h2>
            
            <div style={{ display: 'grid', gap: '1.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{
                    display: 'block',
                    color: '#ffefbf',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    fontWeight: 500
                  }}>
                    Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 239, 191, 0.2)',
                      borderRadius: '8px',
                      color: '#ffefbf',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    color: '#ffefbf',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    fontWeight: 500
                  }}>
                    Author
                  </label>
                  <input
                    type="text"
                    value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 239, 191, 0.2)',
                      borderRadius: '8px',
                      color: '#ffefbf',
                      fontSize: '1rem'
                    }}
                  />
                </div>
                
                <div>
                  <label style={{
                    display: 'block',
                    color: '#ffefbf',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem',
                    fontWeight: 500
                  }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 239, 191, 0.2)',
                      borderRadius: '8px',
                      color: '#ffefbf',
                      fontSize: '1rem'
                    }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '8px',
                    color: '#ffefbf',
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}
                >
                  <option value="Diving">Diving</option>
                  <option value="Scalloping">Scalloping</option>
                  <option value="Lobstering">Lobstering</option>
                  <option value="Wildlife">Wildlife</option>
                  <option value="Conditions">Conditions</option>
                  <option value="Seasonal">Seasonal</option>
                </select>
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  Excerpt
                </label>
                <textarea
                  value={formData.excerpt_text}
                  onChange={(e) => setFormData({ ...formData, excerpt_text: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '8px',
                    color: '#ffefbf',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              <div>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  Content
                </label>
                <textarea
                  value={formData.short_blog_entry}
                  onChange={(e) => setFormData({ ...formData, short_blog_entry: e.target.value })}
                  rows={10}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 239, 191, 0.2)',
                    borderRadius: '8px',
                    color: '#ffefbf',
                    fontSize: '1rem',
                    resize: 'vertical'
                  }}
                />
              </div>
              
              {/* Featured Image Upload */}
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  Featured Image
                </label>
                
                {formData.featuredImage ? (
                  <div style={{
                    position: 'relative',
                    height: '200px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    marginBottom: '1rem'
                  }}>
                    <img 
                      src={formData.featuredImage} 
                      alt="Featured"
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                    <button
                      onClick={() => setFormData({ ...formData, featuredImage: '' })}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(255, 107, 107, 0.9)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <X size={18} color="white" />
                    </button>
                  </div>
                ) : (
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '200px',
                    background: 'rgba(140, 218, 63, 0.1)',
                    border: '2px dashed rgba(140, 218, 63, 0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    marginBottom: '1rem'
                  }}>
                    <Upload size={32} color="#8cda3f" />
                    <span style={{
                      color: '#8cda3f',
                      fontSize: '0.875rem',
                      marginTop: '0.5rem',
                      fontWeight: 600
                    }}>
                      Upload Featured Image
                    </span>
                    <span style={{
                      color: 'rgba(255, 239, 191, 0.5)',
                      fontSize: '0.75rem',
                      marginTop: '0.25rem'
                    }}>
                      This image will appear at the top of the blog post
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, true)}
                      style={{ display: 'none' }}
                    />
                  </label>
                )}
              </div>
              
              {/* Additional Images */}
              <div style={{ marginTop: '1.5rem' }}>
                <label style={{
                  display: 'block',
                  color: '#ffefbf',
                  fontSize: '0.875rem',
                  marginBottom: '0.5rem',
                  fontWeight: 500
                }}>
                  Additional Images
                </label>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
                  gap: '1rem',
                  marginBottom: '1rem'
                }}>
                  {formData.images.map((image, index) => (
                    <div key={index} style={{
                      position: 'relative',
                      height: '150px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={image} 
                        alt={`Blog ${index + 1}`}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <button
                        onClick={() => handleRemoveImage(index)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          background: 'rgba(255, 107, 107, 0.9)',
                          border: 'none',
                          borderRadius: '50%',
                          width: '28px',
                          height: '28px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          cursor: 'pointer'
                        }}
                      >
                        <X size={14} color="white" />
                      </button>
                    </div>
                  ))}
                  
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '150px',
                    background: 'rgba(140, 218, 63, 0.1)',
                    border: '2px dashed rgba(140, 218, 63, 0.3)',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}>
                    <Image size={24} color="#8cda3f" />
                    <span style={{
                      color: '#8cda3f',
                      fontSize: '0.75rem',
                      marginTop: '0.5rem',
                      fontWeight: 600
                    }}>
                      Add Image
                    </span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, false)}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
                
                {formData.images.length > 0 && (
                  <p style={{
                    color: 'rgba(255, 239, 191, 0.5)',
                    fontSize: '0.75rem'
                  }}>
                    {formData.images.length} image{formData.images.length !== 1 ? 's' : ''} uploaded. These can be inserted into the blog content.
                  </p>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                onClick={handleSave}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #8cda3f, #6eb52f)',
                  borderRadius: '8px',
                  border: 'none',
                  color: 'white',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <Save size={18} />
                Save Post
              </button>
              
              <button
                onClick={handleCancel}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '12px 24px',
                  background: 'transparent',
                  border: '1px solid rgba(255, 239, 191, 0.2)',
                  borderRadius: '8px',
                  color: 'rgba(255, 239, 191, 0.8)',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                <X size={18} />
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            style={{
              display: 'grid',
              gap: '1rem'
            }}
          >
            {filteredBlogs.map(blog => (
              <div
                key={blog.slug}
                style={{
                  background: 'rgba(30, 58, 95, 0.2)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: '1rem',
                  alignItems: 'center'
                }}
              >
                <div>
                  <h3 style={{ 
                    color: '#ffefbf', 
                    fontSize: '1.25rem', 
                    fontWeight: 600,
                    marginBottom: '0.5rem'
                  }}>
                    {blog.title}
                  </h3>
                  
                  <p style={{ 
                    color: 'rgba(255, 239, 191, 0.7)', 
                    fontSize: '0.875rem',
                    marginBottom: '0.75rem',
                    lineHeight: 1.5
                  }}>
                    {blog.excerpt_text.substring(0, 150)}...
                  </p>
                  
                  <div style={{ 
                    display: 'flex', 
                    gap: '1.5rem', 
                    alignItems: 'center',
                    flexWrap: 'wrap'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={14} color="#8cda3f" />
                      <span style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                        {blog.author}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Calendar size={14} color="#8cda3f" />
                      <span style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                        {new Date(blog.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={14} color="#8cda3f" />
                      <span style={{ color: 'rgba(255, 239, 191, 0.6)', fontSize: '0.875rem' }}>
                        {calculateReadTime(blog.excerpt_text + blog.short_blog_entry)} min read
                      </span>
                    </div>
                    
                    <span style={{
                      background: 'rgba(140, 218, 63, 0.2)',
                      color: '#8cda3f',
                      padding: '4px 12px',
                      borderRadius: '12px',
                      fontSize: '0.75rem',
                      fontWeight: 600
                    }}>
                      {blog.title.toLowerCase().includes('scallop') ? 'Scalloping' :
                       blog.title.toLowerCase().includes('lobster') ? 'Lobstering' :
                       blog.title.toLowerCase().includes('whale') ? 'Wildlife' :
                       blog.title.toLowerCase().includes('water') ? 'Conditions' :
                       'Diving'}
                    </span>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <Link
                    href={`/blog/${blog.slug}`}
                    target="_blank"
                    style={{
                      padding: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '8px',
                      color: 'rgba(255, 239, 191, 0.8)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Eye size={18} />
                  </Link>
                  
                  <button
                    onClick={() => handleEdit(blog)}
                    style={{
                      padding: '8px',
                      background: 'rgba(140, 218, 63, 0.1)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#8cda3f',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Edit2 size={18} />
                  </button>
                  
                  <button
                    onClick={() => blog.slug && handleDelete(blog.slug)}
                    style={{
                      padding: '8px',
                      background: 'rgba(255, 107, 107, 0.1)',
                      border: 'none',
                      borderRadius: '8px',
                      color: '#ff6b6b',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}