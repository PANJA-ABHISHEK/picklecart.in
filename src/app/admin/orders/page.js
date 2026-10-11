"use client";

import { useState, useEffect } from "react";
import { getAdminOrders, pushOrderToLogistics } from "@/app/actions/orders";
import { Package, Truck, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    const result = await getAdminOrders();
    if (result.success) {
      setOrders(result.orders);
    }
    setLoading(false);
  };

  const handlePushToShiprocket = async (orderId) => {
    if (!confirm("Are you sure you want to push this order to Shiprocket?")) return;
    
    setProcessingId(orderId);
    const result = await pushOrderToLogistics(orderId);
    
    if (result.success) {
      alert("Successfully pushed to Shiprocket!");
      fetchOrders(); // refresh list
    } else {
      alert(`Failed: ${result.error}`);
    }
    setProcessingId(null);
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><CheckCircle size={14}/> Paid (Needs Shipping)</span>;
      case 'pending_payment':
        return <span className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Clock size={14}/> Pending Payment</span>;
      case 'processing':
        return <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit"><Truck size={14}/> Processing (Shiprocket)</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold w-fit capitalize">{status}</span>;
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-charcoal">Orders Management</h1>
        <p className="text-charcoal/60 mt-1">View incoming orders and push them to Shiprocket</p>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 flex flex-col items-center">
            <Package size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-medium text-charcoal">No orders yet</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row gap-6 justify-between">
                
                {/* Order Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-charcoal">Order #{order.id}</h3>
                      <p className="text-sm text-gray-500">{formatDate(order.createdAt)}</p>
                    </div>
                    {getStatusBadge(order.status)}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Customer Details</p>
                      <p className="font-medium text-charcoal">{order.customer.fullName}</p>
                      <p className="text-sm text-gray-600">{order.customer.email}</p>
                      <p className="text-sm text-gray-600">{order.customer.mobile}</p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Shipping Address</p>
                      <p className="text-sm text-gray-600">
                        {order.customer.address}, {order.customer.landmark ? `${order.customer.landmark}, ` : ""}
                        <br/>
                        {order.customer.city}, {order.customer.state} - {order.customer.pincode}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Items</p>
                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm items-center">
                          <span className="text-charcoal flex-1">{item.name} ({item.variantLabel}) <span className="text-gray-400">× {item.quantity}</span></span>
                          <span className="font-medium">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold text-charcoal">
                      <span>Total Paid</span>
                      <span>{formatPrice(order.total)}</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="shrink-0 flex flex-col items-start md:items-end gap-3 md:w-64 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                  {order.razorpayPaymentId && (
                    <div className="w-full bg-green-50 p-3 rounded-lg border border-green-100 text-sm">
                      <p className="text-xs text-green-600 font-bold uppercase mb-1">Payment ID</p>
                      <p className="font-mono text-charcoal truncate">{order.razorpayPaymentId}</p>
                    </div>
                  )}

                  {order.shiprocketOrderId ? (
                    <div className="w-full bg-blue-50 p-3 rounded-lg border border-blue-100 text-sm mt-auto">
                      <p className="text-xs text-blue-600 font-bold uppercase mb-1">Shiprocket Sync</p>
                      <p className="font-medium text-charcoal">Order ID: {order.shiprocketOrderId}</p>
                      <p className="font-medium text-charcoal">Shipment: {order.shiprocketShipmentId}</p>
                    </div>
                  ) : order.status === "paid" ? (
                    <button
                      onClick={() => handlePushToShiprocket(order.id)}
                      disabled={processingId === order.id}
                      className="mt-auto w-full bg-charcoal text-white py-3 px-4 rounded-xl font-bold hover:bg-charcoal/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {processingId === order.id ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                      ) : (
                        <><Truck size={18}/> Push to Shiprocket</>
                      )}
                    </button>
                  ) : (
                    <div className="mt-auto w-full bg-gray-50 p-3 rounded-lg border border-gray-200 text-sm flex items-start gap-2 text-gray-500">
                      <AlertTriangle size={16} className="shrink-0 mt-0.5"/>
                      <p>Order must be paid before pushing to logistics.</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
