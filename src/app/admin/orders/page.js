"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  getAdminOrders, 
  pushOrderToLogistics, 
  deleteOrder 
} from "@/app/actions/orders";
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Search, 
  Download, 
  Trash2, 
  Eye, 
  Copy, 
  Check, 
  RefreshCw, 
  X, 
  Phone, 
  Mail, 
  MapPin, 
  CreditCard, 
  ExternalLink,
  ChevronRight,
  ChevronDown
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Pagination states (Load in batches of 6 for high performance)
  const PAGE_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  // Modal states
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const result = await getAdminOrders();
      if (result.success) {
        setOrders(result.orders);
        // If an order is currently opened in details modal, refresh its data too
        if (selectedOrder) {
          const updated = result.orders.find(o => o.id === selectedOrder.id);
          if (updated) setSelectedOrder(updated);
        }
      } else {
        showToast("error", "Failed to fetch orders from database.");
      }
    } catch (err) {
      console.error("Orders fetch error:", err);
      showToast("error", "Network error fetching orders.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const showToast = (type, text) => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePushToShiprocket = async (orderId) => {
    setProcessingId(orderId);
    try {
      const result = await pushOrderToLogistics(orderId);
      if (result.success) {
        showToast("success", "Order successfully pushed to Shiprocket!");
        await fetchOrders(true);
      } else {
        showToast("error", `Shiprocket push failed: ${result.error}`);
      }
    } catch (err) {
      console.error("Push error:", err);
      showToast("error", "Unexpected error connecting to Shiprocket.");
    } finally {
      setProcessingId(null);
    }
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    setIsDeleting(true);

    try {
      const result = await deleteOrder(orderToDelete.id);
      if (result.success) {
        setOrders(prev => prev.filter(o => o.id !== orderToDelete.id));
        if (selectedOrder?.id === orderToDelete.id) {
          setSelectedOrder(null);
        }
        showToast("success", `Order #${orderToDelete.id} permanently deleted.`);
        setOrderToDelete(null);
      } else {
        showToast("error", `Failed to delete order: ${result.error}`);
      }
    } catch (err) {
      console.error("Delete error:", err);
      showToast("error", "An error occurred while deleting the order.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Export orders to Excel (.xlsx) with auto-adjusted column widths and correct cell formatting
  const handleExportExcel = async () => {
    if (orders.length === 0) {
      alert("No orders available to export.");
      return;
    }

    const exportList = filteredOrders.length > 0 ? filteredOrders : orders;

    try {
      const XLSX = await import("xlsx");

      const headers = [
        "Order ID",
        "Order Date",
        "Status",
        "Customer Name",
        "Customer Mobile",
        "Customer Email",
        "Shipping Address",
        "City",
        "State",
        "Pincode",
        "Items Summary",
        "Total Items Count",
        "Subtotal (₹)",
        "Shipping Charges (₹)",
        "Discount Applied (₹)",
        "Promo Code",
        "Total Paid (₹)",
        "Payment ID",
        "Razorpay Order ID",
        "Shiprocket Order ID",
        "Shiprocket Shipment ID",
        "Pushed to Logistics At"
      ];

      const rows = exportList.map(o => {
        const customer = o.customer || {};
        const itemsStr = (o.items || [])
          .map(i => `${i.name} [${i.variantLabel || 'Standard'}] (x${i.quantity}) @ ₹${i.price}`)
          .join(" | ");
        const totalUnits = (o.items || []).reduce((sum, i) => sum + (Number(i.quantity) || 1), 0);

        return [
          String(o.id || ""),
          o.createdAt ? new Date(o.createdAt).toLocaleString('en-IN') : "",
          String(o.status || "").toUpperCase(),
          String(customer.fullName || ""),
          String(customer.mobile || ""),
          String(customer.email || ""),
          String(`${customer.address || ""}${customer.landmark ? ` (Landmark: ${customer.landmark})` : ""}`),
          String(customer.city || ""),
          String(customer.state || ""),
          String(customer.pincode || ""),
          itemsStr,
          totalUnits,
          Number(o.subtotal ?? o.total ?? 0),
          Number(o.shippingFee ?? o.shipping ?? 0),
          Number(o.discount ?? 0),
          String(o.appliedPromo?.code || ""),
          Number(o.total ?? 0),
          String(o.razorpayPaymentId || ""),
          String(o.razorpayOrderId || ""),
          String(o.shiprocketOrderId || ""),
          String(o.shiprocketShipmentId || ""),
          o.pushedToLogisticsAt ? new Date(o.pushedToLogisticsAt).toLocaleString('en-IN') : ""
        ];
      });

      const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);

      // Indices of columns that must be strictly stored as text to avoid Excel scientific notation (e.g. 9.4E+09, 1.6E+09)
      const textColIndices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 17, 18, 19, 20, 21];
      const numericColIndices = [11, 12, 13, 14, 16];

      rows.forEach((row, rowIdx) => {
        const excelRowIndex = rowIdx + 1; // 0 is header, 1 is first data row
        textColIndices.forEach(colIdx => {
          const cellRef = XLSX.utils.encode_cell({ r: excelRowIndex, c: colIdx });
          if (ws[cellRef]) {
            ws[cellRef].t = "s"; // string type
            ws[cellRef].z = "@"; // text format
          }
        });
        numericColIndices.forEach(colIdx => {
          const cellRef = XLSX.utils.encode_cell({ r: excelRowIndex, c: colIdx });
          if (ws[cellRef]) {
            ws[cellRef].t = "n"; // numeric type
          }
        });
      });

      // Calculate auto-adjusted column widths so no text is truncated or squished
      const colWidths = headers.map((header, colIdx) => {
        let maxLen = header.length;
        rows.forEach(row => {
          const val = row[colIdx];
          const len = val != null ? String(val).length : 0;
          if (len > maxLen) maxLen = len;
        });
        // Extra padding (+4), with min 14 chars and max 65 chars
        return { wch: Math.min(Math.max(maxLen + 4, 14), 65) };
      });
      ws["!cols"] = colWidths;

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Orders");

      const timestamp = new Date().toISOString().split("T")[0];
      XLSX.writeFile(wb, `picklecart_orders_${timestamp}.xlsx`);

      showToast("success", `Exported ${exportList.length} orders to Excel (.xlsx) successfully!`);
    } catch (err) {
      console.error("Excel export error:", err);
      showToast("error", "Failed to generate Excel file.");
    }
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return (
          <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
            <CheckCircle size={13} className="text-emerald-600" />
            Paid (Needs Shipping)
          </span>
        );
      case 'processing':
        return (
          <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200">
            <Truck size={13} className="text-blue-600" />
            Processing (Shiprocket)
          </span>
        );
      case 'pending_payment':
        return (
          <span className="whitespace-nowrap inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
            <Clock size={13} className="text-amber-600" />
            Pending Payment
          </span>
        );
      default:
        return (
          <span className="whitespace-nowrap inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-charcoal border border-gray-200 capitalize">
            {status}
          </span>
        );
    }
  };

  // Filtered orders based on search input and status tabs
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      // 1. Status Filter
      if (statusFilter !== "all" && o.status !== statusFilter) {
        return false;
      }

      // 2. Search query filter
      if (!search.trim()) return true;
      const term = search.toLowerCase().trim();

      const orderIdMatch = (o.id || "").toLowerCase().includes(term);
      const customerNameMatch = (o.customer?.fullName || "").toLowerCase().includes(term);
      const emailMatch = (o.customer?.email || "").toLowerCase().includes(term);
      const mobileMatch = (o.customer?.mobile || "").toLowerCase().includes(term);
      const cityMatch = (o.customer?.city || "").toLowerCase().includes(term);
      const paymentIdMatch = (o.razorpayPaymentId || "").toLowerCase().includes(term);
      const shiprocketIdMatch = String(o.shiprocketOrderId || "").toLowerCase().includes(term);
      const itemMatch = (o.items || []).some(item => (item.name || "").toLowerCase().includes(term));

      return (
        orderIdMatch ||
        customerNameMatch ||
        emailMatch ||
        mobileMatch ||
        cityMatch ||
        paymentIdMatch ||
        shiprocketIdMatch ||
        itemMatch
      );
    });
  }, [orders, search, statusFilter]);

  // Reset pagination back to 6 whenever search or status tab filter changes
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [search, statusFilter]);

  // Sliced orders for fast DOM rendering and scrolling
  const visibleOrders = useMemo(() => {
    return filteredOrders.slice(0, visibleCount);
  }, [filteredOrders, visibleCount]);

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + PAGE_SIZE);
  };

  // Tab counts
  const counts = useMemo(() => {
    return {
      all: orders.length,
      paid: orders.filter(o => o.status === "paid").length,
      processing: orders.filter(o => o.status === "processing").length,
      pending: orders.filter(o => o.status === "pending_payment").length,
    };
  }, [orders]);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`mb-6 p-4 rounded-2xl border font-medium flex items-center justify-between gap-3 animate-in fade-in duration-200 ${
          toastMessage.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
            : 'bg-red-50 text-red-900 border-red-200'
        }`}>
          <span>{toastMessage.text}</span>
          <button onClick={() => setToastMessage(null)} className="p-1 hover:opacity-70">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header section with Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-earthy-brown-dark tracking-tight mb-1">
            Orders Management
          </h1>
          <p className="text-earthy-brown-light font-medium text-sm sm:text-base">
            Track customer orders, manage Shiprocket logistics, and export records
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 flex-wrap sm:mr-8 md:mr-12 lg:mr-16">
          {/* Refresh button */}
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing || loading}
            className="h-10 px-4 bg-white hover:bg-cream border border-border text-charcoal rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-2 transition-all shadow-2xs cursor-pointer disabled:opacity-60"
            title="Refresh Orders"
          >
            <RefreshCw size={15} className={refreshing ? "animate-spin text-earthy-brown" : ""} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Export to Excel button */}
          <button
            onClick={handleExportExcel}
            disabled={orders.length === 0}
            className="h-10 px-5 bg-heritage-green hover:bg-heritage-green-dark !text-white text-white rounded-xl text-xs sm:text-sm font-bold inline-flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-60 active:scale-95"
            style={{ color: "#FFFFFF" }}
          >
            <Download size={16} />
            <span>Export to Excel (.xlsx)</span>
          </button>
        </div>
      </div>

      {/* Search Bar & Filter Tabs */}
      <div className="bg-surface rounded-2xl border border-border-light p-4 mb-6 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted" size={18} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Order ID, customer, mobile, city, or product name..."
              className="w-full pl-10 pr-10 py-2.5 bg-white border border-border-light rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-earthy-brown/20 focus:border-earthy-brown transition-all placeholder:text-charcoal-muted"
            />
            {search && (
              <button 
                onClick={() => setSearch("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal p-1"
              >
                <X size={15} />
              </button>
            )}
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 border-t border-border-light/60">
          <button
            onClick={() => setStatusFilter("all")}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              statusFilter === "all"
                ? "bg-earthy-brown text-white shadow-2xs"
                : "bg-white text-charcoal/70 hover:bg-cream border border-border-light"
            }`}
            style={statusFilter === "all" ? { color: "#FFFFFF" } : {}}
          >
            <span>All Orders</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusFilter === "all" ? "bg-white/20 text-white" : "bg-gray-100 text-charcoal-muted"}`}>
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("paid")}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              statusFilter === "paid"
                ? "bg-emerald-700 text-white shadow-2xs"
                : "bg-white text-charcoal/70 hover:bg-cream border border-border-light"
            }`}
            style={statusFilter === "paid" ? { color: "#FFFFFF" } : {}}
          >
            <span>Ready to Ship</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusFilter === "paid" ? "bg-white/20 text-white" : "bg-emerald-50 text-emerald-800"}`}>
              {counts.paid}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("processing")}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              statusFilter === "processing"
                ? "bg-blue-700 text-white shadow-2xs"
                : "bg-white text-charcoal/70 hover:bg-cream border border-border-light"
            }`}
            style={statusFilter === "processing" ? { color: "#FFFFFF" } : {}}
          >
            <span>In Logistics (Shiprocket)</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusFilter === "processing" ? "bg-white/20 text-white" : "bg-blue-50 text-blue-800"}`}>
              {counts.processing}
            </span>
          </button>

          <button
            onClick={() => setStatusFilter("pending_payment")}
            className={`whitespace-nowrap px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
              statusFilter === "pending_payment"
                ? "bg-amber-700 text-white shadow-2xs"
                : "bg-white text-charcoal/70 hover:bg-cream border border-border-light"
            }`}
            style={statusFilter === "pending_payment" ? { color: "#FFFFFF" } : {}}
          >
            <span>Pending Payment</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] ${statusFilter === "pending_payment" ? "bg-white/20 text-white" : "bg-amber-50 text-amber-800"}`}>
              {counts.pending}
            </span>
          </button>
        </div>
      </div>

      {/* Orders List / Table */}
      {loading ? (
        <div className="bg-surface rounded-2xl border border-border-light p-16 text-center">
          <div className="w-10 h-10 border-4 border-earthy-brown border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-medium text-earthy-brown">Loading orders from database...</p>
        </div>
      ) : filteredOrders.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border-light p-16 text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-cream flex items-center justify-center text-charcoal-muted mb-4 border border-border-light">
            <Package size={28} />
          </div>
          <h3 className="text-lg font-bold text-charcoal">No orders found</h3>
          <p className="text-sm text-charcoal-muted mt-1 max-w-sm">
            {search 
              ? `No orders matching "${search}". Try clearing your search filter.` 
              : "No customer orders have been recorded in this category yet."}
          </p>
          {search && (
            <button
              onClick={() => { setSearch(""); setStatusFilter("all"); }}
              className="mt-4 px-4 py-2 bg-white border border-border text-charcoal rounded-xl text-xs font-semibold hover:bg-cream transition-colors"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-border-light shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-cream/60 border-b border-border-light text-[11px] font-bold uppercase tracking-wider text-charcoal-muted select-none">
                  <th className="py-3.5 px-4 sm:px-6">Order ID &amp; Date</th>
                  <th className="py-3.5 px-4">Customer Details</th>
                  <th className="py-3.5 px-4">Items Summary</th>
                  <th className="py-3.5 px-4 text-right">Total Paid</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4">Logistics / Shiprocket</th>
                  <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-light/60 text-sm">
                {visibleOrders.map((order) => {
                  const customer = order.customer || {};
                  const items = order.items || [];
                  const firstItem = items[0];
                  const remainingCount = items.length - 1;

                  return (
                    <tr 
                      key={order.id} 
                      className="hover:bg-cream/30 transition-colors group cursor-pointer"
                      onClick={() => setSelectedOrder(order)}
                    >
                      {/* Order ID & Date */}
                      <td className="py-4 px-4 sm:px-6 align-middle">
                        <div className="flex items-center gap-1.5 font-mono font-bold text-earthy-brown-dark text-xs sm:text-sm">
                          <span>#{order.id.slice(0, 12)}...</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopy(order.id, order.id);
                            }}
                            className="p-1 text-charcoal-muted hover:text-earthy-brown rounded-md hover:bg-cream transition-colors"
                            title="Copy Full Order ID"
                          >
                            {copiedId === order.id ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                          </button>
                        </div>
                        <p className="text-xs text-charcoal-muted mt-0.5">
                          {formatDate(order.createdAt)}
                        </p>
                      </td>

                      {/* Customer */}
                      <td className="py-4 px-4 align-middle">
                        <p className="font-semibold text-charcoal text-sm leading-tight">
                          {customer.fullName || "Guest Customer"}
                        </p>
                        <p className="text-xs text-charcoal-muted mt-0.5">
                          {customer.mobile || "No phone"}
                        </p>
                        <p className="text-xs text-charcoal-muted/80">
                          {customer.city ? `${customer.city}, ${customer.state || ''}` : ''}
                        </p>
                      </td>

                      {/* Items Summary */}
                      <td className="py-4 px-4 align-middle max-w-xs">
                        {firstItem ? (
                          <div>
                            <p className="font-medium text-charcoal text-xs truncate">
                              {firstItem.name} {firstItem.variantLabel ? `(${firstItem.variantLabel})` : ""}
                              <span className="text-charcoal-muted font-normal ml-1">× {firstItem.quantity}</span>
                            </p>
                            {remainingCount > 0 && (
                              <span className="inline-block mt-0.5 text-[11px] font-semibold text-earthy-brown bg-earthy-brown/10 px-2 py-0.5 rounded-md">
                                +{remainingCount} more item{remainingCount > 1 ? 's' : ''}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-charcoal-muted italic">No items listed</span>
                        )}
                      </td>

                      {/* Total Amount */}
                      <td className="py-4 px-4 align-middle text-right font-bold text-charcoal">
                        <span className="text-sm sm:text-base font-mono text-[#8C2D19]">
                          {formatPrice(order.total ?? 0)}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 align-middle text-center">
                        {getStatusBadge(order.status)}
                      </td>

                      {/* Logistics / Shiprocket */}
                      <td className="py-4 px-4 align-middle" onClick={(e) => e.stopPropagation()}>
                        {order.shiprocketOrderId ? (
                          <div className="bg-blue-50/80 border border-blue-200/80 rounded-xl p-2 text-xs">
                            <div className="flex items-center gap-1 font-bold text-blue-900">
                              <Truck size={13} className="text-blue-700" />
                              <span>SR #{order.shiprocketOrderId}</span>
                            </div>
                            <p className="text-[11px] text-blue-700 font-mono mt-0.5 truncate">
                              Shipment: {order.shiprocketShipmentId}
                            </p>
                          </div>
                        ) : order.status === "paid" ? (
                          <button
                            type="button"
                            onClick={() => handlePushToShiprocket(order.id)}
                            disabled={processingId === order.id}
                            className="px-3 py-1.5 bg-[#8C2D19] hover:bg-[#732414] !text-white text-white rounded-lg text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-60"
                            style={{ color: "#FFFFFF" }}
                            title="Push directly to Shiprocket logistics"
                          >
                            {processingId === order.id ? (
                              <>
                                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Pushing...</span>
                              </>
                            ) : (
                              <>
                                <Truck size={13} />
                                <span>Push to Shiprocket</span>
                              </>
                            )}
                          </button>
                        ) : (
                          <span className="text-xs text-charcoal-muted/70 italic">
                            Awaiting Payment
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 sm:px-6 align-middle text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          {/* View details */}
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="p-2 text-charcoal hover:text-earthy-brown hover:bg-cream rounded-lg transition-colors cursor-pointer"
                            title="View Full Order Details"
                          >
                            <Eye size={16} />
                          </button>

                          {/* Delete order */}
                          <button
                            type="button"
                            onClick={() => setOrderToDelete(order)}
                            className="p-2 text-charcoal-muted hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Order (Safety Confirmation)"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Load More Button if there are remaining orders */}
          {visibleOrders.length < filteredOrders.length && (
            <div className="p-4 bg-cream/25 border-t border-border-light flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                type="button"
                onClick={handleLoadMore}
                className="w-full sm:w-auto px-6 py-2.5 bg-white hover:bg-cream border border-earthy-brown/30 hover:border-earthy-brown text-earthy-brown-dark rounded-xl text-xs sm:text-sm font-bold inline-flex items-center justify-center gap-2 shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer"
              >
                <span>Load More Orders</span>
                <ChevronDown size={16} className="text-earthy-brown" />
                <span className="text-[11px] font-medium text-charcoal-muted bg-cream px-2 py-0.5 rounded-full border border-border-light">
                  +{Math.min(PAGE_SIZE, filteredOrders.length - visibleOrders.length)} more ({filteredOrders.length - visibleOrders.length} remaining)
                </span>
              </button>
            </div>
          )}

          {/* Table Footer info */}
          <div className="bg-cream/40 px-6 py-3 border-t border-border-light flex flex-col sm:flex-row items-center justify-between text-xs text-charcoal-muted gap-2">
            <span>
              Showing <strong className="text-charcoal font-bold">{visibleOrders.length}</strong> of <strong className="text-charcoal font-bold">{filteredOrders.length}</strong> {filteredOrders.length !== orders.length ? `orders (filtered from ${orders.length} total)` : "total orders"}
            </span>
            <span className="flex items-center gap-1">
              Tip: Click any row to view complete shipping, items, and payment details
            </span>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 1. ORDER DETAILS MODAL / DRAWER                               */}
      {/* ───────────────────────────────────────────────────────────── */}
      {selectedOrder && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-200"
          onClick={() => setSelectedOrder(null)}
        >
          <div 
            className="bg-white rounded-3xl border border-border-light max-w-2xl w-full my-8 shadow-2xl overflow-hidden relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#FAF6EE] p-5 sm:p-6 border-b border-border-light flex items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h3 className="font-display text-xl sm:text-2xl font-bold text-earthy-brown-dark tracking-tight">
                    Order Details
                  </h3>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="flex items-center gap-2 font-mono text-xs text-charcoal-muted">
                  <span>ID: #{selectedOrder.id}</span>
                  <button
                    onClick={() => handleCopy(selectedOrder.id, "modal-id")}
                    className="p-1 hover:text-earthy-brown"
                    title="Copy ID"
                  >
                    {copiedId === "modal-id" ? <Check size={12} className="text-emerald-600" /> : <Copy size={12} />}
                  </button>
                  <span>•</span>
                  <span>{formatDate(selectedOrder.createdAt)}</span>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-charcoal-muted hover:text-charcoal hover:bg-cream rounded-full transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Customer & Shipping Information */}
              <div className="bg-[#FAF9F6] rounded-2xl p-4 sm:p-5 border border-border-light">
                <h4 className="text-xs font-bold uppercase tracking-wider text-earthy-brown mb-3 flex items-center gap-1.5">
                  <MapPin size={14} /> Customer &amp; Shipping Details
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-charcoal-muted">Customer Name</p>
                    <p className="font-bold text-charcoal mt-0.5">{selectedOrder.customer?.fullName || "N/A"}</p>

                    <p className="text-xs text-charcoal-muted mt-2.5">Mobile Number</p>
                    <a 
                      href={`tel:${selectedOrder.customer?.mobile}`}
                      className="font-medium text-emerald-800 hover:underline flex items-center gap-1.5 mt-0.5"
                    >
                      <Phone size={13} /> {selectedOrder.customer?.mobile || "N/A"}
                    </a>

                    <p className="text-xs text-charcoal-muted mt-2.5">Email Address</p>
                    <a 
                      href={`mailto:${selectedOrder.customer?.email}`}
                      className="font-medium text-blue-800 hover:underline flex items-center gap-1.5 mt-0.5 truncate"
                    >
                      <Mail size={13} /> {selectedOrder.customer?.email || "N/A"}
                    </a>
                  </div>

                  <div>
                    <p className="text-xs text-charcoal-muted">Delivery Address</p>
                    <p className="text-charcoal font-medium mt-0.5 leading-relaxed">
                      {selectedOrder.customer?.address || "No address provided"}
                      {selectedOrder.customer?.landmark && (
                        <span className="block text-xs text-charcoal-muted mt-0.5">
                          Landmark: {selectedOrder.customer.landmark}
                        </span>
                      )}
                      <span className="block font-semibold mt-1">
                        {selectedOrder.customer?.city}, {selectedOrder.customer?.state} - {selectedOrder.customer?.pincode}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-earthy-brown mb-3 flex items-center gap-1.5">
                  <Package size={14} /> Ordered Items ({(selectedOrder.items || []).length})
                </h4>
                <div className="border border-border-light rounded-2xl overflow-hidden">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-cream/60 border-b border-border-light text-[11px] font-bold uppercase text-charcoal-muted">
                        <th className="py-2.5 px-4">Item</th>
                        <th className="py-2.5 px-3 text-center">Qty</th>
                        <th className="py-2.5 px-3 text-right">Price</th>
                        <th className="py-2.5 px-4 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-light/60">
                      {(selectedOrder.items || []).map((item, idx) => (
                        <tr key={idx} className="hover:bg-cream/20">
                          <td className="py-3 px-4">
                            <p className="font-semibold text-charcoal">{item.name}</p>
                            {item.variantLabel && (
                              <p className="text-xs text-charcoal-muted">Variant: {item.variantLabel}</p>
                            )}
                          </td>
                          <td className="py-3 px-3 text-center font-mono">
                            {item.quantity}
                          </td>
                          <td className="py-3 px-3 text-right font-mono text-charcoal-muted">
                            {formatPrice(item.price)}
                          </td>
                          <td className="py-3 px-4 text-right font-mono font-bold text-charcoal">
                            {formatPrice((item.price || 0) * (item.quantity || 1))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Price Breakdown & Payment Verification */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Payment info */}
                <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-border-light text-xs">
                  <h5 className="font-bold uppercase tracking-wider text-earthy-brown mb-2 flex items-center gap-1.5">
                    <CreditCard size={14} /> Payment Information
                  </h5>
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-charcoal-muted">Payment Status:</span>
                      <span className="font-bold capitalize">{selectedOrder.status}</span>
                    </div>
                    {selectedOrder.razorpayPaymentId && (
                      <div className="flex justify-between items-center">
                        <span className="text-charcoal-muted">Razorpay ID:</span>
                        <span className="font-mono font-bold text-emerald-800 truncate max-w-[130px]" title={selectedOrder.razorpayPaymentId}>
                          {selectedOrder.razorpayPaymentId}
                        </span>
                      </div>
                    )}
                    {selectedOrder.razorpayOrderId && (
                      <div className="flex justify-between items-center">
                        <span className="text-charcoal-muted">Razorpay Order:</span>
                        <span className="font-mono text-charcoal-muted truncate max-w-[130px]">
                          {selectedOrder.razorpayOrderId}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="bg-[#FAF9F6] rounded-2xl p-4 border border-border-light text-xs space-y-1.5">
                  <h5 className="font-bold uppercase tracking-wider text-earthy-brown mb-2">
                    Financial Summary
                  </h5>
                  <div className="flex justify-between text-charcoal-muted">
                    <span>Subtotal:</span>
                    <span className="font-mono font-medium">{formatPrice(selectedOrder.subtotal ?? selectedOrder.total ?? 0)}</span>
                  </div>
                  <div className="flex justify-between text-charcoal-muted">
                    <span>Shipping Fee:</span>
                    <span className="font-mono font-medium">
                      {(Number(selectedOrder.shippingFee ?? selectedOrder.shipping ?? Math.max(0, (selectedOrder.total || 0) - (selectedOrder.subtotal || 0) + (selectedOrder.discount || 0)))) > 0
                        ? formatPrice(selectedOrder.shippingFee ?? selectedOrder.shipping ?? Math.max(0, (selectedOrder.total || 0) - (selectedOrder.subtotal || 0) + (selectedOrder.discount || 0)))
                        : "FREE"}
                    </span>
                  </div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-medium">
                      <span>Discount ({selectedOrder.appliedPromo?.code || 'Promo'}):</span>
                      <span className="font-mono">- {formatPrice(selectedOrder.discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-border-light pt-2 flex justify-between font-bold text-sm text-charcoal">
                    <span>Total Paid:</span>
                    <span className="font-mono text-[#8C2D19]">{formatPrice(selectedOrder.total ?? 0)}</span>
                  </div>
                </div>
              </div>

              {/* Shiprocket Logistics Details & Actions */}
              <div className="bg-blue-50/50 rounded-2xl p-4 sm:p-5 border border-blue-200/60">
                <h4 className="text-xs font-bold uppercase tracking-wider text-blue-900 mb-2.5 flex items-center gap-1.5">
                  <Truck size={14} className="text-blue-700" /> Logistics &amp; Shipping Status
                </h4>
                {selectedOrder.shiprocketOrderId ? (
                  <div className="space-y-2 text-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-charcoal-muted">Shiprocket Order ID:</span>
                        <p className="font-mono font-bold text-blue-900 mt-0.5">{selectedOrder.shiprocketOrderId}</p>
                      </div>
                      <div>
                        <span className="text-charcoal-muted">Shiprocket Shipment ID:</span>
                        <p className="font-mono font-bold text-blue-900 mt-0.5">{selectedOrder.shiprocketShipmentId || "Pending Assignment"}</p>
                      </div>
                    </div>
                    {selectedOrder.pushedToLogisticsAt && (
                      <p className="text-xs text-charcoal-muted">
                        Pushed on: {formatDate(selectedOrder.pushedToLogisticsAt)}
                      </p>
                    )}
                    <div className="pt-2">
                      <Link
                        href={`/track?orderId=${selectedOrder.id}`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-800 hover:text-blue-900 underline"
                      >
                        <ExternalLink size={13} />
                        View Live Tracking Page
                      </Link>
                    </div>
                  </div>
                ) : selectedOrder.status === "paid" ? (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                    <p className="text-xs text-charcoal-muted">
                      This order is marked as paid but has not yet been synced to Shiprocket.
                    </p>
                    <button
                      type="button"
                      onClick={() => handlePushToShiprocket(selectedOrder.id)}
                      disabled={processingId === selectedOrder.id}
                      className="px-4 py-2 bg-[#8C2D19] hover:bg-[#732414] !text-white text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition-all shadow-sm cursor-pointer disabled:opacity-60 shrink-0"
                      style={{ color: "#FFFFFF" }}
                    >
                      {processingId === selectedOrder.id ? (
                        <>
                          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Pushing...</span>
                        </>
                      ) : (
                        <>
                          <Truck size={14} />
                          <span>Push to Shiprocket Now</span>
                        </>
                      )}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-charcoal-muted">
                    Order is awaiting customer payment before pushing to logistics.
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-[#FAF6EE] px-6 py-4 border-t border-border-light flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => {
                  setOrderToDelete(selectedOrder);
                }}
                className="px-4 py-2 text-red-700 hover:bg-red-50 rounded-xl text-xs sm:text-sm font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer border border-red-200"
              >
                <Trash2 size={15} />
                <span>Delete Order</span>
              </button>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="px-5 py-2 bg-charcoal hover:bg-charcoal-dark !text-white text-white rounded-xl text-xs sm:text-sm font-bold transition-all shadow-sm cursor-pointer"
                style={{ color: "#FFFFFF" }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ───────────────────────────────────────────────────────────── */}
      {/* 2. DELETE CONFIRMATION MODAL                                  */}
      {/* ───────────────────────────────────────────────────────────── */}
      {orderToDelete && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => !isDeleting && setOrderToDelete(null)}
        >
          <div 
            className="bg-white rounded-3xl border border-[#E8DFC9] p-6 sm:p-7 max-w-md w-full shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#FDF2F0] text-[#8C2D19] flex items-center justify-center mb-4 mx-auto border border-[#FADCD7]">
              <AlertTriangle size={24} />
            </div>

            <h3 className="font-display text-xl font-bold text-charcoal text-center">
              Delete Order Record?
            </h3>
            <p className="text-xs sm:text-sm text-charcoal-muted text-center mt-1.5 mb-5 font-body leading-relaxed">
              Are you sure you want to delete order <strong className="text-charcoal font-mono">#{orderToDelete.id}</strong>? All order records, line items, and delivery data will be permanently removed.
            </p>

            <div className="bg-[#FAF6EE] rounded-2xl border border-[#E8DFC9] p-3.5 space-y-2 mb-6 text-xs font-medium">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Customer:</span>
                <span className="text-charcoal font-bold">{orderToDelete.customer?.fullName || "Guest"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Total Amount:</span>
                <span className="font-mono font-bold text-[#8C2D19]">{formatPrice(orderToDelete.total ?? 0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Status:</span>
                <span className="capitalize">{orderToDelete.status}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={isDeleting}
                onClick={() => setOrderToDelete(null)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#DFD5C0] bg-[#FAF6EE] hover:bg-[#F2EADB] text-charcoal font-semibold text-xs sm:text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={confirmDeleteOrder}
                className="w-full py-2.5 px-4 rounded-xl bg-[#8C2D19] hover:bg-[#732414] !text-white text-white font-bold text-xs sm:text-sm transition-colors shadow-sm cursor-pointer flex items-center justify-center gap-2"
                style={{ color: "#FFFFFF" }}
              >
                {isDeleting ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Trash2 size={15} />
                    <span>Yes, Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
