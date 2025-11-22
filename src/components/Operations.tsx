import { useState, useEffect } from 'react';
import { Plus, CheckCircle } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

interface OperationsProps {
  token: string;
  type: 'receipts' | 'deliveries' | 'transfers' | 'adjustments';
}

interface Product {
  id: number;
  name: string;
  sku: string;
}

interface Location {
  id: number;
  name: string;
  warehouse_name: string;
}

interface OperationLine {
  product_id: string;
  quantity: string;
  location_id: string;
}

interface FormData {
  supplier_name: string;
  customer_name: string;
  from_location_id: string;
  to_location_id: string;
  product_id: string;
  location_id: string;
  new_quantity: string;
  reason: string;
  lines: OperationLine[];
}

interface Operation {
  id: number;
  supplier_name?: string;
  customer_name?: string;
  from_location_name?: string;
  to_location_name?: string;
  status?: string;
  created_at: string;
}

export default function Operations({ token, type }: OperationsProps) {
  const [operations, setOperations] = useState<Operation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    supplier_name: '',
    customer_name: '',
    from_location_id: '',
    to_location_id: '',
    product_id: '',
    location_id: '',
    new_quantity: '',
    reason: '',
    lines: [{ product_id: '', quantity: '', location_id: '' }]
  });

  useEffect(() => {
    fetchOperations();
    fetchProducts();
    fetchLocations();
  }, [type]);

  const fetchOperations = async () => {
    try {
      const response = await fetch(`${API_URL}/${type}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setOperations(data);
      }
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await fetch(`${API_URL}/products`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch(`${API_URL}/locations`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLocations(data);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let body: Record<string, unknown> = {};

      if (type === 'adjustments') {
        body = {
          product_id: parseInt(formData.product_id),
          location_id: parseInt(formData.location_id),
          new_quantity: parseInt(formData.new_quantity),
          reason: formData.reason
        };
      } else if (type === 'receipts') {
        body = {
          supplier_name: formData.supplier_name,
          lines: formData.lines.map((line: OperationLine) => ({
            product_id: parseInt(line.product_id),
            quantity: parseInt(line.quantity),
            location_id: parseInt(line.location_id)
          }))
        };
      } else if (type === 'deliveries') {
        body = {
          customer_name: formData.customer_name,
          lines: formData.lines.map((line: OperationLine) => ({
            product_id: parseInt(line.product_id),
            quantity: parseInt(line.quantity),
            location_id: parseInt(line.location_id)
          }))
        };
      } else if (type === 'transfers') {
        body = {
          from_location_id: parseInt(formData.from_location_id),
          to_location_id: parseInt(formData.to_location_id),
          lines: formData.lines.map((line: OperationLine) => ({
            product_id: parseInt(line.product_id),
            quantity: parseInt(line.quantity)
          }))
        };
      }

      const response = await fetch(`${API_URL}/${type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      if (response.ok) {
        setShowForm(false);
        resetForm();
        fetchOperations();
      } else {
        const error = await response.json();
        alert(error.error || `Failed to create ${type}`);
      }
    } catch (error) {
      console.error(`Error creating ${type}:`, error);
      alert(`Failed to create ${type}`);
    }
  };

  const handleValidate = async (id: number) => {
    if (!confirm(`Are you sure you want to validate this ${type.slice(0, -1)}?`)) return;

    try {
      const response = await fetch(`${API_URL}/${type}/${id}/validate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchOperations();
        alert('Validated successfully!');
      } else {
        const error = await response.json();
        alert(error.error || 'Validation failed');
      }
    } catch (error) {
      console.error('Error validating:', error);
      alert('Validation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      supplier_name: '',
      customer_name: '',
      from_location_id: '',
      to_location_id: '',
      product_id: '',
      location_id: '',
      new_quantity: '',
      reason: '',
      lines: [{ product_id: '', quantity: '', location_id: '' }]
    });
  };

  const addLine = () => {
    setFormData({
      ...formData,
      lines: [...formData.lines, { product_id: '', quantity: '', location_id: '' }]
    });
  };

  const updateLine = (index: number, field: string, value: string) => {
    const newLines = [...formData.lines];
    newLines[index] = { ...newLines[index], [field]: value };
    setFormData({ ...formData, lines: newLines });
  };

  const removeLine = (index: number) => {
    const newLines = formData.lines.filter((_: OperationLine, i: number) => i !== index);
    setFormData({ ...formData, lines: newLines });
  };

  const getTitle = () => {
    const titles = {
      receipts: 'Receipts',
      deliveries: 'Deliveries',
      transfers: 'Internal Transfers',
      adjustments: 'Inventory Adjustments'
    };
    return titles[type];
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{getTitle()}</h1>
          <p className="text-gray-600 mt-1">Manage {type}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
        >
          <Plus size={20} />
          New {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            New {type.slice(0, -1).charAt(0).toUpperCase() + type.slice(1, -1)}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {type === 'receipts' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier Name *
                </label>
                <input
                  type="text"
                  value={formData.supplier_name}
                  onChange={(e) => setFormData({ ...formData, supplier_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            )}

            {type === 'deliveries' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Customer Name *
                </label>
                <input
                  type="text"
                  value={formData.customer_name}
                  onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  required
                />
              </div>
            )}

            {type === 'transfers' && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From Location *
                  </label>
                  <select
                    value={formData.from_location_id}
                    onChange={(e) => setFormData({ ...formData, from_location_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.warehouse_name} - {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To Location *
                  </label>
                  <select
                    value={formData.to_location_id}
                    onChange={(e) => setFormData({ ...formData, to_location_id: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  >
                    <option value="">Select Location</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>
                        {loc.warehouse_name} - {loc.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {type === 'adjustments' ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product *
                    </label>
                    <select
                      value={formData.product_id}
                      onChange={(e) => setFormData({ ...formData, product_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select Product</option>
                      {products.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name} ({prod.sku})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location *
                    </label>
                    <select
                      value={formData.location_id}
                      onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                      required
                    >
                      <option value="">Select Location</option>
                      {locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.warehouse_name} - {loc.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Quantity *
                  </label>
                  <input
                    type="number"
                    value={formData.new_quantity}
                    onChange={(e) => setFormData({ ...formData, new_quantity: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reason
                  </label>
                  <textarea
                    value={formData.reason}
                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    rows={3}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Products *
                  </label>
                  {formData.lines.map((line: OperationLine, index: number) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-5">
                        <select
                          value={line.product_id}
                          onChange={(e) => updateLine(index, 'product_id', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          required
                        >
                          <option value="">Select Product</option>
                          {products.map((prod) => (
                            <option key={prod.id} value={prod.id}>
                              {prod.name} ({prod.sku})
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={line.quantity}
                          onChange={(e) => updateLine(index, 'quantity', e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                          required
                        />
                      </div>
                      {type !== 'transfers' && (
                        <div className="col-span-4">
                          <select
                            value={line.location_id}
                            onChange={(e) => updateLine(index, 'location_id', e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                            required
                          >
                            <option value="">Select Location</option>
                            {locations.map((loc) => (
                              <option key={loc.id} value={loc.id}>
                                {loc.warehouse_name} - {loc.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                      <div className={type === 'transfers' ? 'col-span-5' : 'col-span-1'}>
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => removeLine(index)}
                            className="w-full px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
                          >
                            ×
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addLine}
                    className="text-purple-600 hover:text-purple-700 text-sm font-medium"
                  >
                    + Add Line
                  </button>
                </div>
              </>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
              >
                Create
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  {type === 'receipts' ? 'Supplier' : type === 'deliveries' ? 'Customer' : 'Details'}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {operations.map((op) => (
                <tr key={op.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{op.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {op.supplier_name || op.customer_name || `${op.from_location_name} → ${op.to_location_name}` || 'Adjustment'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        op.status === 'done'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {op.status || 'completed'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(op.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {op.status !== 'done' && op.status !== undefined && (
                      <button
                        onClick={() => handleValidate(op.id)}
                        className="flex items-center gap-1 text-green-600 hover:text-green-700"
                      >
                        <CheckCircle size={16} />
                        Validate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}