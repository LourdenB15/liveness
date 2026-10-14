import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api";
import { apiKeySchema } from "../utils/validation";

export function useApiKeys() {
  const [loading, setLoading] = useState(true);
  const [keys, setKeys] = useState([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingKey, setIsDeletingKey] = useState(false);
  const [isRevokingKey, setIsRevokingKey] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [showKeyModal, setShowKeyModal] = useState(null);
  const [revokeTarget, setRevokeTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmInput, setConfirmInput] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchKeys = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.apiKeys.list();
      setKeys(data);
    } catch (err) {
      console.error("Failed to fetch keys", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const closeCreateModal = () => {
    setIsCreating(false);
    setIsSubmitting(false);
    setNewKeyName("");
    setError("");
  };

  const closeRevokeModal = () => {
    setRevokeTarget(null);
    setIsRevokingKey(false);
    setConfirmInput("");
  };

  const closeDeleteModal = () => {
    setDeleteTarget(null);
    setIsDeletingKey(false);
    setConfirmInput("");
  };

  const handleCreateKey = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");

    const validation = apiKeySchema.safeParse({ name: newKeyName });
    if (!validation.success) {
      return setError(validation.error.issues[0].message);
    }

    setIsSubmitting(true);
    try {
      const createdKey = await api.apiKeys.create(newKeyName);
      closeCreateModal();
      setShowKeyModal(createdKey);
      fetchKeys();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmRevokeKey = async (e) => {
    e.preventDefault();
    if (!revokeTarget || confirmInput !== revokeTarget.name || isRevokingKey)
      return;
    setIsRevokingKey(true);
    try {
      await api.apiKeys.revoke(revokeTarget.id);
      closeRevokeModal();
      fetchKeys();
    } catch (err) {
      console.error("Failed to revoke key", err);
    } finally {
      setIsRevokingKey(false);
    }
  };

  const confirmDeleteKey = async (e) => {
    e.preventDefault();
    if (!deleteTarget || confirmInput !== deleteTarget.name || isDeletingKey)
      return;
    setIsDeletingKey(true);
    try {
      await api.apiKeys.delete(deleteTarget.id);
      closeDeleteModal();
      fetchKeys();
    } catch (err) {
      console.error("Failed to delete key", err);
    } finally {
      setIsDeletingKey(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1);
  };

  const totalKeys = keys.length;
  const isAll = pageSize === "all";
  const effectivePageSize = isAll ? Math.max(totalKeys, 1) : pageSize;
  const totalPages = isAll
    ? 1
    : Math.max(1, Math.ceil(totalKeys / effectivePageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedKeys = isAll
    ? keys
    : keys.slice(
        (safeCurrentPage - 1) * effectivePageSize,
        safeCurrentPage * effectivePageSize,
      );

  return {
    loading,
    keys,
    paginatedKeys,
    newKeyName,
    setNewKeyName,
    isCreating,
    setIsCreating,
    isSubmitting,
    isDeletingKey,
    isRevokingKey,
    error,
    copiedId,
    showKeyModal,
    setShowKeyModal,
    revokeTarget,
    setRevokeTarget,
    deleteTarget,
    setDeleteTarget,
    confirmInput,
    setConfirmInput,
    pageSize,
    currentPage,
    setCurrentPage,
    totalKeys,
    isAll,
    totalPages,
    safeCurrentPage,
    closeCreateModal,
    closeRevokeModal,
    closeDeleteModal,
    handleCreateKey,
    confirmRevokeKey,
    confirmDeleteKey,
    copyToClipboard,
    handlePageSizeChange,
  };
}
