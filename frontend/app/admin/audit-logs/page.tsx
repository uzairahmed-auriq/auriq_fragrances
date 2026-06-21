"use client";

import { useState, useEffect } from "react";
import { FileText, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { adminAuditLogService } from "../services/adminAuditLogService";

const ACTION_LABELS: Record<string, string> = {
  CREATE_PRODUCT: "Created product",
  UPDATE_PRODUCT: "Updated product",
  DELETE_PRODUCT: "Deleted product",
  CREATE_AD: "Created ad",
  TOGGLE_AD_STATUS: "Toggled ad status",
  DELETE_AD: "Deleted ad",
  UPDATE_ORDER_STATUS: "Updated order status",
  UPDATE_MESSAGE_STATUS: "Updated message status",
  UPDATE_REVIEW_STATUS: "Updated review status",
  UPDATE_DISCOUNT: "Updated discount code",
  UPDATE_SETTING: "Updated site setting",
};

const ACTION_COLORS: Record<string, string> = {
  CREATE_PRODUCT: "text-green-500 bg-green-500/10",
  UPDATE_PRODUCT: "text-blue-400 bg-blue-400/10",
  DELETE_PRODUCT: "text-red-500 bg-red-500/10",
  CREATE_AD: "text-green-500 bg-green-500/10",
  TOGGLE_AD_STATUS: "text-yellow-500 bg-yellow-500/10",
  DELETE_AD: "text-red-500 bg-red-500/10",
  UPDATE_ORDER_STATUS: "text-blue-400 bg-blue-400/10",
  UPDATE_MESSAGE_STATUS: "text-blue-400 bg-blue-400/10",
  UPDATE_REVIEW_STATUS: "text-blue-400 bg-blue-400/10",
  UPDATE_DISCOUNT: "text-yellow-500 bg-yellow-500/10",
  UPDATE_SETTING: "text-foreground/60 bg-foreground/5",
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  const fetchLogs = async (p: number) => {
    try {
      setLoading(true);
      const res = await adminAuditLogService.getAuditLogs(p);
      if (res.success) {
        setLogs(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page);
  }, [page]);

  const getActionLabel = (action: string) => ACTION_LABELS[action] || action;
  const getActionColor = (action: string) => ACTION_COLORS[action] || "text-foreground/60 bg-foreground/5";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-serif font-bold text-foreground tracking-wide mb-2">Audit Logs</h1>
        <p className="text-sm text-foreground/60 font-medium tracking-wide">
          Track all administrative actions, data modifications, and system events for compliance and debugging.
        </p>
      </div>

      <div className="bg-background rounded-xl border border-foreground/10 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[300px]">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="w-8 h-8 animate-spin text-gold" />
            </div>
          ) : logs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-8">
              <FileText className="w-10 h-10 text-foreground/20 mb-4" />
              <p className="text-foreground/50 text-sm">No audit logs yet. Actions taken in the admin panel will appear here.</p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-foreground/10 text-[10px] uppercase tracking-widest text-foreground/50 bg-foreground/[0.02]">
                  <th className="p-4 font-bold">Admin</th>
                  <th className="p-4 font-bold">Action</th>
                  <th className="p-4 font-bold">Entity</th>
                  <th className="p-4 font-bold">Date & Time</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-foreground/5 hover:bg-foreground/[0.02] transition-colors text-sm">
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">{log.admin?.first_name} {log.admin?.last_name}</span>
                        <span className="text-xs text-foreground/50">{log.admin?.email}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getActionColor(log.action)}`}>
                        {getActionLabel(log.action)}
                      </span>
                    </td>
                    <td className="p-4 text-foreground/80 font-medium">
                      {log.entity_type} {log.entity_id ? `#${log.entity_id}` : ''}
                    </td>
                    <td className="p-4 text-foreground/60 text-xs">
                      {new Date(log.created_at).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-foreground/10">
            <span className="text-xs text-foreground/50">
              Page {pagination.page} of {pagination.pages} ({pagination.total} total entries)
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg border border-foreground/10 hover:border-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
                disabled={page === pagination.pages}
                className="p-2 rounded-lg border border-foreground/10 hover:border-gold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
