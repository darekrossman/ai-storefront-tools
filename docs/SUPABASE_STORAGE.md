# Supabase Storage Implementation

This project uses Supabase Storage for secure file management with automated policies and validation. The implementation supports user avatars and product images with proper access controls.

## Overview

The storage system provides:
- **Secure File Upload**: Automatic validation and sanitization
- **Access Control**: Row Level Security (RLS) policies ensure users can only access their own files
- **Automatic Cleanup**: Old files are automatically removed when replaced
- **Organized Structure**: Files are organized by user/project for easy management
- **Type Safety**: Full TypeScript integration with validation

## Storage Structure

### Buckets

```
avatars/
├── {user_id}/
│   └── avatar.{ext}

product-images/
├── {project_id}/
│   └── products/
│       └── {product_id}/
│           ├── hero_{timestamp}_{name}.{ext}
│           ├── gallery_{timestamp}_{name}.{ext}
│           ├── thumbnail_{timestamp}_{name}.{ext}
│           └── ...
```

### File Organization

- **Avatars**: `{user_id}/avatar.{extension}`
- **Product Images**: `{project_id}/products/{product_id}/{type}_{timestamp}_{name}.{extension}`

## Security Policies

### Avatar Policies

- **Public Read**: All avatars are publicly viewable
- **User Upload**: Users can only upload to their own folder
- **User Update**: Users can only update their own avatars
- **User Delete**: Users can only delete their own avatars

### Product Image Policies

- **Public Read**: All product images are publicly viewable
- **Project-based Upload**: Users can only upload images to their own projects
- **Project-based Update**: Users can only update images in their own projects
- **Project-based Delete**: Users can only delete images from their own projects

## Usage Examples

### Avatar Management

```typescript
import { uploadAvatarAction, deleteAvatarAction } from '@/actions/storage'

// Upload avatar
const formData = new FormData()
formData.append('avatar', file)

const result = await uploadAvatarAction(formData)
if (result.success) {
  console.log('Avatar uploaded:', result.url)
} else {
  console.error('Upload failed:', result.error)
}

// Delete avatar
const result = await deleteAvatarAction()
```

### Product Image Management

```typescript
import { 
  uploadProductImageAction, 
  uploadProductImagesAction,
  deleteProductImageAction,
  listProductImagesAction 
} from '@/actions/storage'

// Upload single product image
const formData = new FormData()
formData.append('image', file)
formData.append('imageType', 'hero')
formData.append('productName', 'Product Name')

const result = await uploadProductImageAction(projectId, productId, formData)

// Upload multiple images
const formData = new FormData()
files.forEach(file => formData.append('images', file))
formData.append('imageType', 'gallery')

const result = await uploadProductImagesAction(projectId, productId, formData)

// List product images
const result = await listProductImagesAction(projectId, productId)
if (result.success) {
  console.log('Images:', result.images)
}

// Delete product image
const result = await deleteProductImageAction(projectId, productId, imagePath)
```

### Direct Storage Manager Usage

```typescript
import { createStorageManager } from '@/lib/supabase-storage'

const storage = await createStorageManager()

// Upload avatar
const { url, path } = await storage.uploadAvatar(userId, file)

// Upload product image
const { url, path } = await storage.uploadProductImage(
  projectId, 
  productId, 
  file, 
  'hero',
  { customMetadata: 'value' }
)

// List product images
const images = await storage.listProductImages(projectId, productId)

// Create signed URL for private access
const signedUrl = await storage.createSignedUrl('productImages', filePath, 3600)
```

## File Validation

### Avatar Constraints

- **Max Size**: 5MB
- **Allowed Types**: JPEG, PNG, WebP
- **Max Dimensions**: 1024x1024px

### Product Image Constraints

- **Max Size**: 10MB
- **Allowed Types**: JPEG, PNG, WebP
- **Max Dimensions**: 2048x2048px

### Validation Example

```typescript
import { validateImageFile } from '@/lib/supabase-storage'

const validation = validateImageFile(file, 'avatar')
if (!validation.valid) {
  console.error('Validation failed:', validation.error)
}
```

## Image Types

Product images support different types for organization:

- `hero` - Main product image
- `gallery` - Additional product photos
- `thumbnail` - Small preview images
- `lifestyle` - Product in use/context
- `detail` - Close-up detail shots
- `variant` - Different color/style variants

## Automatic Features

### Avatar Cleanup

When a user uploads a new avatar, the old avatar is automatically deleted to prevent storage bloat.

### File Sanitization

All uploaded files are automatically sanitized:
- Filenames are cleaned of special characters
- File extensions are validated
- Timestamps are added to prevent conflicts

### Metadata Storage

Product images include automatic metadata:
- Original filename
- Upload timestamp
- Image type
- Uploader user ID
- Custom metadata (optional)

## Error Handling

The storage system provides comprehensive error handling:

```typescript
import { StorageError } from '@/lib/supabase-storage'

try {
  const result = await storage.uploadAvatar(userId, file)
} catch (error) {
  if (error instanceof StorageError) {
    // Handle storage-specific errors
    console.error('Storage error:', error.message)
  } else {
    // Handle other errors
    console.error('Unexpected error:', error)
  }
}
```

## Configuration

Storage limits and bucket names are configured in `lib/supabase-storage.ts`:

```typescript
export const STORAGE_CONFIG = {
  buckets: {
    avatars: 'avatars',
    productImages: 'product-images',
  },
  limits: {
    avatar: {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxDimensions: { width: 1024, height: 1024 },
    },
    productImage: {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      maxDimensions: { width: 2048, height: 2048 },
    },
  },
}
```

## Database Integration

### Profile Avatar Integration

The `profiles` table includes automatic avatar cleanup:

```sql
-- Trigger cleans up old avatar files when avatar_url changes
CREATE TRIGGER trigger_cleanup_old_avatar
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  WHEN (old.avatar_url IS DISTINCT FROM new.avatar_url)
  EXECUTE FUNCTION public.cleanup_old_avatar();
```

### Helper Functions

The migration includes helpful SQL functions:

```sql
-- Generate avatar file path
SELECT public.get_avatar_path(user_id, 'jpg');

-- Generate product image path
SELECT public.get_product_image_path(project_id, product_id, 'hero', 'jpg');
```

## Best Practices

### File Upload

1. **Always validate files** before upload using `validateImageFile()`
2. **Handle errors gracefully** with proper user feedback
3. **Use appropriate image types** for organization
4. **Include meaningful metadata** for product images

### Performance

1. **Use public URLs** for displaying images (cached by CDN)
2. **Use signed URLs** only when necessary for private access
3. **Compress images** on the client side when possible
4. **Use appropriate image formats** (WebP for best compression)

### Security

1. **Never trust client-side validation** - server validates all files
2. **Use RLS policies** to ensure proper access control
3. **Sanitize filenames** to prevent path traversal attacks
4. **Monitor storage usage** to prevent abuse

## Monitoring and Maintenance

### Storage Usage

Monitor storage usage through Supabase dashboard:
- Total storage used per bucket
- Number of files per user/project
- Failed upload attempts

### Cleanup

The system includes automatic cleanup for:
- Replaced avatar files
- Orphaned product images (when products are deleted)

### Backup

Consider implementing backup strategies for:
- Critical product images
- User avatars
- Metadata preservation

## Integration with AI Image Generation

The storage system is designed to work seamlessly with AI-generated product images:

1. **Generated images** can be uploaded using the same product image methods
2. **Metadata support** allows storing generation parameters
3. **Batch uploads** support multiple generated variants
4. **Organized storage** keeps generated images with the product

This storage implementation provides a robust foundation for both user-uploaded content and AI-generated assets. 