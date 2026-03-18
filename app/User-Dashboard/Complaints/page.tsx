"use client";

import React, { useState } from 'react';
import NotificationCard from '../Notifications/NotificationCard';
import { Plus, X, AlertCircle, Clock, Truck, FileText } from 'lucide-react';

interface Complaint {
  id: string;
  title: string;
  issueType: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  date: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
}

export default function ComplaintsSection() {
  const [showReportForm, setShowReportForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [complaints, setComplaints] = useState<Complaint[]>([
    {
      id: '1',
      title: 'Missed Pickup',
      issueType: 'Missed Collection',
      description: 'Waste collection was scheduled for today but truck did not arrive',
      status: 'Pending',
      date: 'Oct 8, 2025',
      priority: 'High'
    },
    {
      id: '2',
      title: 'Damaged Bin',
      issueType: 'Equipment Issue',
      description: 'My waste bin was damaged during last collection',
      status: 'In Progress',
      date: 'Sept 11, 2025',
      priority: 'Medium'
    },
    {
      id: '3',
      title: 'Incomplete Collection',
      issueType: 'Service Quality',
      description: 'Transport was not fully loaded, some waste left behind',
      status: 'Resolved',
      date: 'Oct 8, 2025',
      priority: 'Low'
    }
  ]);

  const [formData, setFormData] = useState({
    issueType: '',
    description: '',
    priority: 'Medium' as 'Low' | 'Medium' | 'High' | 'Urgent'
  });

  const issueTypes = [
    'Missed Collection',
    'Late Collection',
    'Incomplete Collection',
    'Equipment Issue',
    'Service Quality',
    'Billing Issue',
    'Schedule Change Request',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.issueType || !formData.description.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newComplaint: Complaint = {
      id: Date.now().toString(),
      title: formData.issueType,
      issueType: formData.issueType,
      description: formData.description,
      status: 'Pending',
      date: new Date().toLocaleDateString(),
      priority: formData.priority
    };
    
    setComplaints(prev => [newComplaint, ...prev]);
    setFormData({ issueType: '', description: '', priority: 'Medium' });
    setShowReportForm(false);
    setIsSubmitting(false);
    
    // Show success message
    alert('Complaint submitted successfully!');
  };

  const handleCancel = () => {
    setFormData({ issueType: '', description: '', priority: 'Medium' });
    setShowReportForm(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending': return 'text-orange-600 bg-orange-100';
      case 'In Progress': return 'text-blue-600 bg-blue-100';
      case 'Resolved': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'text-red-600 bg-red-100';
      case 'High': return 'text-orange-600 bg-orange-100';
      case 'Medium': return 'text-yellow-600 bg-yellow-100';
      case 'Low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending': return <Clock className="w-4 h-4" />;
      case 'In Progress': return <Truck className="w-4 h-4" />;
      case 'Resolved': return <FileText className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with New Complaint Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">My Complaints</h2>
        <button
          onClick={() => setShowReportForm(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Complaint
        </button>
      </div>

      {/* New Complaint Modal */}
      {showReportForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">New Complaint</h3>
                <button
                  onClick={handleCancel}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Issue Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.issueType}
                    onChange={(e) => setFormData(prev => ({ ...prev, issueType: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Select an issue type</option>
                    {issueTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Priority */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as any }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Please describe the issue in detail..."
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Complaints List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Complaints</h3>
          
          {complaints.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No complaints submitted yet</p>
              <p className="text-sm">Click "New Complaint" to submit your first complaint</p>
            </div>
          ) : (
            <div className="space-y-4">
              {complaints.map((complaint) => (
                <div key={complaint.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${getStatusColor(complaint.status).split(' ')[1]}`}>
                        {getStatusIcon(complaint.status)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-800">{complaint.title}</h4>
                        <p className="text-sm text-gray-600">{complaint.issueType}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(complaint.priority)}`}>
                        {complaint.priority}
                      </span>
                    </div>
                  </div>
                  <p className="text-gray-700 mb-3">{complaint.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>Submitted: {complaint.date}</span>
                    <span>ID: #{complaint.id}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Legacy Notifications Section */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications & Updates</h3>
        <div className="space-y-3">
          <NotificationCard
            title="Notifications"
            subtitle="01-12-2025"
            status="New"
            statusColor="green"
            iconBgColor="orange-100"
            iconTextColor="orange-600"
            variant="bordered"
          />

          <NotificationCard
            title="Reminder"
            subtitle="Tomorrow pick day"
            status="New"
            statusColor="green"
            iconBgColor="orange-100"
            iconTextColor="orange-600"
            variant="bordered"
          />

          <NotificationCard
            title="Extra Pickup"
            subtitle="Pickup for extra 2-3 PM"
            iconBgColor="blue-100"
            iconTextColor="blue-600"
            variant="bordered"
          />

          <NotificationCard
            title="Bill of waste"
            subtitle="03-12 EM"
            status="Follow"
            statusColor="green"
            iconBgColor="green-100"
            iconTextColor="green-600"
            variant="bordered"
          />
        </div>
      </div>
    </div>
  );
}