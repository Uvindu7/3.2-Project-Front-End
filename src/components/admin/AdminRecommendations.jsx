import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { useModal } from '../../context/ModalContext';

const AdminRecommendations = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { showAlert, showConfirm } = useModal();
  
  const [currentItem, setCurrentItem] = useState({
    name: '',
    imageUrl: '',
    imageFile: null,
    clothingType: 'Trouser',
    style: 'Casual',
    color: ''
  });

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await api.get('/recommendations');
      setItems(res.data);
    } catch (err) {
      console.error('Failed to load recommendations', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const formData = new FormData();
      Object.keys(currentItem).forEach(key => {
        if (key === 'imageFile') {
          if (currentItem.imageFile) {
            formData.append('image', currentItem.imageFile);
          }
        } else if (currentItem[key] !== null && currentItem[key] !== undefined) {
          formData.append(key, currentItem[key]);
        }
      });

      const config = {
        headers: { 'Content-Type': 'multipart/form-data' }
      };

      if (currentItem.id) {
        await api.put(`/recommendations/${currentItem.id}`, formData, config);
      } else {
        if (!currentItem.imageFile && !currentItem.imageUrl) {
          showAlert('Error', 'An image is required for recommendation items', 'error');
          setIsSaving(false);
          return;
        }
        await api.post('/recommendations', formData, config);
      }
      setIsModalOpen(false);
      fetchItems();
      showAlert('Success', `Item ${currentItem.id ? 'updated' : 'added'} successfully!`, 'success');
    } catch (err) {
      console.error('Failed to save item', err);
      showAlert('Error', err.response?.data?.message || 'Failed to save item', 'error');
    } finally {
      setIsSaving(false);
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setCurrentItem({
          ...currentItem,
          imageFile: file,
          imageUrl: URL.createObjectURL(file)
        });
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCurrentItem({
        ...currentItem,
        imageFile: file,
        imageUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleEdit = (item) => {
    setCurrentItem({
      id: item.id,
      name: item.name,
      clothingType: item.clothingType,
      style: item.style,
      color: item.color || '',
      imageUrl: item.imageUrl,
      imageFile: null
    });
    setIsModalOpen(true);
  };

  const handleAddNew = () => {
    setCurrentItem({
      name: '',
      imageUrl: '',
      imageFile: null,
      clothingType: 'Trouser',
      style: 'Casual',
      color: ''
    });
    setIsModalOpen(true);
  };

  const confirmDelete = (item) => {
    showConfirm('Delete Item', `Are you sure you want to delete "${item.name}"?`, async () => {
      try {
        await api.delete(`/recommendations/${item.id}`);
        fetchItems();
        showAlert('Success', 'Item deleted successfully', 'success');
      } catch (err) {
        console.error('Failed to delete item', err);
        showAlert('Error', 'Failed to delete item', 'error');
      }
    }, 'Delete Item');
  };

  if (loading) return <div className="animate-pulse p-8">Loading recommendations...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-xl font-bold text-gray-800">Recommendation Items</h2>
            <p className="text-sm text-gray-500">Upload styling inspiration pieces (not purchasable products)</p>
        </div>
        {!isModalOpen && (
          <button 
            onClick={handleAddNew}
            className="bg-black text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-800 transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            Add Inspiration Item
          </button>
        )}
      </div>

      {isModalOpen ? (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold mb-4">{currentItem.id ? 'Edit Item' : 'Add New Item'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input required type="text" name="name" value={currentItem.name} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Color (Optional)</label>
                <input type="text" name="color" value={currentItem.color} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white" />
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Clothing Type</label>
                <select name="clothingType" value={currentItem.clothingType} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white">
                  <option value="Trouser">Trouser</option>
                  <option value="Jacket">Jacket</option>
                  <option value="Shoes">Shoes</option>
                  <option value="Accessory">Accessory</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold mb-1">Style</label>
                <select name="style" value={currentItem.style} onChange={handleInputChange} className="w-full p-2 border rounded-lg bg-gray-50 focus:bg-white">
                  <option value="Casual">Casual</option>
                  <option value="Formal">Formal</option>
                  <option value="Sport">Sport</option>
                  <option value="Party">Party</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-1">Item Image</label>
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
                  
                  {currentItem.imageUrl ? (
                    <div className="relative w-full flex justify-center">
                      <img 
                        src={currentItem.imageUrl.startsWith('blob:') || currentItem.imageUrl.startsWith('http') ? currentItem.imageUrl : `http://localhost:5000${currentItem.imageUrl}`} 
                        alt="Preview" 
                        className="h-40 object-contain rounded"
                      />
                      <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded cursor-pointer hover:bg-black" onClick={(e) => { e.stopPropagation(); setCurrentItem({...currentItem, imageUrl: '', imageFile: null}); }}>
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
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button 
                type="button" 
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold transition-colors flex items-center gap-2"
                disabled={isSaving}
              >
                {isSaving ? (
                  <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Saving...</>
                ) : 'Save Item'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="p-4 font-semibold text-sm text-gray-500">Image</th>
                  <th className="p-4 font-semibold text-sm text-gray-500">Name</th>
                  <th className="p-4 font-semibold text-sm text-gray-500">Type</th>
                  <th className="p-4 font-semibold text-sm text-gray-500">Style</th>
                  <th className="p-4 font-semibold text-sm text-gray-500">Color</th>
                  <th className="p-4 font-semibold text-sm text-gray-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-8 text-center text-gray-500">
                      No styling inspiration items found. Create one to get started!
                    </td>
                  </tr>
                ) : (
                  items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-4">
                        <div className="w-12 h-12 rounded bg-gray-100 overflow-hidden flex items-center justify-center">
                          {item.imageUrl ? (
                            <img src={item.imageUrl.startsWith('http') ? item.imageUrl : `http://localhost:5000${item.imageUrl}`} alt={item.name} className="w-full h-full object-cover" />
                          ) : (
                            <span className="text-gray-400 text-xs">No img</span>
                          )}
                        </div>
                      </td>
                      <td className="p-4 font-medium">{item.name}</td>
                      <td className="p-4"><span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium">{item.clothingType}</span></td>
                      <td className="p-4">{item.style}</td>
                      <td className="p-4">{item.color || '-'}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                          </button>
                          <button onClick={() => confirmDelete(item)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRecommendations;
