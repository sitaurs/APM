/**
 * Script to sync thumbnails and galeri from submission documents to published prestasi
 */

import 'dotenv/config'
import { prisma } from '../lib/prisma/client'

async function main() {
  console.log('Syncing prestasi thumbnails...')
  
  // Get all published prestasi
  const allPrestasi = await prisma.prestasi.findMany({
    include: {
      submission: {
        include: {
          documents: true,
        }
      }
    }
  })
  
  for (const prestasi of allPrestasi) {
    const dokumentasiDocs = prestasi.submission.documents.filter(d => d.type === 'dokumentasi')
    const sertifikatDoc = prestasi.submission.documents.find(d => d.type === 'sertifikat')
    const galeri = dokumentasiDocs.map(d => d.file_path)
    const thumbnail = galeri[0] || null
    
    if (galeri.length > 0 && (!prestasi.thumbnail || (prestasi.galeri as unknown[])?.length === 0)) {
      console.log(`Updating prestasi "${prestasi.judul}" with ${galeri.length} photos`)
      
      await prisma.prestasi.update({
        where: { id: prestasi.id },
        data: {
          thumbnail,
          galeri,
          sertifikat: sertifikatDoc?.file_path || prestasi.sertifikat,
        }
      })
      
      console.log(`  - Thumbnail: ${thumbnail}`)
      console.log(`  - Galeri: ${galeri.length} items`)
    }
  }
  
  console.log('Done!')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
