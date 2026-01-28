/**
 * API Route: Calendar Events
 * GET /api/calendar
 * 
 * Fetches calendar events from multiple sources:
 * - apm_lomba (deadlines)
 * - apm_expo (event dates)
 * - apm_calendar (personal/custom entries)
 */

import { NextRequest, NextResponse } from 'next/server';
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';
const TIMEZONE = 'Asia/Jakarta';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'lomba' | 'expo' | 'deadline' | 'event';
  startDate: string;
  endDate?: string;
  time?: string;
  lokasi?: string;
  description?: string;
  link?: string;
  kategori?: string;
  isUrgent?: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const month = searchParams.get('month'); // Format: YYYY-MM
    const userNim = searchParams.get('nim'); // For personal calendar entries

    const events: CalendarEvent[] = [];

    // Calculate date range for the month (with buffer for display)
    // Use Asia/Jakarta timezone for consistent date handling
    const now = toZonedTime(new Date(), TIMEZONE);
    let startDate = new Date(now);
    let endDate = new Date(now);

    if (month) {
      const [year, monthNum] = month.split('-').map(Number);
      startDate = new Date(year, monthNum - 1, 1);
      endDate = new Date(year, monthNum, 0); // Last day of month
      // Add buffer for previous/next month display
      startDate.setDate(startDate.getDate() - 7);
      endDate.setDate(endDate.getDate() + 7);
    } else {
      // Default: next 3 months
      endDate.setMonth(endDate.getMonth() + 3);
    }

    // Format dates for Directus query using Asia/Jakarta timezone
    const startDateStr = formatInTimeZone(startDate, TIMEZONE, 'yyyy-MM-dd');
    const endDateStr = formatInTimeZone(endDate, TIMEZONE, 'yyyy-MM-dd');

    // 1. Fetch Lomba deadlines
    try {
      const lombaParams = new URLSearchParams();
      lombaParams.set('filter', JSON.stringify({
        _and: [
          { status: { _in: ['open', 'upcoming'] } },
          { deadline: { _gte: startDateStr } },
          { deadline: { _lte: endDateStr } },
          { is_deleted: { _eq: false } },
        ]
      }));
      lombaParams.set('fields', 'id,nama_lomba,slug,deadline,lokasi,kategori,tingkat');
      lombaParams.set('sort', 'deadline');
      lombaParams.set('limit', '50');

      const lombaRes = await fetch(`${DIRECTUS_URL}/items/apm_lomba?${lombaParams.toString()}`);

      if (lombaRes.ok) {
        const lombaData = await lombaRes.json();

        (lombaData.data || []).forEach((lomba: Record<string, unknown>) => {
          const deadline = new Date(lomba.deadline as string);
          const daysUntil = Math.ceil((deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24));

          events.push({
            id: `lomba-${lomba.id}`,
            title: lomba.nama_lomba as string,
            type: 'deadline',
            startDate: (lomba.deadline as string).split('T')[0],
            time: '23:59',
            lokasi: (lomba.lokasi as string) || 'Online',
            description: `Deadline pendaftaran ${lomba.nama_lomba}`,
            link: `/lomba/${lomba.slug}`,
            kategori: lomba.kategori as string,
            isUrgent: daysUntil <= 7,
          });
        });
      }
    } catch (error) {
      console.error('Error fetching lomba for calendar:', error);
    }

    // 2. Fetch Expo events
    try {
      const expoParams = new URLSearchParams();
      expoParams.set('filter', JSON.stringify({
        _and: [
          { status: { _in: ['upcoming', 'ongoing'] } },
          { tanggal_mulai: { _gte: startDateStr } },
          { tanggal_mulai: { _lte: endDateStr } },
          { is_deleted: { _eq: false } },
        ]
      }));
      expoParams.set('fields', 'id,nama_event,slug,tanggal_mulai,tanggal_selesai,lokasi,tema');
      expoParams.set('sort', 'tanggal_mulai');
      expoParams.set('limit', '50');

      const expoRes = await fetch(`${DIRECTUS_URL}/items/apm_expo?${expoParams.toString()}`);

      if (expoRes.ok) {
        const expoData = await expoRes.json();

        (expoData.data || []).forEach((expo: Record<string, unknown>) => {
          events.push({
            id: `expo-${expo.id}`,
            title: expo.nama_event as string,
            type: 'expo',
            startDate: (expo.tanggal_mulai as string).split('T')[0],
            endDate: expo.tanggal_selesai ? (expo.tanggal_selesai as string).split('T')[0] : undefined,
            lokasi: expo.lokasi as string,
            description: expo.tema as string,
            link: `/expo/${expo.slug}`,
            kategori: 'Expo',
          });
        });
      }
    } catch (error) {
      console.error('Error fetching expo for calendar:', error);
    }

    // 3. Fetch personal calendar entries (if user NIM provided)
    if (userNim) {
      try {
        const calendarParams = new URLSearchParams();
        calendarParams.set('filter', JSON.stringify({
          _and: [
            { user_nim: { _eq: userNim } },
            { tanggal: { _gte: startDateStr } },
            { tanggal: { _lte: endDateStr } },
            { is_deleted: { _eq: false } },
          ]
        }));
        calendarParams.set('fields', 'id,title,event_type,tanggal,lokasi,deskripsi,link');
        calendarParams.set('sort', 'tanggal');
        calendarParams.set('limit', '100');

        const calendarRes = await fetch(`${DIRECTUS_URL}/items/apm_calendar?${calendarParams.toString()}`);

        if (calendarRes.ok) {
          const calendarData = await calendarRes.json();

          (calendarData.data || []).forEach((entry: Record<string, unknown>) => {
            events.push({
              id: `cal-${entry.id}`,
              title: entry.title as string,
              type: (entry.event_type as CalendarEvent['type']) || 'event',
              startDate: (entry.tanggal as string).split('T')[0],
              lokasi: entry.lokasi as string,
              description: entry.deskripsi as string,
              link: entry.link as string,
              isUrgent: false,
            });
          });
        }
      } catch (error) {
        console.error('Error fetching personal calendar:', error);
      }
    }

    // Sort events by date
    events.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return NextResponse.json({
      success: true,
      data: events,
      total: events.length,
    });

  } catch (error) {
    console.error('Error fetching calendar events:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
