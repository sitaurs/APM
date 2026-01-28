'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  Search, 
  Eye,
  CheckCircle,
  XCircle,
  ChevronLeft, 
  ChevronRight,
  Users,
  X
} from 'lucide-react';

interface Registration {
  id: number;
  teamName: string;
  email: string;
  phone: string;
  institution: string;
  status: string;
  reviewerNotes: string;
  dateCreated: string;
  verifiedAt: string;
  expoId: number;
  expoNama: string;
  memberCount: number;
}

interface RegistrationDetail extends Registration {
  expoTanggal: string;
  members: {
    id: number;
    name: string;
    nim: string;
    email: string;
    phone: string;
    role: string;
  }[];
}

interface Expo {
  id: number;
  nama_event: string;
}

interface Meta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export default function AdminRegistrasiPage() {
  const [data, setData] = useState<Registration[]>([]);
  const [meta, setMeta] = useState<Meta>({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [expoId, setExpoId] = useState('');
  const [expoList, setExpoList] = useState<Expo[]>([]);
  
  // Modal state
  const [selectedRegistration, setSelectedRegistration] = useState<RegistrationDetail | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewNotes, setReviewNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch expo list for filter
  useEffect(() => {
    const fetchExpoList = async () => {
      try {
        const res = await fetch('/api/admin/expo');
        const result = await res.json();
        if (res.ok) {
          setExpoList(result.data);
        }
      } catch (error) {
        console.error('Error fetching expo list:', error);
      }
    };
    fetchExpoList();
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', (meta.page).toString());
      params.set('limit', meta.limit.toString());
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (expoId) params.set('expo_id', expoId);

      const res = await fetch(`/api/admin/registrasi?${params.toString()}`);
      const result = await res.json();
      
      if (res.ok) {
        setData(result.data);
        setMeta(result.meta);
      }
    } catch (error) {
      console.error('Error fetching registrations:', error);
    } finally {
      setLoading(false);
    }
  }, [meta.page, meta.limit, search, status, expoId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setMeta(prev => ({ ...prev, page: 1 }));
    fetchData();
  };

  const openReviewModal = async (registration: Registration) => {
    setLoadingDetail(true);
    setShowModal(true);
    
    try {
      const res = await fetch(`/api/admin/registrasi/${registration.id}`);
      const result = await res.json();
      
      if (res.ok) {
        setSelectedRegistration(result.data);
        setReviewNotes(result.data.reviewerNotes || '');
      } else {
        alert(result.error || 'Gagal mengambil detail');
        setShowModal(false);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan');
      setShowModal(false);
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleVerify = async (newStatus: 'verified' | 'rejected') => {
    if (!selectedRegistration) return;
    
    setIsProcessing(true);
    try {
      const res = await fetch(`/api/admin/registrasi/${selectedRegistration.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          reviewer_notes: reviewNotes,
        }),
      });

      if (res.ok) {
        setShowModal(false);
        fetchData();
      } else {
        const error = await res.json();
        alert(error.error || 'Gagal memproses');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan');
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      verified: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
    };
    const labels: Record<string, string> = {
      pending: 'Menunggu',
      verified: 'Terverifikasi',
      rejected: 'Ditolak',
    };
    return { style: styles[status] || 'bg-slate-100 text-slate-800', label: labels[status] || status };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Verifikasi Registrasi</h1>
        <p className="text-slate-600">Kelola dan verifikasi pendaftaran expo</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-200">
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari tim, email, atau telepon..."
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setMeta(prev => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Semua Status</option>
            <option value="pending">Menunggu</option>
            <option value="verified">Terverifikasi</option>
            <option value="rejected">Ditolak</option>
          </select>

          <select
            value={expoId}
            onChange={(e) => {
              setExpoId(e.target.value);
              setMeta(prev => ({ ...prev, page: 1 }));
            }}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Semua Expo</option>
            {expoList.map(expo => (
              <option key={expo.id} value={expo.id}>{expo.nama_event}</option>
            ))}
          </select>

          <button
            type="submit"
            className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Filter
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left py-4 px-4 text-sm font-medium text-slate-600">Tim</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-slate-600">Expo</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-slate-600">Anggota</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-slate-600">Tanggal Daftar</th>
                <th className="text-left py-4 px-4 text-sm font-medium text-slate-600">Status</th>
                <th className="text-center py-4 px-4 text-sm font-medium text-slate-600">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span>Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-500">
                    Tidak ada data registrasi
                  </td>
                </tr>
              ) : (
                data.map((item) => {
                  const statusInfo = getStatusBadge(item.status);
                  return (
                    <tr key={item.id} className="border-t border-slate-100 hover:bg-slate-50">
                      <td className="py-4 px-4">
                        <p className="font-medium text-slate-800">{item.teamName}</p>
                        <p className="text-sm text-slate-500">{item.email}</p>
                        <p className="text-xs text-slate-400">{item.institution}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">{item.expoNama || '-'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-1.5 text-sm text-slate-600">
                          <Users size={14} />
                          <span>{item.memberCount} orang</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-slate-600">{formatDate(item.dateCreated)}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${statusInfo.style}`}>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openReviewModal(item)}
                            className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Review"
                          >
                            <Eye size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200">
            <p className="text-sm text-slate-600">
              Menampilkan {((meta.page - 1) * meta.limit) + 1} - {Math.min(meta.page * meta.limit, meta.total)} dari {meta.total} data
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setMeta(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={meta.page <= 1}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-sm text-slate-600">
                {meta.page} / {meta.totalPages}
              </span>
              <button
                onClick={() => setMeta(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={meta.page >= meta.totalPages}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => !loadingDetail && setShowModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            {loadingDetail ? (
              <div className="flex items-center justify-center py-20">
                <svg className="animate-spin h-8 w-8 text-green-600" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            ) : selectedRegistration && (
              <>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                  <h2 className="text-xl font-bold text-slate-800">Review Registrasi</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Team Info */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-slate-500">Nama Tim</p>
                      <p className="font-medium text-slate-800">{selectedRegistration.teamName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Email</p>
                      <p className="font-medium text-slate-800">{selectedRegistration.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Telepon</p>
                      <p className="font-medium text-slate-800">{selectedRegistration.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Institusi</p>
                      <p className="font-medium text-slate-800">{selectedRegistration.institution}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Expo</p>
                      <p className="font-medium text-slate-800">{selectedRegistration.expoNama}</p>
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Status</p>
                      <span className={`inline-flex px-2.5 py-1 text-xs font-medium rounded-full ${getStatusBadge(selectedRegistration.status).style}`}>
                        {getStatusBadge(selectedRegistration.status).label}
                      </span>
                    </div>
                  </div>

                  {/* Members */}
                  <div>
                    <p className="text-sm font-medium text-slate-600 mb-3">Anggota Tim ({selectedRegistration.members.length})</p>
                    <div className="bg-slate-50 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-slate-200">
                            <th className="text-left py-2 px-3 text-slate-600">Nama</th>
                            <th className="text-left py-2 px-3 text-slate-600">NIM</th>
                            <th className="text-left py-2 px-3 text-slate-600">Email</th>
                            <th className="text-left py-2 px-3 text-slate-600">Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {selectedRegistration.members.map(member => (
                            <tr key={member.id} className="border-b border-slate-100 last:border-0">
                              <td className="py-2 px-3 text-slate-800">{member.name}</td>
                              <td className="py-2 px-3 text-slate-600">{member.nim}</td>
                              <td className="py-2 px-3 text-slate-600">{member.email}</td>
                              <td className="py-2 px-3">
                                <span className={`text-xs px-2 py-0.5 rounded ${
                                  member.role === 'ketua' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                                }`}>
                                  {member.role === 'ketua' ? 'Ketua' : 'Anggota'}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Review Notes */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Catatan Reviewer
                    </label>
                    <textarea
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Tambahkan catatan jika diperlukan..."
                    />
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Tutup
                  </button>
                  <button
                    onClick={() => handleVerify('rejected')}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 transition-colors"
                  >
                    <XCircle size={18} />
                    <span>Tolak</span>
                  </button>
                  <button
                    onClick={() => handleVerify('verified')}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
                  >
                    <CheckCircle size={18} />
                    <span>Verifikasi</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

