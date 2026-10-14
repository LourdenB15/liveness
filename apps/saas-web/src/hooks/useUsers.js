import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";

export function useUsers() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState("enrolledAt");
  const [sortOrder, setSortOrder] = useState("desc");

  const [isDeletingUser, setIsDeletingUser] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.users.list();
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setConfirmInput("");
    setDeleteError("");
  };

  const confirmDelete = async (e) => {
    e.preventDefault();
    if (!deleteTarget || confirmInput !== deleteTarget.name) return;
    setIsDeletingUser(true);
    setDeleteError("");
    try {
      await api.users.delete(deleteTarget.id);
      closeDeleteModal();
      fetchUsers();
    } catch (err) {
      console.error("Failed to delete user", err);
      setDeleteError(err.message || "Failed to delete identity profile");
    } finally {
      setIsDeletingUser(false);
    }
  };

  const handleSearchChange = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const handleSortToggle = (field) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
    setCurrentPage(1);
  };

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(term) ||
      user.id.toString().toLowerCase().includes(term) ||
      (user.apiKeyName && user.apiKeyName.toLowerCase().includes(term)) ||
      (user.apiKeyMasked && user.apiKeyMasked.toLowerCase().includes(term))
    );
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;
    if (sortField === "name") {
      comparison = a.name.localeCompare(b.name, undefined, {
        sensitivity: "base",
      });
    } else if (sortField === "apiKey") {
      const keyA = a.apiKeyName || "";
      const keyB = b.apiKeyName || "";
      comparison = keyA.localeCompare(keyB, undefined, { sensitivity: "base" });
    } else if (sortField === "enrolledAt") {
      const dateA = new Date(a.enrolledAt).getTime() || 0;
      const dateB = new Date(b.enrolledAt).getTime() || 0;
      comparison = dateA - dateB;
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const totalFiltered = sortedUsers.length;
  const isAll = pageSize === "all";
  const effectivePageSize = isAll ? Math.max(totalFiltered, 1) : pageSize;
  const totalPages = isAll
    ? 1
    : Math.max(1, Math.ceil(totalFiltered / effectivePageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedUsers = isAll
    ? sortedUsers
    : sortedUsers.slice(
        (safeCurrentPage - 1) * effectivePageSize,
        safeCurrentPage * effectivePageSize,
      );

  return {
    loading,
    users,
    filteredUsers,
    sortedUsers,
    paginatedUsers,
    searchTerm,
    deleteTarget,
    setDeleteTarget,
    confirmInput,
    setConfirmInput,
    pageSize,
    currentPage,
    setCurrentPage,
    sortField,
    sortOrder,
    totalFiltered,
    isAll,
    totalPages,
    safeCurrentPage,
    closeDeleteModal,
    confirmDelete,
    isDeletingUser,
    deleteError,
    handleSearchChange,
    handlePageSizeChange,
    handleSortToggle,
  };
}
