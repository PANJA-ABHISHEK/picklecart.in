"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Search, Edit2, Trash2, Package, PackageX } from "lucide-react";
import { getProducts, deleteProduct, toggleProductStock } from "@/app/actions/products";
import { getCategories } from "@/app/actions/taxonomy";
import { REGIONS, CATEGORIES } from "@/lib/constants";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dbCategories, setDbCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [regionFilter, setRegionFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  
  // Delete Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const [result, catsRes] = await Promise.all([getProducts(), getCategories()]);
    if (result.success) {
      setProducts(result.products);
    }
    if (catsRes.success) {
      setDbCategories(catsRes.categories);
    }
    setLoading(false);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    
    const result = await deleteProduct(productToDelete.id);
    if (result.success) {
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } else {
      alert("Failed to delete product: " + result.error);
    }
    setIsDeleting(false);
  };

  const handleToggleStock = async (product) => {
    // Check if currently in stock
    const isCurrentlyInStock = product.pricing.some(p => p.inStock);
    
    // Flip all variants to the opposite state
    const newPricingState = product.pricing.map(p => ({
      ...p,
      inStock: !isCurrentlyInStock
    }));

    // Update local state instantly for snappy UI
    setProducts(products.map(p => 
      p.id === product.id ? { ...p, pricing: newPricingState } : p
    ));

    // Update in database
    const result = await toggleProductStock(product.id, newPricingState);
    if (!result.success) {
      alert("Failed to update stock status.");
      // Revert if failed
      fetchProducts();
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const hasRegions = p.regions && p.regions.length > 0;
    const matchesRegion = regionFilter === "all" || 
      (hasRegions ? p.regions.includes(regionFilter) : p.regionId === regionFilter);
    const matchesCategory = categoryFilter === "all" || p.categoryId === categoryFilter;
    return matchesSearch && matchesRegion && matchesCategory;
  });

  const totalProducts = products.length;
  const inStockProducts = products.filter(p => p.pricing.some(pricing => pricing.inStock)).length;
  const outOfStockProducts = totalProducts - inStockProducts;

  const allCats = [...CATEGORIES, ...dbCategories.filter(c => !CATEGORIES.some(x => x.id === c.id))];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-4xl font-display font-bold text-earthy-brown-dark tracking-tight mb-1">Products</h1>
          <p className="text-earthy-brown-light font-medium">Manage your inventory and product catalog</p>
        </div>
        
        <Link 
          href="/admin/products/new" 
          className="bg-earthy-brown text-white px-5 py-2.5 rounded-lg font-medium hover:bg-earthy-brown-dark transition-colors flex items-center justify-center gap-2 shadow-sm"
          style={{ color: "white" }}
        >
          <Plus size={20} color="white" />
          Add Product
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-surface rounded-2xl shadow-sm border border-border-light p-6 flex flex-col justify-center items-center sm:items-start transition-colors">
          <p className="text-sm font-semibold text-earthy-brown-light mb-1 tracking-wider uppercase text-center sm:text-left">Total Products</p>
          <p className="text-3xl font-bold text-earthy-brown-dark text-center sm:text-left">{totalProducts}</p>
        </div>
        <div className="bg-surface rounded-2xl shadow-sm border border-border-light p-6 flex flex-col justify-center items-center sm:items-start transition-colors">
          <p className="text-sm font-semibold text-heritage-green/70 mb-1 tracking-wider uppercase text-center sm:text-left">In Stock</p>
          <p className="text-3xl font-bold text-heritage-green-dark text-center sm:text-left">{inStockProducts}</p>
        </div>
        <div className="bg-surface rounded-2xl shadow-sm border border-border-light p-6 flex flex-col justify-center items-center sm:items-start transition-colors">
          <p className="text-sm font-semibold text-pickle-red/70 mb-1 tracking-wider uppercase text-center sm:text-left">Out of Stock</p>
          <p className="text-3xl font-bold text-pickle-red-dark text-center sm:text-left">{outOfStockProducts}</p>
        </div>
      </div>

      <div className="bg-surface rounded-2xl shadow-sm border border-border-light overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border-light flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="relative flex-1 w-full md:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-earthy-brown-light" size={20} />
            <input 
              type="text"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-cream border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all text-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="w-full md:w-40 px-3 py-2 bg-cream border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all text-sm"
            >
              <option value="all">All Regions</option>
              {REGIONS.map(reg => (
                <option key={reg.id} value={reg.id}>{reg.name}</option>
              ))}
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-48 px-3 py-2 bg-cream border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all text-sm"
            >
              <option value="all">All Categories</option>
              {allCats.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="text-sm font-semibold text-earthy-brown-light whitespace-nowrap ml-auto">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-alt border-b border-border-light">
                <th className="px-6 py-4 text-xs font-bold text-earthy-brown-dark uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-xs font-bold text-earthy-brown-dark uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-xs font-bold text-earthy-brown-dark uppercase tracking-wider">Starting Price</th>
                <th className="px-6 py-4 text-xs font-bold text-earthy-brown-dark uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-earthy-brown-dark uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    Loading products...
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <Package size={48} className="mx-auto text-gray-300 mb-3" />
                    <p>No products found in the database.</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => {
                  const categoryName = allCats.find(c => c.id === product.categoryId)?.name || product.categoryId;
                  const lowestPrice = Math.min(...product.pricing.map(p => p.price));
                  const isInStock = product.pricing.some(p => p.inStock);

                  return (
                    <tr key={product.id} className="hover:bg-cream/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <div className="relative w-12 h-12 rounded-lg border border-border overflow-hidden bg-surface flex-shrink-0">
                            {product.image ? (
                              <Image src={product.image} alt={product.name} fill className="object-cover" />
                            ) : (
                              <Package className="absolute inset-0 m-auto text-charcoal-muted/30" size={20} />
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-charcoal">{product.name}</p>
                            <div className="flex gap-2 mt-1">
                              {product.featured && <span className="text-[10px] bg-turmeric-gold/20 text-turmeric-gold-dark px-2 py-0.5 rounded font-bold uppercase tracking-wide">Featured</span>}
                              {product.bestSeller && <span className="text-[10px] bg-heritage-green/10 text-heritage-green-dark px-2 py-0.5 rounded font-bold uppercase tracking-wide">Best Seller</span>}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-earthy-brown/10 text-earthy-brown">
                          {categoryName}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-charcoal">₹{lowestPrice}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                          isInStock ? 'bg-heritage-green/10 text-heritage-green-dark border border-heritage-green/20' : 'bg-pickle-red/10 text-pickle-red-dark border border-pickle-red/20'
                        }`}>
                          {isInStock ? 'In Stock' : 'Out of Stock'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleToggleStock(product)}
                            className="p-2 text-orange-500 hover:bg-orange-50 rounded-lg transition-colors" 
                            title={isInStock ? "Disable (Mark Out of Stock)" : "Enable (Mark In Stock)"}
                          >
                            <PackageX size={18} />
                          </button>
                          <Link 
                            href={`/admin/products/edit/${product.id}`}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" 
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </Link>
                          <button 
                            onClick={() => handleDeleteClick(product)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" 
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile/Tablet Card View */}
        <div className="md:hidden flex flex-col gap-4 mt-4">
          {loading ? (
            <div className="py-12 text-center text-gray-500">Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-12 text-center text-gray-500">
              <Package size={48} className="mx-auto text-gray-300 mb-3" />
              <p>No products found.</p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const categoryName = allCats.find(c => c.id === product.categoryId)?.name || product.categoryId;
              const lowestPrice = Math.min(...product.pricing.map(p => p.price));
              const isInStock = product.pricing.some(p => p.inStock);

              return (
                <div key={product.id} className="bg-surface p-4 rounded-xl shadow-sm border border-border-light flex flex-col gap-4">
                  {/* Top: Image & Info */}
                  <div className="flex gap-4">
                    <div className="relative w-16 h-16 rounded-lg border border-border overflow-hidden bg-cream flex-shrink-0">
                      {product.image ? (
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      ) : (
                        <Package className="absolute inset-0 m-auto text-charcoal-muted/30" size={24} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-charcoal text-base truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-charcoal text-sm">₹{lowestPrice}</span>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {product.featured && <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded font-bold uppercase tracking-wide">Featured</span>}
                        {product.bestSeller && <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold uppercase tracking-wide">Best Seller</span>}
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Pills & Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50 mt-1">
                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold bg-blue-50 text-blue-600">
                        {categoryName}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                        isInStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {isInStock ? 'IN STOCK' : 'OUT OF STOCK'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button 
                        onClick={() => handleToggleStock(product)}
                        className="p-1.5 text-orange-500 hover:bg-orange-50 rounded-md transition-colors" 
                        title={isInStock ? "Disable (Mark Out of Stock)" : "Enable (Mark In Stock)"}
                      >
                        <PackageX size={16} />
                      </button>
                      <Link 
                        href={`/admin/products/edit/${product.id}`}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors" 
                        title="Edit"
                      >
                        <Edit2 size={16} />
                      </Link>
                      <button 
                        onClick={() => handleDeleteClick(product)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors" 
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Custom Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/20 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trash2 size={32} className="text-red-600" />
              </div>
              <h3 className="text-xl font-display font-bold text-charcoal mb-2">
                Delete Product?
              </h3>
              <p className="text-charcoal-muted font-body text-sm mb-6">
                Are you sure you want to delete <span className="font-bold text-charcoal">{productToDelete?.name}</span>? This action cannot be undone and it will be permanently removed from your database.
              </p>
              <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-center">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  disabled={isDeleting}
                  className="px-6 py-2.5 rounded-xl font-medium text-charcoal bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-6 py-2.5 rounded-xl font-medium text-white bg-red-600 hover:bg-red-700 transition-colors flex items-center justify-center min-w-[120px] disabled:opacity-50"
                >
                  {isDeleting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    "Yes, Delete"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
