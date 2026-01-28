'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Button, 
  Badge, 
  Breadcrumb,
  Input,
  Textarea,
  Select
} from '@/components/ui';
import { 
  Upload, 
  FileText, 
  Image as ImageIcon,
  X,
  CheckCircle,
  AlertCircle,
  Info,
  ChevronRight,
  Plus,
  Trash2
} from 'lucide-react';
import { kategoriLomba, tingkatLomba, fakultasList } from '@/lib/constants';

type TeamMember = {
  nama: string;
  nim: string;
  prodi: string;
};

export default function SubmissionPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Info Lomba
    namaLomba: '',
    penyelenggara: '',
    kategori: '',
    tingkat: '',
    tanggalLomba: '',
    lokasi: '',
    
    // Hasil
    peringkat: '',
    deskripsi: '',
    
    // Tim
    teamMembers: [{ nama: '', nim: '', prodi: '' }] as TeamMember[],
    dosenPembimbing: '',
    nipPembimbing: '',
    fakultas: '',
    
    // Files
    sertifikat: null as File | null,
    dokumentasi: [] as File[],
    suratKeterangan: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTeamMember = () => {
    setFormData(prev => ({
      ...prev,
      teamMembers: [...prev.teamMembers, { nama: '', nim: '', prodi: '' }]
    }));
  };

  const removeTeamMember = (index: number) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.filter((_, i) => i !== index)
    }));
  };

  const updateTeamMember = (index: number, field: keyof TeamMember, value: string) => {
    setFormData(prev => ({
      ...prev,
      teamMembers: prev.teamMembers.map((member, i) => 
        i === index ? { ...member, [field]: value } : member
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setSubmitSuccess(true);
  };

  const peringkatOptions = [
    { value: 'juara-1', label: 'Juara 1' },
    { value: 'juara-2', label: 'Juara 2' },
    { value: 'juara-3', label: 'Juara 3' },
    { value: 'juara-harapan', label: 'Juara Harapan' },
    { value: 'finalis', label: 'Finalis' },
    { value: 'best-paper', label: 'Best Paper' },
    { value: 'gold', label: 'Gold Medal' },
    { value: 'silver', label: 'Silver Medal' },
    { value: 'bronze', label: 'Bronze Medal' },
    { value: 'honorable', label: 'Honorable Mention' },
    { value: 'lainnya', label: 'Lainnya' },
  ];

  if (submitSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-2xl shadow-card p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-success/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-success" />
            </div>
            <h1 className="text-2xl font-bold text-text-main mb-2">
              Submission Berhasil!
            </h1>
            <p className="text-text-muted mb-6">
              Laporan prestasi kamu telah dikirim dan sedang dalam proses verifikasi. 
              Kami akan menghubungi kamu melalui email dalam 3-5 hari kerja.
            </p>
            <div className="space-y-3">
              <Link href="/prestasi">
                <Button variant="primary" fullWidth>Lihat Prestasi Lainnya</Button>
              </Link>
              <Link href="/">
                <Button variant="outline" fullWidth>Kembali ke Beranda</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-apm py-6">
          <Breadcrumb 
            items={[{ label: 'Submission Prestasi' }]} 
          />
          <h1 className="text-2xl font-bold text-text-main mt-4">
            Laporkan Prestasi
          </h1>
          <p className="text-text-muted mt-1">
            Dokumentasikan pencapaianmu dan bagikan kepada komunitas Polinema
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40">
        <div className="container-apm py-4">
          <div className="flex items-center justify-center gap-2">
            {[
              { num: 1, label: 'Info Lomba' },
              { num: 2, label: 'Tim & Pembimbing' },
              { num: 3, label: 'Upload Dokumen' },
            ].map((s, idx) => (
              <div key={s.num} className="flex items-center">
                <button
                  onClick={() => s.num < step && setStep(s.num)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                    step === s.num
                      ? 'bg-primary text-white'
                      : step > s.num
                      ? 'bg-success/10 text-success'
                      : 'bg-gray-100 text-text-muted'
                  }`}
                >
                  {step > s.num ? (
                    <CheckCircle className="w-4 h-4" />
                  ) : (
                    <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs font-bold">
                      {s.num}
                    </span>
                  )}
                  <span className="text-sm font-medium hidden sm:inline">{s.label}</span>
                </button>
                {idx < 2 && <ChevronRight className="w-4 h-4 text-text-muted mx-2" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="container-apm py-8">
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Info Lomba */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-card p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-text-main mb-1">Informasi Lomba</h2>
                  <p className="text-sm text-text-muted">Detail lomba/kompetisi yang diikuti</p>
                </div>

                <div className="space-y-4">
                  <Input
                    label="Nama Lomba/Kompetisi"
                    placeholder="contoh: Hackathon Nasional Inovasi 2026"
                    value={formData.namaLomba}
                    onChange={(e) => updateFormData('namaLomba', e.target.value)}
                    required
                  />

                  <Input
                    label="Penyelenggara"
                    placeholder="contoh: Kementerian Kominfo RI"
                    value={formData.penyelenggara}
                    onChange={(e) => updateFormData('penyelenggara', e.target.value)}
                    required
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-main mb-1.5">
                        Kategori <span className="text-error">*</span>
                      </label>
                      <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.kategori}
                        onChange={(e) => updateFormData('kategori', e.target.value)}
                        required
                      >
                        <option value="">Pilih kategori</option>
                        {kategoriLomba.map((k) => (
                          <option key={k.id} value={k.name}>{k.name}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-main mb-1.5">
                        Tingkat <span className="text-error">*</span>
                      </label>
                      <select
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        value={formData.tingkat}
                        onChange={(e) => updateFormData('tingkat', e.target.value)}
                        required
                      >
                        <option value="">Pilih tingkat</option>
                        {tingkatLomba.map((t) => (
                          <option key={t.id} value={t.name}>{t.name}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Tanggal Lomba"
                      type="date"
                      value={formData.tanggalLomba}
                      onChange={(e) => updateFormData('tanggalLomba', e.target.value)}
                      required
                    />
                    <Input
                      label="Lokasi"
                      placeholder="Online / Kota"
                      value={formData.lokasi}
                      onChange={(e) => updateFormData('lokasi', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-text-main mb-1.5">
                      Peringkat/Hasil <span className="text-error">*</span>
                    </label>
                    <select
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                      value={formData.peringkat}
                      onChange={(e) => updateFormData('peringkat', e.target.value)}
                      required
                    >
                      <option value="">Pilih peringkat</option>
                      {peringkatOptions.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>

                  <Textarea
                    label="Deskripsi Singkat"
                    placeholder="Ceritakan tentang prestasi yang kamu raih..."
                    rows={4}
                    value={formData.deskripsi}
                    onChange={(e) => updateFormData('deskripsi', e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <Button 
                    type="button" 
                    onClick={() => setStep(2)}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    Lanjutkan
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Tim & Pembimbing */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-card p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-text-main mb-1">Tim & Pembimbing</h2>
                  <p className="text-sm text-text-muted">Data anggota tim dan dosen pembimbing</p>
                </div>

                {/* Team Members */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-text-main">
                      Anggota Tim <span className="text-error">*</span>
                    </label>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      leftIcon={<Plus className="w-4 h-4" />}
                      onClick={addTeamMember}
                    >
                      Tambah Anggota
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {formData.teamMembers.map((member, idx) => (
                      <div key={idx} className="p-4 bg-gray-50 rounded-lg relative">
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => removeTeamMember(idx)}
                            className="absolute top-2 right-2 p-1 text-text-muted hover:text-error transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                        <p className="text-xs font-medium text-text-muted mb-3">
                          Anggota {idx + 1} {idx === 0 && '(Ketua Tim)'}
                        </p>
                        <div className="grid grid-cols-3 gap-3">
                          <Input
                            placeholder="Nama Lengkap"
                            value={member.nama}
                            onChange={(e) => updateTeamMember(idx, 'nama', e.target.value)}
                            required
                          />
                          <Input
                            placeholder="NIM"
                            value={member.nim}
                            onChange={(e) => updateTeamMember(idx, 'nim', e.target.value)}
                            required
                          />
                          <Input
                            placeholder="Program Studi"
                            value={member.prodi}
                            onChange={(e) => updateTeamMember(idx, 'prodi', e.target.value)}
                            required
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Dosen Pembimbing */}
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-sm font-medium text-text-main mb-3">Dosen Pembimbing</p>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Nama Dosen"
                      placeholder="Dr. Nama Lengkap, M.T."
                      value={formData.dosenPembimbing}
                      onChange={(e) => updateFormData('dosenPembimbing', e.target.value)}
                    />
                    <Input
                      label="NIP"
                      placeholder="NIP Dosen"
                      value={formData.nipPembimbing}
                      onChange={(e) => updateFormData('nipPembimbing', e.target.value)}
                    />
                  </div>
                </div>

                {/* Fakultas */}
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1.5">
                    Fakultas <span className="text-error">*</span>
                  </label>
                  <select
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    value={formData.fakultas}
                    onChange={(e) => updateFormData('fakultas', e.target.value)}
                    required
                  >
                    <option value="">Pilih fakultas</option>
                    {fakultasList.map((f) => (
                      <option key={f.id} value={f.name}>{f.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(1)}
                  >
                    Kembali
                  </Button>
                  <Button 
                    type="button" 
                    onClick={() => setStep(3)}
                    rightIcon={<ChevronRight className="w-4 h-4" />}
                  >
                    Lanjutkan
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Upload Documents */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-card p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-semibold text-text-main mb-1">Upload Dokumen</h2>
                  <p className="text-sm text-text-muted">Lampirkan bukti prestasi yang diraih</p>
                </div>

                {/* Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex gap-3">
                  <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium mb-1">Format file yang diterima:</p>
                    <p>Gambar: JPG, PNG, WebP (maks. 5MB per file)</p>
                    <p>Dokumen: PDF (maks. 10MB per file)</p>
                  </div>
                </div>

                {/* Sertifikat */}
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">
                    Sertifikat / Piagam <span className="text-error">*</span>
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="hidden"
                      id="sertifikat"
                      onChange={(e) => updateFormData('sertifikat', e.target.files?.[0] || null)}
                    />
                    <label htmlFor="sertifikat" className="cursor-pointer">
                      {formData.sertifikat ? (
                        <div className="flex items-center justify-center gap-2 text-success">
                          <CheckCircle className="w-5 h-5" />
                          <span>{formData.sertifikat.name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              updateFormData('sertifikat', null);
                            }}
                            className="text-error hover:text-error/80"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <FileText className="w-10 h-10 text-text-muted mx-auto mb-2" />
                          <p className="text-text-main font-medium">Upload Sertifikat</p>
                          <p className="text-sm text-text-muted">Klik untuk memilih file atau drag & drop</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Dokumentasi */}
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">
                    Foto Dokumentasi
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      multiple
                      className="hidden"
                      id="dokumentasi"
                      onChange={(e) => updateFormData('dokumentasi', Array.from(e.target.files || []))}
                    />
                    <label htmlFor="dokumentasi" className="cursor-pointer">
                      {formData.dokumentasi.length > 0 ? (
                        <div className="flex flex-wrap gap-2 justify-center">
                          {formData.dokumentasi.map((file, idx) => (
                            <Badge key={idx} variant="outline" className="gap-1">
                              {file.name}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateFormData('dokumentasi', formData.dokumentasi.filter((_, i) => i !== idx));
                                }}
                                className="text-error hover:text-error/80"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <>
                          <ImageIcon className="w-10 h-10 text-text-muted mx-auto mb-2" />
                          <p className="text-text-main font-medium">Upload Foto</p>
                          <p className="text-sm text-text-muted">Bisa pilih multiple file</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Surat Keterangan */}
                <div>
                  <label className="block text-sm font-medium text-text-main mb-2">
                    Surat Keterangan Penyelenggara (opsional)
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                    <input
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      id="suratKeterangan"
                      onChange={(e) => updateFormData('suratKeterangan', e.target.files?.[0] || null)}
                    />
                    <label htmlFor="suratKeterangan" className="cursor-pointer">
                      {formData.suratKeterangan ? (
                        <div className="flex items-center justify-center gap-2 text-success">
                          <CheckCircle className="w-5 h-5" />
                          <span>{formData.suratKeterangan.name}</span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              updateFormData('suratKeterangan', null);
                            }}
                            className="text-error hover:text-error/80"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <Upload className="w-10 h-10 text-text-muted mx-auto mb-2" />
                          <p className="text-text-main font-medium">Upload Surat Keterangan</p>
                          <p className="text-sm text-text-muted">PDF only</p>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Agreement */}
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="agreement"
                    required
                    className="w-4 h-4 mt-1 rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="agreement" className="text-sm text-text-muted">
                    Saya menyatakan bahwa data yang saya isi adalah benar dan dapat dipertanggungjawabkan. 
                    Saya bersedia menerima sanksi jika terbukti memberikan informasi palsu.
                  </label>
                </div>

                <div className="flex justify-between">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setStep(2)}
                  >
                    Kembali
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    leftIcon={isSubmitting ? undefined : <Upload className="w-4 h-4" />}
                  >
                    {isSubmitting ? 'Mengirim...' : 'Submit Prestasi'}
                  </Button>
                </div>
              </div>
            )}
          </form>

          {/* Help */}
          <div className="mt-6 p-4 bg-primary/5 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
            <div className="text-sm text-text-muted">
              <p className="font-medium text-text-main mb-1">Butuh bantuan?</p>
              <p>
                Hubungi tim APM di{' '}
                <a href="mailto:apm@polinema.ac.id" className="text-primary hover:underline">
                  apm@polinema.ac.id
                </a>{' '}
                atau kunjungi Gedung JTI Polinema Lt. 5.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

