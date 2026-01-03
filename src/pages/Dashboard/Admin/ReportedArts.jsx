import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import Swal from "sweetalert2";
import { Trash2, XCircle, Eye, AlertTriangle } from "lucide-react";

const ReportedArts = () => {
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const [selectedReport, setSelectedReport] = useState(null);

  const { data: reports = [], isLoading } = useQuery({
    queryKey: ["admin-reports"],
    queryFn: async () => {
      const res = await axiosSecure.get("/admin/reports");
      return Array.isArray(res.data)
        ? res.data
        : res.data.data || res.data.reports || [];
    },
  });

  const deleteArtMutation = useMutation({
    mutationFn: async (artId) => {
      return await axiosSecure.delete(`/arts/${artId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-reports"]);
      Swal.fire("Deleted!", "The art has been deleted.", "success");
      setSelectedReport(null);
    },
    onError: () => {
      Swal.fire("Error", "Failed to delete art.", "error");
    },
  });

  const ignoreReportMutation = useMutation({
    mutationFn: async (reportId) => {
      // DELETE /admin/reports/:id resolves/deletes the report
      return await axiosSecure.delete(`/admin/reports/${reportId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["admin-reports"]);
      Swal.fire("Ignored", "Report has been dismissed.", "success");
      setSelectedReport(null);
    },
    onError: () => {
      Swal.fire("Error", "Failed to dismiss report.", "error");
    },
  });

  const handleDeleteArt = (artId) => {
    Swal.fire({
      title: "Delete Art?",
      text: "This will permanently delete the content.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete art!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteArtMutation.mutate(artId);
      }
    });
  };

  const handleIgnoreReport = (reportId) => {
    ignoreReportMutation.mutate(reportId);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold font-montserrat">Reported Arts</h2>
        <p className="text-base-content/60">
          Review and resolve community reports
        </p>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-xl border border-base-200">
        <table className="table w-full">
          <thead className="bg-error/10">
            <tr>
              <th>Art Title</th>
              <th className="text-center">Report Count</th>
              <th>Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((report) => (
              <tr key={report._id} className="hover">
                <td>
                  <div className="font-bold">
                    {report.artTitle || `Art ID: ${report.artId}`}
                  </div>
                  <div className="text-xs text-base-content/50">
                    Report ID: {report._id}
                  </div>
                </td>
                <td className="text-center">
                  <span className="badge badge-error gap-1 font-bold">
                    {report.reportCount || 1}
                  </span>
                </td>
                <td>
                  <span className="text-warning font-medium flex items-center gap-1">
                    <AlertTriangle size={14} /> Pending Review
                  </span>
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="btn btn-sm btn-ghost text-primary"
                    >
                      <Eye size={16} /> Details
                    </button>
                    <button
                      onClick={() => handleIgnoreReport(report._id)}
                      className="btn btn-sm btn-ghost text-base-content/50"
                      title="Ignore Report"
                    >
                      <XCircle size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteArt(report.artId)}
                      className="btn btn-sm btn-ghost text-error"
                      title="Delete Art"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {reports.length === 0 && (
          <div className="p-10 text-center flex flex-col items-center gap-4 text-base-content/50">
            <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center text-success">
              <CheckCircle className="w-8 h-8" />
            </div>
            <p>No reported arts. Good job!</p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedReport && (
        <dialog id="report_modal" className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">Report Details</h3>

            <div className="space-y-4">
              <div>
                <span className="font-semibold block text-sm opacity-70">
                  Art Title
                </span>
                <p>{selectedReport.artTitle}</p>
              </div>
              <div>
                <span className="font-semibold block text-sm opacity-70">
                  Reporter Info
                </span>
                <p>{selectedReport.reporterEmail || "Anonymous"}</p>
              </div>
              <div>
                <span className="font-semibold block text-sm opacity-70">
                  Reason(s)
                </span>
                <div className="bg-base-200 p-3 rounded-lg text-sm mt-1">
                  {selectedReport.reason || "No reason provided"}
                </div>
              </div>
            </div>

            <div className="modal-action">
              <button
                className="btn btn-ghost"
                onClick={() => setSelectedReport(null)}
              >
                Close
              </button>
              <button
                className="btn btn-error"
                onClick={() => handleDeleteArt(selectedReport.artId)}
              >
                Delete Art
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setSelectedReport(null)}>close</button>
          </form>
        </dialog>
      )}
    </div>
  );
};

// Helper component for empty state icon
function CheckCircle(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

export default ReportedArts;
