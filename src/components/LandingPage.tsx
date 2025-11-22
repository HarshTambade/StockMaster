import { useState } from 'react';
import { 
  Package, 
  TruckIcon, 
  Send, 
  ArrowRightLeft, 
  BarChart3, 
  Shield, 
  Zap, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Menu,
  X
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export default function LandingPage({ onGetStarted }: LandingPageProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: Package,
      title: 'Product Management',
      description: 'Complete catalog management with SKUs, categories, and real-time stock visibility across all locations.'
    },
    {
      icon: TruckIcon,
      title: 'Smart Receipts',
      description: 'Process incoming stock efficiently with automated inventory updates and supplier tracking.'
    },
    {
      icon: Send,
      title: 'Delivery Management',
      description: 'Streamline outgoing orders with availability checks and automated stock deduction.'
    },
    {
      icon: ArrowRightLeft,
      title: 'Internal Transfers',
      description: 'Move stock between warehouses and locations with complete audit trails.'
    },
    {
      icon: BarChart3,
      title: 'Real-Time Analytics',
      description: 'Monitor KPIs, low stock alerts, and pending operations from a unified dashboard.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'JWT authentication, role-based access, and transaction-safe operations.'
    }
  ];

  const benefits = [
    {
      icon: Zap,
      title: 'Boost Efficiency',
      description: 'Reduce manual work by 80% with automated stock tracking and digital operations.'
    },
    {
      icon: Clock,
      title: 'Real-Time Updates',
      description: 'Get instant visibility of stock levels across all warehouses and locations.'
    },
    {
      icon: CheckCircle,
      title: 'Error-Free Operations',
      description: 'Eliminate manual errors with automated validations and transaction management.'
    }
  ];

  const stats = [
    { value: '100%', label: 'Digital Tracking' },
    { value: '80%', label: 'Time Saved' },
    { value: '99.9%', label: 'Accuracy' },
    { value: '24/7', label: 'Availability' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-purple-600" />
              <span className="ml-2 text-2xl font-bold text-purple-600">StockMaster</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-purple-600 transition-colors">Features</a>
              <a href="#benefits" className="text-gray-700 hover:text-purple-600 transition-colors">Benefits</a>
              <a href="#about" className="text-gray-700 hover:text-purple-600 transition-colors">About</a>
              <button 
                onClick={onGetStarted}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-700"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block text-gray-700 hover:text-purple-600 transition-colors py-2">Features</a>
              <a href="#benefits" className="block text-gray-700 hover:text-purple-600 transition-colors py-2">Benefits</a>
              <a href="#about" className="block text-gray-700 hover:text-purple-600 transition-colors py-2">About</a>
              <button 
                onClick={onGetStarted}
                className="w-full bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-blue-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
              Modern Inventory
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
                Management System
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-10 leading-relaxed">
              Digitize your warehouse operations with real-time tracking, automated workflows, 
              and complete visibility across all locations.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={onGetStarted}
                className="bg-purple-600 text-white px-8 py-4 rounded-xl hover:bg-purple-700 transition-all font-semibold text-lg shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                Start Free Trial
                <ArrowRight className="w-5 h-5" />
              </button>
              <a 
                href="#features"
                className="border-2 border-purple-600 text-purple-600 px-8 py-4 rounded-xl hover:bg-purple-50 transition-all font-semibold text-lg"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-purple-600 mb-2">{stat.value}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Everything you need to manage your inventory efficiently
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index}
                  className="bg-gradient-to-br from-purple-50 to-blue-50 p-8 rounded-2xl hover:shadow-xl transition-all border border-purple-100 hover:border-purple-300"
                >
                  <div className="bg-purple-600 w-14 h-14 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Why Choose StockMaster?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transform your inventory management with proven results
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon;
              return (
                <div 
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="bg-gradient-to-br from-purple-600 to-blue-600 w-16 h-16 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 text-lg leading-relaxed">{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get started in minutes with our simple workflow
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', title: 'Sign Up', desc: 'Create your account in seconds' },
              { step: '02', title: 'Add Products', desc: 'Import or add your inventory' },
              { step: '03', title: 'Setup Locations', desc: 'Configure warehouses & racks' },
              { step: '04', title: 'Start Tracking', desc: 'Begin managing operations' }
            ].map((item, index) => (
              <div key={index} className="text-center">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-3xl font-bold w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  {item.step}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Built for Modern Businesses
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            StockMaster is a comprehensive inventory management system designed to digitize 
            and streamline all stock-related operations. From receiving goods to tracking 
            internal movements, we provide complete visibility and control over your inventory.
          </p>
          <p className="text-lg text-gray-600 leading-relaxed">
            Whether you're managing a single warehouse or multiple locations, our system 
            adapts to your needs with real-time updates, automated workflows, and powerful 
            reporting capabilities.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Inventory?
          </h2>
          <p className="text-xl text-purple-100 mb-10">
            Join businesses that are already managing their inventory smarter
          </p>
          <button 
            onClick={onGetStarted}
            className="bg-white text-purple-600 px-10 py-4 rounded-xl hover:bg-gray-100 transition-all font-bold text-lg shadow-2xl flex items-center gap-3 mx-auto"
          >
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center mb-4">
                <Package className="w-6 h-6 text-purple-500" />
                <span className="ml-2 text-xl font-bold text-white">StockMaster</span>
              </div>
              <p className="text-sm">
                Modern inventory management system for businesses of all sizes.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-purple-500 transition-colors">Features</a></li>
                <li><a href="#benefits" className="hover:text-purple-500 transition-colors">Benefits</a></li>
                <li><a href="#" className="hover:text-purple-500 transition-colors">Pricing</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#about" className="hover:text-purple-500 transition-colors">About</a></li>
                <li><a href="#" className="hover:text-purple-500 transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-purple-500 transition-colors">Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-purple-500 transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-purple-500 transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-purple-500 transition-colors">License</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2025 StockMaster. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
