import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { stories, categories } from '@/db/schema';
import { eq } from 'drizzle-orm';

interface Params {
  id: string;
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const story = await db.select({
      id: stories.id,
      title: stories.title,
      slug: stories.slug,
      excerpt: stories.excerpt,
      content: stories.content,
      author: stories.author,
      image: stories.image,
      featured: stories.featured,
      publishedAt: stories.publishedAt,
      createdAt: stories.createdAt,
      updatedAt: stories.updatedAt,
      categoryId: stories.categoryId,
      categoryName: categories.name,
      categorySlug: categories.slug
    })
    .from(stories)
    .leftJoin(categories, eq(stories.categoryId, categories.id))
    .where(eq(stories.id, parseInt(id)))
    .limit(1);

    if (story.length === 0) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json(story[0]);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const requestBody = await request.json();
    const { title, content, categoryId, author, excerpt, image, featured, publishedAt } = requestBody;

    // Check if story exists
    const existingStory = await db.select()
      .from(stories)
      .where(eq(stories.id, parseInt(id)))
      .limit(1);

    if (existingStory.length === 0) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    // Validate category exists if provided
    if (categoryId) {
      const categoryExists = await db.select()
        .from(categories)
        .where(eq(categories.id, categoryId))
        .limit(1);

      if (categoryExists.length === 0) {
        return NextResponse.json({ 
          error: "Category not found",
          code: "CATEGORY_NOT_FOUND" 
        }, { status: 400 });
      }
    }

    const updateData: any = {
      updatedAt: new Date().toISOString()
    };

    if (title !== undefined) {
      updateData.title = title;
      updateData.slug = generateSlug(title);
    }
    if (excerpt !== undefined) updateData.excerpt = excerpt;
    if (content !== undefined) updateData.content = content;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (author !== undefined) updateData.author = author;
    if (image !== undefined) updateData.image = image;
    if (featured !== undefined) updateData.featured = featured;
    if (publishedAt !== undefined) updateData.publishedAt = publishedAt;

    const updated = await db.update(stories)
      .set(updateData)
      .where(eq(stories.id, parseInt(id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<Params> }
) {
  try {
    const resolvedParams = await params;
    const id = resolvedParams.id;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Check if story exists
    const existingStory = await db.select()
      .from(stories)
      .where(eq(stories.id, parseInt(id)))
      .limit(1);

    if (existingStory.length === 0) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    const deleted = await db.delete(stories)
      .where(eq(stories.id, parseInt(id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Story not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Story deleted successfully',
      deletedStory: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}