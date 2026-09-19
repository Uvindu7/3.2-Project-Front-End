import React, { useState, useEffect } from 'react';
import api from '../../lib/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({
    name: '',
    description: '',
    price: '',
    stockS: '',
    stockM: '',
    stockL: '',
    categoryId: '',
    imageUrl: '',
    imageFile: null,
    clothingType: 'T-Shirt',
    style: 'Casual',
    color: ''
  });

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Failed to load data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProduct({ ...currentProduct, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Use FormData to support image uploads
      const formData = new FormData();
      Object.keys(currentProduct).forEach(key => {
        if (key === 'imageFile') {
          if (currentProduct.imageFile) {
            formData.append('image', currentProduct.imageFile);
          }
        } else if (currentProduct[key] !== null && currentProduct[key] !== undefined) {
          formData.append(key, currentProduct[key]);
        }
      });

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (currentProduct.id) {
        // Update
        await api.put(`/products/${currentProduct.id}`, formData, config);
      } else {
        // Create
        await api.post('/products', formData, config);
      }
      setIsEditing(false);
      fetchData(); // Refresh list
    } catch (err) {
      console.error('Failed to save product', err);
      alert(err.response?.data?.message || 'Failed to save product');
    }
  };

  // Drag and Drop Handlers
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileSelection = (file) => {
    if (file.type.startsWith('image/')) {
      const previewUrl = URL.createObjectURL(file);
      setCurrentProduct({
        ...currentProduct,
        imageFile: file,
        imageUrl: previewUrl // Temporarily show the local preview
      });
    } else {
      alert('Please select an image file.');
    }
  };

  const handleEdit = (product) => {
    setCurrentProduct({
      id: product.id,
      name: product.name,
      description: product.description || '',
      price: product.price,
      stockS: product.stockS,
      stockM: product.stockM,
      stockL: product.stockL,
      categoryId: product.categoryId || '',
      imageUrl: product.imageUrl || '',
      imageFile: null,
      clothingType: product.clothingType || 'Other',
      style: product.style || 'Casual',
      color: product.color || ''
    });
    setIsEditing(true);
  };

  const handleAddNew = () => {
    setCurrentProduct({
      name: '',
      description: '',
      price: '',
      stockS: '',
      stockM: '',
      stockL: '',
      categoryId: '',
      imageUrl: '',
      imageFile: null,
      clothingType: 'Other',
      style: 'Casual',
      color: ''
    });
    setIsEditing(true);
  };

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await api.delete(`/products/${productToDelete.id}`);
      setProducts(products.filter(p => p.id !== productToDelete.id));
      setProductToDelete(null);
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  if (loading) return <div className="animate-pulse p-8">Loading products...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Product Management</h2>
        {!isEditing && (
          <button 
            onClick={handleAddNew}
            className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add Product
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">{currentProduct.id ? 'Edit Product' : 'Add New Product'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input required type="text" name="name" value={currentProduct.name} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Category</label>
                <select name="categoryId" value={currentProduct.categoryId} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white">
                  <option value="">No Category</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Price ($)</label>
                <input required type="number" step="0.01" min="0" name="price" value={currentProduct.price} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Stock (S)</label>
                <input required type="number" min="0" name="stockS" value={currentProduct.stockS} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Stock (M)</label>
                <input required type="number" min="0" name="stockM" value={currentProduct.stockM} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Stock (L)</label>
                <input required type="number" min="0" name="stockL" value={currentProduct.stockL} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Product Image</label>
                <div 
                  className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer min-h-[150px] ${isDragging ? 'border-black bg-gray-50' : 'border-gray-300 hover:border-gray-400 bg-white'}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('fileInput').click()}
                >
                  <input 
                    id="fileInput"
                    type="file" 
                    accept="image/*" 
                    onChange={handleFileChange} 
                    className="hidden" 
                  />
                  
                  {currentProduct.imageUrl ? (
                    <div className="relative w-full flex justify-center">
                      <img 
                        src={currentProduct.imageUrl.startsWith('blob:') || currentProduct.imageUrl.startsWith('http') ? currentProduct.imageUrl : `http://localhost:5000${currentProduct.imageUrl}`} 
                        alt="Preview" 
                        className="h-40 object-contain rounded"
                      />
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-black" onClick={(e) => { e.stopPropagation(); setCurrentProduct({...currentProduct, imageUrl: '', imageFile: null}); }}>
                        Change
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500">
                      <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="font-semibold">Click to upload or drag and drop</p>
                      <p className="text-xs mt-1">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Clothing Type</label>
                <select name="clothingType" value={currentProduct.clothingType} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white">
                  <option value="T-Shirt">T-Shirt</option>
                  <option value="Trouser">Trouser</option>
                  <option value="Jacket">Jacket</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessory">Accessory</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Style</label>
                <select name="style" value={currentProduct.style} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white">
                  <option value="Casual">Casual</option>
                  <option value="Formal">Formal</option>
                  <option value="Sport">Sport</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Color</label>
                <input type="text" name="color" value={currentProduct.color} onChange={handleInputChange} placeholder="e.g. Black" className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Description</label>
                <textarea name="description" rows="3" value={currentProduct.description} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"></textarea>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button type="submit" className="bg-black text-white px-6 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors">
                Save Product
              </button>
              <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-500 text-xs uppercase tracking-wider">
                <tr>
                  <th className="p-4 font-semibold">Product</th>
                  <th className="p-4 font-semibold">Category</th>
                  <th className="p-4 font-semibold">Price</th>
                  <th className="p-4 font-semibold">Stock</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {p.imageUrl ? (
                            <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100" />
                        ) : (
                            <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center font-bold text-gray-500">P</div>
                        )}
                        <div>
                            <span className="font-semibold text-gray-800 block">{p.name}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">
                        {p.Category ? (
                            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs font-semibold">{p.Category.name}</span>
                        ) : (
                            <span className="text-gray-400">None</span>
                        )}
                    </td>
                    <td className="p-4 font-medium text-gray-900">${p.price}</td>
                    <td className="p-4">
                        <div className="flex flex-col gap-1">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${p.stockS > 10 ? 'bg-green-100 text-green-700' : p.stockS > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>S: {p.stockS}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${p.stockM > 10 ? 'bg-green-100 text-green-700' : p.stockM > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>M: {p.stockM}</span>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${p.stockL > 10 ? 'bg-green-100 text-green-700' : p.stockL > 0 ? 'bg-orange-100 text-orange-700' : 'bg-red-100 text-red-700'}`}>L: {p.stockL}</span>
                        </div>
                    </td>
                    <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                            Edit
                        </button>
                        <button onClick={() => handleDeleteClick(p)} className="text-rose-500 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors">
                            Delete
                        </button>
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-500">No products found. Click "Add Product" to create one.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Delete Product</h3>
              <p className="text-gray-500">
                Are you sure you want to delete <span className="font-semibold text-gray-800">"{productToDelete.name}"</span>? This action cannot be undone.
              </p>
            </div>
            <div className="bg-gray-50 p-4 border-t border-gray-100 flex justify-end gap-3">
              <button 
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2 font-semibold text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 font-semibold bg-rose-500 text-white hover:bg-rose-600 rounded-lg transition-colors shadow-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
