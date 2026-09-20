import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useModal } from '../../context/ModalContext';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showAlert, showConfirm } = useModal();
  
  const [currentCategory, setCurrentCategory] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to load categories', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentCategory({ ...currentCategory, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (currentCategory.id) {
        // Update
        await api.put(`/categories/${currentCategory.id}`, currentCategory);
      } else {
        // Create
        await api.post('/categories', currentCategory);
      }
      setIsModalOpen(false);
      fetchCategories();
      showAlert('Success', `Category ${currentCategory.id ? 'updated' : 'added'} successfully!`, 'success');
    } catch (err) {
      console.error('Failed to save category', err);
      showAlert('Error', err.response?.data?.message || 'Failed to save category', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (category) => {
    setCurrentCategory({
      id: category.id,
      name: category.name,
      description: category.description || ''
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentCategory({
      name: '',
      description: ''
    });
    setIsModalOpen(true);
  };

  const confirmDelete = (category) => {
    showConfirm('Delete Category', `Are you sure you want to delete "${category.name}"? This action cannot be undone.`, async () => {
      try {
        await api.delete(`/categories/${category.id}`);
        fetchCategories();
        showAlert('Success', 'Category deleted successfully', 'success');
      } catch (err) {
        console.error('Failed to delete category', err);
        showAlert('Error', 'Failed to delete category. Make sure no products are using it.', 'error');
      }
    }, 'Delete Category');
  };

  if (loading) return <div className="animate-pulse p-8">Loading categories...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Category Management</h2>
        {!isModalOpen && (
          <button 
            onClick={handleAddNew}
            className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add Category
          </button>
        )}
      </div>

      {isModalOpen ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 max-w-2xl">
          <h3 className="text-lg font-bold mb-4">{currentCategory.id ? 'Edit Category' : 'Add New Category'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input required type="text" name="name" value={currentCategory.name} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white" />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Description</label>
              <textarea name="description" rows="3" value={currentCategory.description} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white"></textarea>
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                type="submit" 
                disabled={isSaving}
                className={`px-6 py-2 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 ${isSaving ? 'bg-zinc-400 text-zinc-100 cursor-not-allowed' : 'bg-black text-white hover:bg-gray-800'}`}
              >
                {isSaving ? 'Saving...' : 'Save Category'}
              </button>
              <button type="button" disabled={isSaving} onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg font-semibold text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
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
                  <th className="p-4 font-semibold">Category Name</th>
                  <th className="p-4 font-semibold">Description</th>
                  <th className="p-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {categories.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 font-semibold text-gray-800">{c.name}</td>
                    <td className="p-4 text-gray-600">{c.description || <span className="text-gray-400 italic">No description</span>}</td>
                    <td className="p-4 text-right space-x-2">
                        <button onClick={() => handleEdit(c)} className="text-blue-600 hover:text-blue-800 font-medium px-2 py-1 rounded hover:bg-blue-50 transition-colors">
                            Edit
                        </button>
                        <button onClick={() => confirmDelete(c)} className="text-red-600 hover:text-red-800 font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors">
                            Delete
                        </button>
                    </td>
                  </tr>
                ))}
                {categories.length === 0 && (
                  <tr>
                    <td colSpan="3" className="p-8 text-center text-gray-500">No categories found. Click "Add Category" to create one.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
