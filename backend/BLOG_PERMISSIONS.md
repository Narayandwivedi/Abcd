# Blog Management & SubAdmin Permissions

This document explains the blog management system and how to assign blog permissions to subadmins.

## 📚 Blog System Overview

The blog system allows admins and authorized subadmins to manage blog posts with comprehensive CRUD operations, publishing controls, and SEO features.

### Blog Features

- **Full CRUD Operations**: Create, Read, Update, Delete blogs
- **Publishing Workflow**: Draft → Published → Archived
- **Featured Blogs**: Mark important blogs as featured
- **SEO Optimization**: Meta titles, descriptions, and keywords
- **Auto Features**: Auto-generated slugs, read time calculation, view tracking
- **Rich Content**: Categories, tags, author info, featured images
- **Search & Filter**: Pagination, search, category/tag filtering
- **Social Features**: Views and likes tracking

---

## 🔐 SubAdmin Blog Permissions

SubAdmins can be granted specific permissions to manage blogs. There are **5 blog permissions**:

### Permission Types

| Permission | Description | What it allows |
|-----------|-------------|----------------|
| `canViewBlogs` | View blogs | View all blogs (any status) and get blog details |
| `canCreateBlogs` | Create blogs | Create new blog posts |
| `canEditBlogs` | Edit blogs | Update existing blogs and toggle featured status |
| `canDeleteBlogs` | Delete blogs | Permanently delete blog posts |
| `canPublishBlogs` | Publish/Unpublish blogs | Change blog status (publish/unpublish) |

### Default Values

All blog permissions default to `false` when a new subadmin is created. Admin must explicitly grant permissions.

---

## 🛠️ Admin: Managing SubAdmin Blog Permissions

### Create SubAdmin with Blog Permissions

**Endpoint:** `POST /api/admin/subadmins`

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "mobile": "1234567890",
  "password": "securepassword",
  "permissions": {
    "canViewBlogs": true,
    "canCreateBlogs": true,
    "canEditBlogs": true,
    "canDeleteBlogs": false,
    "canPublishBlogs": true
  }
}
```

### Update SubAdmin Permissions

**Endpoint:** `PUT /api/admin/subadmins/:subAdminId`

```json
{
  "permissions": {
    "canViewBlogs": true,
    "canCreateBlogs": true,
    "canEditBlogs": true,
    "canDeleteBlogs": true,
    "canPublishBlogs": true
  }
}
```

**Note:** The permissions object is merged with existing permissions, so you only need to include the permissions you want to change.

### Common Permission Sets

#### **Content Writer** (Create & Edit Only)
```json
{
  "canViewBlogs": true,
  "canCreateBlogs": true,
  "canEditBlogs": true,
  "canDeleteBlogs": false,
  "canPublishBlogs": false
}
```

#### **Content Editor** (Everything except Delete)
```json
{
  "canViewBlogs": true,
  "canCreateBlogs": true,
  "canEditBlogs": true,
  "canDeleteBlogs": false,
  "canPublishBlogs": true
}
```

#### **Content Manager** (Full Access)
```json
{
  "canViewBlogs": true,
  "canCreateBlogs": true,
  "canEditBlogs": true,
  "canDeleteBlogs": true,
  "canPublishBlogs": true
}
```

#### **Content Reviewer** (View & Publish Only)
```json
{
  "canViewBlogs": true,
  "canCreateBlogs": false,
  "canEditBlogs": false,
  "canDeleteBlogs": false,
  "canPublishBlogs": true
}
```

---

## 📝 SubAdmin: Blog Management Endpoints

### Authentication Required

All endpoints require subadmin authentication via `subAdminToken` cookie.

### Available Endpoints

#### 1. Get All Blogs
```
GET /api/subadmin/blogs
```
**Permission Required:** `canViewBlogs`

**Query Parameters:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 100)
- `status` - Filter by status (draft/published/archived)
- `category` - Filter by category
- `search` - Search in title, excerpt, tags
- `sortBy` - Sort field (default: createdAt)
- `order` - Sort order (asc/desc, default: desc)
- `isFeatured` - Filter featured blogs (true/false)

**Example:**
```
GET /api/subadmin/blogs?page=1&limit=10&status=published&category=Business
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 45,
  "currentPage": 1,
  "totalPages": 5,
  "stats": {
    "total": 45,
    "published": 30,
    "draft": 10,
    "archived": 5,
    "featured": 8
  },
  "blogs": [...]
}
```

#### 2. Get Single Blog
```
GET /api/subadmin/blogs/:blogId
```
**Permission Required:** `canViewBlogs`

**Parameters:**
- `blogId` - MongoDB ObjectId or slug

#### 3. Create Blog
```
POST /api/subadmin/blogs
```
**Permission Required:** `canCreateBlogs`

**Body:**
```json
{
  "title": "10 Tips for Growing Your Business",
  "excerpt": "Learn the essential strategies for business growth",
  "content": "Full blog content here... (minimum 50 characters)",
  "featuredImage": "https://example.com/image.jpg",
  "category": "Business",
  "tags": ["business", "growth", "tips"],
  "status": "draft",
  "author": {
    "name": "John Doe",
    "avatar": "https://example.com/avatar.jpg"
  },
  "isFeatured": false,
  "metaTitle": "Business Growth Tips",
  "metaDescription": "Discover 10 proven strategies...",
  "metaKeywords": ["business", "growth", "startup"]
}
```

**Validation:**
- Title: 5-200 characters (required)
- Excerpt: 10-500 characters (required)
- Content: minimum 50 characters (required)
- Featured Image: required
- Category: must be valid (Business, Technology, Marketing, etc.)
- Tags: max 10 tags
- Meta Title: max 60 characters
- Meta Description: max 160 characters
- Meta Keywords: max 15 keywords

#### 4. Update Blog
```
PUT /api/subadmin/blogs/:blogId
```
**Permission Required:** `canEditBlogs`

**Body:** Same as create (all fields optional)

#### 5. Delete Blog
```
DELETE /api/subadmin/blogs/:blogId
```
**Permission Required:** `canDeleteBlogs`

#### 6. Publish Blog
```
PATCH /api/subadmin/blogs/:blogId/publish
```
**Permission Required:** `canPublishBlogs`

**Effect:**
- Sets status to "published"
- Sets isPublished to true
- Sets publishedAt to current date (if not already set)

#### 7. Unpublish Blog
```
PATCH /api/subadmin/blogs/:blogId/unpublish
```
**Permission Required:** `canPublishBlogs`

**Effect:**
- Sets status to "draft"
- Sets isPublished to false

#### 8. Toggle Featured Status
```
PATCH /api/subadmin/blogs/:blogId/toggle-featured
```
**Permission Required:** `canEditBlogs`

**Effect:**
- Toggles isFeatured between true/false

---

## 🌍 Public Blog Endpoints

These endpoints are available without authentication for public consumption:

```
GET /api/blogs                  - Get all published blogs
GET /api/blogs/:slug            - Get single blog by slug
POST /api/blogs/:slug/like      - Like a blog
```

**Note:** Public endpoints only show published blogs. Draft and archived blogs are hidden.

---

## 🔒 Permission Error Responses

### 401 Unauthorized
When subadmin is not authenticated:
```json
{
  "success": false,
  "message": "Unauthorized - No token provided"
}
```

### 403 Forbidden
When subadmin lacks required permission:
```json
{
  "success": false,
  "message": "Forbidden - You don't have permission to canViewBlogs"
}
```

### Account Deactivated
When subadmin account is inactive:
```json
{
  "success": false,
  "message": "Forbidden - Account is deactivated"
}
```

---

## 📊 Blog Categories

Valid blog categories:
- Business
- Technology
- Marketing
- Finance
- Community
- News
- Tips & Tricks
- Success Stories
- Other

---

## 🎯 Blog Status Workflow

```
Draft (default)
  ↓
  ↓ (Publish)
  ↓
Published (public)
  ↓
  ↓ (Unpublish)
  ↓
Draft
  ↓
  ↓ (Archive)
  ↓
Archived (hidden)
```

---

## 💡 Best Practices

### For Admins

1. **Principle of Least Privilege**: Only grant permissions that subadmins actually need
2. **Content Writers**: Give create/edit but not publish/delete
3. **Content Reviewers**: Give view/publish but not create/edit/delete
4. **Content Managers**: Give full permissions for trusted staff
5. **Regular Audits**: Review subadmin permissions regularly

### For SubAdmins

1. **Draft First**: Create blogs as drafts, then publish after review
2. **SEO Optimization**: Always fill in meta titles and descriptions
3. **Featured Sparingly**: Only mark truly important blogs as featured
4. **Proper Categorization**: Choose the most relevant category
5. **Meaningful Tags**: Use 3-5 relevant tags per blog

---

## 🔧 Technical Details

### Model Location
`backend/models/SubAdmin.js`

### Permission Fields
```javascript
permissions: {
  canViewBlogs: Boolean,
  canCreateBlogs: Boolean,
  canEditBlogs: Boolean,
  canDeleteBlogs: Boolean,
  canPublishBlogs: Boolean
}
```

### Middleware
`backend/middleware/subAdminAuth.js`
- `subAdminAuth`: Verifies authentication
- `checkPermission(permission)`: Checks specific permission

### Routes
`backend/routes/subAdminRoute.js`

### Controller
`backend/controllers/blogController.js`

---

## 📞 Support

For issues or questions:
- Check server logs for detailed error messages
- Verify subadmin authentication token
- Confirm permissions are correctly set in database
- Review this documentation for proper usage

---

**Last Updated:** January 2025
