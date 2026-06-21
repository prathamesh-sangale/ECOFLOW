import React, { useState } from 'react';
import { useAuth, api } from '../../store/AuthContext';
import type { Product, ProductCategory } from '@ecoflow/shared-types';
import { NotificationPopover } from '../../components/NotificationPopover';
import { GlobalSearch } from '../../components/GlobalSearch';
import ProductForm from './ProductForm';
import { useQuery } from '@tanstack/react-query';

export default function ProductList() {
  const { logout } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [editProductId, setEditProductId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);

  const { data: catData = [] } = useQuery<ProductCategory[]>({
    queryKey: ['categories'],
    queryFn: async () => (await api.get('/categories')).data
  });

  const { data: prodData, isLoading: loading, refetch } = useQuery({
    queryKey: ['products'],
    queryFn: async () => (await api.get('/products')).data
  });

  const products: Product[] = prodData?.products || [];
  const total = prodData?.total || 0;
  const categories = catData;

  const filteredProducts = categoryFilter 
    ? products.filter(p => p.category_id === categoryFilter)
    : products;

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        await api.delete(`/products/${id}`);
        refetch();
      } catch (error: any) {
        alert(error.response?.data?.error || 'Failed to delete product. It may have associated records like BOMs or ECOs.');
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-[#006a63]/15 text-[#006a63]';
      case 'Draft': return 'bg-[#7f4025]/15 text-[#7f4025]';
      case 'Archived': return 'bg-error-container text-error';
      default: return 'bg-surface-container text-on-surface';
    }
  };

  return (
    <div className="flex flex-col h-full">
      <header className="flex items-center justify-between mb-xl">
        <div className="flex items-center gap-xl flex-1">
          <GlobalSearch />
        </div>
          <div className="flex items-center gap-md">
            <NotificationPopover />
            <button 
              onClick={() => setShowForm(true)}
              className="bg-secondary-container text-primary font-label-md text-label-md px-4 py-2 rounded-lg hover:bg-primary hover:text-white transition-all"
            >
              Add Product
            </button>
          </div>
        </header>

        <section className="p-xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-xl gap-lg">
            <div>
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Product Management</h2>
              <p className="text-secondary font-body-lg text-body-lg">Manage engineering lifecycles and versions for the current furniture catalog.</p>
            </div>
            <div className="flex items-center gap-md bg-surface p-1 rounded-xl shadow-sm border border-outline-variant overflow-x-auto">
              <button onClick={() => setCategoryFilter(null)} className={`whitespace-nowrap px-md py-sm rounded-lg text-label-lg font-label-lg transition-all ${categoryFilter === null ? 'bg-secondary-container text-primary font-medium' : 'text-secondary hover:text-primary'}`}>All Products</button>
              {categories.map(cat => (
                <button onClick={() => setCategoryFilter(cat.id)} key={cat.id} className={`whitespace-nowrap px-md py-sm rounded-lg text-label-lg font-label-lg transition-all ${categoryFilter === cat.id ? 'bg-secondary-container text-primary font-medium' : 'text-secondary hover:text-primary'}`}>{cat.name}</button>
              ))}
            </div>
          </div>

          {/* KPI Summary Strip */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-lg mb-xl">
            <div className="bg-surface p-lg rounded-xl shadow-sm border border-outline-variant relative overflow-hidden">
              <p className="text-label-md font-label-md text-secondary uppercase tracking-wider mb-2">Total Products</p>
              <h3 className="font-headline-lg text-headline-lg text-on-surface">{total}</h3>
            </div>
            {/* Additional KPIs would go here */}
          </div>

          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
            <div className="p-lg border-b border-outline-variant flex items-center justify-between bg-surface-container-low/50">
              <h4 className="font-title-lg text-title-lg text-on-surface">Live Catalog</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low/30">
                    <th className="px-lg py-md font-label-md text-label-md text-secondary uppercase tracking-wider">Product Name</th>
                    <th className="px-lg py-md font-label-md text-label-md text-secondary uppercase tracking-wider">Category</th>
                    <th className="px-lg py-md font-label-md text-label-md text-secondary uppercase tracking-wider">Status</th>
                    <th className="px-lg py-md font-label-md text-label-md text-secondary uppercase tracking-wider">Last Updated</th>
                    <th className="px-lg py-md font-label-md text-label-md text-secondary uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {loading ? (
                    <tr><td colSpan={5} className="text-center p-md">Loading...</td></tr>
                  ) : filteredProducts.length === 0 ? (
                    <tr><td colSpan={5} className="text-center p-md text-secondary">No products found.</td></tr>
                  ) : (
                    filteredProducts.map(product => (
                      <tr key={product.id} className="hover:bg-surface-container transition-colors">
                        <td className="px-lg py-md">
                          <div className="flex items-center gap-md">
                            <div className="w-10 h-10 rounded-lg bg-surface-variant flex items-center justify-center overflow-hidden border border-outline-variant">
                              {product.image_url ? (
                                <img className="w-full h-full object-cover" src={product.image_url} alt="" />
                              ) : (
                                <span className="material-symbols-outlined text-secondary">inventory_2</span>
                              )}
                            </div>
                            <div>
                              <p className="font-body-md text-body-md font-semibold text-on-surface">{product.product_name}</p>
                              <p className="text-body-sm text-secondary font-body-sm">SKU: {product.product_code}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-lg py-md">
                          <span className="text-body-md font-body-md text-secondary">{product.category?.name}</span>
                        </td>
                        <td className="px-lg py-md">
                          <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(product.status)}`}>{product.status}</span>
                        </td>
                        <td className="px-lg py-md">
                          <span className="text-body-md font-body-md text-on-surface">{new Date(product.updated_at).toLocaleDateString()}</span>
                        </td>
                        <td className="px-lg py-md text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={() => { setEditProductId(product.id); setShowForm(true); }}
                              className="p-2 hover:bg-secondary-container rounded-lg text-secondary hover:text-primary transition-all"
                            >
                              <span className="material-symbols-outlined text-sm">edit</span>
                            </button>
                            <button onClick={() => handleDelete(product.id)} className="p-2 text-error hover:bg-error-container rounded-lg transition-colors"><span className="material-symbols-outlined text-sm">delete</span></button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      {showForm && (
        <ProductForm 
          productId={editProductId}
          onClose={() => { setShowForm(false); setEditProductId(null); }} 
          onSuccess={() => { setShowForm(false); setEditProductId(null); refetch(); }} 
        />
      )}
    </div>
  );
}
