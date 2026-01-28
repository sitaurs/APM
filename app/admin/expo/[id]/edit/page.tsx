'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

interface ExpoFormData {
  nama_event: string;
  slug: string;
  tema: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  alamat_lengkap: string;
  deskripsi: string;
  biaya_partisipasi: number;
  benefit: string;
  website_resmi: string;
  is_featured: boolean;
  status: string;
  registration_open: boolean;
  registration_deadline: string;
  max_participants: number;
}

const statusOptions = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
];

export default function EditExpoPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<ExpoFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchExpo = async () => {
      try {
        const res = await fetch(`/api/admin/expo/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Gagal memuat data expo');
        }

        const expo = data.data;
        setFormData({
          nama_event: expo.nama_event || '',
          slug: expo.slug || '',
          tema: expo.tema || '',
          tanggal_mulai: expo.tanggal_mulai?.split('T')[0] || '',
          tanggal_selesai: expo.tanggal_selesai?.split('T')[0] || '',
          lokasi: expo.lokasi || '',
          alamat_lengkap: expo.alamat_lengkap || '',
          deskripsi: expo.deskripsi || '',
          biaya_partisipasi: expo.biaya_partisipasi || 0,
          benefit: expo.benefit || '',
          website_resmi: expo.website_resmi || '',
          is_featured: expo.is_featured || false,
          status: expo.status || 'upcoming',
          registration_open: expo.registration_open || false,
          registration_deadline: expo.registration_deadline?.split('T')[0] || '',
          max_participants: expo.max_participants || 0,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchExpo();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => prev ? ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : 
              type === 'number' ? parseFloat(value) || 0 : value,
    }) : null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) return;

    setError('');
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/expo/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengupdate expo');
      }

      router.push('/admin/expo');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={32} className="animate-spin text-purple-600" />
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Data expo tidak ditemukan'}</p>
        <Link href="/admin/expo" className="text-purple-600 hover:underline mt-4 inline-block">
          Kembali ke daftar expo
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/expo"
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Edit Expo</h1>
          <p className="text-slate-600">{formData.nama_event}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Basic Info */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Informasi Dasar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Event <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_event"
                value={formData.nama_event}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Slug (URL)
              </label>
              <input
                type="text"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tema
              </label>
              <input
                type="text"
                name="tema"
                value={formData.tema}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Date & Location */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Tanggal & Lokasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tanggal Mulai <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_mulai"
                value={formData.tanggal_mulai}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tanggal Selesai
              </label>
              <input
                type="date"
                name="tanggal_selesai"
                value={formData.tanggal_selesai}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Lokasi
              </label>
              <input
                type="text"
                name="lokasi"
                value={formData.lokasi}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Alamat Lengkap
              </label>
              <textarea
                name="alamat_lengkap"
                value={formData.alamat_lengkap}
                onChange={handleChange}
                rows={2}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Registration Settings */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Pengaturan Registrasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="registration_open"
                  checked={formData.registration_open}
                  onChange={handleChange}
                  className="w-5 h-5 text-purple-600 rounded"
                />
                <div>
                  <span className="font-medium text-slate-800">Buka Registrasi</span>
                  <p className="text-sm text-slate-500">Aktifkan untuk membuka pendaftaran peserta</p>
                </div>
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deadline Registrasi
              </label>
              <input
                type="date"
                name="registration_deadline"
                value={formData.registration_deadline}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Maksimal Peserta
              </label>
              <input
                type="number"
                name="max_participants"
                value={formData.max_participants}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Biaya Partisipasi (Rp)
              </label>
              <input
                type="number"
                name="biaya_partisipasi"
                value={formData.biaya_partisipasi}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Website Resmi
              </label>
              <input
                type="url"
                name="website_resmi"
                value={formData.website_resmi}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Deskripsi Expo</h2>
          <RichTextEditor
            content={formData.deskripsi}
            onChange={(content) => setFormData(prev => prev ? { ...prev, deskripsi: content } : null)}
            placeholder="Tulis deskripsi lengkap tentang expo ini..."
          />
        </div>

        {/* Benefit */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Benefit Peserta</h2>
          <textarea
            name="benefit"
            value={formData.benefit}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Options */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Opsi</h2>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="w-5 h-5 text-purple-600 rounded"
            />
            <div>
              <span className="font-medium text-slate-800">Tampilkan di Featured</span>
              <p className="text-sm text-slate-500">Expo akan ditampilkan di halaman utama</p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/expo"
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Update Expo</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
