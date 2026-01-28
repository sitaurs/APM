'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Users, 
  Calendar,
  MapPin,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Plus,
  Trash2,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Button, Breadcrumb, Badge } from '@/components/ui';
import { FormField, TextAreaField } from '@/components/forms';

interface ExpoData {
  id: number;
  nama_event: string;
  slug: string;
  tema: string;
  tanggal_mulai: string;
  tanggal_selesai: string;
  lokasi: string;
  registration_open: boolean;
  registration_deadline: string | null;
  max_participants: number | null;
}

interface Anggota {
  nama: string;
  nim: string;
}

interface FormData {
  nama_project: string;
  deskripsi_project: string;
  link_demo: string;
  ketua_nama: string;
  ketua_nim: string;
  ketua_email: string;
  ketua_phone: string;
}

export default function DaftarExpoPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [expo, setExpo] = useState<ExpoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    nama_project: '',
    deskripsi_project: '',
    link_demo: '',
    ketua_nama: '',
    ketua_nim: '',
    ketua_email: '',
    ketua_phone: '',
  });
  const [anggota, setAnggota] = useState<Anggota[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch expo data
  useEffect(() => {
    async function fetchExpo() {
      try {
        const response = await fetch(
          `/api/expo?slug=${slug}&fields=id,nama_event,slug,tema,tanggal_mulai,tanggal_selesai,lokasi,registration_open,registration_deadline,max_participants`
        );
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          setExpo(data.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch expo:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchExpo();
  }, [slug]);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const addAnggota = () => {
    if (anggota.length < 3) {
      setAnggota([...anggota, { nama: '', nim: '' }]);
    }
  };

  const removeAnggota = (index: number) => {
    setAnggota(anggota.filter((_, i) => i !== index));
  };

  const updateAnggota = (index: number, field: keyof Anggota, value: string) => {
    const updated = anggota.map((a, i) => 
      i === index ? { ...a, [field]: value } : a
    );
    setAnggota(updated);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama_project.trim()) newErrors.nama_project = 'Nama project wajib diisi';
    if (!formData.ketua_nama.trim()) newErrors.ketua_nama = 'Nama ketua wajib diisi';
    if (!formData.ketua_nim.trim()) newErrors.ketua_nim = 'NIM ketua wajib diisi';
    if (!formData.ketua_email.trim()) newErrors.ketua_email = 'Email wajib diisi';
    if (!formData.ketua_phone.trim()) newErrors.ketua_phone = 'No. telepon wajib diisi';

    if (formData.ketua_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ketua_email)) {
      newErrors.ketua_email = 'Format email tidak valid';
    }

    if (formData.ketua_nim && !/^\d+$/.test(formData.ketua_nim)) {
      newErrors.ketua_nim = 'NIM harus berupa angka';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !expo) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const submitData = {
        ...formData,
        anggota_1_nama: anggota[0]?.nama || null,
        anggota_1_nim: anggota[0]?.nim || null,
        anggota_2_nama: anggota[1]?.nama || null,
        anggota_2_nim: anggota[1]?.nim || null,
        anggota_3_nama: anggota[2]?.nama || null,
        anggota_3_nim: anggota[2]?.nim || null,
      };

      const response = await fetch(`/api/expo/${expo.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
        } else {
          setErrorMessage(result.error || 'Gagal mendaftar');
        }
        setSubmitStatus('error');
        return;
      }

      setSubmitStatus('success');
    } catch (error) {
      console.error('Submit error:', error);
      setErrorMessage('Terjadi kesalahan. Silakan coba lagi.');
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // Expo not found
  if (!expo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Expo Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-4">Expo yang Anda cari tidak tersedia.</p>
          <Button onClick={() => router.push('/expo')}>Kembali ke Expo</Button>
        </div>
      </div>
    );
  }

  // Registration closed
  if (!expo.registration_open) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Pendaftaran Belum Dibuka</h1>
          <p className="text-gray-600 mb-4">
            Pendaftaran untuk <strong>{expo.nama_event}</strong> belum dibuka. 
            Silakan cek kembali nanti.
          </p>
          <Button onClick={() => router.push(`/expo/${slug}`)}>
            Lihat Detail Expo
          </Button>
        </div>
      </div>
    );
  }

  // Check deadline
  const isDeadlinePassed = expo.registration_deadline 
    ? new Date() > new Date(expo.registration_deadline)
    : false;

  if (isDeadlinePassed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Clock className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Pendaftaran Ditutup</h1>
          <p className="text-gray-600 mb-4">
            Pendaftaran untuk <strong>{expo.nama_event}</strong> sudah ditutup.
          </p>
          <Button onClick={() => router.push(`/expo/${slug}`)}>
            Lihat Detail Expo
          </Button>
        </div>
      </div>
    );
  }

  // Success state
  if (submitStatus === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="container-apm max-w-2xl">
          <div className="bg-white rounded-2xl shadow-card p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Pendaftaran Berhasil!
            </h1>
            <p className="text-gray-600 mb-6">
              Tim Anda telah terdaftar untuk <strong>{expo.nama_event}</strong>.
              Kami akan menghubungi Anda melalui email untuk konfirmasi lebih lanjut.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => router.push(`/expo/${slug}`)}>
                Lihat Detail Expo
              </Button>
              <Button variant="outline" onClick={() => router.push('/expo')}>
                Lihat Expo Lainnya
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="container-apm py-6">
          <Breadcrumb
            items={[
              { label: 'Beranda', href: '/' },
              { label: 'Expo', href: '/expo' },
              { label: expo.nama_event, href: `/expo/${slug}` },
              { label: 'Daftar' },
            ]}
          />
          <div className="mt-4 flex items-center gap-4">
            <Link
              href={`/expo/${slug}`}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="primary">Pendaftaran Dibuka</Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Daftar {expo.nama_event}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {new Date(expo.tanggal_mulai).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {expo.lokasi}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="container-apm py-8 max-w-3xl">
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-red-700 text-sm">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Project Info */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Informasi Project</h2>
            <div className="space-y-4">
              <FormField
                label="Nama Project / Karya"
                value={formData.nama_project}
                onChange={(e) => handleChange('nama_project', e.target.value)}
                placeholder="Smart Home Automation System"
                required
                error={errors.nama_project}
              />
              <TextAreaField
                label="Deskripsi Singkat"
                value={formData.deskripsi_project}
                onChange={(e) => handleChange('deskripsi_project', e.target.value)}
                placeholder="Jelaskan secara singkat tentang project Anda..."
                hint="Opsional. Maksimal 500 karakter"
              />
              <FormField
                label="Link Demo / Video"
                value={formData.link_demo}
                onChange={(e) => handleChange('link_demo', e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
                hint="Opsional. Link YouTube, Google Drive, atau lainnya"
              />
            </div>
          </div>

          {/* Section 2: Ketua Tim */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Data Ketua Tim</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Nama Lengkap"
                value={formData.ketua_nama}
                onChange={(e) => handleChange('ketua_nama', e.target.value)}
                placeholder="Nama lengkap"
                required
                error={errors.ketua_nama}
              />
              <FormField
                label="NIM"
                value={formData.ketua_nim}
                onChange={(e) => handleChange('ketua_nim', e.target.value)}
                placeholder="1234567890"
                required
                error={errors.ketua_nim}
              />
              <FormField
                label="Email"
                type="email"
                value={formData.ketua_email}
                onChange={(e) => handleChange('ketua_email', e.target.value)}
                placeholder="email@student.ac.id"
                required
                error={errors.ketua_email}
              />
              <FormField
                label="No. Telepon / WhatsApp"
                value={formData.ketua_phone}
                onChange={(e) => handleChange('ketua_phone', e.target.value)}
                placeholder="08123456789"
                required
                error={errors.ketua_phone}
              />
            </div>
          </div>

          {/* Section 3: Anggota */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="font-semibold text-gray-900">Anggota Tim</h2>
                <p className="text-sm text-gray-500">Maksimal 3 anggota (opsional)</p>
              </div>
              <span className="text-sm text-gray-500">{anggota.length}/3</span>
            </div>

            {anggota.length > 0 && (
              <div className="space-y-4 mb-4">
                {anggota.map((a, index) => (
                  <div
                    key={index}
                    className="relative p-4 border rounded-lg bg-gray-50"
                  >
                    <div className="absolute -top-2 left-3 px-2 py-0.5 bg-white border rounded text-xs font-medium text-gray-600">
                      Anggota {index + 1}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAnggota(index)}
                      className="absolute -top-2 right-3 p-1 bg-white border rounded hover:bg-red-50 hover:border-red-200 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-red-500" />
                    </button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                      <FormField
                        label="Nama Lengkap"
                        value={a.nama}
                        onChange={(e) => updateAnggota(index, 'nama', e.target.value)}
                        placeholder="Nama lengkap"
                      />
                      <FormField
                        label="NIM"
                        value={a.nim}
                        onChange={(e) => updateAnggota(index, 'nim', e.target.value)}
                        placeholder="1234567890"
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {anggota.length < 3 && (
              <Button
                type="button"
                variant="outline"
                onClick={addAnggota}
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Anggota
              </Button>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Mendaftar...
                </>
              ) : (
                'Daftar Sekarang'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
