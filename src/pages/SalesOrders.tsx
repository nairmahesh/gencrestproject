import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, DollarSign, Package, CheckCircle, Clock, AlertTriangle, ArrowLeft } from 'lucide-react';

interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  date: string;
  status: 'Draft' | 'Pending' | 'Approved' | 'Delivered' | 'Cancelled';
  items: OrderItem[];
  totalAmount: number;
  discount: number;
  netAmount: number;
}

const SalesOrders: React.FC = () => {
  const navigate = useNavigate();
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'SO-2024-001',
      customerName: 'Ram Kumar',
      date: '2024-01-20',
      status: 'Pending',
      items: [
        {
          id: '1',
          productName: 'Premium Fertilizer 50kg',
          quantity: 10,
          unitPrice: 1200,
          totalPrice: 12000,
        },
        {
          id: '2',
          productName: 'Organic Seeds 1kg',
          quantity: 5,
          unitPrice: 800,
          totalPrice: 4000,
        },
      ],
      totalAmount: 16000,
      discount: 800,
      netAmount: 15200,
    },
    {
      id: '2',
      orderNumber: 'SO-2024-002',
      customerName: 'Suresh Traders',
      date: '2024-01-19',
      status: 'Approved',
      items: [
        {
          id: '3',
          productName: 'Pesticide Spray 500ml',
          quantity: 20,
          unitPrice: 450,
          totalPrice: 9000,
        },
      ],
      totalAmount: 9000,
      discount: 0,
      netAmount: 9000,
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft':
        return 'text-gray-700 bg-gray-100';
      case 'Pending':
        return 'text-yellow-700 bg-yellow-100';
      case 'Approved':
        return 'text-green-700 bg-green-100';
      case 'Delivered':
        return 'text-blue-700 bg-blue-100';
      case 'Cancelled':
        return 'text-red-700 bg-red-100';
      default:
        return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved':
        return <CheckCircle className="w-4 h-4" />;
      case 'Delivered':
        return <Package className="w-4 h-4" />;
      case 'Pending':
        return <Clock className="w-4 h-4" />;
      case 'Cancelled':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <ShoppingCart className="w-4 h-4" />;
    }
  };

  const totalOrderValue = orders.reduce((sum, order) => sum + order.netAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Sales Orders</h1>
            <p className="text-gray-600 mt-1">Manage customer orders and deliveries</p>
          </div>
        </div>
        <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          Create Order
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{totalOrderValue.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 card-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {orders.filter(order => order.status === 'Pending').length}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl p-6 card-shadow card-hover">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{order.orderNumber}</h3>
                  <p className="text-sm text-gray-600">{order.customerName}</p>
                </div>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center ${getStatusColor(order.status)}`}>
                {getStatusIcon(order.status)}
                <span className="ml-1">{order.status}</span>
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Items ({order.items.length})</p>
              <div className="space-y-1">
                {order.items.slice(0, 2).map((item) => (
                  <div key={item.id} className="flex justify-between text-sm">
                    <span>{item.productName} x {item.quantity}</span>
                    <span>₹{item.totalPrice.toLocaleString()}</span>
                  </div>
                ))}
                {order.items.length > 2 && (
                  <p className="text-sm text-gray-500">+{order.items.length - 2} more items</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 pt-2 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <DollarSign className="w-4 h-4 text-gray-600" />
                <div>
                  <span className="text-lg font-semibold">₹{order.netAmount.toLocaleString()}</span>
                  {order.discount > 0 && (
                    <span className="text-sm text-gray-500 ml-2">
                      (₹{order.discount.toLocaleString()} discount)
                    </span>
                  )}
                </div>
              </div>
              <div className="text-sm text-gray-600">
                {new Date(order.date).toLocaleDateString()}
              </div>
            </div>

            <div className="flex space-x-3">
              <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded-lg hover:bg-purple-200 transition-colors">
                View Details
              </button>
              <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                Download PDF
              </button>
              {order.status === 'Pending' && (
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Approve
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SalesOrders;