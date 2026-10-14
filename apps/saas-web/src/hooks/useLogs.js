import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

export function useLogs() {
  const [loading, setLoading] = useState(true);
  const [logs, setLogs] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [selectedLog, setSelectedLog] = useState(null);
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const filterOptions = [
    { id: "ALL", label: "All Statuses", color: "bg-slate-400" },
    { id: "SUCCESS", label: "Passed Verification", color: "bg-emerald-500" },
    { id: "ENROLLED", label: "Enrolled Identities", color: "bg-purple-500" },
    { id: "FAILURE", label: "Failed / Blocked", color: "bg-rose-500" },
  ];

  const selectedOption =
    filterOptions.find((o) => o.id === statusFilter) || filterOptions[0];

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.logs.list();
      setLogs(data);
    } catch (err) {
      console.error("Failed to fetch logs", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
    setStatusDropdownOpen(false);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      (log.userName || "").toLowerCase().includes(term) ||
      (log.apiKeyName || "").toLowerCase().includes(term) ||
      (log.apiKeyMasked || "").toLowerCase().includes(term);
    const matchesStatus = statusFilter === "ALL" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalFiltered = filteredLogs.length;
  const isAll = pageSize === "all";
  const effectivePageSize = isAll ? Math.max(totalFiltered, 1) : pageSize;
  const totalPages = isAll
    ? 1
    : Math.max(1, Math.ceil(totalFiltered / effectivePageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedLogs = isAll
    ? filteredLogs
    : filteredLogs.slice(
        (safeCurrentPage - 1) * effectivePageSize,
        safeCurrentPage * effectivePageSize,
      );

  const totalCount = logs.length;
  const successCount = logs.filter(
    (l) => l.status === "SUCCESS" || l.status === "ENROLLED",
  ).length;
  const passRate = totalCount
    ? ((successCount / totalCount) * 100).toFixed(1)
    : 0;
  const avgScore = totalCount
    ? (
        (logs.reduce((acc, l) => acc + (l.score || 0), 0) / totalCount) *
        100
      ).toFixed(1)
    : 0;

  return {
    loading,
    logs,
    filteredLogs,
    paginatedLogs,
    searchTerm,
    statusFilter,
    selectedLog,
    setSelectedLog,
    statusDropdownOpen,
    setStatusDropdownOpen,
    pageSize,
    currentPage,
    setCurrentPage,
    totalFiltered,
    isAll,
    totalPages,
    safeCurrentPage,
    totalCount,
    passRate,
    avgScore,
    filterOptions,
    selectedOption,
    handleSearchChange,
    handleStatusFilterChange,
    handlePageSizeChange,
  };
}
