const Blog = require("../models/Blog");

// Helper function to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
};

// Validation helper functions
const validateBlogData = (data, isUpdate = false) => {
  const errors = [];

  // Title validation
  if (!isUpdate || data.title !== undefined) {
    if (!data.title || typeof data.title !== 'string') {
      errors.push('Title is required and must be a string');
    } else if (data.title.trim().length < 5) {
      errors.push('Title must be at least 5 characters long');
    } else if (data.title.trim().length > 200) {
      errors.push('Title cannot exceed 200 characters');
    }
  }

  // Excerpt validation
  if (!isUpdate || data.excerpt !== undefined) {
    if (!data.excerpt || typeof data.excerpt !== 'string') {
      errors.push('Excerpt is required and must be a string');
    } else if (data.excerpt.trim().length < 10) {
      errors.push('Excerpt must be at least 10 characters long');
    } else if (data.excerpt.trim().length > 500) {
      errors.push('Excerpt cannot exceed 500 characters');
    }
  }

  // Content validation
  if (!isUpdate || data.content !== undefined) {
    if (!data.content || typeof data.content !== 'string') {
      errors.push('Content is required and must be a string');
    } else if (data.content.trim().length < 50) {
      errors.push('Content must be at least 50 characters long');
    }
  }

  // Featured Image validation
  if (!isUpdate || data.featuredImage !== undefined) {
    if (!data.featuredImage || typeof data.featuredImage !== 'string') {
      errors.push('Featured image is required and must be a valid URL');
    } else if (data.featuredImage.trim().length === 0) {
      errors.push('Featured image URL cannot be empty');
    }
  }

  // Category validation
  const validCategories = ['Business', 'Technology', 'Marketing', 'Finance', 'Community', 'News', 'Tips & Tricks', 'Success Stories', 'Other'];
  if (!isUpdate || data.category !== undefined) {
    if (!data.category) {
      errors.push('Category is required');
    } else if (!validCategories.includes(data.category)) {
      errors.push(`Category must be one of: ${validCategories.join(', ')}`);
    }
  }

  // Status validation
  const validStatuses = ['draft', 'published', 'archived'];
  if (data.status !== undefined) {
    if (!validStatuses.includes(data.status)) {
      errors.push(`Status must be one of: ${validStatuses.join(', ')}`);
    }
  }

  // Author validation
  if (data.author !== undefined) {
    if (typeof data.author !== 'object' || !data.author.name) {
      errors.push('Author must be an object with a name property');
    } else if (data.author.name.trim().length === 0) {
      errors.push('Author name cannot be empty');
    }
  }

  // Tags validation
  if (data.tags !== undefined) {
    if (!Array.isArray(data.tags)) {
      errors.push('Tags must be an array');
    } else if (data.tags.length > 10) {
      errors.push('Cannot have more than 10 tags');
    } else {
      for (const tag of data.tags) {
        if (typeof tag !== 'string' || tag.trim().length === 0) {
          errors.push('All tags must be non-empty strings');
          break;
        }
      }
    }
  }

  // Meta Title validation
  if (data.metaTitle !== undefined && data.metaTitle) {
    if (typeof data.metaTitle !== 'string') {
      errors.push('Meta title must be a string');
    } else if (data.metaTitle.length > 60) {
      errors.push('Meta title cannot exceed 60 characters');
    }
  }

  // Meta Description validation
  if (data.metaDescription !== undefined && data.metaDescription) {
    if (typeof data.metaDescription !== 'string') {
      errors.push('Meta description must be a string');
    } else if (data.metaDescription.length > 160) {
      errors.push('Meta description cannot exceed 160 characters');
    }
  }

  // Meta Keywords validation
  if (data.metaKeywords !== undefined) {
    if (!Array.isArray(data.metaKeywords)) {
      errors.push('Meta keywords must be an array');
    } else if (data.metaKeywords.length > 15) {
      errors.push('Cannot have more than 15 meta keywords');
    }
  }

  // Boolean validations
  if (data.isFeatured !== undefined && typeof data.isFeatured !== 'boolean') {
    errors.push('isFeatured must be a boolean');
  }

  if (data.isPublished !== undefined && typeof data.isPublished !== 'boolean') {
    errors.push('isPublished must be a boolean');
  }

  return errors;
};

// Get all blogs (Admin - includes all statuses)
const getAllBlogsAdmin = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      search,
      sortBy = 'createdAt',
      order = 'desc',
      isFeatured
    } = req.query;

    // Validate page and limit
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid page number'
      });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 100'
      });
    }

    // Build query
    let query = {};

    if (status) {
      if (!['draft', 'published', 'archived'].includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid status value'
        });
      }
      query.status = status;
    }

    if (category) {
      query.category = category;
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    // Count total documents
    const total = await Blog.countDocuments(query);

    // Validate sort field
    const validSortFields = ['createdAt', 'updatedAt', 'publishedAt', 'title', 'views', 'likes'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    const sortOrder = order === 'asc' ? 1 : -1;

    // Fetch blogs
    const blogs = await Blog.find(query)
      .sort({ [sortField]: sortOrder })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .select('-__v');

    // Calculate stats
    const stats = {
      total: await Blog.countDocuments(),
      published: await Blog.countDocuments({ status: 'published' }),
      draft: await Blog.countDocuments({ status: 'draft' }),
      archived: await Blog.countDocuments({ status: 'archived' }),
      featured: await Blog.countDocuments({ isFeatured: true })
    };

    return res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      stats,
      blogs
    });
  } catch (error) {
    console.error('Get all blogs admin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
};

// Get all published blogs (Public)
const getAllBlogs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      category,
      tag,
      isFeatured,
      search
    } = req.query;

    // Validate page and limit
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    if (isNaN(pageNum) || pageNum < 1) {
      return res.status(400).json({
        success: false,
        message: 'Invalid page number'
      });
    }

    if (isNaN(limitNum) || limitNum < 1 || limitNum > 50) {
      return res.status(400).json({
        success: false,
        message: 'Limit must be between 1 and 50'
      });
    }

    // Build query - only published blogs
    let query = { status: 'published', isPublished: true };

    if (category) {
      query.category = category;
    }

    if (tag) {
      query.tags = tag;
    }

    if (isFeatured !== undefined) {
      query.isFeatured = isFeatured === 'true';
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { excerpt: { $regex: search, $options: 'i' } },
        { tags: { $regex: search, $options: 'i' } }
      ];
    }

    const total = await Blog.countDocuments(query);

    const blogs = await Blog.find(query)
      .sort({ publishedAt: -1 })
      .limit(limitNum)
      .skip((pageNum - 1) * limitNum)
      .select('title slug excerpt featuredImage author category tags publishedAt readTime views likes isFeatured');

    return res.status(200).json({
      success: true,
      count: blogs.length,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
      blogs
    });
  } catch (error) {
    console.error('Get all blogs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blogs',
      error: error.message
    });
  }
};

// Get single blog by ID or slug (Admin)
const getBlogByIdAdmin = async (req, res) => {
  try {
    const { blogId } = req.params;

    if (!blogId || typeof blogId !== 'string' || blogId.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Blog ID is required'
      });
    }

    let blog;

    // Check if it's a MongoDB ObjectId
    if (blogId.match(/^[0-9a-fA-F]{24}$/)) {
      blog = await Blog.findById(blogId).select('-__v');
    } else {
      // Try to find by slug (include unpublished)
      blog = await Blog.findBySlug(blogId, true);
    }

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    return res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Get blog by ID admin error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
};

// Get single blog by slug (Public - only published)
const getBlogBySlug = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Blog slug is required'
      });
    }

    const blog = await Blog.findBySlug(slug);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Increment views (asynchronously, don't wait)
    blog.incrementViews().catch(err => console.error('Error incrementing views:', err));

    return res.status(200).json({
      success: true,
      blog
    });
  } catch (error) {
    console.error('Get blog by slug error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch blog',
      error: error.message
    });
  }
};

// Create new blog (Admin)
const createBlog = async (req, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      featuredImage,
      author,
      category,
      tags,
      status,
      isFeatured,
      metaTitle,
      metaDescription,
      metaKeywords
    } = req.body;

    // Validate input
    const validationErrors = validateBlogData(req.body, false);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    // Generate slug from title
    const slug = generateSlug(title);

    // Check if blog with same slug already exists
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return res.status(400).json({
        success: false,
        message: 'Blog with similar title already exists'
      });
    }

    // Create blog data object
    const blogData = {
      title: title.trim(),
      slug,
      excerpt: excerpt.trim(),
      content: content.trim(),
      featuredImage: featuredImage.trim(),
      category,
      status: status || 'draft',
      author: author || { name: 'ABCD Team' },
      tags: tags ? tags.map(tag => tag.trim().toLowerCase()) : [],
      isFeatured: isFeatured || false,
      metaTitle: metaTitle ? metaTitle.trim() : title.trim(),
      metaDescription: metaDescription ? metaDescription.trim() : excerpt.trim(),
      metaKeywords: metaKeywords ? metaKeywords.map(kw => kw.trim().toLowerCase()) : []
    };

    // Create blog
    const blog = await Blog.create(blogData);

    console.log(`[ADMIN] Blog created: ${blog.title} (${blog.slug})`);

    return res.status(201).json({
      success: true,
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to create blog',
      error: error.message
    });
  }
};

// Update blog (Admin)
const updateBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Validate blog ID
    if (!blogId || !blogId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID'
      });
    }

    // Find blog
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    // Validate input
    const validationErrors = validateBlogData(req.body, true);
    if (validationErrors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: validationErrors
      });
    }

    const {
      title,
      excerpt,
      content,
      featuredImage,
      author,
      category,
      tags,
      status,
      isFeatured,
      metaTitle,
      metaDescription,
      metaKeywords
    } = req.body;

    // Check if title changed and generate new slug
    if (title && title !== blog.title) {
      const newSlug = generateSlug(title);

      // Check if new slug conflicts with another blog
      const duplicateBlog = await Blog.findOne({
        _id: { $ne: blogId },
        slug: newSlug
      });

      if (duplicateBlog) {
        return res.status(400).json({
          success: false,
          message: 'Blog with similar title already exists'
        });
      }

      blog.title = title.trim();
      blog.slug = newSlug;
    }

    // Update fields
    if (excerpt !== undefined) blog.excerpt = excerpt.trim();
    if (content !== undefined) blog.content = content.trim();
    if (featuredImage !== undefined) blog.featuredImage = featuredImage.trim();
    if (category !== undefined) blog.category = category;
    if (status !== undefined) blog.status = status;
    if (isFeatured !== undefined) blog.isFeatured = isFeatured;
    if (author !== undefined) blog.author = author;
    if (tags !== undefined) blog.tags = tags.map(tag => tag.trim().toLowerCase());
    if (metaTitle !== undefined) blog.metaTitle = metaTitle.trim();
    if (metaDescription !== undefined) blog.metaDescription = metaDescription.trim();
    if (metaKeywords !== undefined) blog.metaKeywords = metaKeywords.map(kw => kw.trim().toLowerCase());

    await blog.save();

    console.log(`[ADMIN] Blog updated: ${blog.title} (${blog.slug})`);

    return res.status(200).json({
      success: true,
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update blog',
      error: error.message
    });
  }
};

// Delete blog (Admin)
const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Validate blog ID
    if (!blogId || !blogId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID'
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    const blogTitle = blog.title;
    await Blog.findByIdAndDelete(blogId);

    console.log(`[ADMIN] Blog deleted: ${blogTitle}`);

    return res.status(200).json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete blog',
      error: error.message
    });
  }
};

// Publish blog (Admin)
const publishBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Validate blog ID
    if (!blogId || !blogId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID'
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    if (blog.status === 'published') {
      return res.status(400).json({
        success: false,
        message: 'Blog is already published'
      });
    }

    await blog.publish();

    console.log(`[ADMIN] Blog published: ${blog.title}`);

    return res.status(200).json({
      success: true,
      message: 'Blog published successfully',
      blog
    });
  } catch (error) {
    console.error('Publish blog error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to publish blog',
      error: error.message
    });
  }
};

// Unpublish blog (Admin)
const unpublishBlog = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Validate blog ID
    if (!blogId || !blogId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID'
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    if (blog.status !== 'published') {
      return res.status(400).json({
        success: false,
        message: 'Blog is not published'
      });
    }

    await blog.unpublish();

    console.log(`[ADMIN] Blog unpublished: ${blog.title}`);

    return res.status(200).json({
      success: true,
      message: 'Blog unpublished successfully',
      blog
    });
  } catch (error) {
    console.error('Unpublish blog error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to unpublish blog',
      error: error.message
    });
  }
};

// Toggle featured status (Admin)
const toggleFeatured = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Validate blog ID
    if (!blogId || !blogId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid blog ID'
      });
    }

    const blog = await Blog.findById(blogId);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    blog.isFeatured = !blog.isFeatured;
    await blog.save();

    console.log(`[ADMIN] Blog featured status toggled: ${blog.title} - ${blog.isFeatured ? 'Featured' : 'Not Featured'}`);

    return res.status(200).json({
      success: true,
      message: `Blog ${blog.isFeatured ? 'marked as featured' : 'removed from featured'}`,
      blog
    });
  } catch (error) {
    console.error('Toggle featured error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to toggle featured status',
      error: error.message
    });
  }
};

// Increment blog likes (Public)
const likeBlog = async (req, res) => {
  try {
    const { slug } = req.params;

    if (!slug || typeof slug !== 'string' || slug.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Blog slug is required'
      });
    }

    const blog = await Blog.findBySlug(slug);

    if (!blog) {
      return res.status(404).json({
        success: false,
        message: 'Blog not found'
      });
    }

    await blog.incrementLikes();

    return res.status(200).json({
      success: true,
      message: 'Blog liked successfully',
      likes: blog.likes
    });
  } catch (error) {
    console.error('Like blog error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to like blog',
      error: error.message
    });
  }
};

module.exports = {
  getAllBlogsAdmin,
  getAllBlogs,
  getBlogByIdAdmin,
  getBlogBySlug,
  createBlog,
  updateBlog,
  deleteBlog,
  publishBlog,
  unpublishBlog,
  toggleFeatured,
  likeBlog
};
