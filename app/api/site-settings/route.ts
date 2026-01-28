/**
 * API Route: Site Settings
 * GET /api/site-settings
 * 
 * Fetches site settings and statistics from Directus
 * Falls back to calculated values if CMS not configured
 */

import { NextResponse } from 'next/server';

const DIRECTUS_URL = process.env.DIRECTUS_URL || 'http://localhost:8055';

interface SiteStats {
    totalLomba: number;
    totalPrestasi: number;
    totalMahasiswa: number;
    totalExpo: number;
}

interface HelpContent {
    title: string;
    description: string;
    email: string;
    showLocation: boolean;
    location?: string;
}

interface SiteSettings {
    stats: SiteStats;
    help: HelpContent;
}

async function getCalculatedStats(): Promise<SiteStats> {
    const stats: SiteStats = {
        totalLomba: 0,
        totalPrestasi: 0,
        totalMahasiswa: 0,
        totalExpo: 0,
    };

    try {
        // Get lomba count
        const lombaRes = await fetch(
            `${DIRECTUS_URL}/items/apm_lomba?aggregate[count]=id&filter[status][_neq]=closed`,
            { cache: 'no-store' }
        );
        if (lombaRes.ok) {
            const data = await lombaRes.json();
            stats.totalLomba = data.data?.[0]?.count?.id || 0;
        }

        // Get verified prestasi count
        const prestasiRes = await fetch(
            `${DIRECTUS_URL}/items/apm_prestasi?aggregate[count]=id&filter[status_verifikasi][_eq]=verified`,
            { cache: 'no-store' }
        );
        if (prestasiRes.ok) {
            const data = await prestasiRes.json();
            stats.totalPrestasi = data.data?.[0]?.count?.id || 0;
        }

        // Get expo count
        const expoRes = await fetch(
            `${DIRECTUS_URL}/items/apm_expo?aggregate[count]=id`,
            { cache: 'no-store' }
        );
        if (expoRes.ok) {
            const data = await expoRes.json();
            stats.totalExpo = data.data?.[0]?.count?.id || 0;
        }

        // Get unique student count from prestasi tim
        const mahasiswaRes = await fetch(
            `${DIRECTUS_URL}/items/apm_prestasi_tim?aggregate[countDistinct]=nim`,
            { cache: 'no-store' }
        );
        if (mahasiswaRes.ok) {
            const data = await mahasiswaRes.json();
            stats.totalMahasiswa = data.data?.[0]?.countDistinct?.nim || 0;
        }
    } catch (error) {
        console.error('Error calculating stats:', error);
    }

    return stats;
}

export async function GET() {
    try {
        // Try to get CMS-managed settings first
        let settings: SiteSettings | null = null;

        try {
            const settingsRes = await fetch(`${DIRECTUS_URL}/items/apm_site_settings`, {
                cache: 'no-store',
            });

            if (settingsRes.ok) {
                const data = await settingsRes.json();
                if (data.data) {
                    settings = {
                        stats: {
                            totalLomba: data.data.stat_lomba || 0,
                            totalPrestasi: data.data.stat_prestasi || 0,
                            totalMahasiswa: data.data.stat_mahasiswa || 0,
                            totalExpo: data.data.stat_expo || 0,
                        },
                        help: {
                            title: data.data.help_title || 'Butuh Bantuan?',
                            description: data.data.help_description || 'Tim APM siap membantu Anda',
                            email: data.data.help_email || 'apm@polinema.ac.id',
                            showLocation: data.data.help_show_location || false,
                            location: data.data.help_location,
                        },
                    };
                }
            }
        } catch {
            // CMS collection might not exist, fall back to calculated
        }

        // If no CMS settings or stats are 0, calculate from data
        if (!settings || (settings.stats.totalLomba === 0 && settings.stats.totalPrestasi === 0)) {
            const calculatedStats = await getCalculatedStats();
            settings = {
                stats: calculatedStats,
                help: settings?.help || {
                    title: 'Butuh Bantuan?',
                    description: 'Tim APM siap membantu Anda',
                    email: 'apm@polinema.ac.id',
                    showLocation: false,
                },
            };
        }

        return NextResponse.json({
            success: true,
            data: settings,
        });
    } catch (error) {
        console.error('Error fetching site settings:', error);

        // Return defaults on error
        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    totalLomba: 0,
                    totalPrestasi: 0,
                    totalMahasiswa: 0,
                    totalExpo: 0,
                },
                help: {
                    title: 'Butuh Bantuan?',
                    description: 'Tim APM siap membantu Anda',
                    email: 'apm@polinema.ac.id',
                    showLocation: false,
                },
            },
        });
    }
}
