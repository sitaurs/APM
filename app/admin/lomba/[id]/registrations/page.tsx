'use client';

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  Mail,
  Phone,
  Eye,
  RefreshCw,
  Building2,
  GraduationCap
} from 'lucide-react';

interface Registration {
  id: number;
  nama_lengkap: string;
  nim: string;
  email: string;
  phone: string;
  fakultas: string;
  jurusan: string;
  status: 'pending' | 'approved' | 'rejected';
  motivasi: string;
  date_created: string;
}

interface Lomba {
  id: number;
  nama_lomba: string;
  slug: string;
  deadline: string;
}

interface Meta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function LombaRegistrationsPage() {
  const params = useParams();
  const lombaId = params.id as string;

  const [lomba, setLomba] = useState<Lomba | null>(null);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [meta, setMeta] = useState<Meta>({ page: 1, limit: 20, total: 0, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<Registration | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', meta.page.toString());
      params.set('limit', meta.limit.toString());
      if (statusFilter !== 'all') params.set('status', statusFilter);

      const res = await fetch(`/api/admin/lomba/${lombaId}/registrations?${params.toString()}`);
      const data = await res.json();

      if (res.ok && data.success) {
        setLomba(data.lomba);
        setRegistrations(data.data);
        setMeta(data.meta);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [lombaId, meta.page, meta.limit, statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleBatchUpdate = async (status: 'approved' | 'rejected') => {
    if (selectedIds.length === 0) return;

    try {
      const res = await fetch(`/api/admin/lomba/${lombaId}/registrations`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationIds: selectedIds, status }),
      });

      if (res.ok) {
        setSelectedIds([]);
        fetchData();
      }
    } catch (error) {
      console.error('Error updating:', error);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === registrations.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(registrations.map((r) => r.id));
    }
  };

  const handleSelect = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string; icon: typeof CheckCircle2 }> = {
      pending: { bg: 'bg-amber-100', text: 'text-amber-800', icon: Clock },
      approved: { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', icon: XCircle },
    };
    const style = styles[status] || styles.pending;
    const Icon = style.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        <Icon size={12} />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const stats = {
    total: meta.total,
    pending: registrations.filter((r) => r.status === 'pending').length,
    approved: registrations.filter((r) => r.status === 'approved').length,
    rejected: registrations.filter((r) => r.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/lomba"
          className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-slate-800">
            Pendaftar Lomba
          </h1>
          {lomba && (
            <p className="text-slate-500 mt-1">{lomba.nama_lomba}</p>
          )}
        </div>
        <button
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
        >
          <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Pendaftar', value: stats.total, icon: Users, color: 'blue' },
          { label: 'Pending', value: stats.pending, icon: Clock, color: 'amber' },
          { label: 'Approved', value: stats.approved, icon: CheckCircle2, color: 'green' },
          { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'red' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl p-4 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 bg-${stat.color}-100 rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 text-${stat.color}-600`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-800">{stat.value}</p>
                <p className="text-sm text-slate-500">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
            <button
              key={status}
              onClick={() => {
                setStatusFilter(status);
                setMeta((prev) => ({ ...prev, page: 1 }));
              }}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${statusFilter === status
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }
              `}
            >
              {status === 'all' ? 'Semua' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        {selectedIds.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-600">{selectedIds.length} dipilih</span>
            <button
              onClick={() => handleBatchUpdate('approved')}
              className="px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-lg hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleBatchUpdate('rejected')}
              className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700"
            >
              Reject
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : registrations.length === 0 ? (
          <div className="text-center py-20">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 mb-2">Belum ada pendaftar</h3>
            <p className="text-slate-500">Belum ada mahasiswa yang mendaftar untuk lomba ini.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-left">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === registrations.length}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Pendaftar
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Jurusan
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-medium text-slate-500 uppercase">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {registrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(reg.id)}
                          onChange={() => handleSelect(reg.id)}
                          className="rounded border-slate-300"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="font-medium text-slate-800">{reg.nama_lengkap}</p>
                          <p className="text-sm text-slate-500">{reg.nim}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <p className="text-sm text-slate-800">{reg.fakultas}</p>
                          <p className="text-xs text-slate-500">{reg.jurusan}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">{getStatusBadge(reg.status)}</td>
                      <td className="px-4 py-3 text-sm text-slate-500">
                        {formatDate(reg.date_created)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => setSelectedDetail(reg)}
                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                            title="Lihat Detail"
                          >
                            <Eye size={16} />
                          </button>
                          <a
                            href={`mailto:${reg.email}`}
                            className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg"
                            title="Email"
                          >
                            <Mail size={16} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
                <span className="text-sm text-slate-600">
                  {(meta.page - 1) * meta.limit + 1} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setMeta((prev) => ({ ...prev, page: prev.page - 1 }))}
                    disabled={meta.page <= 1}
                    className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <span className="text-sm">{meta.page} / {meta.totalPages}</span>
                  <button
                    onClick={() => setMeta((prev) => ({ ...prev, page: prev.page + 1 }))}
                    disabled={meta.page >= meta.totalPages}
                    className="p-2 rounded-lg hover:bg-slate-100 disabled:opacity-50"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedDetail(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full mx-4 max-h-[80vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Detail Pendaftar</h3>
              <button
                onClick={() => setSelectedDetail(null)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users className="w-7 h-7 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-lg text-slate-900">{selectedDetail.nama_lengkap}</h4>
                  <p className="text-slate-500">{selectedDetail.nim}</p>
                </div>
                <div className="ml-auto">{getStatusBadge(selectedDetail.status)}</div>
              </div>

              <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-200">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600">{selectedDetail.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600">{selectedDetail.phone || '-'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600">{selectedDetail.fakultas}</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-600">{selectedDetail.jurusan}</span>
                </div>
              </div>

              <div>
                <h5 className="font-medium text-slate-800 mb-2">Motivasi</h5>
                <p className="text-sm text-slate-600 bg-slate-50 rounded-lg p-4">
                  {selectedDetail.motivasi || 'Tidak ada motivasi yang diisi.'}
                </p>
              </div>

              <div className="text-xs text-slate-400">
                Mendaftar pada: {formatDate(selectedDetail.date_created)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
