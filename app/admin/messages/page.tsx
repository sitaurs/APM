'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Mail, 
  MailOpen, 
  Search, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  User,
  Phone,
  Eye,
  X,
  MessageSquare,
  RefreshCw
} from 'lucide-react';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface Message {
  id: number;
  nama: string;
  email: string;
  phone: string | null;
  subjek: string;
  pesan: string;
  status: 'unread' | 'read';
  date_created: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Message | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', pagination.page.toString());
      params.set('limit', pagination.limit.toString());
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/kontak?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setMessages(data.data);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, statusFilter]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleMarkAsRead = async (message: Message) => {
    if (message.status === 'read') return;

    try {
      const res = await fetch(`/api/kontak/${message.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'read' }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === message.id ? { ...m, status: 'read' } : m))
        );
        if (selectedMessage?.id === message.id) {
          setSelectedMessage({ ...selectedMessage, status: 'read' });
        }
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      const res = await fetch(`/api/kontak/${deleteTarget.id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== deleteTarget.id));
        if (selectedMessage?.id === deleteTarget.id) {
          setSelectedMessage(null);
        }
        setDeleteTarget(null);
      }
    } catch (error) {
      console.error('Error deleting message:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const openMessage = (message: Message) => {
    setSelectedMessage(message);
    if (message.status === 'unread') {
      handleMarkAsRead(message);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = diffHours / 24;

    if (diffHours < 1) {
      return 'Baru saja';
    } else if (diffHours < 24) {
      return `${Math.floor(diffHours)} jam lalu`;
    } else if (diffDays < 7) {
      return `${Math.floor(diffDays)} hari lalu`;
    }
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const unreadCount = messages.filter((m) => m.status === 'unread').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Pesan Masuk</h1>
          <p className="text-slate-500 mt-1">
            Kelola pesan dari halaman kontak
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {unreadCount} belum dibaca
              </span>
            )}
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Cari pesan..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          {(['all', 'unread', 'read'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setPagination((prev) => ({ ...prev, page: 1 }));
              }}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }
              `}
            >
              {status === 'all' && 'Semua'}
              {status === 'unread' && 'Belum Dibaca'}
              {status === 'read' && 'Sudah Dibaca'}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-20">
            <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">Tidak ada pesan</h3>
            <p className="text-slate-500">Belum ada pesan masuk dari halaman kontak.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {messages.map((message) => (
              <div
                key={message.id}
                onClick={() => openMessage(message)}
                className={`
                  flex items-start gap-4 p-4 cursor-pointer transition-colors
                  ${message.status === 'unread' 
                    ? 'bg-blue-50/50 hover:bg-blue-50' 
                    : 'hover:bg-slate-50'
                  }
                `}
              >
                {/* Icon */}
                <div className={`
                  w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0
                  ${message.status === 'unread' ? 'bg-blue-100' : 'bg-slate-100'}
                `}>
                  {message.status === 'unread' ? (
                    <Mail className="w-5 h-5 text-blue-600" />
                  ) : (
                    <MailOpen className="w-5 h-5 text-slate-400" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`font-medium ${message.status === 'unread' ? 'text-slate-900' : 'text-slate-600'}`}>
                      {message.nama}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-sm text-slate-500">{message.email}</span>
                  </div>
                  <p className={`text-sm font-medium mb-1 ${message.status === 'unread' ? 'text-slate-800' : 'text-slate-600'}`}>
                    {message.subjek}
                  </p>
                  <p className="text-sm text-slate-500 line-clamp-1">{message.pesan}</p>
                </div>

                {/* Date & Actions */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs text-slate-400">{formatDate(message.date_created)}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteTarget(message);
                    }}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <span className="text-sm text-slate-600">
              Menampilkan {(pagination.page - 1) * pagination.limit + 1} -{' '}
              {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} pesan
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page <= 1}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-slate-600">
                {pagination.page} / {pagination.totalPages}
              </span>
              <button
                onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page >= pagination.totalPages}
                className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedMessage(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{selectedMessage.subjek}</h3>
              <button
                onClick={() => setSelectedMessage(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Sender Info */}
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{selectedMessage.nama}</p>
                    <p className="text-sm text-slate-500">{selectedMessage.email}</p>
                  </div>
                </div>
                {selectedMessage.phone && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Phone size={16} />
                    <span>{selectedMessage.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Clock size={16} />
                  <span>
                    {new Date(selectedMessage.date_created).toLocaleDateString('id-ID', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Message Content */}
              <div className="bg-slate-50 rounded-xl p-4">
                <p className="text-slate-700 whitespace-pre-wrap">{selectedMessage.pesan}</p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subjek}`}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  <Mail size={18} />
                  Balas via Email
                </a>
                <button
                  onClick={() => {
                    setSelectedMessage(null);
                    setDeleteTarget(selectedMessage);
                  }}
                  className="px-4 py-2.5 text-red-600 border border-red-200 rounded-lg font-medium hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Hapus Pesan"
        message={`Yakin ingin menghapus pesan dari "${deleteTarget?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Hapus"
        cancelText="Batal"
        variant="danger"
        loading={isDeleting}
      />
    </div>
  );
}
