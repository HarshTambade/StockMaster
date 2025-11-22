import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Products from './components/Products';
import Operations from './components/Operations';
import MoveHistory from './components/MoveHistory';
import Settings from './components/Settings';
import { Sidebar } from './components/Sidebar';

const API_URL = 'http://localhost:3001/api';

export interface User {
  id: number;
  email: string;
  name: string;
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`${API_URL}/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        handleLogout();
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (newToken: string, userData: User) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!token || !user) {
    return <Auth onLogin={handleLogin} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-gray-50">
        <Sidebar user={user} onLogout={handleLogout} />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard token={token} />} />
            <Route path="/products" element={<Products token={token} />} />
            <Route path="/receipts" element={<Operations type="receipts" token={token} />} />
            <Route path="/deliveries" element={<Operations type="deliveries" token={token} />} />
            <Route path="/transfers" element={<Operations type="transfers" token={token} />} />
            <Route path="/adjustments" element={<Operations type="adjustments" token={token} />} />
            <Route path="/move-history" element={<MoveHistory token={token} />} />
            <Route path="/settings" element={<Settings token={token} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;