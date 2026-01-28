'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar,
  MapPin,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
  AlertTriangle,
  ExternalLink,
  Trophy
} from 'lucide-react';
import { Button, Breadcrumb, Badge } from '@/components/ui';
import { FormField, TextAreaField, SelectField } from '@/components/forms';
import { fakultasList } from '@/lib/constants';

interface LombaData {
  id: number;
  nama_lomba: string;
  slug: string;
  penyelenggara: string;
  deadline: string;
  tanggal_pelaksanaan: string;
  lokasi: string;
  status: string;
  link_pendaftaran: string | null;
  kategori: string;
  tingkat: string;
}

interface FormData {
  nama: string;
  nim: string;
  email: string;
  phone: string;
  fakultas: string;
  prodi: string;
  motivasi: string;
  pengalaman: string;
}

export default function DaftarLombaPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [lomba, setLomba] = useState<LombaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    nim: '',
    email: '',
    phone: '',
    fakultas: '',
    prodi: '',
    motivasi: '',
    pengalaman: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [externalLink, setExternalLink] = useState<string | null>(null);

  // Fetch lomba data
  useEffect(() => {
    async function fetchLomba() {
      try {
        const response = await fetch(
          `/api/lomba?slug=${slug}&fields=id,nama_lomba,slug,penyelenggara,deadline,tanggal_pelaksanaan,lokasi,status,link_pendaftaran,kategori,tingkat`
        );
        const data = await response.json();
        
        if (data.data && data.data.length > 0) {
          setLomba(data.data[0]);
        }
      } catch (error) {
        console.error('Failed to fetch lomba:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLomba();
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nama.trim()) newErrors.nama = 'Nama lengkap wajib diisi';
    if (!formData.nim.trim()) newErrors.nim = 'NIM wajib diisi';
    if (!formData.email.trim()) newErrors.email = 'Email wajib diisi';
    if (!formData.phone.trim()) newErrors.phone = 'No. telepon wajib diisi';
    if (!formData.fakultas) newErrors.fakultas = 'Fakultas wajib dipilih';
    if (!formData.prodi.trim()) newErrors.prodi = 'Program studi wajib diisi';

    // Email validation
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    // NIM validation
    if (formData.nim && !/^\d+$/.test(formData.nim)) {
      newErrors.nim = 'NIM harus berupa angka';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !lomba) return;

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const response = await fetch(`/api/lomba/${lomba.id}/daftar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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

      // Check if there's an external registration link
      if (result.externalLink) {
        setExternalLink(result.externalLink);
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

  // Lomba not found
  if (!lomba) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Lomba Tidak Ditemukan</h1>
          <p className="text-gray-600 mb-4">Lomba yang Anda cari tidak tersedia.</p>
          <Button onClick={() => router.push('/lomba')}>Kembali ke Lomba</Button>
        </div>
      </div>
    );
  }

  // Check status
  if (lomba.status === 'closed') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-amber-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Pendaftaran Ditutup</h1>
          <p className="text-gray-600 mb-4">
            Pendaftaran untuk <strong>{lomba.nama_lomba}</strong> sudah ditutup.
          </p>
          <Button onClick={() => router.push(`/lomba/${slug}`)}>
            Lihat Detail Lomba
          </Button>
        </div>
      </div>
    );
  }

  // Check deadline
  const isDeadlinePassed = lomba.deadline 
    ? new Date() > new Date(lomba.deadline)
    : false;

  if (isDeadlinePassed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <Clock className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Deadline Terlewat</h1>
          <p className="text-gray-600 mb-4">
            Deadline pendaftaran untuk <strong>{lomba.nama_lomba}</strong> sudah lewat.
          </p>
          <Button onClick={() => router.push(`/lomba/${slug}`)}>
            Lihat Detail Lomba
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
              Anda telah terdaftar untuk <strong>{lomba.nama_lomba}</strong>.
              {externalLink 
                ? ' Silakan lanjutkan pendaftaran di website penyelenggara.'
                : ' Kami akan menghubungi Anda untuk informasi lebih lanjut.'
              }
            </p>
            
            <div className="bg-primary/5 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">
                📅 Deadline lomba ini telah ditambahkan ke kalender Anda
              </p>
              <Link 
                href="/kalender" 
                className="text-primary hover:text-primary-600 text-sm font-medium"
              >
                Lihat Kalender →
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {externalLink && (
                <Button 
                  onClick={() => window.open(externalLink, '_blank')}
                  leftIcon={<ExternalLink className="w-4 h-4" />}
                >
                  Daftar di Website Penyelenggara
                </Button>
              )}
              <Button 
                variant={externalLink ? 'outline' : 'primary'}
                onClick={() => router.push(`/lomba/${slug}`)}
              >
                Lihat Detail Lomba
              </Button>
              <Button variant="ghost" onClick={() => router.push('/lomba')}>
                Lihat Lomba Lainnya
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
              { label: 'Lomba', href: '/lomba' },
              { label: lomba.nama_lomba, href: `/lomba/${slug}` },
              { label: 'Daftar' },
            ]}
          />
          <div className="mt-4 flex items-center gap-4">
            <Link
              href={`/lomba/${slug}`}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="open">Pendaftaran Dibuka</Badge>
                <Badge variant={lomba.tingkat === 'internasional' ? 'internasional' : 'nasional'}>
                  {lomba.tingkat}
                </Badge>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Daftar {lomba.nama_lomba}
              </h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Deadline: {new Date(lomba.deadline).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {lomba.lokasi || 'Online'}
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

        {lomba.link_pendaftaran && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-3">
              <ExternalLink className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-900 font-medium text-sm mb-1">
                  Lomba ini juga memiliki pendaftaran resmi di website penyelenggara
                </p>
                <p className="text-blue-700 text-sm">
                  Setelah mengisi form ini, Anda akan diarahkan untuk menyelesaikan pendaftaran di website penyelenggara.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Data Pribadi */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <h2 className="font-semibold text-gray-900">Data Pribadi</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <FormField
                  label="Nama Lengkap"
                  value={formData.nama}
                  onChange={(e) => handleChange('nama', e.target.value)}
                  placeholder="Nama lengkap sesuai KTM"
                  required
                  error={errors.nama}
                />
              </div>
              <FormField
                label="NIM"
                value={formData.nim}
                onChange={(e) => handleChange('nim', e.target.value)}
                placeholder="1234567890"
                required
                error={errors.nim}
              />
              <FormField
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="email@student.polinema.ac.id"
                required
                error={errors.email}
              />
              <FormField
                label="No. Telepon / WhatsApp"
                value={formData.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="08123456789"
                required
                error={errors.phone}
              />
              <SelectField
                label="Fakultas / Jurusan"
                value={formData.fakultas}
                onChange={(e) => handleChange('fakultas', e.target.value)}
                required
                error={errors.fakultas}
                placeholder="Pilih fakultas..."
                options={fakultasList.map((f) => ({ value: f.name, label: f.name }))}
              />
              <FormField
                label="Program Studi"
                value={formData.prodi}
                onChange={(e) => handleChange('prodi', e.target.value)}
                placeholder="S1 Teknik Informatika"
                required
                error={errors.prodi}
              />
            </div>
          </div>

          {/* Section 2: Informasi Tambahan */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <h2 className="font-semibold text-gray-900 mb-4">Informasi Tambahan</h2>
            <div className="space-y-4">
              <TextAreaField
                label="Motivasi Mengikuti Lomba"
                value={formData.motivasi}
                onChange={(e) => handleChange('motivasi', e.target.value)}
                placeholder="Ceritakan alasan Anda ingin mengikuti lomba ini..."
                hint="Opsional. Maksimal 500 karakter"
              />
              <TextAreaField
                label="Pengalaman Lomba Sebelumnya"
                value={formData.pengalaman}
                onChange={(e) => handleChange('pengalaman', e.target.value)}
                placeholder="Ceritakan pengalaman lomba yang pernah diikuti..."
                hint="Opsional"
              />
            </div>
          </div>

          {/* Submit */}
          <div className="bg-white rounded-xl shadow-card p-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <p className="text-sm text-gray-600">
                Dengan mendaftar, Anda menyetujui bahwa data yang diberikan adalah benar.
              </p>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/lomba/${slug}`)}
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  leftIcon={isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
                >
                  {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
