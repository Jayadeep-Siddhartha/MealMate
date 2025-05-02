// src/components/Sidebar.tsx
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  Utensils, 
  ListOrdered, 
  Star, 
  Coffee,
  Settings,
  LogOut
} from 'lucide-react';

const Sidebar = () => {
  const pathname = usePathname();
  
  const navItems = [
    { 
      href: '/dashboard/cafeteria', 
      label: 'Cafe Details', 
      icon: <Home size={18} className="mr-3" />,
      match: 'cafeteria'
    },
    { 
      href: '/dashboard/foods', 
      label: 'Menu Management', 
      icon: <Utensils size={18} className="mr-3" />,
      match: 'foods'
    },
    { 
      href: '/dashboard/orders', 
      label: 'Orders', 
      icon: <ListOrdered size={18} className="mr-3" />,
      match: 'orders'
    },
    { 
      href: '/dashboard/reviews', 
      label: 'Reviews', 
      icon: <Star size={18} className="mr-3" />,
      match: 'reviews'
    }
  ];

  return (
    <div className="w-64 bg-amber-800 text-amber-50 flex flex-col min-h-[calc(100vh-64px)] border-r border-amber-700">
      {/* Header */}
      <div className="p-4 border-b border-amber-700">
        <div className="flex items-center space-x-3">
          <Coffee size={24} className="text-amber-200" />
          <h2 className="text-xl font-bold">Cafe Dashboard</h2>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
              pathname.includes(item.match) 
                ? 'bg-amber-600 text-white shadow-inner' 
                : 'text-amber-100 hover:bg-amber-700 hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-amber-700 space-y-2">
        <Link
          href="/settings"
          className={`flex items-center px-4 py-2 rounded-lg text-amber-100 hover:bg-amber-700 ${
            pathname.includes('settings') ? 'bg-amber-600' : ''
          }`}
        >
          <Settings size={18} className="mr-3" />
          Settings
        </Link>
        <button className="flex items-center w-full px-4 py-2 rounded-lg text-amber-100 hover:bg-amber-700">
          <LogOut size={18} className="mr-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;