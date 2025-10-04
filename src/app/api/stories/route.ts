import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { stories, categories } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single story by ID
    if (id) {
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
        return NextResponse.json({ 
          error: 'Story not found',
          code: "STORY_NOT_FOUND" 
        }, { status: 404 });
      }

      return NextResponse.json(story[0]);
    }

    // List stories with pagination, search, and filtering
    const limit = Math.min(parseInt(searchParams.get('limit') || '10'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const search = searchParams.get('search');
    const categoryId = searchParams.get('category_id');
    const featured = searchParams.get('featured');
    const author = searchParams.get('author');
    const sort = searchParams.get('sort') || 'createdAt';
    const order = searchParams.get('order') || 'desc';

    // Build conditions array
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(stories.title, `%${search}%`),
          like(stories.excerpt, `%${search}%`),
          like(stories.content, `%${search}%`)
        )
      );
    }

    if (categoryId) {
      if (isNaN(parseInt(categoryId))) {
        return NextResponse.json({ 
          error: "Valid category ID is required",
          code: "INVALID_CATEGORY_ID" 
        }, { status: 400 });
      }
      conditions.push(eq(stories.categoryId, parseInt(categoryId)));
    }

    if (featured !== null && featured !== undefined) {
      const isFeatured = featured === 'true' || featured === '1';
      conditions.push(eq(stories.featured, isFeatured));
    }

    if (author) {
      conditions.push(like(stories.author, `%${author}%`));
    }

    // Determine sort field and order
    const validSortFields = ['publishedAt', 'createdAt', 'title'];
    const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
    const sortOrder = order === 'asc' ? asc : desc;

    // Build base query (select + from only, no joins yet)
    const baseQuery = db.select({
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
    .from(stories);

    // Apply where conditions if needed
    const filteredQuery = conditions.length > 0 
      ? baseQuery.where(and(...conditions))
      : baseQuery;

    // Apply left join to get category data
    const queryWithJoin = filteredQuery.leftJoin(categories, eq(stories.categoryId, categories.id));

    // Apply sorting
    let queryWithSort;
    if (sortField === 'publishedAt') {
      queryWithSort = queryWithJoin.orderBy(sortOrder(stories.publishedAt));
    } else if (sortField === 'createdAt') {
      queryWithSort = queryWithJoin.orderBy(sortOrder(stories.createdAt));
    } else {
      queryWithSort = queryWithJoin.orderBy(sortOrder(stories.title));
    }

    // Execute with pagination
    const results = await queryWithSort.limit(limit).offset(offset);

    return NextResponse.json(results);

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { title, content, categoryId, author, excerpt, image, featured, publishedAt } = requestBody;

    // Validate required fields
    if (!title) {
      return NextResponse.json({ 
        error: "Title is required",
        code: "MISSING_TITLE" 
      }, { status: 400 });
    }

    if (!content) {
      return NextResponse.json({ 
        error: "Content is required",
        code: "MISSING_CONTENT" 
      }, { status: 400 });
    }

    if (!categoryId) {
      return NextResponse.json({ 
        error: "Category ID is required",
        code: "MISSING_CATEGORY_ID" 
      }, { status: 400 });
    }

    if (!author) {
      return NextResponse.json({ 
        error: "Author is required",
        code: "MISSING_AUTHOR" 
      }, { status: 400 });
    }

    // Validate category exists
    if (isNaN(parseInt(categoryId))) {
      return NextResponse.json({ 
        error: "Valid category ID is required",
        code: "INVALID_CATEGORY_ID" 
      }, { status: 400 });
    }

    const existingCategory = await db.select()
      .from(categories)
      .where(eq(categories.id, parseInt(categoryId)))
      .limit(1);

    if (existingCategory.length === 0) {
      return NextResponse.json({ 
        error: "Category not found",
        code: "CATEGORY_NOT_FOUND" 
      }, { status: 404 });
    }

    // Generate slug from title
    const slug = generateSlug(title.trim());

    // Prepare insert data
    const insertData = {
      title: title.trim(),
      slug,
      content: content.trim(),
      categoryId: parseInt(categoryId),
      author: author.trim(),
      excerpt: excerpt ? excerpt.trim() : null,
      image: image ? image.trim() : null,
      featured: featured ? Boolean(featured) : false,
      publishedAt: publishedAt ? publishedAt : null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const newStory = await db.insert(stories)
      .values(insertData)
      .returning();

    return NextResponse.json(newStory[0], { status: 201 });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

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
      return NextResponse.json({ 
        error: 'Story not found',
        code: "STORY_NOT_FOUND" 
      }, { status: 404 });
    }

    const requestBody = await request.json();
    const { title, content, categoryId, author, excerpt, image, featured, publishedAt } = requestBody;
    const updates: any = {};

    // Update fields if provided
    if (title !== undefined) {
      if (!title.trim()) {
        return NextResponse.json({ 
          error: "Title cannot be empty",
          code: "INVALID_TITLE" 
        }, { status: 400 });
      }
      updates.title = title.trim();
      updates.slug = generateSlug(title.trim());
    }

    if (content !== undefined) {
      if (!content.trim()) {
        return NextResponse.json({ 
          error: "Content cannot be empty",
          code: "INVALID_CONTENT" 
        }, { status: 400 });
      }
      updates.content = content.trim();
    }

    if (categoryId !== undefined) {
      if (isNaN(parseInt(categoryId))) {
        return NextResponse.json({ 
          error: "Valid category ID is required",
          code: "INVALID_CATEGORY_ID" 
        }, { status: 400 });
      }

      // Validate category exists
      const existingCategory = await db.select()
        .from(categories)
        .where(eq(categories.id, parseInt(categoryId)))
        .limit(1);

      if (existingCategory.length === 0) {
        return NextResponse.json({ 
          error: "Category not found",
          code: "CATEGORY_NOT_FOUND" 
        }, { status: 404 });
      }

      updates.categoryId = parseInt(categoryId);
    }

    if (author !== undefined) {
      if (!author.trim()) {
        return NextResponse.json({ 
          error: "Author cannot be empty",
          code: "INVALID_AUTHOR" 
        }, { status: 400 });
      }
      updates.author = author.trim();
    }

    if (excerpt !== undefined) {
      updates.excerpt = excerpt ? excerpt.trim() : null;
    }

    if (image !== undefined) {
      updates.image = image ? image.trim() : null;
    }

    if (featured !== undefined) {
      updates.featured = Boolean(featured);
    }

    if (publishedAt !== undefined) {
      updates.publishedAt = publishedAt || null;
    }

    // Always update the updated_at timestamp
    updates.updatedAt = new Date().toISOString();

    const updatedStory = await db.update(stories)
      .set(updates)
      .where(eq(stories.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedStory[0]);

  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

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
      return NextResponse.json({ 
        error: 'Story not found',
        code: "STORY_NOT_FOUND" 
      }, { status: 404 });
    }

    const deletedStory = await db.delete(stories)
      .where(eq(stories.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Story deleted successfully',
      story: deletedStory[0]
    });

  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}