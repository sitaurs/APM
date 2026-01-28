'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  MessageSquare,
  Building2,
  Globe
} from 'lucide-react';
import { FormField, TextAreaField } from '@/components/forms';
import { Button } from '@/components/ui/Button';

interface FormData {
  nama: string;
  email: string;
  phone: string;
  subjek: string;
  pesan: string;
}

interface FormErrors {
  nama?: string;
  email?: string;
  phone?: string;
  subjek?: string;
  pesan?: string;
}

const kontakInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'apm@polinema.ac.id',
    href: 'mailto:apm@polinema.ac.id',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  {
    icon: Phone,
    label: 'Telepon',
    value: '+62 341 404424 ext. 5010',
    href: 'tel:+623414044245010',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  {
    icon: MapPin,
    label: 'Alamat',
    value: 'Gedung JTI Lt. 5, Politeknik Negeri Malang',
    href: 'https://maps.google.com/?q=Politeknik+Negeri+Malang',
    color: 'text-red-500',
    bgColor: 'bg-red-500/10',
  },
  {
    icon: Clock,
    label: 'Jam Kerja',
    value: 'Senin - Jumat, 08:00 - 16:00 WIB',
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/10',
  },
];

export default function KontakPage() {
  const [formData, setFormData] = useState<FormData>({
    nama: '',
    email: '',
    phone: '',
    subjek: '',
    pesan: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.nama.trim()) newErrors.nama = 'Nama wajib diisi';
    if (!formData.email.trim()) {
      newErrors.email = 'Email wajib diisi';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }
    if (!formData.subjek.trim()) newErrors.subjek = 'Subjek wajib diisi';
    if (!formData.pesan.trim()) {
      newErrors.pesan = 'Pesan wajib diisi';
    } else if (formData.pesan.trim().length < 10) {
      newErrors.pesan = 'Pesan minimal 10 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/kontak', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          throw new Error(data.error || 'Gagal mengirim pesan');
        }
        return;
      }

      setIsSuccess(true);
      setFormData({
        nama: '',
        email: '',
        phone: '',
        subjek: '',
        pesan: '',
      });
    } catch (error) {
      console.error('Submit error:', error);
      setErrors({
        pesan: 'Gagal mengirim pesan. Silakan coba lagi.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-300"
        >
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Pesan Terkirim!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Terima kasih telah menghubungi kami. Tim kami akan segera merespons
            pesan Anda dalam 1-2 hari kerja.
          </p>
          <Button
            variant="primary"
            onClick={() => setIsSuccess(false)}
          >
            Kirim Pesan Lain
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-blue-800/50" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <MessageSquare className="w-5 h-5 text-white" />
              <span className="text-white/90 font-medium">Hubungi Kami</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ada Pertanyaan?
            </h1>
            <p className="text-lg text-white/80">
              Jangan ragu untuk menghubungi kami. Tim APM Polinema siap membantu
              menjawab pertanyaan dan memberikan informasi yang Anda butuhkan.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative -mt-12 z-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {kontakInfo.map((info, index) => (
              <div
                key={info.label}
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {info.href ? (
                  <a
                    href={info.href}
                    target={info.href.startsWith('http') ? '_blank' : undefined}
                    rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="block bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                  >
                    <div className={`w-12 h-12 ${info.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <info.icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {info.label}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {info.value}
                    </p>
                  </a>
                ) : (
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                    <div className={`w-12 h-12 ${info.bgColor} rounded-lg flex items-center justify-center mb-4`}>
                      <info.icon className={`w-6 h-6 ${info.color}`} />
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                      {info.label}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {info.value}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  Kirim Pesan
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6">
                  Isi formulir di bawah ini untuk mengirimkan pesan kepada kami.
                </p>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      label="Nama Lengkap"
                      name="nama"
                      value={formData.nama}
                      onChange={handleChange}
                      placeholder="Masukkan nama lengkap"
                      error={errors.nama}
                      required
                    />
                    <FormField
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="nama@email.com"
                      error={errors.email}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField
                      label="No. Telepon (Opsional)"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="08xxxxxxxxxx"
                    />
                    <FormField
                      label="Subjek"
                      name="subjek"
                      value={formData.subjek}
                      onChange={handleChange}
                      placeholder="Subjek pesan"
                      error={errors.subjek}
                      required
                    />
                  </div>

                  <TextAreaField
                    label="Pesan"
                    name="pesan"
                    value={formData.pesan}
                    onChange={handleChange}
                    placeholder="Tulis pesan Anda di sini..."
                    rows={5}
                    error={errors.pesan}
                    required
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin mr-2">⏳</span>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>
                </form>
              </div>
            </div>

            {/* Map & Additional Info */}
            <div
              className="space-y-6"
            >
              {/* Map */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="aspect-video">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3951.3622611466!2d112.61458531531458!3d-7.945463994257377!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2dd6282a57b2e4e5%3A0x33c7d1fb36a387a9!2sPoliteknik%20Negeri%20Malang!5e0!3m2!1sen!2sid!4v1638000000000!5m2!1sen!2sid"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Lokasi APM Polinema"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    Gedung Jurusan Teknologi Informasi
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    Lantai 5, Politeknik Negeri Malang
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4">
                  Tautan Cepat
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <a
                    href="https://polinema.ac.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Building2 className="w-5 h-5 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      Polinema
                    </span>
                  </a>
                  <a
                    href="https://jti.polinema.ac.id"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Globe className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
                      JTI Polinema
                    </span>
                  </a>
                </div>
              </div>

              {/* FAQ Teaser */}
              <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl p-6 text-white">
                <h3 className="font-bold mb-2">Pertanyaan Umum?</h3>
                <p className="text-white/80 text-sm mb-4">
                  Cek halaman FAQ kami untuk menemukan jawaban dari pertanyaan
                  yang sering diajukan.
                </p>
                <a
                  href="/faq"
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
                >
                  Lihat FAQ
                  <span>→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
