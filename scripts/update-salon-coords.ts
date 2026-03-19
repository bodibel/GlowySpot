import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import "dotenv/config"

const connectionString = `${process.env.DATABASE_URL}`
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const cityCoords: Record<string, { lat: number, lng: number }> = {
    "Budapest": { lat: 47.4979, lng: 19.0402 },
    "Debrecen": { lat: 47.5316, lng: 21.6273 },
    "Szeged": { lat: 46.2530, lng: 20.1414 },
    "Miskolc": { lat: 48.1035, lng: 20.7834 },
    "Pécs": { lat: 46.0727, lng: 18.2323 },
    "Győr": { lat: 47.6875, lng: 17.6504 },
    "Nyíregyháza": { lat: 47.9554, lng: 21.7167 },
    "Kecskemét": { lat: 46.8964, lng: 19.6897 },
    "Székesfehérvár": { lat: 47.1860, lng: 18.4221 },
    "Szombathely": { lat: 47.2307, lng: 16.6218 }
}

async function main() {
    const salons = await prisma.salon.findMany()
    console.log(`Updating ${salons.length} salons...`)

    for (const salon of salons) {
        const coords = cityCoords[salon.city]
        if (coords) {
            await prisma.salon.update({
                where: { id: salon.id },
                data: {
                    lat: coords.lat + (Math.random() - 0.5) * 0.02, // Add tiny jitter
                    lng: coords.lng + (Math.random() - 0.5) * 0.02
                }
            })
            console.log(`Updated ${salon.name} in ${salon.city}`)
        }
    }

    console.log("Done!")
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
