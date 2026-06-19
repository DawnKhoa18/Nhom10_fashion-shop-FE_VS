import * as mobilenet from '@tensorflow-models/mobilenet';
import '@tensorflow/tfjs';

const PRODUCT_IMAGE_BASE_URL = 'http://localhost:8080/Images/Products/';
const MAX_PRODUCTS_TO_COMPARE = 50;
let modelPromise;
const memoryFeatureCache = new Map();

const LABEL_KEYWORDS = {
  shirt: ['áo', 'sơ mi'], jersey: ['áo', 'thun', 'polo'], tshirt: ['áo', 'thun'],
  cardigan: ['áo', 'khoác'], sweatshirt: ['áo', 'nỉ'], suit: ['áo', 'vest', 'blazer'],
  jacket: ['áo', 'khoác'], coat: ['áo', 'khoác'], jean: ['quần', 'jean', 'denim'],
  jeans: ['quần', 'jean', 'denim'], trouser: ['quần', 'dài'], pants: ['quần'],
  short: ['quần', 'short'], shoe: ['giày', 'phụ kiện'], sneaker: ['giày', 'phụ kiện'],
  sandal: ['dép', 'phụ kiện'], bag: ['túi', 'phụ kiện'], backpack: ['balo', 'phụ kiện'],
  watch: ['đồng hồ', 'phụ kiện'], tie: ['cà vạt', 'phụ kiện'],
  cap: ['nón', 'mũ', 'phụ kiện'], hat: ['nón', 'mũ', 'phụ kiện'],
  belt: ['thắt lưng', 'phụ kiện']
};

const COLOR_GROUPS = [
  { name: 'đen', rgb: [25, 25, 25] }, { name: 'trắng', rgb: [235, 235, 235] },
  { name: 'xám', rgb: [130, 130, 130] }, { name: 'đỏ', rgb: [190, 45, 45] },
  { name: 'cam', rgb: [225, 125, 35] }, { name: 'vàng', rgb: [220, 190, 45] },
  { name: 'xanh lá', rgb: [55, 145, 75] }, { name: 'xanh dương', rgb: [45, 100, 180] },
  { name: 'tím', rgb: [125, 70, 155] }, { name: 'hồng', rgb: [220, 135, 165] },
  { name: 'nâu', rgb: [120, 80, 55] }
];

const getModel = () => {
  if (!modelPromise) modelPromise = mobilenet.load({ version: 2, alpha: 0.5 });
  return modelPromise;
};

const normalize = (value = '') => value.toLowerCase()
  .normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');

const createFeatureCanvas = (image) => {
  const canvas = document.createElement('canvas');
  const size = 224;
  canvas.width = size;
  canvas.height = size;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, size, size);

  const sourceSize = Math.min(image.naturalWidth || image.width, image.naturalHeight || image.height);
  const sourceX = ((image.naturalWidth || image.width) - sourceSize) / 2;
  const sourceY = ((image.naturalHeight || image.height) - sourceSize) / 2;
  context.drawImage(image, sourceX, sourceY, sourceSize, sourceSize, 0, 0, size, size);
  return canvas;
};

const loadLocalImage = (file) => new Promise((resolve, reject) => {
  const image = new Image();
  const url = URL.createObjectURL(file);
  image.onload = () => resolve({ image, url });
  image.onerror = () => {
    URL.revokeObjectURL(url);
    reject(new Error('Không thể đọc hình ảnh'));
  };
  image.src = url;
});

const loadRemoteImage = (url) => new Promise((resolve, reject) => {
  const image = new Image();
  image.crossOrigin = 'anonymous';
  image.onload = () => resolve(image);
  image.onerror = () => reject(new Error(`Không tải được ảnh ${url}`));
  image.src = url;
});

const extractEmbedding = async (model, image) => {
  const canvas = createFeatureCanvas(image);
  const tensor = model.infer(canvas, true);
  const values = Array.from(await tensor.data());
  tensor.dispose();
  return values;
};

const detectDominantColor = (image) => {
  const canvas = createFeatureCanvas(image);
  const context = canvas.getContext('2d', { willReadFrequently: true });
  const pixels = context.getImageData(36, 25, 152, 174).data;
  const buckets = new Map();

  for (let index = 0; index < pixels.length; index += 20) {
    const r = pixels[index];
    const g = pixels[index + 1];
    const b = pixels[index + 2];
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    if (pixels[index + 3] < 180 || (max > 242 && min > 235)) continue;
    const key = `${Math.round(r / 32) * 32},${Math.round(g / 32) * 32},${Math.round(b / 32) * 32}`;
    buckets.set(key, (buckets.get(key) || 0) + 1);
  }

  const dominant = [...buckets.entries()].sort((a, b) => b[1] - a[1])[0]?.[0]
    ?.split(',').map(Number) || [128, 128, 128];
  return COLOR_GROUPS.map((color) => ({
    ...color,
    distance: Math.sqrt(color.rgb.reduce(
      (sum, channel, index) => sum + ((channel - dominant[index]) ** 2), 0
    ))
  })).sort((a, b) => a.distance - b.distance)[0];
};

const extractKeywords = (predictions) => {
  const keywords = new Set();
  predictions.forEach(({ className }) => {
    normalize(className).split(/[,/]/).forEach((label) => {
      Object.entries(LABEL_KEYWORDS).forEach(([english, vietnamese]) => {
        if (label.trim().includes(english)) vietnamese.forEach((word) => keywords.add(word));
      });
    });
  });
  return [...keywords];
};

const cosineSimilarity = (first, second) => {
  let dot = 0;
  let normFirst = 0;
  let normSecond = 0;
  const length = Math.min(first.length, second.length);
  for (let index = 0; index < length; index += 1) {
    dot += first[index] * second[index];
    normFirst += first[index] ** 2;
    normSecond += second[index] ** 2;
  }
  return dot / ((Math.sqrt(normFirst) * Math.sqrt(normSecond)) || 1);
};

const colorSimilarity = (first, second) => {
  const distance = Math.sqrt(first.rgb.reduce(
    (sum, channel, index) => sum + ((channel - second.rgb[index]) ** 2), 0
  ));
  return Math.max(0, 1 - (distance / 441.67));
};

const metadataScore = (product, keywords) => {
  if (!keywords.length) return 0.5;
  const searchable = normalize([
    product.tenSp, product.category?.name, product.material, product.form, product.description
  ].filter(Boolean).join(' '));
  const matches = keywords.filter((keyword) => searchable.includes(normalize(keyword))).length;
  return matches / keywords.length;
};

const getProductFeatures = async (model, product) => {
  const imageUrl = encodeURI(`${PRODUCT_IMAGE_BASE_URL}${product.hinhAnh}`);
  if (memoryFeatureCache.has(imageUrl)) return memoryFeatureCache.get(imageUrl);

  const image = await loadRemoteImage(imageUrl);
  const features = {
    embedding: await extractEmbedding(model, image),
    color: detectDominantColor(image)
  };
  memoryFeatureCache.set(imageUrl, features);
  return features;
};

export const analyzeFashionImage = async (file) => {
  const { image, url } = await loadLocalImage(file);
  try {
    const model = await getModel();
    const predictions = await model.classify(image, 5);
    return {
      previewUrl: url,
      embedding: await extractEmbedding(model, image),
      color: detectDominantColor(image),
      keywords: extractKeywords(predictions)
    };
  } catch (error) {
    URL.revokeObjectURL(url);
    throw error;
  }
};

export const rankSimilarProducts = async (products, analysis, onProgress) => {
  const model = await getModel();
  const candidates = products
    .map((product) => ({ product, metadata: metadataScore(product, analysis.keywords) }))
    .sort((a, b) => b.metadata - a.metadata)
    .slice(0, MAX_PRODUCTS_TO_COMPARE);
  const ranked = [];

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    try {
      const features = await getProductFeatures(model, candidate.product);
      const visual = Math.max(0, cosineSimilarity(analysis.embedding, features.embedding));
      const color = colorSimilarity(analysis.color, features.color);
      ranked.push({
        ...candidate.product,
        similarityScore: (visual * 0.75) + (color * 0.15) + (candidate.metadata * 0.10)
      });
    } catch (error) {
      console.warn(`Bỏ qua ảnh sản phẩm ${candidate.product.id}:`, error);
    }
    onProgress?.(Math.round(((index + 1) / candidates.length) * 100));
  }

  return ranked.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, 16);
};
