"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, XCircle, Building2, FileText, Eye, Download } from "lucide-react";
import wasteCompanyService, { WasteCompany } from "@/lib/waste-company-service";
import { toast } from "react-toastify";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<WasteCompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "PENDING" | "APPROVED" | "REJECTED">("all");
  const [selectedCompany, setSelectedCompany] = useState<WasteCompany | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const data = await wasteCompanyService.getAllCompanies();
      setCompanies(data);
    } catch (error) {
      toast.error("Failed to fetch companies");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (companyId: number) => {
    try {
      setActionLoading(true);
      await wasteCompanyService.approveCompany(companyId);
      toast.success("Company approved successfully");
      fetchCompanies();
    } catch (error) {
      toast.error("Failed to approve company");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedCompany || !rejectReason.trim()) {
      toast.error("Please provide a rejection reason");
      return;
    }
    try {
      setActionLoading(true);
      await wasteCompanyService.rejectCompany(selectedCompany.id, rejectReason);
      toast.success("Company rejected");
      setShowRejectModal(false);
      setRejectReason("");
      fetchCompanies();
    } catch (error) {
      toast.error("Failed to reject company");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const blob = await wasteCompanyService.downloadDocument(url);
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (error) {
      toast.error("Failed to download document");
    }
  };

  const filteredCompanies = filter === "all" 
    ? companies 
    : companies.filter(company => company.status === filter);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "APPROVED":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "PENDING":
        return <Clock className="w-5 h-5 text-yellow-600" />;
      case "REJECTED":
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      APPROVED: "bg-green-100 text-green-800",
      PENDING: "bg-yellow-100 text-yellow-800",
      REJECTED: "bg-red-100 text-red-800",
    };
    return variants[status as keyof typeof variants] || "";
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Companies Registration</h1>
        <div className="flex gap-2">
          {["all", "PENDING", "APPROVED", "REJECTED"].map((status) => (
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard 
          title="Total Companies" 
          value={companies.length.toString()} 
          icon={<Building2 className="w-6 h-6 text-blue-600" />}
        />
        <StatCard 
          title="Approved" 
          value={companies.filter(c => c.status === "APPROVED").length.toString()} 
          icon={<CheckCircle className="w-6 h-6 text-green-600" />}
        />
        <StatCard 
          title="Pending" 
          value={companies.filter(c => c.status === "PENDING").length.toString()} 
          icon={<Clock className="w-6 h-6 text-yellow-600" />}
        />
      </div>

      <div className="grid gap-4">
        {filteredCompanies.map((company) => (
          <Card key={company.id} className="p-6 rounded-2xl shadow">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                {getStatusIcon(company.status)}
                <div>
                  <h3 className="font-semibold text-lg">{company.companyName}</h3>
                  <p className="text-gray-500 text-sm">{company.email}</p>
                  <p className="text-gray-500 text-sm">{company.phoneNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSelectedCompany(company)}
                  className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
                >
                  <Eye className="w-4 h-4 inline mr-1" />
                  View
                </button>
                <Badge className={getStatusBadge(company.status)}>
                  {company.status}
                </Badge>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Sectors:</strong> {company.sectors.join(", ")}
              </p>
              <p className="text-sm text-gray-600">
                <strong>TIN:</strong> {company.tinNumber}
              </p>
            </div>

            {company.status === "PENDING" && (
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleApprove(company.id)}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    setSelectedCompany(company);
                    setShowRejectModal(true);
                  }}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            )}
          </Card>
        ))}
      </div>

      {selectedCompany && !showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">{selectedCompany.companyName}</h2>
                  <Badge className={getStatusBadge(selectedCompany.status)}>
                    {selectedCompany.status}
                  </Badge>
                </div>
                <button
                  onClick={() => setSelectedCompany(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold mb-3">Company Information</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <p>{selectedCompany.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Phone:</span>
                      <p>{selectedCompany.phoneNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">TIN Number:</span>
                      <p>{selectedCompany.tinNumber}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Address:</span>
                      <p>{selectedCompany.address}</p>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-500">Service Sectors:</span>
                      <p>{selectedCompany.sectors.join(", ")}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-3">Documents</h3>
                  <div className="space-y-3">
                    {selectedCompany.kigaliContractUrl && (
                      <DocumentRow 
                        label="Kigali Contract" 
                        url={selectedCompany.kigaliContractUrl}
                        onDownload={handleDownload}
                      />
                    )}
                    {selectedCompany.remaCertificateUrl && (
                      <DocumentRow 
                        label="REMA Certificate" 
                        url={selectedCompany.remaCertificateUrl}
                        onDownload={handleDownload}
                      />
                    )}
                    {selectedCompany.rdbCertificateUrl && (
                      <DocumentRow 
                        label="RDB Certificate" 
                        url={selectedCompany.rdbCertificateUrl}
                        onDownload={handleDownload}
                      />
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4">Reject Company</h3>
            <p className="text-gray-600 mb-4">Please provide a reason for rejection:</p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border rounded-lg p-3 mb-4 min-h-[100px]"
              placeholder="Enter rejection reason..."
            />
            <div className="flex gap-2">
              <button
                onClick={handleReject}
                disabled={actionLoading || !rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason("");
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
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

function DocumentRow({ label, url, onDownload }: { label: string; url: string; onDownload: (url: string, filename: string) => void }) {
  return (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-600" />
        <div>
          <p className="font-medium">{label}</p>
          <p className="text-sm text-gray-500">{url.split('/').pop()}</p>
        </div>
      </div>
      <button 
        onClick={() => onDownload(url, `${label}.pdf`)}
        className="px-3 py-1 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200"
      >
        <Download className="w-4 h-4 inline mr-1" />
        Download
      </button>
    </div>
  );
}
