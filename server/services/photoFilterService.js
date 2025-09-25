const sharp = require('sharp');
const faceapi = require('face-api.js');
const { Canvas, Image, ImageData } = require('canvas');
const path = require('path');
const fs = require('fs');

// Configure face-api.js to use node-canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

class PhotoFilterService {
  constructor() {
    this.modelsLoaded = false;
    this.filterAssets = new Map();
    this.faceDetectionEnabled = true;
  }

  /**
   * Initialize the service and load face detection models
   */
  async initialize() {
    try {
      if (this.faceDetectionEnabled) {
        await this.loadFaceDetectionModels();
      }
      await this.loadFilterAssets();
      console.log('Photo filter service initialized successfully');
      return true;
    } catch (error) {
      console.error('Failed to initialize photo filter service:', error);
      this.faceDetectionEnabled = false;
      return false;
    }
  }

  /**
   * Load face detection models
   */
  async loadFaceDetectionModels() {
    try {
      const modelsPath = path.join(__dirname, '../models/face-api');
      
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromDisk(modelsPath),
        faceapi.nets.faceLandmark68Net.loadFromDisk(modelsPath),
        faceapi.nets.faceRecognitionNet.loadFromDisk(modelsPath),
        faceapi.nets.faceExpressionNet.loadFromDisk(modelsPath)
      ]);

      this.modelsLoaded = true;
      console.log('Face detection models loaded successfully');
    } catch (error) {
      console.error('Error loading face detection models:', error);
      this.faceDetectionEnabled = false;
    }
  }

  /**
   * Load filter assets (overlays, effects, etc.)
   */
  async loadFilterAssets() {
    try {
      const assetsPath = path.join(__dirname, '../assets/filters');
      
      if (!fs.existsSync(assetsPath)) {
        fs.mkdirSync(assetsPath, { recursive: true });
        console.log('Created filter assets directory');
        return;
      }

      // Load various filter assets
      const filterTypes = ['overlays', 'frames', 'effects', 'stickers'];
      
      for (const type of filterTypes) {
        const typePath = path.join(assetsPath, type);
        if (fs.existsSync(typePath)) {
          const files = fs.readdirSync(typePath);
          this.filterAssets.set(type, files);
        }
      }

      console.log('Filter assets loaded successfully');
    } catch (error) {
      console.error('Error loading filter assets:', error);
    }
  }

  /**
   * Detect faces in image
   * @param {Buffer} imageBuffer - Image buffer
   * @returns {Array} Face detection results
   */
  async detectFaces(imageBuffer) {
    try {
      if (!this.modelsLoaded || !this.faceDetectionEnabled) {
        return [];
      }

      const image = new Image();
      image.src = imageBuffer;

      const detections = await faceapi
        .detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())
        .withFaceLandmarks()
        .withFaceExpressions()
        .withAgeAndGender();

      return detections.map(detection => ({
        box: detection.detection.box,
        landmarks: detection.landmarks.positions,
        expressions: detection.expressions,
        age: detection.ageAndGender?.age,
        gender: detection.ageAndGender?.gender,
        confidence: detection.detection.score
      }));
    } catch (error) {
      console.error('Error detecting faces:', error);
      return [];
    }
  }

  /**
   * Apply filter to image
   * @param {Buffer} imageBuffer - Original image buffer
   * @param {String} filterType - Type of filter to apply
   * @param {Object} options - Filter options
   * @returns {Buffer} Filtered image buffer
   */
  async applyFilter(imageBuffer, filterType, options = {}) {
    try {
      const image = sharp(imageBuffer);
      const metadata = await image.metadata();

      switch (filterType) {
        case 'vintage':
          return await this.applyVintageFilter(image, options);
        case 'blackwhite':
          return await this.applyBlackWhiteFilter(image, options);
        case 'sepia':
          return await this.applySepiaFilter(image, options);
        case 'blur':
          return await this.applyBlurFilter(image, options);
        case 'brightness':
          return await this.applyBrightnessFilter(image, options);
        case 'contrast':
          return await this.applyContrastFilter(image, options);
        case 'saturation':
          return await this.applySaturationFilter(image, options);
        case 'hue':
          return await this.applyHueFilter(image, options);
        case 'overlay':
          return await this.applyOverlayFilter(image, options);
        case 'frame':
          return await this.applyFrameFilter(image, options);
        case 'face_filter':
          return await this.applyFaceFilter(image, options);
        case 'sticker':
          return await this.applyStickerFilter(image, options);
        case 'text':
          return await this.applyTextFilter(image, options);
        case 'rainbow':
          return await this.applyRainbowFilter(image, options);
        case 'neon':
          return await this.applyNeonFilter(image, options);
        case 'pixelate':
          return await this.applyPixelateFilter(image, options);
        case 'mirror':
          return await this.applyMirrorFilter(image, options);
        case 'fisheye':
          return await this.applyFisheyeFilter(image, options);
        default:
          throw new Error(`Unknown filter type: ${filterType}`);
      }
    } catch (error) {
      console.error('Error applying filter:', error);
      throw error;
    }
  }

  /**
   * Apply vintage filter
   */
  async applyVintageFilter(image, options = {}) {
    const intensity = options.intensity || 0.7;
    
    return await image
      .modulate({
        brightness: 1.1,
        saturation: 0.8,
        hue: 20
      })
      .linear(1.1, -(128 * 0.1))
      .sharpen()
      .toBuffer();
  }

  /**
   * Apply black and white filter
   */
  async applyBlackWhiteFilter(image, options = {}) {
    return await image
      .greyscale()
      .modulate({
        brightness: options.brightness || 1.0,
        contrast: options.contrast || 1.2
      })
      .toBuffer();
  }

  /**
   * Apply sepia filter
   */
  async applySepiaFilter(image, options = {}) {
    const intensity = options.intensity || 0.8;
    
    return await image
      .recomb([
        [0.393, 0.769, 0.189],
        [0.349, 0.686, 0.168],
        [0.272, 0.534, 0.131]
      ])
      .modulate({
        brightness: 1.1,
        saturation: 0.8
      })
      .toBuffer();
  }

  /**
   * Apply blur filter
   */
  async applyBlurFilter(image, options = {}) {
    const sigma = options.sigma || 2;
    return await image.blur(sigma).toBuffer();
  }

  /**
   * Apply brightness filter
   */
  async applyBrightnessFilter(image, options = {}) {
    const brightness = options.brightness || 1.2;
    return await image.modulate({ brightness }).toBuffer();
  }

  /**
   * Apply contrast filter
   */
  async applyContrastFilter(image, options = {}) {
    const contrast = options.contrast || 1.3;
    return await image.linear(contrast, -(128 * (contrast - 1))).toBuffer();
  }

  /**
   * Apply saturation filter
   */
  async applySaturationFilter(image, options = {}) {
    const saturation = options.saturation || 1.5;
    return await image.modulate({ saturation }).toBuffer();
  }

  /**
   * Apply hue filter
   */
  async applyHueFilter(image, options = {}) {
    const hue = options.hue || 30;
    return await image.modulate({ hue }).toBuffer();
  }

  /**
   * Apply overlay filter
   */
  async applyOverlayFilter(image, options = {}) {
    const { overlayPath, opacity = 0.7, position = 'center' } = options;
    
    if (!overlayPath || !fs.existsSync(overlayPath)) {
      throw new Error('Overlay file not found');
    }

    const overlay = sharp(overlayPath);
    const overlayMetadata = await overlay.metadata();
    const imageMetadata = await image.metadata();

    // Resize overlay to match image dimensions
    const resizedOverlay = await overlay
      .resize(imageMetadata.width, imageMetadata.height, {
        fit: 'cover'
      })
      .toBuffer();

    return await image
      .composite([{
        input: resizedOverlay,
        blend: 'over',
        opacity: opacity
      }])
      .toBuffer();
  }

  /**
   * Apply frame filter
   */
  async applyFrameFilter(image, options = {}) {
    const { framePath, frameType = 'border' } = options;
    
    if (!framePath || !fs.existsSync(framePath)) {
      throw new Error('Frame file not found');
    }

    const frame = sharp(framePath);
    const frameMetadata = await frame.metadata();
    const imageMetadata = await image.metadata();

    // Resize frame to match image dimensions
    const resizedFrame = await frame
      .resize(imageMetadata.width, imageMetadata.height, {
        fit: 'cover'
      })
      .toBuffer();

    return await image
      .composite([{
        input: resizedFrame,
        blend: 'over'
      }])
      .toBuffer();
  }

  /**
   * Apply face filter (requires face detection)
   */
  async applyFaceFilter(image, options = {}) {
    const { filterType = 'sunglasses', intensity = 1.0 } = options;
    
    // Detect faces first
    const imageBuffer = await image.toBuffer();
    const faces = await this.detectFaces(imageBuffer);
    
    if (faces.length === 0) {
      console.log('No faces detected, returning original image');
      return imageBuffer;
    }

    // Apply face-specific filters
    switch (filterType) {
      case 'sunglasses':
        return await this.applySunglassesFilter(image, faces, intensity);
      case 'hat':
        return await this.applyHatFilter(image, faces, intensity);
      case 'mustache':
        return await this.applyMustacheFilter(image, faces, intensity);
      case 'crown':
        return await this.applyCrownFilter(image, faces, intensity);
      case 'heart_eyes':
        return await this.applyHeartEyesFilter(image, faces, intensity);
      case 'rainbow_vomit':
        return await this.applyRainbowVomitFilter(image, faces, intensity);
      default:
        return imageBuffer;
    }
  }

  /**
   * Apply sunglasses filter to detected faces
   */
  async applySunglassesFilter(image, faces, intensity) {
    const sunglassesPath = path.join(__dirname, '../assets/filters/overlays/sunglasses.png');
    
    if (!fs.existsSync(sunglassesPath)) {
      return await image.toBuffer();
    }

    const sunglasses = sharp(sunglassesPath);
    const imageMetadata = await image.metadata();
    
    const composites = faces.map(face => {
      const { box } = face;
      const width = box.width * 1.2;
      const height = width * 0.4;
      const x = Math.max(0, box.x - width * 0.1);
      const y = Math.max(0, box.y + box.height * 0.2);

      return {
        input: sunglassesPath,
        top: Math.round(y),
        left: Math.round(x),
        blend: 'over',
        opacity: intensity
      };
    });

    return await image
      .composite(composites)
      .toBuffer();
  }

  /**
   * Apply hat filter to detected faces
   */
  async applyHatFilter(image, faces, intensity) {
    const hatPath = path.join(__dirname, '../assets/filters/overlays/hat.png');
    
    if (!fs.existsSync(hatPath)) {
      return await image.toBuffer();
    }

    const hat = sharp(hatPath);
    const imageMetadata = await image.metadata();
    
    const composites = faces.map(face => {
      const { box } = face;
      const width = box.width * 1.5;
      const height = width * 0.8;
      const x = Math.max(0, box.x - width * 0.25);
      const y = Math.max(0, box.y - height * 0.7);

      return {
        input: hatPath,
        top: Math.round(y),
        left: Math.round(x),
        blend: 'over',
        opacity: intensity
      };
    });

    return await image
      .composite(composites)
      .toBuffer();
  }

  /**
   * Apply mustache filter to detected faces
   */
  async applyMustacheFilter(image, faces, intensity) {
    const mustachePath = path.join(__dirname, '../assets/filters/overlays/mustache.png');
    
    if (!fs.existsSync(mustachePath)) {
      return await image.toBuffer();
    }

    const mustache = sharp(mustachePath);
    const imageMetadata = await image.metadata();
    
    const composites = faces.map(face => {
      const { box, landmarks } = face;
      
      // Find nose position from landmarks
      const noseLandmarks = landmarks.slice(27, 36); // Nose landmarks
      const noseCenter = {
        x: noseLandmarks.reduce((sum, point) => sum + point.x, 0) / noseLandmarks.length,
        y: noseLandmarks.reduce((sum, point) => sum + point.y, 0) / noseLandmarks.length
      };

      const width = box.width * 0.6;
      const height = width * 0.3;
      const x = Math.max(0, noseCenter.x - width / 2);
      const y = Math.max(0, noseCenter.y + height * 0.5);

      return {
        input: mustachePath,
        top: Math.round(y),
        left: Math.round(x),
        blend: 'over',
        opacity: intensity
      };
    });

    return await image
      .composite(composites)
      .toBuffer();
  }

  /**
   * Apply crown filter to detected faces
   */
  async applyCrownFilter(image, faces, intensity) {
    const crownPath = path.join(__dirname, '../assets/filters/overlays/crown.png');
    
    if (!fs.existsSync(crownPath)) {
      return await image.toBuffer();
    }

    const crown = sharp(crownPath);
    const imageMetadata = await image.metadata();
    
    const composites = faces.map(face => {
      const { box } = face;
      const width = box.width * 1.8;
      const height = width * 0.6;
      const x = Math.max(0, box.x - width * 0.4);
      const y = Math.max(0, box.y - height * 0.8);

      return {
        input: crownPath,
        top: Math.round(y),
        left: Math.round(x),
        blend: 'over',
        opacity: intensity
      };
    });

    return await image
      .composite(composites)
      .toBuffer();
  }

  /**
   * Apply heart eyes filter to detected faces
   */
  async applyHeartEyesFilter(image, faces, intensity) {
    const heartEyesPath = path.join(__dirname, '../assets/filters/overlays/heart_eyes.png');
    
    if (!fs.existsSync(heartEyesPath)) {
      return await image.toBuffer();
    }

    const heartEyes = sharp(heartEyesPath);
    const imageMetadata = await image.metadata();
    
    const composites = faces.map(face => {
      const { box, landmarks } = face;
      
      // Find eye positions from landmarks
      const leftEyeLandmarks = landmarks.slice(36, 42); // Left eye landmarks
      const rightEyeLandmarks = landmarks.slice(42, 48); // Right eye landmarks
      
      const leftEyeCenter = {
        x: leftEyeLandmarks.reduce((sum, point) => sum + point.x, 0) / leftEyeLandmarks.length,
        y: leftEyeLandmarks.reduce((sum, point) => sum + point.y, 0) / leftEyeLandmarks.length
      };
      
      const rightEyeCenter = {
        x: rightEyeLandmarks.reduce((sum, point) => sum + point.x, 0) / rightEyeLandmarks.length,
        y: rightEyeLandmarks.reduce((sum, point) => sum + point.y, 0) / rightEyeLandmarks.length
      };

      const eyeWidth = box.width * 0.15;
      const eyeHeight = eyeWidth * 0.8;

      return [
        {
          input: heartEyesPath,
          top: Math.round(leftEyeCenter.y - eyeHeight / 2),
          left: Math.round(leftEyeCenter.x - eyeWidth / 2),
          blend: 'over',
          opacity: intensity
        },
        {
          input: heartEyesPath,
          top: Math.round(rightEyeCenter.y - eyeHeight / 2),
          left: Math.round(rightEyeCenter.x - eyeWidth / 2),
          blend: 'over',
          opacity: intensity
        }
      ];
    }).flat();

    return await image
      .composite(composites)
      .toBuffer();
  }

  /**
   * Apply rainbow vomit filter
   */
  async applyRainbowVomitFilter(image, faces, intensity) {
    const rainbowPath = path.join(__dirname, '../assets/filters/overlays/rainbow_vomit.png');
    
    if (!fs.existsSync(rainbowPath)) {
      return await image.toBuffer();
    }

    const rainbow = sharp(rainbowPath);
    const imageMetadata = await image.metadata();
    
    const composites = faces.map(face => {
      const { box, landmarks } = face;
      
      // Find mouth position from landmarks
      const mouthLandmarks = landmarks.slice(48, 68); // Mouth landmarks
      const mouthCenter = {
        x: mouthLandmarks.reduce((sum, point) => sum + point.x, 0) / mouthLandmarks.length,
        y: mouthLandmarks.reduce((sum, point) => sum + point.y, 0) / mouthLandmarks.length
      };

      const width = box.width * 1.2;
      const height = width * 0.8;
      const x = Math.max(0, mouthCenter.x - width / 2);
      const y = Math.max(0, mouthCenter.y + height * 0.3);

      return {
        input: rainbowPath,
        top: Math.round(y),
        left: Math.round(x),
        blend: 'over',
        opacity: intensity
      };
    });

    return await image
      .composite(composites)
      .toBuffer();
  }

  /**
   * Apply sticker filter
   */
  async applyStickerFilter(image, options = {}) {
    const { stickerPath, x = 0, y = 0, scale = 1.0, rotation = 0 } = options;
    
    if (!stickerPath || !fs.existsSync(stickerPath)) {
      throw new Error('Sticker file not found');
    }

    const sticker = sharp(stickerPath);
    const stickerMetadata = await sticker.metadata();
    const imageMetadata = await image.metadata();

    // Scale sticker
    const scaledWidth = Math.round(stickerMetadata.width * scale);
    const scaledHeight = Math.round(stickerMetadata.height * scale);

    const resizedSticker = await sticker
      .resize(scaledWidth, scaledHeight)
      .rotate(rotation)
      .toBuffer();

    return await image
      .composite([{
        input: resizedSticker,
        top: Math.round(y),
        left: Math.round(x),
        blend: 'over'
      }])
      .toBuffer();
  }

  /**
   * Apply text filter
   */
  async applyTextFilter(image, options = {}) {
    const { text, x = 0, y = 0, fontSize = 24, color = 'white', font = 'Arial' } = options;
    
    if (!text) {
      throw new Error('Text is required for text filter');
    }

    // This is a simplified text overlay
    // In a real implementation, you'd use a library like canvas or fabric.js
    // to render text with proper font rendering
    
    return await image.toBuffer();
  }

  /**
   * Apply rainbow filter
   */
  async applyRainbowFilter(image, options = {}) {
    const intensity = options.intensity || 0.6;
    
    return await image
      .modulate({
        saturation: 1.5,
        hue: 180
      })
      .linear(1.2, -(128 * 0.2))
      .toBuffer();
  }

  /**
   * Apply neon filter
   */
  async applyNeonFilter(image, options = {}) {
    const intensity = options.intensity || 0.8;
    
    return await image
      .modulate({
        brightness: 1.3,
        saturation: 2.0,
        contrast: 1.5
      })
      .sharpen()
      .toBuffer();
  }

  /**
   * Apply pixelate filter
   */
  async applyPixelateFilter(image, options = {}) {
    const pixelSize = options.pixelSize || 8;
    
    const metadata = await image.metadata();
    const newWidth = Math.floor(metadata.width / pixelSize);
    const newHeight = Math.floor(metadata.height / pixelSize);
    
    return await image
      .resize(newWidth, newHeight, { kernel: sharp.kernel.nearest })
      .resize(metadata.width, metadata.height, { kernel: sharp.kernel.nearest })
      .toBuffer();
  }

  /**
   * Apply mirror filter
   */
  async applyMirrorFilter(image, options = {}) {
    const direction = options.direction || 'horizontal'; // 'horizontal' or 'vertical'
    
    if (direction === 'horizontal') {
      return await image.flop().toBuffer();
    } else {
      return await image.flip().toBuffer();
    }
  }

  /**
   * Apply fisheye filter
   */
  async applyFisheyeFilter(image, options = {}) {
    const strength = options.strength || 0.5;
    
    // This is a simplified fisheye effect
    // In a real implementation, you'd use more complex distortion algorithms
    return await image
      .modulate({
        brightness: 1.1,
        contrast: 1.2
      })
      .toBuffer();
  }

  /**
   * Get available filters
   */
  getAvailableFilters() {
    return {
      basic: [
        { id: 'vintage', name: 'Vintage', category: 'basic' },
        { id: 'blackwhite', name: 'Black & White', category: 'basic' },
        { id: 'sepia', name: 'Sepia', category: 'basic' },
        { id: 'blur', name: 'Blur', category: 'basic' },
        { id: 'brightness', name: 'Brightness', category: 'basic' },
        { id: 'contrast', name: 'Contrast', category: 'basic' },
        { id: 'saturation', name: 'Saturation', category: 'basic' },
        { id: 'hue', name: 'Hue Shift', category: 'basic' }
      ],
      effects: [
        { id: 'rainbow', name: 'Rainbow', category: 'effects' },
        { id: 'neon', name: 'Neon', category: 'effects' },
        { id: 'pixelate', name: 'Pixelate', category: 'effects' },
        { id: 'mirror', name: 'Mirror', category: 'effects' },
        { id: 'fisheye', name: 'Fisheye', category: 'effects' }
      ],
      face_filters: [
        { id: 'sunglasses', name: 'Sunglasses', category: 'face_filters' },
        { id: 'hat', name: 'Hat', category: 'face_filters' },
        { id: 'mustache', name: 'Mustache', category: 'face_filters' },
        { id: 'crown', name: 'Crown', category: 'face_filters' },
        { id: 'heart_eyes', name: 'Heart Eyes', category: 'face_filters' },
        { id: 'rainbow_vomit', name: 'Rainbow Vomit', category: 'face_filters' }
      ],
      overlays: [
        { id: 'overlay', name: 'Overlay', category: 'overlays' },
        { id: 'frame', name: 'Frame', category: 'overlays' },
        { id: 'sticker', name: 'Sticker', category: 'overlays' },
        { id: 'text', name: 'Text', category: 'overlays' }
      ]
    };
  }

  /**
   * Check if service is available
   */
  isAvailable() {
    return true; // Basic filters are always available
  }

  /**
   * Check if face detection is available
   */
  isFaceDetectionAvailable() {
    return this.faceDetectionEnabled && this.modelsLoaded;
  }
}

// Create singleton instance
const photoFilterService = new PhotoFilterService();

module.exports = photoFilterService;
