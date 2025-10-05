'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Package, FileText, FileIcon, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
  title: string;
  url: string;
  description: string;
  category: 'products' | 'blog' | 'pages' | 'categories';
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      setQuery('');
      setResults([]);
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (!isOpen) {
          // This will be triggered from parent, but we prevent default here
        }
      }

      // ESC to close
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }

      // Arrow navigation
      if (isOpen && results.length > 0) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter' && selectedIndex >= 0) {
          e.preventDefault();
          const selectedResult = results[selectedIndex];
          if (selectedResult) {
            window.location.href = selectedResult.url;
            onClose();
          }
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, results, selectedIndex]);

  // Debounced search
  const performSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim().length >= 2) {
      setLoading(true);
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 300);
    } else {
      setResults([]);
      setLoading(false);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, performSearch]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'products':
        return <Package size={16} />;
      case 'blog':
        return <FileText size={16} />;
      case 'pages':
        return <FileIcon size={16} />;
      case 'categories':
        return <Package size={16} />;
      default:
        return <FileIcon size={16} />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'products':
        return 'Product';
      case 'blog':
        return 'Blog Post';
      case 'pages':
        return 'Page';
      case 'categories':
        return 'Category';
      default:
        return 'Result';
    }
  };

  // Group results by category
  const groupedResults = results.reduce((acc, result) => {
    if (!acc[result.category]) {
      acc[result.category] = [];
    }
    acc[result.category].push(result);
    return acc;
  }, {} as Record<string, SearchResult[]>);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.7)',
              backdropFilter: 'blur(4px)',
              zIndex: 9998
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: -50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.95 }}
            transition={{ duration: 0.3, type: 'spring', damping: 25 }}
            style={{
              position: 'fixed',
              top: '15%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '90%',
              maxWidth: '700px',
              maxHeight: '70vh',
              background: 'rgba(10, 22, 40, 0.95)',
              border: '1px solid rgba(140, 218, 63, 0.3)',
              borderRadius: '16px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(20px)',
              zIndex: 9999,
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* Search Header */}
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(255, 239, 191, 0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem'
            }}>
              <Search size={24} color="#8cda3f" style={{ flexShrink: 0 }} />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, blog posts, pages..."
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#ffefbf',
                  fontSize: '1.125rem',
                  fontWeight: 500
                }}
              />
              <button
                onClick={onClose}
                style={{
                  background: 'rgba(255, 239, 191, 0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  color: 'rgba(255, 239, 191, 0.6)',
                  flexShrink: 0
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 107, 107, 0.2)';
                  e.currentTarget.style.color = '#ff6b6b';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(255, 239, 191, 0.1)';
                  e.currentTarget.style.color = 'rgba(255, 239, 191, 0.6)';
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Results Container */}
            <div style={{
              flex: 1,
              overflowY: 'auto',
              padding: '1rem'
            }}>
              {loading && (
                <div style={{
                  padding: '3rem',
                  textAlign: 'center',
                  color: 'rgba(255, 239, 191, 0.5)',
                  fontSize: '0.875rem'
                }}>
                  Searching...
                </div>
              )}

              {!loading && query.trim().length < 2 && (
                <div style={{
                  padding: '3rem',
                  textAlign: 'center'
                }}>
                  <Search size={48} color="rgba(140, 218, 63, 0.3)" style={{ margin: '0 auto 1rem' }} />
                  <p style={{
                    color: 'rgba(255, 239, 191, 0.5)',
                    fontSize: '0.875rem',
                    marginBottom: '0.5rem'
                  }}>
                    Start typing to search...
                  </p>
                  <p style={{
                    color: 'rgba(255, 239, 191, 0.3)',
                    fontSize: '0.75rem'
                  }}>
                    Press <kbd style={{
                      background: 'rgba(140, 218, 63, 0.1)',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      border: '1px solid rgba(140, 218, 63, 0.3)'
                    }}>ESC</kbd> to close
                  </p>
                </div>
              )}

              {!loading && query.trim().length >= 2 && results.length === 0 && (
                <div style={{
                  padding: '3rem',
                  textAlign: 'center',
                  color: 'rgba(255, 239, 191, 0.5)',
                  fontSize: '0.875rem'
                }}>
                  No results found for "{query}"
                </div>
              )}

              {!loading && results.length > 0 && (
                <div>
                  {Object.entries(groupedResults).map(([category, categoryResults]) => (
                    <div key={category} style={{ marginBottom: '1.5rem' }}>
                      <h3 style={{
                        color: '#8cda3f',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '0.75rem',
                        paddingLeft: '0.5rem'
                      }}>
                        {category === 'products' ? 'Products' : category === 'blog' ? 'Blog Posts' : category === 'categories' ? 'Categories' : 'Pages'}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        {categoryResults.map((result, idx) => {
                          const globalIndex = results.indexOf(result);
                          const isSelected = globalIndex === selectedIndex;

                          return (
                            <Link
                              key={idx}
                              href={result.url}
                              onClick={onClose}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                background: isSelected ? 'rgba(140, 218, 63, 0.1)' : 'rgba(30, 58, 95, 0.3)',
                                border: `1px solid ${isSelected ? 'rgba(140, 218, 63, 0.3)' : 'rgba(255, 239, 191, 0.1)'}`,
                                borderRadius: '8px',
                                textDecoration: 'none',
                                transition: 'all 0.2s ease',
                                cursor: 'pointer'
                              }}
                              onMouseEnter={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.background = 'rgba(140, 218, 63, 0.05)';
                                  e.currentTarget.style.borderColor = 'rgba(140, 218, 63, 0.2)';
                                }
                              }}
                              onMouseLeave={(e) => {
                                if (!isSelected) {
                                  e.currentTarget.style.background = 'rgba(30, 58, 95, 0.3)';
                                  e.currentTarget.style.borderColor = 'rgba(255, 239, 191, 0.1)';
                                }
                              }}
                            >
                              <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '8px',
                                background: 'rgba(140, 218, 63, 0.1)',
                                border: '1px solid rgba(140, 218, 63, 0.2)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#8cda3f',
                                flexShrink: 0
                              }}>
                                {getCategoryIcon(result.category)}
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  marginBottom: '0.25rem'
                                }}>
                                  <h4 style={{
                                    color: '#ffefbf',
                                    fontSize: '0.9375rem',
                                    fontWeight: 600,
                                    margin: 0,
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                  }}>
                                    {result.title}
                                  </h4>
                                  <span style={{
                                    color: 'rgba(140, 218, 63, 0.6)',
                                    fontSize: '0.6875rem',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em',
                                    fontWeight: 600,
                                    flexShrink: 0
                                  }}>
                                    {getCategoryLabel(result.category)}
                                  </span>
                                </div>
                                <p style={{
                                  color: 'rgba(255, 239, 191, 0.6)',
                                  fontSize: '0.8125rem',
                                  margin: 0,
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {result.description}
                                </p>
                              </div>

                              <ArrowRight
                                size={18}
                                color="rgba(140, 218, 63, 0.5)"
                                style={{
                                  flexShrink: 0,
                                  opacity: isSelected ? 1 : 0.5
                                }}
                              />
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with keyboard shortcuts */}
            {results.length > 0 && (
              <div style={{
                padding: '0.75rem 1.5rem',
                borderTop: '1px solid rgba(255, 239, 191, 0.1)',
                display: 'flex',
                gap: '1.5rem',
                fontSize: '0.75rem',
                color: 'rgba(255, 239, 191, 0.4)'
              }}>
                <span>
                  <kbd style={{
                    background: 'rgba(140, 218, 63, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid rgba(140, 218, 63, 0.3)',
                    marginRight: '0.5rem'
                  }}>↑</kbd>
                  <kbd style={{
                    background: 'rgba(140, 218, 63, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid rgba(140, 218, 63, 0.3)',
                    marginRight: '0.5rem'
                  }}>↓</kbd>
                  Navigate
                </span>
                <span>
                  <kbd style={{
                    background: 'rgba(140, 218, 63, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid rgba(140, 218, 63, 0.3)',
                    marginRight: '0.5rem'
                  }}>↵</kbd>
                  Select
                </span>
                <span>
                  <kbd style={{
                    background: 'rgba(140, 218, 63, 0.1)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid rgba(140, 218, 63, 0.3)',
                    marginRight: '0.5rem'
                  }}>ESC</kbd>
                  Close
                </span>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
