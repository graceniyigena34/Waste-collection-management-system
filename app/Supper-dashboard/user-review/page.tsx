/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, User, Calendar, Filter } from "lucide-react";
import { contactService, Contact } from "@/lib/contact-service";
import { toast } from "react-toastify";

interface Review {
  id: string;
  userName: string;
  userEmail: string;
  companyName: string;
  rating: number;
  comment: string;
  date: string;
  status: "pending" | "approved" | "rejected";
}

export default function UserReviewPage() {
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        setLoading(true);
        console.log('Fetching contacts from API...');
        const data = await contactService.getAllContacts();
        console.log('Contacts received:', data);
        setContacts(data);
        
        const mappedReviews: Review[] = data.map(contact => ({
          id: contact.id,
          userName: contact.fullName,
          userEmail: contact.email,
          companyName: contact.serviceInterest,
          rating: 0,
          comment: contact.message,
          date: contact.createdAt,
          status: contact.processed ? "approved" : "pending",
        }));
        
        setReviews(mappedReviews);
        setError(null);
      } catch (err: any) {
        console.error('Error fetching contacts:', err);
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load contact submissions';
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, []);

  const filteredReviews = filter === "all" 
    ? reviews 
    : reviews.filter(review => review.status === filter);

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800",
      approved: "bg-green-100 text-green-800",
      rejected: "bg-red-100 text-red-800",
    };
    return variants[status as keyof typeof variants] || "";
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
        }`}
      />
    ));
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return "0.0";
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading contact submissions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">User Reviews</h1>
        <div className="flex gap-2">
          {["all", "pending", "approved", "rejected"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status as any)}
              className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${
                filter === status
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Submissions" 
          value={reviews.length.toString()} 
          icon={<MessageSquare className="w-6 h-6 text-blue-600" />}
        />
        <StatCard 
          title="Phone Contacts" 
          value={contacts.filter(c => c.phone).length.toString()} 
          icon={<Star className="w-6 h-6 text-yellow-600" />}
        />
        <StatCard 
          title="Pending" 
          value={reviews.filter(r => r.status === "pending").length.toString()} 
          icon={<Filter className="w-6 h-6 text-yellow-600" />}
        />
        <StatCard 
          title="Processed" 
          value={reviews.filter(r => r.status === "approved").length.toString()} 
          icon={<User className="w-6 h-6 text-green-600" />}
        />
      </div>

      <div className="grid gap-4">
        {filteredReviews.length === 0 ? (
          <Card className="p-12 rounded-2xl shadow text-center">
            <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No contact submissions found</p>
          </Card>
        ) : (
          filteredReviews.map((review) => (
          <Card key={review.id} className="p-6 rounded-2xl shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold">{review.userName}</h3>
                  <p className="text-gray-500 text-sm">{review.userEmail}</p>
                </div>
              </div>
              <Badge className={getStatusBadge(review.status)}>
                {review.status}
              </Badge>
            </div>

            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium">Service Interest:</span>
                <span className="text-sm text-gray-600 capitalize">{review.companyName}</span>
              </div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium">Phone:</span>
                <span className="text-sm text-gray-600">{contacts.find(c => c.id === review.id)?.phone || 'N/A'}</span>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-gray-700 text-sm leading-relaxed">
                &quot;{review.comment}&quot;
              </p>
            </div>

            <div className="flex justify-between items-center pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date(review.date).toLocaleDateString()}
              </div>
              
              {review.status === "pending" && (
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200">
                    Approve
                  </button>
                  <button className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200">
                    Reject
                  </button>
                </div>
              )}
            </div>
          </Card>
        )))}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string; icon: React.ReactNode }) {
  return (
    <Card className="rounded-2xl shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <h2 className="text-2xl font-bold">{value}</h2>
          </div>
          {icon}
        </div>
      </CardContent>
    </Card>
  );
}