import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  TruckIcon, 
  Send, 
  ArrowRightLeft, 
  ClipboardList, 
  History, 
  Settings, 
  User, 
  LogOut 
} from 'lucide-react';
import { User as UserType } from '../App';

interface SidebarProps {
  user: UserType;
  onLogout: () => void;
}

export function Sidebar({ user, onLogout }: SidebarProps) {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/receipts', icon: TruckIcon, label: 'Receipts' },
    { path: '/deliveries', icon: Send, label: 'Deliveries' },
    { path: '/transfers', icon: ArrowRightLeft, label: 'Internal Transfers' },
    { path: '/adjustments', icon: ClipboardList, label: 'Adjustments' },
    { path: '/move-history', icon: History, label: 'Move History' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-purple-600">StockMaster</h1>
        <p className="text-sm text-gray-500 mt-1">Inventory Management</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-purple-50 text-purple-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 px-4 py-3 mb-2">
          <User size={20} className="text-gray-600" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}