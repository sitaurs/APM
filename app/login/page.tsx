import { redirect } from 'next/navigation';

// Login mahasiswa tidak tersedia - redirect ke halaman utama
// Admin login tersedia di /admin/login (hidden, tidak muncul di navigasi)

export default function LoginPage() {
    redirect('/');
}
