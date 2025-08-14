# Factory Pattern Implementation

## Tổng quan

Factory Pattern là một design pattern thuộc nhóm Creational Patterns, cho phép tạo đối tượng mà không cần chỉ định chính xác class của chúng. Pattern này đặc biệt hữu ích khi bạn cần tạo các đối tượng dựa trên điều kiện runtime.

## Lợi ích

- **Tách biệt việc tạo đối tượng**: Code client không cần biết chi tiết về cách tạo đối tượng
- **Tính mở rộng**: Dễ dàng thêm các loại đối tượng mới
- **Tuân thủ SOLID principles**: Đặc biệt là Open/Closed Principle
- **Centralized object creation**: Quản lý việc tạo đối tượng tại một nơi

## Cấu trúc cơ bản

```typescript
// Abstract Product
interface Product {
  operation(): string;
}

// Concrete Products
class ConcreteProductA implements Product {
  operation(): string {
    return "Result of ConcreteProductA";
  }
}

class ConcreteProductB implements Product {
  operation(): string {
    return "Result of ConcreteProductB";
  }
}

// Abstract Creator
abstract class Creator {
  abstract factoryMethod(): Product;

  someOperation(): string {
    const product = this.factoryMethod();
    return `Creator: ${product.operation()}`;
  }
}

// Concrete Creators
class ConcreteCreatorA extends Creator {
  factoryMethod(): Product {
    return new ConcreteProductA();
  }
}

class ConcreteCreatorB extends Creator {
  factoryMethod(): Product {
    return new ConcreteProductB();
  }
}
```

## Ví dụ thực tế: File Handler với Express

### 1. Định nghĩa interfaces và types

```typescript
// types/file.types.ts
export enum FileType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  ARCHIVE = 'archive'
}

export interface FileProcessor {
  process(file: Express.Multer.File): Promise<ProcessResult>;
  validate(file: Express.Multer.File): boolean;
  getMaxSize(): number;
  getAllowedExtensions(): string[];
}

export interface ProcessResult {
  success: boolean;
  message: string;
  processedPath?: string;
  metadata?: any;
}

export interface FileConfig {
  maxSize: number;
  allowedExtensions: string[];
  outputPath: string;
}
```

### 2. Concrete File Processors

```typescript
// processors/ImageProcessor.ts
import sharp from 'sharp';
import { FileProcessor, ProcessResult, FileConfig } from '../types/file.types';

export class ImageProcessor implements FileProcessor {
  private config: FileConfig = {
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedExtensions: ['.jpg', '.jpeg', '.png', '.gif', '.webp'],
    outputPath: 'uploads/images'
  };

  async process(file: Express.Multer.File): Promise<ProcessResult> {
    try {
      if (!this.validate(file)) {
        return {
          success: false,
          message: 'Invalid image file'
        };
      }

      // Resize and optimize image
      const outputPath = `${this.config.outputPath}/${Date.now()}-${file.originalname}`;
      
      await sharp(file.buffer)
        .resize(1920, 1080, { 
          fit: 'inside',
          withoutEnlargement: true 
        })
        .jpeg({ quality: 85 })
        .toFile(outputPath);

      // Get image metadata
      const metadata = await sharp(file.buffer).metadata();

      return {
        success: true,
        message: 'Image processed successfully',
        processedPath: outputPath,
        metadata: {
          width: metadata.width,
          height: metadata.height,
          format: metadata.format,
          size: file.size
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Image processing failed: ${error.message}`
      };
    }
  }

  validate(file: Express.Multer.File): boolean {
    const extension = path.extname(file.originalname).toLowerCase();
    return this.config.allowedExtensions.includes(extension) &&
           file.size <= this.config.maxSize &&
           file.mimetype.startsWith('image/');
  }

  getMaxSize(): number {
    return this.config.maxSize;
  }

  getAllowedExtensions(): string[] {
    return this.config.allowedExtensions;
  }
}
```

```typescript
// processors/DocumentProcessor.ts
import { FileProcessor, ProcessResult, FileConfig } from '../types/file.types';
import * as fs from 'fs/promises';
import * as path from 'path';

export class DocumentProcessor implements FileProcessor {
  private config: FileConfig = {
    maxSize: 10 * 1024 * 1024, // 10MB
    allowedExtensions: ['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.pptx'],
    outputPath: 'uploads/documents'
  };

  async process(file: Express.Multer.File): Promise<ProcessResult> {
    try {
      if (!this.validate(file)) {
        return {
          success: false,
          message: 'Invalid document file'
        };
      }

      const outputPath = `${this.config.outputPath}/${Date.now()}-${file.originalname}`;
      
      // Save file to disk
      await fs.writeFile(outputPath, file.buffer);

      // Scan for virus (mock implementation)
      const isClean = await this.virusScan(file.buffer);
      if (!isClean) {
        await fs.unlink(outputPath); // Remove infected file
        return {
          success: false,
          message: 'File contains malicious content'
        };
      }

      return {
        success: true,
        message: 'Document processed successfully',
        processedPath: outputPath,
        metadata: {
          size: file.size,
          extension: path.extname(file.originalname),
          uploadDate: new Date().toISOString()
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Document processing failed: ${error.message}`
      };
    }
  }

  validate(file: Express.Multer.File): boolean {
    const extension = path.extname(file.originalname).toLowerCase();
    return this.config.allowedExtensions.includes(extension) &&
           file.size <= this.config.maxSize;
  }

  private async virusScan(buffer: Buffer): Promise<boolean> {
    // Mock virus scanning - in real implementation, use ClamAV or similar
    return new Promise(resolve => {
      setTimeout(() => resolve(true), 100);
    });
  }

  getMaxSize(): number {
    return this.config.maxSize;
  }

  getAllowedExtensions(): string[] {
    return this.config.allowedExtensions;
  }
}
```

```typescript
// processors/VideoProcessor.ts
import { FileProcessor, ProcessResult, FileConfig } from '../types/file.types';
import ffmpeg from 'fluent-ffmpeg';

export class VideoProcessor implements FileProcessor {
  private config: FileConfig = {
    maxSize: 100 * 1024 * 1024, // 100MB
    allowedExtensions: ['.mp4', '.avi', '.mov', '.wmv', '.flv'],
    outputPath: 'uploads/videos'
  };

  async process(file: Express.Multer.File): Promise<ProcessResult> {
    try {
      if (!this.validate(file)) {
        return {
          success: false,
          message: 'Invalid video file'
        };
      }

      const inputPath = `temp/${Date.now()}-${file.originalname}`;
      const outputPath = `${this.config.outputPath}/${Date.now()}-compressed.mp4`;

      // Save temp file
      await fs.writeFile(inputPath, file.buffer);

      // Compress video
      await this.compressVideo(inputPath, outputPath);

      // Clean up temp file
      await fs.unlink(inputPath);

      return {
        success: true,
        message: 'Video processed successfully',
        processedPath: outputPath,
        metadata: {
          originalSize: file.size,
          format: 'mp4'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `Video processing failed: ${error.message}`
      };
    }
  }

  private compressVideo(inputPath: string, outputPath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputPath)
        .output(outputPath)
        .videoCodec('libx264')
        .audioCodec('aac')
        .size('1280x720')
        .on('end', () => resolve())
        .on('error', (err) => reject(err))
        .run();
    });
  }

  validate(file: Express.Multer.File): boolean {
    const extension = path.extname(file.originalname).toLowerCase();
    return this.config.allowedExtensions.includes(extension) &&
           file.size <= this.config.maxSize &&
           file.mimetype.startsWith('video/');
  }

  getMaxSize(): number {
    return this.config.maxSize;
  }

  getAllowedExtensions(): string[] {
    return this.config.allowedExtensions;
  }
}
```

### 3. Factory Implementation

```typescript
// factories/FileProcessorFactory.ts
import { FileProcessor } from '../types/file.types';
import { ImageProcessor } from '../processors/ImageProcessor';
import { DocumentProcessor } from '../processors/DocumentProcessor';
import { VideoProcessor } from '../processors/VideoProcessor';
import { AudioProcessor } from '../processors/AudioProcessor';
import { ArchiveProcessor } from '../processors/ArchiveProcessor';
import * as path from 'path';

export class FileProcessorFactory {
  private static processors = new Map<string, () => FileProcessor>([
    ['image', () => new ImageProcessor()],
    ['document', () => new DocumentProcessor()],
    ['video', () => new VideoProcessor()],
    ['audio', () => new AudioProcessor()],
    ['archive', () => new ArchiveProcessor()]
  ]);

  static createProcessor(file: Express.Multer.File): FileProcessor {
    const fileType = this.detectFileType(file);
    
    const processorCreator = this.processors.get(fileType);
    if (!processorCreator) {
      throw new Error(`Unsupported file type: ${fileType}`);
    }

    return processorCreator();
  }

  private static detectFileType(file: Express.Multer.File): string {
    const extension = path.extname(file.originalname).toLowerCase();
    const mimeType = file.mimetype;

    // Image files
    if (mimeType.startsWith('image/') || 
        ['.jpg', '.jpeg', '.png', '.gif', '.webp'].includes(extension)) {
      return 'image';
    }

    // Document files
    if (['.pdf', '.doc', '.docx', '.txt', '.xlsx', '.pptx'].includes(extension)) {
      return 'document';
    }

    // Video files
    if (mimeType.startsWith('video/') || 
        ['.mp4', '.avi', '.mov', '.wmv', '.flv'].includes(extension)) {
      return 'video';
    }

    // Audio files
    if (mimeType.startsWith('audio/') || 
        ['.mp3', '.wav', '.flac', '.aac'].includes(extension)) {
      return 'audio';
    }

    // Archive files
    if (['.zip', '.rar', '.7z', '.tar', '.gz'].includes(extension)) {
      return 'archive';
    }

    throw new Error(`Unknown file type for: ${file.originalname}`);
  }

  static getSupportedTypes(): string[] {
    return Array.from(this.processors.keys());
  }

  static registerProcessor(type: string, creator: () => FileProcessor): void {
    this.processors.set(type, creator);
  }
}
```

### 4. Express Controller sử dụng Factory

```typescript
// controllers/FileController.ts
import { Request, Response } from 'express';
import { FileProcessorFactory } from '../factories/FileProcessorFactory';
import { ProcessResult } from '../types/file.types';

export class FileController {
  async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded'
        });
        return;
      }

      // Sử dụng Factory để tạo processor phù hợp
      const processor = FileProcessorFactory.createProcessor(req.file);
      
      // Xử lý file
      const result: ProcessResult = await processor.process(req.file);

      if (result.success) {
        res.status(200).json({
          success: true,
          message: result.message,
          data: {
            filename: req.file.originalname,
            processedPath: result.processedPath,
            metadata: result.metadata
          }
        });
      } else {
        res.status(400).json({
          success: false,
          message: result.message
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: `Upload failed: ${error.message}`
      });
    }
  }

  async getFileInfo(req: Request, res: Response): Promise<void> {
    try {
      const { fileType } = req.params;
      
      if (!FileProcessorFactory.getSupportedTypes().includes(fileType)) {
        res.status(400).json({
          success: false,
          message: 'Unsupported file type'
        });
        return;
      }

      // Tạo processor để lấy thông tin cấu hình
      const tempFile = {
        originalname: `temp.${fileType}`,
        mimetype: `${fileType}/*`,
        size: 0,
        buffer: Buffer.alloc(0)
      } as Express.Multer.File;

      const processor = FileProcessorFactory.createProcessor(tempFile);

      res.status(200).json({
        success: true,
        data: {
          fileType,
          maxSize: processor.getMaxSize(),
          allowedExtensions: processor.getAllowedExtensions(),
          maxSizeFormatted: `${(processor.getMaxSize() / (1024 * 1024)).toFixed(1)} MB`
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getSupportedTypes(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      success: true,
      data: {
        supportedTypes: FileProcessorFactory.getSupportedTypes()
      }
    });
  }
}
```

### 5. Express Routes

```typescript
// routes/fileRoutes.ts
import { Router } from 'express';
import multer from 'multer';
import { FileController } from '../controllers/FileController';

const router = Router();
const fileController = new FileController();

// Cấu hình multer để upload file vào memory
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024 // 100MB max
  }
});

// Routes
router.post('/upload', upload.single('file'), fileController.uploadFile.bind(fileController));
router.get('/info/:fileType', fileController.getFileInfo.bind(fileController));
router.get('/supported-types', fileController.getSupportedTypes.bind(fileController));

export default router;
```

### 6. Sử dụng trong Express App

```typescript
// app.ts
import express from 'express';
import fileRoutes from './routes/fileRoutes';

const app = express();

app.use(express.json());
app.use('/api/files', fileRoutes);

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large'
      });
    }
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
```

## Mở rộng Factory

### Thêm processor mới

```typescript
// processors/CustomProcessor.ts
export class CustomProcessor implements FileProcessor {
  async process(file: Express.Multer.File): Promise<ProcessResult> {
    // Custom implementation
    return {
      success: true,
      message: 'Custom processing completed'
    };
  }

  validate(file: Express.Multer.File): boolean {
    return true;
  }

  getMaxSize(): number {
    return 50 * 1024 * 1024;
  }

  getAllowedExtensions(): string[] {
    return ['.custom'];
  }
}

// Đăng ký processor mới
FileProcessorFactory.registerProcessor('custom', () => new CustomProcessor());
```

## Testing

```typescript
// tests/FileProcessorFactory.test.ts
import { FileProcessorFactory } from '../src/factories/FileProcessorFactory';
import { ImageProcessor } from '../src/processors/ImageProcessor';

describe('FileProcessorFactory', () => {
  test('should create ImageProcessor for image files', () => {
    const mockFile = {
      originalname: 'test.jpg',
      mimetype: 'image/jpeg',
      size: 1024,
      buffer: Buffer.alloc(0)
    } as Express.Multer.File;

    const processor = FileProcessorFactory.createProcessor(mockFile);
    expect(processor).toBeInstanceOf(ImageProcessor);
  });

  test('should throw error for unsupported file type', () => {
    const mockFile = {
      originalname: 'test.unknown',
      mimetype: 'application/unknown',
      size: 1024,
      buffer: Buffer.alloc(0)
    } as Express.Multer.File;

    expect(() => {
      FileProcessorFactory.createProcessor(mockFile);
    }).toThrow('Unknown file type');
  });
});
```

## Kết luận

Factory Pattern trong ví dụ này:

1. **Tách biệt logic tạo đối tượng**: `FileProcessorFactory` chịu trách nhiệm quyết định loại processor nào sẽ được tạo
2. **Dễ mở rộng**: Có thể thêm processor mới mà không cần thay đổi code client
3. **Centralized configuration**: Tất cả logic phát hiện file type được tập trung tại factory
4. **Type safety**: Sử dụng TypeScript interfaces đảm bảo type safety
5. **Testable**: Dễ dàng test từng component riêng biệt

Pattern này đặc biệt hữu ích trong các ứng dụng cần xử lý nhiều loại file khác nhau với logic phức tạp.