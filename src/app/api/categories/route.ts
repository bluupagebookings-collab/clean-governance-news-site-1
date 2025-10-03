import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { categories } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const allCategories = await db.select({
      id: categories.id,
      name: categories.name,
      slug: categories.slug,
      createdAt: categories.createdAt
    })
    .from(categories)
    .orderBy(asc(categories.name));

    return NextResponse.json(allCategories, { status: 200 });
  } catch (error) {
    console.error('GET categories error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return NextResponse.json({ 
        error: "Name is required and must be a non-empty string",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    const trimmedName = name.trim();

    // Check if name already exists
    const existingCategory = await db.select()
      .from(categories)
      .where(eq(categories.name, trimmedName))
      .limit(1);

    if (existingCategory.length > 0) {
      return NextResponse.json({ 
        error: "Category name already exists",
        code: "DUPLICATE_NAME" 
      }, { status: 400 });
    }

    // Generate slug from name
    let baseSlug = trimmedName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

    // Ensure slug uniqueness
    let slug = baseSlug;
    let counter = 1;
    
    while (true) {
      const existingSlug = await db.select()
        .from(categories)
        .where(eq(categories.slug, slug))
        .limit(1);

      if (existingSlug.length === 0) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newCategory = await db.insert(categories)
      .values({
        name: trimmedName,
        slug: slug,
        createdAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newCategory[0], { status: 201 });
  } catch (error) {
    console.error('POST categories error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}