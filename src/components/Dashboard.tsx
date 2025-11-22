import { useState, useEffect } from 'react';
import { Package, AlertTriangle, TruckIcon, Send, ArrowRightLeft } from 'lucide-react';

const API_URL = 'http://localhost:3001/api';

interface DashboardProps {
  token: string;
}

interface KPIs {
  totalProducts: number;
  totalStock: number;
  lowStock: number;
  pendingReceipts: number;
  pendingDeliveries: number;
  pendingTransfers: number;
}

export default function Dashboard({ token }: DashboardProps) {
  const [kpis, setKpis] = useState<KPIs>({
    totalProducts: 0,
    totalStock: 0,
    lowStock: 0,
    pendingReceipts: 0,
    pendingDeliveries: 0,
    pendingTransfers: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchKPIs();
  }, []);

  const fetchKPIs = async () => {
    try {
      const response = await fetch(`${API_URL}/dashboard/kpis`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setKpis(data);
      }
    } catch (error) {
      console.error('Error fetching KPIs:', error);
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    {
      title: 'Total Products',
      value: kpis.totalProducts,
      icon: Package,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Total Stock',
      value: kpis.totalStock,
      icon: Package,
      color: 'bg-green-500',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Low Stock Items',
      value: kpis.lowStock,
      icon: AlertTriangle,
      color: 'bg-red-500',
      bgColor: 'bg-red-50'
    },
    {
      title: 'Pending Receipts',
      value: kpis.pendingReceipts,
      icon: TruckIcon,
      color: 'bg-purple-500',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Pending Deliveries',
      value: kpis.pendingDeliveries,
      icon: Send,
      color: 'bg-orange-500',
      bgColor: 'bg-orange-50'
    },
    {
      title: 'Pending Transfers',
      value: kpis.pendingTransfers,
      icon: ArrowRightLeft,
      color: 'bg-indigo-500',
      bgColor: 'bg-indigo-50'
    }
  ];

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your inventory operations</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{card.value}</p>
                </div>
                <div className={`${card.bgColor} p-3 rounded-lg`}>
                  <Icon className={`${card.color.replace('bg-', 'text-')} w-6 h-6`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <a
            href="/products"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
          >
            <Package className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="font-medium text-gray-900">Manage Products</p>
          </a>
          <a
            href="/receipts"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
          >
            <TruckIcon className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="font-medium text-gray-900">New Receipt</p>
          </a>
          <a
            href="/deliveries"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
          >
            <Send className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="font-medium text-gray-900">New Delivery</p>
          </a>
          <a
            href="/transfers"
            className="p-4 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all text-center"
          >
            <ArrowRightLeft className="w-8 h-8 mx-auto mb-2 text-purple-600" />
            <p className="font-medium text-gray-900">Transfer Stock</p>
          </a>
        </div>
      </div>
    </div>
  );
}