import Link from 'next/link';
import Image from 'next/image';
import { 
  Button, 
  Badge, 
  Breadcrumb,
  Avatar
} from '@/components/ui';
import { 
  Trophy, 
  Users, 
  Target, 
  Lightbulb,
  Heart,
  Star,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  ChevronDown,
  Award,
  Building2,
  GraduationCap
} from 'lucide-react';

// Stats
const stats = [
  { value: '256+', label: 'Total Prestasi', icon: Trophy },
  { value: '89', label: 'Juara 1', icon: Award },
  { value: '1000+', label: 'Mahasiswa Terlibat', icon: Users },
  { value: '50+', label: 'Mitra & Partner', icon: Building2 },
];

// Team members
const teamMembers = [
  { nama: 'Dr. Ir. Ahmad Suherman, M.T.', jabatan: 'Ketua APM', fakultas: 'Rektorat', foto: null },
  { nama: 'Budi Santoso, S.Kom., M.Kom.', jabatan: 'Sekretaris', fakultas: 'FTE', foto: null },
  { nama: 'Citra Dewi, S.Pd., M.Pd.', jabatan: 'Koordinator Lomba', fakultas: 'FKB', foto: null },
  { nama: 'Diana Pratiwi, S.T., M.T.', jabatan: 'Koordinator Prestasi', fakultas: 'FIF', foto: null },
  { nama: 'Eko Prasetyo, S.E., M.M.', jabatan: 'Koordinator Expo', fakultas: 'FEB', foto: null },
  { nama: 'Fitria Rahma, S.Ds., M.Ds.', jabatan: 'Desain & Media', fakultas: 'FIK', foto: null },
];

// Values
const values = [
  { 
    icon: Target, 
    title: 'Fokus pada Prestasi', 
    desc: 'Mendorong mahasiswa untuk terus berprestasi di tingkat nasional dan internasional' 
  },
  { 
    icon: Lightbulb, 
    title: 'Inovasi', 
    desc: 'Mengembangkan solusi kreatif dan inovatif untuk berbagai permasalahan' 
  },
  { 
    icon: Heart, 
    title: 'Kolaborasi', 
    desc: 'Membangun kerjasama yang kuat antar mahasiswa, dosen, dan industri' 
  },
  { 
    icon: Star, 
    title: 'Keunggulan', 
    desc: 'Menjadi yang terdepan dalam pengembangan potensi mahasiswa' 
  },
];

// FAQ
const faqs = [
  {
    question: 'Apa itu APM Politeknik Negeri Malang?',
    answer: 'APM (Ajang Prestasi Mahasiswa) adalah unit yang mengelola dan mendukung kegiatan kemahasiswaan dalam bidang prestasi, lomba, dan kompetisi di Politeknik Negeri Malang. Kami menyediakan informasi lomba, memfasilitasi pendaftaran, dan mendokumentasikan prestasi mahasiswa.',
  },
  {
    question: 'Bagaimana cara mendaftar lomba melalui APM?',
    answer: 'Anda dapat melihat daftar lomba yang tersedia di halaman Lomba & Kompetisi, memilih lomba yang diminati, lalu mengikuti instruksi pendaftaran yang tertera. Beberapa lomba mungkin memerlukan rekomendasi dari fakultas.',
  },
  {
    question: 'Bagaimana cara melaporkan prestasi yang diraih?',
    answer: 'Gunakan halaman Submission untuk melaporkan prestasi. Upload bukti prestasi seperti sertifikat, foto dokumentasi, dan surat keterangan dari penyelenggara. Tim kami akan memverifikasi dan mempublikasikannya.',
  },
  {
    question: 'Apakah ada pendanaan untuk mengikuti lomba?',
    answer: 'Ya, Politeknik Negeri Malang menyediakan bantuan pendanaan untuk mahasiswa yang mengikuti lomba tertentu. Informasi pendanaan biasanya tersedia di detail masing-masing lomba atau dapat dikonsultasikan dengan koordinator APM fakultas.',
  },
  {
    question: 'Bagaimana cara menjadi volunteer atau panitia event APM?',
    answer: 'Kami membuka rekrutmen volunteer secara berkala. Pantau pengumuman di website dan media sosial kami, atau hubungi langsung tim APM untuk informasi lebih lanjut.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-primary-600 to-primary-700 relative overflow-hidden">
        {/* Decorative */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />
        
        <div className="container-apm py-16 relative z-10">
          <Breadcrumb 
            items={[{ label: 'Tentang APM' }]} 
            className="text-white/70 [&_a]:text-white/70 [&_a:hover]:text-white mb-6"
          />
          <div className="max-w-3xl">
            <Badge variant="secondary" className="bg-white/20 text-white border-white/30 mb-4">
              Tentang Kami
            </Badge>
            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              Portal Ajang Prestasi Mahasiswa
            </h1>
            <p className="text-xl text-white/80 mb-6">
              Mendukung dan memfasilitasi mahasiswa Politeknik Negeri Malang untuk berprestasi di tingkat nasional dan internasional.
            </p>
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                Hubungi Kami
              </Button>
              <Button variant="ghost" className="text-white border-white/50 hover:bg-white/10">
                Pelajari Lebih Lanjut
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="container-apm -mt-8 relative z-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl shadow-card p-6 text-center">
              <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
              <p className="text-3xl font-bold text-text-main">{stat.value}</p>
              <p className="text-sm text-text-muted">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Vision & Mission */}
      <div className="container-apm py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <Badge variant="primary" className="mb-4">Visi & Misi</Badge>
            <h2 className="text-2xl lg:text-3xl font-bold text-text-main mb-6">
              Mencetak Generasi Berprestasi dan Berdaya Saing Global
            </h2>
            
            <div className="space-y-6">
              <div className="bg-primary/5 rounded-xl p-6 border-l-4 border-primary">
                <h3 className="font-semibold text-primary mb-2">Visi</h3>
                <p className="text-text-muted">
                  Menjadi pusat pengembangan prestasi mahasiswa terkemuka di Indonesia yang menghasilkan talenta-talenta unggul berdaya saing global.
                </p>
              </div>
              
              <div className="bg-secondary/5 rounded-xl p-6 border-l-4 border-secondary">
                <h3 className="font-semibold text-secondary mb-2">Misi</h3>
                <ul className="space-y-2 text-text-muted">
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">1</span>
                    Menyediakan informasi komprehensif tentang lomba dan kompetisi
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">2</span>
                    Memfasilitasi pendaftaran dan persiapan lomba
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">3</span>
                    Mendokumentasikan dan mempromosikan prestasi mahasiswa
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-secondary/20 text-secondary flex items-center justify-center flex-shrink-0 mt-0.5 text-xs">4</span>
                    Membangun jaringan dengan industri dan institusi pendidikan
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-xl shadow-card p-6 hover:shadow-lg transition-shadow">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-semibold text-text-main mb-2">{value.title}</h3>
                <p className="text-sm text-text-muted">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="bg-white py-16">
        <div className="container-apm">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4">Tim Kami</Badge>
            <h2 className="text-2xl lg:text-3xl font-bold text-text-main mb-4">
              Tim Pengelola APM
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Tim yang berdedikasi untuk mendukung prestasi mahasiswa Politeknik Negeri Malang
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {teamMembers.map((member) => (
              <div key={member.nama} className="text-center group">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-2xl font-bold group-hover:scale-105 transition-transform">
                  {member.nama.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <h3 className="font-semibold text-text-main text-sm">{member.nama}</h3>
                <p className="text-xs text-primary font-medium">{member.jabatan}</p>
                <p className="text-xs text-text-muted">{member.fakultas}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div className="container-apm py-16">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="accent" className="mb-4">FAQ</Badge>
            <h2 className="text-2xl lg:text-3xl font-bold text-text-main mb-4">
              Pertanyaan yang Sering Diajukan
            </h2>
          </div>
          
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details 
                key={idx} 
                className="group bg-white rounded-xl shadow-card overflow-hidden"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-gray-50 transition-colors">
                  <span className="font-semibold text-text-main pr-4">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-text-muted group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 pt-0">
                  <p className="text-text-muted">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-r from-primary to-secondary py-16">
        <div className="container-apm">
          <div className="max-w-3xl mx-auto text-center text-white">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4">
              Ada Pertanyaan Lain?
            </h2>
            <p className="text-white/80 mb-8">
              Jangan ragu untuk menghubungi kami. Tim APM siap membantu kamu!
            </p>
            
            <div className="flex flex-wrap justify-center gap-6 mb-8">
              <a href="mailto:apm@polinema.ac.id" className="flex items-center gap-2 text-white/90 hover:text-white">
                <Mail className="w-5 h-5" />
                apm@polinema.ac.id
              </a>
              <a href="tel:+62227564108" className="flex items-center gap-2 text-white/90 hover:text-white">
                <Phone className="w-5 h-5" />
                +62 22 7564108
              </a>
              <span className="flex items-center gap-2 text-white/90">
                <MapPin className="w-5 h-5" />
                Gedung JTI Polinema Lt. 5, Polinema Malang
              </span>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Button variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                <Mail className="w-4 h-4 mr-2" />
                Kirim Email
              </Button>
              <Button variant="ghost" className="text-white border-white hover:bg-white/10">
                <ExternalLink className="w-4 h-4 mr-2" />
                Kunjungi Kantor
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

