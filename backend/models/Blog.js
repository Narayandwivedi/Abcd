const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Blog title is required'],
    trim: true,
    minlength: [5, 'Title must be at least 5 characters long'],
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  excerpt: {
    type: String,
    required: [true, 'Blog excerpt is required'],
    trim: true,
    minlength: [10, 'Excerpt must be at least 10 characters long'],
    maxlength: [500, 'Excerpt cannot exceed 500 characters']
  },
  content: {
    type: String,
    required: [true, 'Blog content is required'],
    minlength: [50, 'Content must be at least 50 characters long']
  },
  featuredImage: {
    type: String,
    required: [true, 'Featured image is required'],
    trim: true
  },
  author: {
    name: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true,
      default: 'ABCD Team'
    },
    avatar: {
      type: String,
      trim: true
    }
  },
  category: {
    type: String,
    required: [true, 'Blog category is required'],
    trim: true,
    enum: {
      values: ['Business', 'Technology', 'Marketing', 'Finance', 'Community', 'News', 'Tips & Tricks', 'Success Stories', 'Other'],
      message: '{VALUE} is not a valid category'
    }
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  status: {
    type: String,
    enum: {
      values: ['draft', 'published', 'archived'],
      message: '{VALUE} is not a valid status'
    },
    default: 'draft',
    index: true
  },
  isPublished: {
    type: Boolean,
    default: false,
    index: true
  },
  publishedAt: {
    type: Date,
    default: null
  },
  readTime: {
    type: Number, // in minutes
    default: 0
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  likes: {
    type: Number,
    default: 0,
    min: 0
  },
  isFeatured: {
    type: Boolean,
    default: false,
    index: true
  },
  metaTitle: {
    type: String,
    trim: true,
    maxlength: [60, 'Meta title cannot exceed 60 characters']
  },
  metaDescription: {
    type: String,
    trim: true,
    maxlength: [160, 'Meta description cannot exceed 160 characters']
  },
  metaKeywords: [{
    type: String,
    trim: true,
    lowercase: true
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better query performance
blogSchema.index({ slug: 1 });
blogSchema.index({ status: 1, isPublished: 1 });
blogSchema.index({ category: 1 });
blogSchema.index({ createdAt: -1 });
blogSchema.index({ publishedAt: -1 });
blogSchema.index({ isFeatured: 1, isPublished: 1 });
blogSchema.index({ tags: 1 });

// Text index for search functionality
blogSchema.index({
  title: 'text',
  excerpt: 'text',
  content: 'text',
  tags: 'text'
});

// Virtual for formatted publish date
blogSchema.virtual('formattedPublishedDate').get(function() {
  if (!this.publishedAt) return null;
  return this.publishedAt.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Pre-save middleware to calculate read time
blogSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    // Average reading speed: 200 words per minute
    const wordsPerMinute = 200;
    const wordCount = this.content.trim().split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / wordsPerMinute);
  }
  next();
});

// Pre-save middleware to auto-generate slug if not provided
blogSchema.pre('save', function(next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  next();
});

// Pre-save middleware to set published date
blogSchema.pre('save', function(next) {
  // If status changed to published and not already published
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date();
    this.isPublished = true;
  }

  // If status changed from published to draft/archived
  if (this.isModified('status') && this.status !== 'published') {
    this.isPublished = false;
  }

  next();
});

// Static method to get all published blogs
blogSchema.statics.getPublishedBlogs = function(options = {}) {
  const { limit = 10, skip = 0, category, tag, featured } = options;

  const query = { status: 'published', isPublished: true };

  if (category) query.category = category;
  if (tag) query.tags = tag;
  if (featured !== undefined) query.isFeatured = featured;

  return this.find(query)
    .sort({ publishedAt: -1 })
    .limit(limit)
    .skip(skip)
    .select('-__v')
    .lean();
};

// Static method to get blog by slug
blogSchema.statics.findBySlug = function(slug, includeUnpublished = false) {
  const query = { slug };
  if (!includeUnpublished) {
    query.status = 'published';
    query.isPublished = true;
  }
  return this.findOne(query).select('-__v');
};

// Instance method to increment views
blogSchema.methods.incrementViews = function() {
  this.views += 1;
  return this.save();
};

// Instance method to increment likes
blogSchema.methods.incrementLikes = function() {
  this.likes += 1;
  return this.save();
};

// Instance method to publish blog
blogSchema.methods.publish = function() {
  this.status = 'published';
  this.isPublished = true;
  if (!this.publishedAt) {
    this.publishedAt = new Date();
  }
  return this.save();
};

// Instance method to unpublish blog
blogSchema.methods.unpublish = function() {
  this.status = 'draft';
  this.isPublished = false;
  return this.save();
};

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
