'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { RichTextEditor } from '@/components/admin/RichTextEditor';

interface LombaFormData {
  nama_lomba: string;
  slug: string;
  kategori: string;
  tingkat: string;
  penyelenggara: string;
  deadline_pendaftaran: string;
  tanggal_pelaksanaan: string;
  lokasi: string;
  deskripsi: string;
  persyaratan: string;
  hadiah: string;
  link_pendaftaran: string;
  cp_nama: string;
  cp_whatsapp: string;
  biaya_pendaftaran: number;
  is_featured: boolean;
  status: string;
}

const kategoriOptions = [
  { value: 'teknologi', label: 'Teknologi' },
  { value: 'bisnis', label: 'Bisnis' },
  { value: 'desain', label: 'Desain' },
  { value: 'sains', label: 'Sains' },
  { value: 'seni', label: 'Seni' },
  { value: 'olahraga', label: 'Olahraga' },
  { value: 'lainnya', label: 'Lainnya' },
];

const tingkatOptions = [
  { value: 'internasional', label: 'Internasional' },
  { value: 'nasional', label: 'Nasional' },
  { value: 'regional', label: 'Regional' },
  { value: 'provinsi', label: 'Provinsi' },
  { value: 'kota', label: 'Kota/Kabupaten' },
  { value: 'kampus', label: 'Kampus' },
];

const statusOptions = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'closed', label: 'Closed' },
];

export default function EditLombaPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [formData, setFormData] = useState<LombaFormData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLomba = async () => {
      try {
        const res = await fetch(`/api/admin/lomba/${id}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Gagal memuat data lomba');
        }

        const lomba = data.data;
        setFormData({
          nama_lomba: lomba.nama_lomba || '',
          slug: lomba.slug || '',
          kategori: lomba.kategori || '',
          tingkat: lomba.tingkat || 'nasional',
          penyelenggara: lomba.penyelenggara || '',
          deadline_pendaftaran: lomba.deadline_pendaftaran?.split('T')[0] || '',
          tanggal_pelaksanaan: lomba.tanggal_pelaksanaan?.split('T')[0] || '',
          lokasi: lomba.lokasi || '',
          deskripsi: lomba.deskripsi || '',
          persyaratan: lomba.persyaratan || '',
          hadiah: lomba.hadiah || '',
          link_pendaftaran: lomba.link_pendaftaran || '',
          cp_nama: lomba.cp_nama || '',
          cp_whatsapp: lomba.cp_whatsapp || '',
          biaya_pendaftaran: lomba.biaya_pendaftaran || 0,
          is_featured: lomba.is_featured || false,
          status: lomba.status || 'upcoming',
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
      } finally {
        setIsLoading(false);
      }
    };

    fetchLomba();
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
      const res = await fetch(`/api/admin/lomba/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mengupdate lomba');
      }

      router.push('/admin/lomba');
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
        <Loader2 size={32} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!formData) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || 'Data lomba tidak ditemukan'}</p>
        <Link href="/admin/lomba" className="text-blue-600 hover:underline mt-4 inline-block">
          Kembali ke daftar lomba
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/lomba"
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Edit Lomba</h1>
          <p className="text-slate-600">{formData.nama_lomba}</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Message */}
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
                Nama Lomba <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nama_lomba"
                value={formData.nama_lomba}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Penyelenggara <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="penyelenggara"
                value={formData.penyelenggara}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kategori <span className="text-red-500">*</span>
              </label>
              <select
                name="kategori"
                value={formData.kategori}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Pilih Kategori</option>
                {kategoriOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tingkat <span className="text-red-500">*</span>
              </label>
              <select
                name="tingkat"
                value={formData.tingkat}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {tingkatOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Date & Location */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Tanggal & Lokasi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Deadline Pendaftaran <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="deadline_pendaftaran"
                value={formData.deadline_pendaftaran}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Tanggal Pelaksanaan <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="tanggal_pelaksanaan"
                value={formData.tanggal_pelaksanaan}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {statusOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Deskripsi Lomba</h2>
          <RichTextEditor
            content={formData.deskripsi}
            onChange={(content) => setFormData(prev => prev ? { ...prev, deskripsi: content } : null)}
            placeholder="Tulis deskripsi lengkap tentang lomba ini..."
          />
        </div>

        {/* Requirements */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Persyaratan</h2>
          <RichTextEditor
            content={formData.persyaratan}
            onChange={(content) => setFormData(prev => prev ? { ...prev, persyaratan: content } : null)}
            placeholder="Tulis persyaratan peserta lomba..."
          />
        </div>

        {/* Prizes */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Hadiah</h2>
          <RichTextEditor
            content={formData.hadiah}
            onChange={(content) => setFormData(prev => prev ? { ...prev, hadiah: content } : null)}
            placeholder="Tulis informasi hadiah lomba..."
          />
        </div>

        {/* Registration & Contact */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Pendaftaran & Kontak</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Link Pendaftaran
              </label>
              <input
                type="url"
                name="link_pendaftaran"
                value={formData.link_pendaftaran}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Biaya Pendaftaran (Rp)
              </label>
              <input
                type="number"
                name="biaya_pendaftaran"
                value={formData.biaya_pendaftaran}
                onChange={handleChange}
                min="0"
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Nama Contact Person
              </label>
              <input
                type="text"
                name="cp_nama"
                value={formData.cp_nama}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                WhatsApp Contact Person
              </label>
              <input
                type="text"
                name="cp_whatsapp"
                value={formData.cp_whatsapp}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
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
              className="w-5 h-5 text-blue-600 rounded"
            />
            <div>
              <span className="font-medium text-slate-800">Tampilkan di Featured</span>
              <p className="text-sm text-slate-500">Lomba akan ditampilkan di halaman utama</p>
            </div>
          </label>
        </div>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Link
            href="/admin/lomba"
            className="px-6 py-2.5 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Batal
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Save size={18} />
                <span>Update Lomba</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
