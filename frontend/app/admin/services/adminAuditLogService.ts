import { adminFetch } from "../lib/adminFetch";

export const adminAuditLogService = {
  getAuditLogs: async (page: number = 1) => {
    const res = await adminFetch(`/audit-logs?page=${page}&limit=50`);
    return res;
  }
};
