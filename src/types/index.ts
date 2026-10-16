export type ParticleColor = 'black' | 'red' | 'gray' | 'brown' | 'green';

export type GarbageType = 
  | 'soda_can' 
  | 'apple_core' 
  | 'plastic_bottle' 
  | 'cardboard' 
  | 'fish_bone' 
  | 'coffee_cup' 
  | 'battery' 
  | 'banana_peel' 
  | 'tea_bag' 
  | 'bottle_cap';

export interface Particle {
  id: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  vx: number;
  vy: number;
  type: GarbageType;
  color: string;
  colorGroup: ParticleColor;
  size: number;
  rotation: number;
  targetRotation: number;
  vRot: number;
  expression: string; // kawaii eyes
  delay: number;
  arrived: boolean;
  charIndex: number;
}

export interface WasteItem {
  id: string;
  name: string;
  category: 'plastics' | 'e-waste' | 'organics' | 'metals' | 'textiles' | 'glass';
  weightKg: number;
  co2OffsetKg: number;
  iconName: string;
  description: string;
}

export interface RecycledMaterialBreakdown {
  name: string;
  percentage: number;
}

export interface SellerMessage {
  id: string;
  sender: 'buyer' | 'seller';
  text: string;
  timestamp: string;
  pointsOffer?: number;
  isOffer?: boolean;
  status?: 'pending' | 'accepted' | 'declined';
}

export interface CustomerLocation {
  id: string;
  name: string;
  neighborhood: string;
  city: string;
}

export interface MarketplaceProduct {
  id: string;
  title: string;
  category: 'furniture' | 'tech' | 'wearables' | 'materials';
  points: number; // Strictly in points - no money
  originalPoints: number; // In points - no money
  condition: 'Mint Upcycled' | 'Restored Classic' | 'Raw Reclaimed' | 'Certified Grade A';
  co2SavedKg: number;
  wasteDivertedKg: number;
  seller: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerResponseTime: string;
  sellerBio: string;
  location: string;
  neighborhood: string;
  distanceKm: number; // Distance from customer
  pickupAvailable: boolean;
  image: string;
  recycledFrom: string;
  description: string;
  recycledProcessStory: string;
  materials: RecycledMaterialBreakdown[];
  tags: string[];
  negotiatedPoints?: number;
  howToMake?: {
    difficulty: 'Easy' | 'Intermediate' | 'Artisan';
    timeRequired: string;
    toolsNeeded: string[];
    steps: CreativeStep[];
  };
}

export interface ShhhPoseOrder {
  id: string;
  serviceType: 'Data Sanitization' | 'Confidential Shred' | 'Lithium/Hazard Vault' | 'Estate Clearance';
  tier: 'Whisper Silent' | 'Encrypted Zero-Trace' | 'Secure Lockbox';
  scheduledTime: string;
  status: 'Pending Dispatch' | 'En Route' | 'Certified Shredded' | 'Complete';
  certificateHash?: string;
}

export interface CreativeStep {
  stepNumber: number;
  title: string;
  instruction: string;
  toolRequired?: string;
  tip?: string;
}

export interface TransformationOption {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  difficulty: 'Easy' | 'Intermediate' | 'Artisan';
  timeRequired: string;
  resultImageUrl: string;
  description: string;
  materialsUsed: string;
  steps: CreativeStep[];
}

export interface WasteAnalysisResult {
  id: string;
  uploadedImageUrl: string;
  detectedItem: string;
  materialCategory: string;
  recyclablePercent: number;
  biodegradablePercent: number;
  reusablePercent: number;
  confidenceScore: number;
  co2PotentialKg: number;
  ecoPointsReward: number;
  analysisSummary: string;
  options: TransformationOption[];
}
