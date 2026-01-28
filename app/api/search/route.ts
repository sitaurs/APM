/**
 * API Route: Unified Search
 * GET /api/search?q=query
 * 
 * Search across lomba, prestasi, expo, and resources
 */

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type'); // Optional: 'lomba', 'prestasi', 'expo', 'resources', or 'all'

    if (!query.trim()) {
      return NextResponse.json({
        lomba: [],
        prestasi: [],
        expo: [],
        resources: [],
        total: 0,
      });
    }

    const searchFilter = {
      _or: [
        { nama_lomba: { _icontains: query } },
        { deskripsi: { _icontains: query } },
        { penyelenggara: { _icontains: query } },
      ],
    };

    const results: {
      lomba: unknown[];
      prestasi: unknown[];
      expo: unknown[];
      resources: unknown[];
      total: number;
    } = {
      lomba: [],
      prestasi: [],
      expo: [],
      resources: [],
      total: 0,
    };

    // Search Lomba
    if (!type || type === 'all' || type === 'lomba') {
      try {
        const lombaParams = new URLSearchParams();
        lombaParams.set('limit', '10');
        lombaParams.set('filter', JSON.stringify({
          _or: [
            { nama_lomba: { _icontains: query } },
            { deskripsi: { _icontains: query } },
            { penyelenggara: { _icontains: query } },
          ],
        }));
        lombaParams.set('fields', 'id,nama_lomba,slug,deadline,kategori,tingkat,status,biaya,is_urgent,poster');

        const lombaRes = await fetch(`${DIRECTUS_URL}/items/apm_lomba?${lombaParams.toString()}`, {
          next: { revalidate: 60 },
        });

        if (lombaRes.ok) {
          const lombaData = await lombaRes.json();
          results.lomba = (lombaData.data || []).map((item: Record<string, unknown>) => ({
            id: item.id,
            slug: item.slug,
            title: item.nama_lomba,
            deadline: item.deadline,
            deadlineDisplay: item.deadline 
              ? new Date(item.deadline as string).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
              : null,
            kategori: item.kategori,
            tingkat: item.tingkat,
            status: item.status,
            isUrgent: item.is_urgent,
            isFree: item.biaya === 0,
            posterUrl: item.poster ? `${DIRECTUS_URL}/assets/${item.poster}?width=200` : null,
          }));
        }
      } catch (error) {
        console.error('Error searching lomba:', error);
      }
    }

    // Search Prestasi
    if (!type || type === 'all' || type === 'prestasi') {
      try {
        const prestasiParams = new URLSearchParams();
        prestasiParams.set('limit', '10');
        prestasiParams.set('filter', JSON.stringify({
          status: { _eq: 'verified' },
          _or: [
            { judul: { _icontains: query } },
            { nama_lomba: { _icontains: query } },
            { submitter_name: { _icontains: query } },
          ],
        }));
        prestasiParams.set('fields', 'id,judul,slug,nama_lomba,peringkat,tingkat,tahun,kategori,submitter_name');

        const prestasiRes = await fetch(`${DIRECTUS_URL}/items/apm_prestasi?${prestasiParams.toString()}`, {
          next: { revalidate: 60 },
        });

        if (prestasiRes.ok) {
          const prestasiData = await prestasiRes.json();
          results.prestasi = (prestasiData.data || []).map((item: Record<string, unknown>) => ({
            id: item.id,
            slug: item.slug,
            title: item.judul,
            namaLomba: item.nama_lomba,
            peringkat: item.peringkat,
            tingkat: item.tingkat,
            tahun: item.tahun,
            kategori: item.kategori,
            tim: item.submitter_name ? [{ nama: item.submitter_name }] : [],
          }));
        }
      } catch (error) {
        console.error('Error searching prestasi:', error);
      }
    }

    // Search Expo
    if (!type || type === 'all' || type === 'expo') {
      try {
        const expoParams = new URLSearchParams();
        expoParams.set('limit', '10');
        expoParams.set('filter', JSON.stringify({
          _or: [
            { nama_event: { _icontains: query } },
            { tema: { _icontains: query } },
            { deskripsi: { _icontains: query } },
          ],
        }));
        expoParams.set('fields', 'id,nama_event,slug,tanggal_mulai,tanggal_selesai,lokasi');

        const expoRes = await fetch(`${DIRECTUS_URL}/items/apm_expo?${expoParams.toString()}`, {
          next: { revalidate: 60 },
        });

        if (expoRes.ok) {
          const expoData = await expoRes.json();
          results.expo = (expoData.data || []).map((item: Record<string, unknown>) => {
            const startDate = new Date(item.tanggal_mulai as string);
            const endDate = item.tanggal_selesai ? new Date(item.tanggal_selesai as string) : null;
            const tanggal = endDate && endDate !== startDate
              ? `${startDate.toLocaleDateString('id-ID', { day: 'numeric' })}-${endDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}`
              : startDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

            return {
              id: item.id,
              slug: item.slug,
              title: item.nama_event,
              tanggal,
              lokasi: item.lokasi,
            };
          });
        }
      } catch (error) {
        console.error('Error searching expo:', error);
      }
    }

    // Search Resources
    if (!type || type === 'all' || type === 'resources') {
      try {
        const resourcesParams = new URLSearchParams();
        resourcesParams.set('limit', '10');
        resourcesParams.set('filter', JSON.stringify({
          is_published: { _eq: true },
          _or: [
            { judul: { _icontains: query } },
            { deskripsi: { _icontains: query } },
          ],
        }));
        resourcesParams.set('fields', 'id,judul,slug,kategori,deskripsi,thumbnail');

        const resourcesRes = await fetch(`${DIRECTUS_URL}/items/apm_resources?${resourcesParams.toString()}`, {
          next: { revalidate: 60 },
        });

        if (resourcesRes.ok) {
          const resourcesData = await resourcesRes.json();
          results.resources = (resourcesData.data || []).map((item: Record<string, unknown>) => ({
            id: item.id,
            slug: item.slug,
            title: item.judul,
            kategori: item.kategori,
            format: 'PDF', // Default, could be dynamic
          }));
        }
      } catch (error) {
        console.error('Error searching resources:', error);
      }
    }

    results.total = results.lomba.length + results.prestasi.length + results.expo.length + results.resources.length;

    return NextResponse.json(results);
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
