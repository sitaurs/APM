/**
 * API Service Layer untuk APM Portal
 * Menggunakan native fetch untuk fleksibilitas
 */

import { getAssetUrl } from './directus';

const DIRECTUS_URL = process.env.NEXT_PUBLIC_DIRECTUS_URL || process.env.DIRECTUS_URL || 'http://localhost:8055';

// Helper untuk fetch dari Directus
async function fetchDirectus<T>(
  collection: string,
  params: URLSearchParams,
  options?: { revalidate?: number }
): Promise<T[]> {
  const url = `${DIRECTUS_URL}/items/${collection}?${params.toString()}`;
  
  const response = await fetch(url, {
    next: { revalidate: options?.revalidate ?? 60 },
  });
  
  if (!response.ok) {
    throw new Error(`Directus API error: ${response.status}`);
  }
  
  const data = await response.json();
  return data.data || [];
}

// ============================================
// LOMBA API
// ============================================

export interface LombaListParams {
  page?: number;
  limit?: number;
  kategori?: string;
  tingkat?: string;
  status?: string;
  search?: string;
  featured?: boolean;
}

export async function getLombaList(params: LombaListParams = {}) {
  const { page = 1, limit = 12, kategori, tingkat, status, search, featured } = params;

  const filter: Record<string, unknown> = {};
  
  if (kategori) filter.kategori = { _eq: kategori };
  if (tingkat) filter.tingkat = { _eq: tingkat };
  if (status) filter.status = { _eq: status };
  if (featured) filter.is_featured = { _eq: true };
  if (search) {
    filter._or = [
      { nama_lomba: { _icontains: search } },
      { deskripsi: { _icontains: search } },
    ];
  }

  const queryParams = new URLSearchParams();
  queryParams.set('limit', String(limit));
  queryParams.set('offset', String((page - 1) * limit));
  queryParams.set('sort', '-date_created');
  queryParams.set('fields', 'id,nama_lomba,slug,deadline,kategori,tingkat,status,poster,biaya,lokasi,is_featured,is_urgent,tags');
  
  if (Object.keys(filter).length > 0) {
    queryParams.set('filter', JSON.stringify(filter));
  }

  const result = await fetchDirectus<Record<string, unknown>>('apm_lomba', queryParams);

  return {
    data: result.map((item) => ({
      ...item,
      posterUrl: getAssetUrl(item.poster as string | null, { width: 400 }),
    })),
  };
}

export async function getLombaBySlug(slug: string) {
  const queryParams = new URLSearchParams();
  queryParams.set('filter', JSON.stringify({ slug: { _eq: slug } }));
  queryParams.set('limit', '1');
  queryParams.set('fields', '*');

  const result = await fetchDirectus<Record<string, unknown>>('apm_lomba', queryParams);

  if (!result || result.length === 0) {
    return null;
  }

  const lomba = result[0];
  return {
    ...lomba,
    posterUrl: getAssetUrl(lomba.poster as string | null, { width: 800 }),
  };
}

// ============================================
// PRESTASI API
// ============================================

export interface PrestasiListParams {
  page?: number;
  limit?: number;
  tingkat?: string;
  kategori?: string;
  tahun?: number;
  status?: string;
  search?: string;
}

export async function getPrestasiList(params: PrestasiListParams = {}) {
  const { page = 1, limit = 12, tingkat, kategori, tahun, status, search } = params;

  const filter: Record<string, unknown> = {
    status_verifikasi: { _eq: status || 'verified' },
  };
  
  if (tingkat) filter.tingkat = { _eq: tingkat };
  if (kategori) filter.kategori = { _eq: kategori };
  if (tahun) filter.tahun = { _eq: tahun };
  if (search) {
    filter._or = [
      { judul: { _icontains: search } },
      { nama_lomba: { _icontains: search } },
    ];
  }

  const queryParams = new URLSearchParams();
  queryParams.set('limit', String(limit));
  queryParams.set('offset', String((page - 1) * limit));
  queryParams.set('sort', '-tanggal');
  queryParams.set('fields', 'id,judul,slug,nama_lomba,peringkat,tingkat,kategori,tanggal,tahun,sertifikat,status_verifikasi');
  queryParams.set('filter', JSON.stringify(filter));

  const result = await fetchDirectus<Record<string, unknown>>('apm_prestasi', queryParams);

  return {
    data: result.map((item) => ({
      ...item,
      sertifikatUrl: getAssetUrl(item.sertifikat as string | null, { width: 400 }),
    })),
  };
}

export async function getPrestasiBySlug(slug: string) {
  const queryParams = new URLSearchParams();
  queryParams.set('filter', JSON.stringify({ slug: { _eq: slug } }));
  queryParams.set('limit', '1');
  queryParams.set('fields', '*');

  const result = await fetchDirectus<Record<string, unknown>>('apm_prestasi', queryParams);

  if (!result || result.length === 0) {
    return null;
  }

  const prestasi = result[0];
  return {
    ...prestasi,
    sertifikatUrl: getAssetUrl(prestasi.sertifikat as string | null, { width: 800 }),
  };
}

// ============================================
// EXPO API
// ============================================

export interface ExpoListParams {
  page?: number;
  limit?: number;
  status?: string;
  featured?: boolean;
  search?: string;
}

export async function getExpoList(params: ExpoListParams = {}) {
  const { page = 1, limit = 12, status, featured, search } = params;

  const filter: Record<string, unknown> = {};
  
  if (status) filter.status = { _eq: status };
  if (featured) filter.is_featured = { _eq: true };
  if (search) {
    filter._or = [
      { nama_event: { _icontains: search } },
      { tema: { _icontains: search } },
    ];
  }

  const queryParams = new URLSearchParams();
  queryParams.set('limit', String(limit));
  queryParams.set('offset', String((page - 1) * limit));
  queryParams.set('sort', '-tanggal_mulai');
  queryParams.set('fields', 'id,nama_event,slug,tema,tanggal_mulai,tanggal_selesai,lokasi,poster,biaya_partisipasi,is_featured,status');
  
  if (Object.keys(filter).length > 0) {
    queryParams.set('filter', JSON.stringify(filter));
  }

  const result = await fetchDirectus<Record<string, unknown>>('apm_expo', queryParams);

  return {
    data: result.map((item) => ({
      ...item,
      posterUrl: getAssetUrl(item.poster as string | null, { width: 400 }),
    })),
  };
}

export async function getExpoBySlug(slug: string) {
  const queryParams = new URLSearchParams();
  queryParams.set('filter', JSON.stringify({ slug: { _eq: slug } }));
  queryParams.set('limit', '1');
  queryParams.set('fields', '*');

  const result = await fetchDirectus<Record<string, unknown>>('apm_expo', queryParams);

  if (!result || result.length === 0) {
    return null;
  }

  const expo = result[0];
  return {
    ...expo,
    posterUrl: getAssetUrl(expo.poster as string | null, { width: 800 }),
  };
}

// ============================================
// RESOURCES API
// ============================================

export interface ResourceListParams {
  page?: number;
  limit?: number;
  kategori?: string;
  featured?: boolean;
  search?: string;
}

export async function getResourceList(params: ResourceListParams = {}) {
  const { page = 1, limit = 12, kategori, featured, search } = params;

  const filter: Record<string, unknown> = {
    is_published: { _eq: true },
  };
  
  if (kategori) filter.kategori = { _eq: kategori };
  if (featured) filter.is_featured = { _eq: true };
  if (search) {
    filter._or = [
      { judul: { _icontains: search } },
      { deskripsi: { _icontains: search } },
    ];
  }

  const queryParams = new URLSearchParams();
  queryParams.set('limit', String(limit));
  queryParams.set('offset', String((page - 1) * limit));
  queryParams.set('sort', 'urutan,-date_created');
  queryParams.set('fields', 'id,judul,slug,kategori,deskripsi,thumbnail,file_attachment,download_count,is_featured,tags');
  queryParams.set('filter', JSON.stringify(filter));

  const result = await fetchDirectus<Record<string, unknown>>('apm_resources', queryParams);

  return {
    data: result.map((item) => ({
      ...item,
      thumbnailUrl: getAssetUrl(item.thumbnail as string | null, { width: 300 }),
      downloadUrl: getAssetUrl(item.file_attachment as string | null),
    })),
  };
}

export async function getResourceBySlug(slug: string) {
  const queryParams = new URLSearchParams();
  queryParams.set('filter', JSON.stringify({ 
    slug: { _eq: slug },
    is_published: { _eq: true },
  }));
  queryParams.set('limit', '1');
  queryParams.set('fields', '*');

  const result = await fetchDirectus<Record<string, unknown>>('apm_resources', queryParams);

  if (!result || result.length === 0) {
    return null;
  }

  const resource = result[0];
  return {
    ...resource,
    thumbnailUrl: getAssetUrl(resource.thumbnail as string | null, { width: 600 }),
    downloadUrl: getAssetUrl(resource.file_attachment as string | null),
  };
}

// ============================================
// ABOUT, TIM, FAQ API
// ============================================

export async function getAboutInfo() {
  const url = `${DIRECTUS_URL}/items/apm_about`;
  const response = await fetch(url, { next: { revalidate: 300 } });
  
  if (!response.ok) {
    throw new Error('Failed to fetch about info');
  }
  
  const data = await response.json();
  return data.data;
}

export async function getTimList() {
  const queryParams = new URLSearchParams();
  queryParams.set('filter', JSON.stringify({ is_active: { _eq: true } }));
  queryParams.set('sort', 'urutan');
  queryParams.set('fields', '*');

  const result = await fetchDirectus<Record<string, unknown>>('apm_tim', queryParams);

  return result.map((item) => ({
    ...item,
    fotoUrl: getAssetUrl(item.foto as string | null, { width: 300 }),
  }));
}

export async function getFaqList(kategori?: string) {
  const filter: Record<string, unknown> = {
    is_published: { _eq: true },
  };
  
  if (kategori) filter.kategori = { _eq: kategori };

  const queryParams = new URLSearchParams();
  queryParams.set('filter', JSON.stringify(filter));
  queryParams.set('sort', 'urutan');
  queryParams.set('fields', 'id,pertanyaan,jawaban,kategori');

  return await fetchDirectus<Record<string, unknown>>('apm_faq', queryParams);
}

// ============================================
// SUBMISSIONS API
// ============================================

export interface CreateSubmissionData {
  tipe: 'lomba' | 'prestasi';
  data: Record<string, unknown>;
  submitted_by: string;
  email: string;
  phone?: string;
}

export async function createSubmission(submission: CreateSubmissionData) {
  const url = `${DIRECTUS_URL}/items/apm_submissions`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      ...submission,
      data: JSON.stringify(submission.data),
      status: 'pending',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to create submission');
  }

  const data = await response.json();
  return data.data;
}

// ============================================
// SEARCH API
// ============================================

export async function globalSearch(query: string, limit = 5) {
  const searchFilter = (fields: string[]) => ({
    _or: fields.map(field => ({ [field]: { _icontains: query } })),
  });

  const [lomba, prestasi, expo, resources] = await Promise.all([
    (async () => {
      const params = new URLSearchParams();
      params.set('filter', JSON.stringify(searchFilter(['nama_lomba', 'deskripsi'])));
      params.set('limit', String(limit));
      params.set('fields', 'id,nama_lomba,slug,kategori,tingkat');
      return fetchDirectus<Record<string, unknown>>('apm_lomba', params);
    })(),
    (async () => {
      const params = new URLSearchParams();
      params.set('filter', JSON.stringify({
        ...searchFilter(['judul', 'nama_lomba']),
        status_verifikasi: { _eq: 'verified' },
      }));
      params.set('limit', String(limit));
      params.set('fields', 'id,judul,slug,peringkat,tingkat');
      return fetchDirectus<Record<string, unknown>>('apm_prestasi', params);
    })(),
    (async () => {
      const params = new URLSearchParams();
      params.set('filter', JSON.stringify(searchFilter(['nama_event', 'tema'])));
      params.set('limit', String(limit));
      params.set('fields', 'id,nama_event,slug,lokasi');
      return fetchDirectus<Record<string, unknown>>('apm_expo', params);
    })(),
    (async () => {
      const params = new URLSearchParams();
      params.set('filter', JSON.stringify({
        ...searchFilter(['judul', 'deskripsi']),
        is_published: { _eq: true },
      }));
      params.set('limit', String(limit));
      params.set('fields', 'id,judul,slug,kategori');
      return fetchDirectus<Record<string, unknown>>('apm_resources', params);
    })(),
  ]);

  return { lomba, prestasi, expo, resources };
}

// ============================================
// KALENDER API
// ============================================

export async function getKalenderEvents(startDate: string, endDate: string) {
  const [lomba, expo] = await Promise.all([
    (async () => {
      const params = new URLSearchParams();
      params.set('filter', JSON.stringify({
        deadline: { _gte: startDate, _lte: endDate },
        status: { _neq: 'closed' },
      }));
      params.set('fields', 'id,nama_lomba,slug,deadline,kategori,status');
      return fetchDirectus<Record<string, unknown>>('apm_lomba', params);
    })(),
    (async () => {
      const params = new URLSearchParams();
      params.set('filter', JSON.stringify({
        tanggal_mulai: { _lte: endDate },
        tanggal_selesai: { _gte: startDate },
      }));
      params.set('fields', 'id,nama_event,slug,tanggal_mulai,tanggal_selesai,lokasi');
      return fetchDirectus<Record<string, unknown>>('apm_expo', params);
    })(),
  ]);

  return {
    lomba: lomba.map((item) => ({
      id: item.id,
      title: item.nama_lomba,
      type: 'deadline' as const,
      startDate: item.deadline,
      link: `/lomba/${item.slug}`,
      kategori: item.kategori,
    })),
    expo: expo.map((item) => ({
      id: item.id,
      title: item.nama_event,
      type: 'expo' as const,
      startDate: item.tanggal_mulai,
      endDate: item.tanggal_selesai,
      link: `/expo/${item.slug}`,
      lokasi: item.lokasi,
    })),
  };
}

// ============================================
// HOMEPAGE API
// ============================================

export async function getHomepageData() {
  const [featuredLomba, recentPrestasi, upcomingExpo] = await Promise.all([
    (async () => {
      const params = new URLSearchParams();
      params.set('filter', JSON.stringify({ status: { _eq: 'open' } }));
      params.set('limit', '4');
      params.set('sort', '-is_featured,deadline');
      params.set('fields', 'id,nama_lomba,slug,deadline,kategori,tingkat,status,biaya,is_urgent,poster');
      return fetchDirectus<Record<string, unknown>>('apm_lomba', params);
    })(),
    (async () => {
      const params = new URLSearchParams();
      params.set('filter', JSON.stringify({ status_verifikasi: { _eq: 'verified' } }));
      params.set('limit', '3');
      params.set('sort', '-tanggal');
      params.set('fields', 'id,judul,slug,peringkat,tingkat,tahun,nama_lomba,sertifikat');
      return fetchDirectus<Record<string, unknown>>('apm_prestasi', params);
    })(),
    (async () => {
      const params = new URLSearchParams();
      params.set('filter', JSON.stringify({ status: { _in: ['upcoming', 'ongoing'] } }));
      params.set('limit', '3');
      params.set('sort', 'tanggal_mulai');
      params.set('fields', 'id,nama_event,slug,tanggal_mulai,tanggal_selesai,lokasi,poster');
      return fetchDirectus<Record<string, unknown>>('apm_expo', params);
    })(),
  ]);

  return {
    lomba: featuredLomba.map((item) => ({
      ...item,
      posterUrl: getAssetUrl(item.poster as string | null, { width: 400 }),
    })),
    prestasi: recentPrestasi.map((item) => ({
      ...item,
      sertifikatUrl: getAssetUrl(item.sertifikat as string | null, { width: 300 }),
    })),
    expo: upcomingExpo.map((item) => ({
      ...item,
      posterUrl: getAssetUrl(item.poster as string | null, { width: 400 }),
    })),
  };
}
