import { db } from '@/db';
import { categories } from '@/db/schema';

async function main() {
    const sampleCategories = [
        {
            name: 'Municipal',
            slug: 'municipal',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Provincial',
            slug: 'provincial',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Investigations',
            slug: 'investigations',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'Opinion',
            slug: 'opinion',
            createdAt: new Date().toISOString(),
        },
        {
            name: 'International',
            slug: 'international',
            createdAt: new Date().toISOString(),
        }
    ];

    await db.insert(categories).values(sampleCategories);
    
    console.log('✅ Categories seeder completed successfully');
}

main().catch((error) => {
    console.error('❌ Seeder failed:', error);
});