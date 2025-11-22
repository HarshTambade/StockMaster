import { useState, useEffect } from 'react';
import { History, Filter } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

interface MoveHistoryProps {
  token: string;
}

interface Move {
  id: number;
  product_name: string;
  sku: string;
  type: string;
  from_location: string | null;
  to_location: string | null;
  quantity: number;
  reference: string;
  created_at: string;
}

export default function MoveHistory({ token }: MoveHistoryProps) {
  const [moves, setMoves] = useState<Move[]>([]);
  const [filteredMoves, setFilteredMoves] = useState<Move[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMoveHistory();
  }, []);

  useEffect(() => {
    if (filterType === 'all') {
      setFilteredMoves(moves);
    } else {
      setFilteredMoves(moves.filter(move => move.type === filterType));
    }
  }, [filterType, moves]);

  const fetchMoveHistory = async () => {
    try {
      const response = await fetch(`${API_URL}/move-history`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setMoves(data);
        setFilteredMoves(data);
      }
    } catch (error) {
      console.error('Error fetching move history:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      receipt: 'bg-green-100 text-green-800',
      delivery: 'bg-red-100 text-red-800',
      transfer: 'bg-blue-100 text-blue-800',
      adjustment: 'bg-yellow-100 text-yellow-800',
      initial: 'bg-purple-100 text-purple-800'
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Move History</h1>
        <p className="text-gray-600 mt-1">Complete ledger of all stock movements</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-6 p-6">
        <div className="flex items-center gap-4">
          <Filter size={20} className="text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Filter by Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
          >
            <option value="all">All Types</option>
            <option value="receipt">Receipts</option>
            <option value="delivery">Deliveries</option>
            <option value="transfer">Transfers</option>
            <option value="adjustment">Adjustments</option>
            <option value="initial">Initial Stock</option>
          </select>
          <span className="text-sm text-gray-600 ml-auto">
            Showing {filteredMoves.length} of {moves.length} movements
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date & Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Product
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  From
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  To
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMoves.map((move) => (
                <tr key={move.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {new Date(move.created_at).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <History className="text-purple-600 mr-2" size={16} />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{move.product_name}</div>
                        <div className="text-xs text-gray-500">{move.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor(move.type)}`}>
                      {move.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {move.from_location || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {move.to_location || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {move.quantity > 0 ? '+' : ''}{move.quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    {move.reference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredMoves.length === 0 && (
          <div className="text-center py-12">
            <History className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No movement history found</p>
          </div>
        )}
      </div>
    </div>
  );
}