"use client";

import { useState, useEffect } from "react";
import { Mail, Briefcase, CheckCircle, Clock, Trash2, ChevronDown } from "lucide-react";
import { getEnquiries, markEnquiryStatus, deleteEnquiry } from "@/app/actions/enquiries";

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetchEnquiries();
  }, [filter]);

  const fetchEnquiries = async () => {
    setLoading(true);
    const result = await getEnquiries(filter);
    if (result.success) {
      setEnquiries(result.enquiries);
    }
    setLoading(false);
  };

  const handleStatusChange = async (id, newStatus) => {
    const result = await markEnquiryStatus(id, newStatus);
    if (result.success) {
      setEnquiries(enquiries.map(e => e.id === id ? { ...e, status: newStatus } : e));
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this enquiry?")) {
      const result = await deleteEnquiry(id);
      if (result.success) {
        setEnquiries(enquiries.filter(e => e.id !== id));
      }
    }
  };

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-display font-bold text-charcoal">Customer Enquiries</h1>
          <p className="text-charcoal/60 mt-1">Manage contact messages and bulk order requests</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
          {["all", "contact", "bulk"].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
                filter === type ? "bg-white shadow-sm text-charcoal" : "text-gray-500 hover:text-charcoal"
              }`}
            >
              {type === "all" ? "All Messages" : type}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {loading ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
            Loading enquiries...
          </div>
        ) : enquiries.length === 0 ? (
          <div className="p-12 text-center text-gray-500 bg-white rounded-2xl border border-gray-100 flex flex-col items-center">
            <Mail size={48} className="text-gray-300 mb-4" />
            <p className="text-lg font-medium text-charcoal">No enquiries found</p>
            <p className="text-sm">You&apos;re all caught up!</p>
          </div>
        ) : (
          enquiries.map((enq) => (
            <div key={enq.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative group transition-all hover:shadow-md">
              <div className="flex items-start justify-between gap-4">
                
                {/* Left content */}
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${
                    enq.type === 'bulk' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {enq.type === 'bulk' ? <Briefcase size={24} /> : <Mail size={24} />}
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg text-charcoal">
                        {enq.type === 'bulk' ? enq.fullName : enq.name}
                      </h3>
                      {enq.type === 'bulk' && enq.company && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                          {enq.company}
                        </span>
                      )}
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Clock size={12} /> {formatDate(enq.createdAt)}
                      </span>
                    </div>

                    <div className="text-sm text-gray-500 flex items-center gap-4 mb-4">
                      <a href={`mailto:${enq.email}`} className="hover:text-blue-600 transition-colors">{enq.email}</a>
                      {enq.mobile && (
                        <a href={`tel:${enq.mobile}`} className="hover:text-blue-600 transition-colors">{enq.mobile}</a>
                      )}
                    </div>

                    {enq.type === 'bulk' && (
                      <div className="flex gap-3 mb-4 text-xs font-medium">
                        <span className="bg-gray-50 border border-gray-200 px-2 py-1 rounded text-charcoal">Type: {enq.requirementType}</span>
                        <span className="bg-gray-50 border border-gray-200 px-2 py-1 rounded text-charcoal">Qty: {enq.quantity || 'Not specified'}</span>
                        {enq.location && <span className="bg-gray-50 border border-gray-200 px-2 py-1 rounded text-charcoal">Loc: {enq.location}</span>}
                      </div>
                    )}

                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-charcoal/80 text-sm whitespace-pre-wrap">
                      {enq.type === 'contact' && enq.subject && (
                        <p className="font-bold mb-2">Subject: {enq.subject}</p>
                      )}
                      {enq.message}
                    </div>
                  </div>
                </div>

                {/* Right actions */}
                <div className="flex flex-col items-end gap-3 shrink-0">
                  <div className="relative">
                    <select
                      value={enq.status || 'new'}
                      onChange={(e) => handleStatusChange(enq.id, e.target.value)}
                      className={`appearance-none pl-3 pr-8 py-1.5 text-xs font-bold uppercase tracking-wide rounded-full border outline-none cursor-pointer ${
                        enq.status === 'resolved' 
                          ? 'bg-green-50 border-green-200 text-green-700' 
                          : 'bg-orange-50 border-orange-200 text-orange-700'
                      }`}
                    >
                      <option value="new">New / Pending</option>
                      <option value="resolved">Resolved</option>
                    </select>
                    <ChevronDown size={14} className={`absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none ${
                      enq.status === 'resolved' ? 'text-green-700' : 'text-orange-700'
                    }`} />
                  </div>

                  <button
                    onClick={() => handleDelete(enq.id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                    title="Delete message"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
