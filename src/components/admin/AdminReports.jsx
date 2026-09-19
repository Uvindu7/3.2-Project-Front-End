import React, { useState, useEffect } from 'react';
import api from '../../lib/api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';

const AdminReports = () => {
  const [salesMetrics, setSalesMetrics] = useState(null);
  const [inventoryMetrics, setInventoryMetrics] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const [salesRes, inventoryRes, topRes] = await Promise.all([
          api.get('/reports/sales'),
          api.get('/reports/inventory'),
          api.get('/reports/top-products')
        ]);
        
        setSalesMetrics(salesRes.data);
        setInventoryMetrics(inventoryRes.data);
        setTopProducts(topRes.data);
      } catch (error) {
        console.error('Error fetching reports:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleDownloadPDF = async (type) => {
    try {
      // Create a temporary anchor element to trigger download
      const response = await api.get(`/reports/export/pdf?type=${type}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Failed to generate PDF. Please try again later.');
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-zinc-500">Loading reports...</div>;
  }

  // Format chart data (convert dates if necessary)
  const chartData = salesMetrics?.salesByDate?.map(item => ({
    date: new Date(item.date).toLocaleDateString(),
    revenue: parseFloat(item.revenue) || 0
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-zinc-900 tracking-tight font-outfit uppercase">Reports & Analytics</h1>
        <div className="flex gap-2">
          <button 
            onClick={() => handleDownloadPDF('sales')}
            className="bg-zinc-900 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-zinc-800 transition"
          >
            Export Sales PDF
          </button>
          <button 
            onClick={() => handleDownloadPDF('inventory')}
            className="bg-white border border-zinc-200 text-zinc-700 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-zinc-50 transition"
          >
            Export Inventory PDF
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-zinc-900">Rs. {salesMetrics?.totalRevenue?.toLocaleString() || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6">
          <h3 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-zinc-900">{salesMetrics?.totalOrders || 0}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6">
          <h3 className="text-sm font-semibold text-rose-500 uppercase tracking-wider mb-2">Inventory Alerts</h3>
          <p className="text-3xl font-bold text-zinc-900">
            {inventoryMetrics?.outOfStockCount || 0} <span className="text-sm font-normal text-zinc-500">Out of Stock</span>
          </p>
        </div>
      </div>

      {/* Charts Area */}
      <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6">
        <h3 className="text-lg font-bold text-zinc-900 mb-6">Sales Trend (Last 30 Days)</h3>
        <div className="h-80 w-full">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e4e4e7" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#71717a'}} tickMargin={10} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#71717a'}} axisLine={false} tickLine={false} tickFormatter={(value) => `Rs.${value}`} />
                <Tooltip cursor={{fill: '#f4f4f5'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}} />
                <Bar dataKey="revenue" fill="#18181b" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-400">No sales data available for this period.</div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Inventory Status Table */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-100 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-zinc-900">Inventory Status</h3>
            <span className="text-xs font-semibold bg-rose-50 text-rose-600 px-2.5 py-1 rounded-full">
              {inventoryMetrics?.lowStockCount} Low Stock
            </span>
          </div>
          <div className="overflow-y-auto max-h-96">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 text-zinc-500 sticky top-0">
                <tr>
                  <th className="px-6 py-3 font-semibold">Product</th>
                  <th className="px-6 py-3 font-semibold text-right">Stock</th>
                  <th className="px-6 py-3 font-semibold text-right">Total Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {inventoryMetrics?.inventory?.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-zinc-900">{item.name}</td>
                    <td className="px-6 py-4 text-right text-zinc-600">{item.totalStock}</td>
                    <td className="px-6 py-4 text-right">
                      {item.totalStock === 0 ? (
                        <span className="bg-red-50 text-red-700 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide">
                          Out of Stock
                        </span>
                      ) : item.totalStock < 10 ? (
                        <span className="bg-orange-50 text-orange-700 px-2.5 py-1 rounded-md text-xs font-bold tracking-wide">
                          Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          In Stock
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-xl shadow-sm border border-zinc-100 p-6">
          <h3 className="text-lg font-bold text-zinc-900 mb-6">Top Performing Products</h3>
          <div className="space-y-4">
            {topProducts.length > 0 ? topProducts.map((prod, idx) => (
              <div key={prod.id} className="flex items-center justify-between p-4 rounded-lg border border-zinc-100 hover:border-zinc-200 transition">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-500 text-sm">
                    #{idx + 1}
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900 text-sm">{prod.name}</h4>
                    <p className="text-xs text-zinc-500">{prod.totalSold} units sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="block font-bold text-zinc-900 text-sm">Rs. {prod.revenue.toLocaleString()}</span>
                </div>
              </div>
            )) : (
              <div className="text-center text-zinc-400 py-8">No order data available to determine top products.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;
