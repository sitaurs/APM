/**
 * API Route: Deadline Reminders
 * GET /api/reminders/deadlines
 * 
 * Fetches upcoming lomba deadlines and can trigger reminder notifications
 * This endpoint can be called by a cron job to send email reminders
 */

import { NextRequest, NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

interface Lomba {
  id: number;
  nama_lomba: string;
  slug: string;
  deadline: string;
  penyelenggara: string;
}

interface Registration {
  id: number;
  nama_lengkap: string;
  email: string;
  nim: string;
  lomba_id: number;
}

interface UpcomingDeadline {
  lomba: Lomba;
  daysUntilDeadline: number;
  registrations: Registration[];
}

/**
 * GET /api/reminders/deadlines
 * 
 * Query params:
 * - days: number of days to look ahead (default: 7)
 * - action: 'check' (default) or 'send' to actually send reminders
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const daysAhead = parseInt(searchParams.get('days') || '7');
    const action = searchParams.get('action') || 'check';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const futureDate = new Date(today);
    futureDate.setDate(futureDate.getDate() + daysAhead);

    // Fetch lomba with upcoming deadlines
    const lombaParams = new URLSearchParams();
    lombaParams.set('fields', 'id,nama_lomba,slug,deadline,penyelenggara');
    lombaParams.set('filter', JSON.stringify({
      _and: [
        { is_deleted: { _eq: false } },
        { deadline: { _gte: today.toISOString().split('T')[0] } },
        { deadline: { _lte: futureDate.toISOString().split('T')[0] } },
      ],
    }));
    lombaParams.set('sort', 'deadline');

    const lombaRes = await fetch(`${DIRECTUS_URL}/items/apm_lomba?${lombaParams.toString()}`);
    const lombaData = await lombaRes.json();
    const upcomingLomba: Lomba[] = lombaData.data || [];

    if (upcomingLomba.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Tidak ada deadline dalam periode yang ditentukan',
        data: [],
      });
    }

    // Group by days until deadline
    const upcomingDeadlines: UpcomingDeadline[] = [];
    
    for (const lomba of upcomingLomba) {
      const deadlineDate = new Date(lomba.deadline);
      deadlineDate.setHours(0, 0, 0, 0);
      const diffTime = deadlineDate.getTime() - today.getTime();
      const daysUntil = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Fetch registrations for this lomba
      const regParams = new URLSearchParams();
      regParams.set('fields', 'id,nama_lengkap,email,nim,lomba_id');
      regParams.set('filter', JSON.stringify({
        lomba_id: { _eq: lomba.id },
        status: { _eq: 'approved' },
      }));

      const regRes = await fetch(`${DIRECTUS_URL}/items/apm_lomba_registrations?${regParams.toString()}`);
      const regData = await regRes.json();

      upcomingDeadlines.push({
        lomba,
        daysUntilDeadline: daysUntil,
        registrations: regData.data || [],
      });
    }

    // Group by reminder thresholds (1 day, 3 days, 7 days)
    const reminders = {
      urgent: upcomingDeadlines.filter(d => d.daysUntilDeadline <= 1), // Tomorrow or today
      soon: upcomingDeadlines.filter(d => d.daysUntilDeadline > 1 && d.daysUntilDeadline <= 3), // 2-3 days
      upcoming: upcomingDeadlines.filter(d => d.daysUntilDeadline > 3), // 4+ days
    };

    // If action is 'send', we would send emails here
    // For now, we'll just log what would be sent
    const emailsToSend: Array<{
      to: string;
      subject: string;
      body: string;
      urgency: string;
    }> = [];

    if (action === 'send') {
      for (const deadline of upcomingDeadlines) {
        for (const reg of deadline.registrations) {
          const urgency = deadline.daysUntilDeadline <= 1 ? 'URGENT' : 
                          deadline.daysUntilDeadline <= 3 ? 'SEGERA' : 'PENGINGAT';
          
          emailsToSend.push({
            to: reg.email,
            subject: `[${urgency}] Deadline ${deadline.lomba.nama_lomba} - ${deadline.daysUntilDeadline === 0 ? 'HARI INI' : `${deadline.daysUntilDeadline} hari lagi`}`,
            body: `
Halo ${reg.nama_lengkap},

Ini adalah pengingat bahwa deadline untuk lomba "${deadline.lomba.nama_lomba}" 
${deadline.daysUntilDeadline === 0 ? 'adalah HARI INI!' : `tinggal ${deadline.daysUntilDeadline} hari lagi.`}

Detail Lomba:
- Nama: ${deadline.lomba.nama_lomba}
- Penyelenggara: ${deadline.lomba.penyelenggara}
- Deadline: ${new Date(deadline.lomba.deadline).toLocaleDateString('id-ID', { 
  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
})}

Pastikan Anda sudah menyiapkan semua berkas yang diperlukan.

Salam,
Tim APM Polinema
            `.trim(),
            urgency,
          });
        }
      }

      // In production, integrate with email service here
      // For now, just return what would be sent
      console.log(`[Reminders] Would send ${emailsToSend.length} emails`);
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalLomba: upcomingLomba.length,
        urgent: reminders.urgent.length,
        soon: reminders.soon.length,
        upcoming: reminders.upcoming.length,
        emailsQueued: emailsToSend.length,
      },
      reminders: {
        urgent: reminders.urgent.map(d => ({
          lombaId: d.lomba.id,
          namaLomba: d.lomba.nama_lomba,
          deadline: d.lomba.deadline,
          daysUntil: d.daysUntilDeadline,
          registrationCount: d.registrations.length,
        })),
        soon: reminders.soon.map(d => ({
          lombaId: d.lomba.id,
          namaLomba: d.lomba.nama_lomba,
          deadline: d.lomba.deadline,
          daysUntil: d.daysUntilDeadline,
          registrationCount: d.registrations.length,
        })),
        upcoming: reminders.upcoming.map(d => ({
          lombaId: d.lomba.id,
          namaLomba: d.lomba.nama_lomba,
          deadline: d.lomba.deadline,
          daysUntil: d.daysUntilDeadline,
          registrationCount: d.registrations.length,
        })),
      },
      ...(action === 'send' && { emailsQueued: emailsToSend }),
    });

  } catch (error) {
    console.error('Error fetching deadlines:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/reminders/deadlines
 * 
 * Create a custom reminder for a specific lomba
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { lomba_id, reminder_date, message } = body;

    if (!lomba_id || !reminder_date) {
      return NextResponse.json(
        { error: 'lomba_id dan reminder_date wajib diisi' },
        { status: 400 }
      );
    }

    // Create reminder in apm_reminders collection
    const reminderData = {
      lomba_id,
      reminder_date,
      message: message || 'Pengingat deadline lomba',
      status: 'pending',
      is_deleted: false,
    };

    const response = await fetch(`${DIRECTUS_URL}/items/apm_reminders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(reminderData),
    });

    if (!response.ok) {
      console.error('Failed to create reminder:', await response.text());
      return NextResponse.json(
        { error: 'Gagal membuat pengingat' },
        { status: 500 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      message: 'Pengingat berhasil dibuat',
      data: data.data,
    });

  } catch (error) {
    console.error('Error creating reminder:', error);
    return NextResponse.json(
      { error: 'Terjadi kesalahan server' },
      { status: 500 }
    );
  }
}
