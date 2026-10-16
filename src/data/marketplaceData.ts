import { MarketplaceProduct, CustomerLocation, CreativeStep } from '../types';

export const CUSTOMER_LOCATIONS: CustomerLocation[] = [
  {
    id: 'loc-1',
    name: 'Current Location (Auto-Detected)',
    neighborhood: 'Greenpoint Eco-District',
    city: 'Metro Sector 4',
  },
  {
    id: 'loc-2',
    name: 'Downtown Circular Quarter',
    neighborhood: 'Old Mill Arts Zone',
    city: 'Central District',
  },
  {
    id: 'loc-3',
    name: 'Westside Sustainable Commons',
    neighborhood: 'Harbor Reclaim Yard',
    city: 'West Sector',
  },
];

export function getDistanceForProduct(product: MarketplaceProduct, locationId: string): number {
  if (product.neighborhood.includes('Outer Valley')) {
    return 48.5;
  }

  if (product.id === 'mp-1') return 0.6;
  if (product.id === 'mp-2') return 0.8;
  if (product.id === 'mp-3') return 1.1;

  const lookup: Record<string, Record<string, number>> = {
    'loc-1': {
      'Greenpoint Eco-District': 1.8,
      'Old Mill Arts Zone': 2.9,
      'Harbor Reclaim Yard': 5.8,
    },
    'loc-2': {
      'Old Mill Arts Zone': 1.7,
      'Greenpoint Eco-District': 2.9,
      'Harbor Reclaim Yard': 4.1,
    },
    'loc-3': {
      'Harbor Reclaim Yard': 1.6,
      'Old Mill Arts Zone': 4.1,
      'Greenpoint Eco-District': 5.8,
    },
  };

  const base = lookup[locationId]?.[product.neighborhood] ?? 2.5;
  const offset = ((product.id.charCodeAt(product.id.length - 1) % 5) - 2) * 0.2;
  return Math.max(1.5, Math.round((base + offset) * 10) / 10);
}

export function getHowToMakeForProduct(product: MarketplaceProduct): {
  difficulty: 'Easy' | 'Intermediate' | 'Artisan';
  timeRequired: string;
  toolsNeeded: string[];
  steps: CreativeStep[];
} {
  if (product.howToMake) {
    return product.howToMake;
  }

  // Fallback dynamic generator based on category/title
  return {
    difficulty: 'Easy',
    timeRequired: '25-40 mins',
    toolsNeeded: ['Utility Scissors / Shears', 'Eco Adhesive / Thread', 'Sandpaper', 'Measuring Ruler'],
    steps: [
      {
        stepNumber: 1,
        title: 'Collect & Prepare Raw Scrap',
        instruction: `Gather discarded ${product.recycledFrom || 'post-consumer raw materials'}, clean thoroughly with warm eco-soap, and remove leftover labels or fasteners.`,
        toolRequired: 'Eco Wash & Scrub Brush',
        tip: 'Ensure raw materials are completely dry before cutting.',
      },
      {
        stepNumber: 2,
        title: 'Measure & Pattern Cut',
        instruction: `Mark structural dimensions for ${product.title} using ruler lines and carefully cut out matching panels or shapes.`,
        toolRequired: 'Precision Cutter / Shears',
        tip: 'Keep edges straight to guarantee flush joints during assembly.',
      },
      {
        stepNumber: 3,
        title: 'Assemble & Interlock Components',
        instruction: `Join trimmed pieces together using slot joints or non-toxic binder. Reinforce structural stress points.`,
        toolRequired: 'Clamps / Adhesive',
        tip: 'Test load stability before applying final finish.',
      },
      {
        stepNumber: 4,
        title: 'Surface Polish & Finish',
        instruction: `Sand rough edges smooth and apply a coat of natural plant-based protective wax or organic oil.`,
        toolRequired: 'Fine Sandpaper & Wax Rag',
        tip: 'Allows natural recycled texture to shine while protecting against moisture.',
      },
    ],
  };
}

export const RECYCLED_PRODUCTS: MarketplaceProduct[] = [
  // 1st Product: Recycled Bottle Planter
  {
    id: 'mp-1',
    title: 'Recycled Plastic Bottle Planter',
    category: 'materials',
    points: 90,
    originalPoints: 180,
    condition: 'Restored Classic',
    co2SavedKg: 8.2,
    wasteDivertedKg: 0.8,
    seller: 'Kinetics Upcycle Lab',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    sellerRating: 4.91,
    sellerResponseTime: 'Around 15 mins',
    sellerBio: 'Creating indoor self-watering botanical planters out of rescued PET beverage bottles.',
    location: '88 Foundry Lane, Unit 3B',
    neighborhood: 'Greenpoint Eco-District',
    distanceKm: 0.6,
    pickupAvailable: true,
    image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=1000&q=80',
    recycledFrom: '5 Discarded Clear PET Beverage Bottles',
    description:
      'Self-watering indoor botanical planter crafted from upcycled PET plastic bottles. Features an integrated cotton sub-irrigation wick system.',
    recycledProcessStory:
      'Rescued from local recycling drives, flame-smoothed along cut edges, and paired with organic coconut coir soil disks.',
    materials: [
      { name: 'Post-Consumer PET Plastic Bottle', percentage: 85 },
      { name: 'Sub-irrigation Cotton Wick', percentage: 15 },
    ],
    tags: ['Self-Watering', 'PET Upcycle', 'Same-Day Pickup'],
    howToMake: {
      difficulty: 'Easy',
      timeRequired: '15-20 mins',
      toolsNeeded: ['Utility Knife / Shears', 'Cotton Sub-irrigation Wick', '200-Grit Sandpaper', 'Potting Coir Soil'],
      steps: [
        {
          stepNumber: 1,
          title: 'Clean & Cut PET Bottle in Half',
          instruction: 'Rinse a discarded 2-liter PET bottle with warm soapy water. Mark a line around the midpoint and slice in half with utility shears.',
          toolRequired: 'Utility Shears',
          tip: 'Sand the sharp cut rim in a circular motion for a smooth child-safe edge.',
        },
        {
          stepNumber: 2,
          title: 'Thread Cotton Sub-Irrigation Wick',
          instruction: 'Drill or pierce a 5mm hole through the bottle cap. Thread a 20cm cotton wick rope through the cap, leaving 10cm dangling below.',
          toolRequired: 'Hand Awl or Drill',
          tip: 'Knot the top end inside the cap so the wick stays firmly anchored.',
        },
        {
          stepNumber: 3,
          title: 'Invert Funnel & Fill Water Reservoir',
          instruction: 'Screw cap back on inverted top funnel section and seat it upside-down into the bottom reservoir half. Fill bottom reservoir with 250ml water.',
          toolRequired: 'Measuring Cup',
          tip: 'Ensure the dangling wick extends deep into the bottom water reservoir.',
        },
        {
          stepNumber: 4,
          title: 'Add Soil Disks & Plant Seedling',
          instruction: 'Pack expandable coconut coir or potting soil into the top funnel around the cotton wick. Plant herb seedling or succulent and water top layer once.',
          toolRequired: 'Trowel & Coir Soil',
          tip: 'Sub-irrigation will draw water automatically for up to 2 weeks without manual re-watering!',
        },
      ],
    },
  },

  // 2nd Product: Cardboard Desk Organizer
  {
    id: 'mp-2',
    title: 'Cardboard Desktop Storage Organizer',
    category: 'tech',
    points: 95,
    originalPoints: 190,
    condition: 'Mint Upcycled',
    co2SavedKg: 7.4,
    wasteDivertedKg: 1.1,
    seller: 'Smelt & Pulp Labs',
    sellerAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80',
    sellerRating: 4.93,
    sellerResponseTime: 'Within 10 mins',
    sellerBio: 'Precision laser-cutting heavy corrugated shipping boxes into modular desk organizers.',
    location: '88 Circular Works Yard',
    neighborhood: 'Harbor Reclaim Yard',
    distanceKm: 0.8,
    pickupAvailable: true,
    image: 'https://images.unsplash.com/photo-1585336261026-875a60a1c96b?auto=format&fit=crop&w=1000&q=80',
    recycledFrom: 'Heavy 5-Ply Corrugated Shipping Boxes',
    description:
      'Modular 4-tier desktop station with slots for pens, notebooks, and phone accessories. Lightweight yet incredibly rigid.',
    recycledProcessStory:
      'Clean double-wall packaging boxes collected from local electronics stores were laser-cut and tab-locked with zero glue needed.',
    materials: [{ name: 'Heavy Corrugated Recycled Board', percentage: 100 }],
    tags: ['Modular Design', 'Zero Adhesive', 'Curbside Pickup'],
    howToMake: {
      difficulty: 'Easy',
      timeRequired: '25-30 mins',
      toolsNeeded: ['Precision Cutter Knife', 'Steel Measuring Ruler', 'Cutting Mat', 'Pencil'],
      steps: [
        {
          stepNumber: 1,
          title: 'Flatten Clean Shipping Box',
          instruction: 'Deconstruct a clean double-wall corrugated shipping box, peel off packing tape, and flatten onto a cutting mat.',
          toolRequired: 'Utility Blade',
          tip: 'Use 5-ply corrugated cardboard for maximum structural stiffness.',
        },
        {
          stepNumber: 2,
          title: 'Measure & Cut Modular Wall Panels',
          instruction: 'Measure out 2 side walls (20x15cm), 1 back base panel (25x15cm), and 3 internal compartment shelf dividers.',
          toolRequired: 'Steel Ruler & Cutter',
          tip: 'Score fold lines lightly on one side instead of cutting all the way through.',
        },
        {
          stepNumber: 3,
          title: 'Cut Interlocking Tab Slots',
          instruction: 'Cut 5mm wide interlocking notch slots into divider edges to allow tabs to interlock without needing synthetic glue.',
          toolRequired: 'Craft Knife',
          tip: 'Matching slot depth equals half the height of connecting panels.',
        },
        {
          stepNumber: 4,
          title: 'Tab-Lock Assembly',
          instruction: 'Slide vertical and horizontal dividers together via notched tab slots until tight and flush. Set on desk for instant organizer use!',
          toolRequired: 'Hands',
          tip: 'Apply optional coat of clear beeswax spray for splash protection.',
        },
      ],
    },
  },

  // 3rd Product: Recycled Plastic Earrings
  {
    id: 'mp-3',
    title: 'Recycled Ocean Plastic Earrings',
    category: 'wearables',
    points: 85,
    originalPoints: 170,
    condition: 'Mint Upcycled',
    co2SavedKg: 5.8,
    wasteDivertedKg: 0.3,
    seller: 'Ocean Crafted Jewelry',
    sellerAvatar: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=150&q=80',
    sellerRating: 4.92,
    sellerResponseTime: 'Within 10 mins',
    sellerBio: 'Melting beach-salvaged plastic micro-debris into vibrant statement earrings.',
    location: '12 Shoreline Studio',
    neighborhood: 'Greenpoint Eco-District',
    distanceKm: 1.1,
    pickupAvailable: true,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80',
    recycledFrom: 'Beach Clean-up HDPE & Polypropylene Micro-Plastics',
    description:
      'Lightweight terrazzo-patterned drop earrings set on hypoallergenic recycled sterling silver ear hooks.',
    recycledProcessStory:
      'Sorted by color, low-heat pressed into marbleized sheet stock, precision-cut, and buffed with natural carnauba wax.',
    materials: [
      { name: 'Salvaged Beach Plastic', percentage: 85 },
      { name: 'Recycled Sterling Silver Hooks', percentage: 15 },
    ],
    tags: ['Ocean Plastic', 'Terrazzo Pattern', 'Hypoallergenic'],
    howToMake: {
      difficulty: 'Intermediate',
      timeRequired: '35-45 mins',
      toolsNeeded: ['Heat Press or Toaster Oven', 'Silicone Earring Mold', 'Micro Drill (1mm)', 'Jewelry Pliers', 'Sterling Silver Hooks'],
      steps: [
        {
          stepNumber: 1,
          title: 'Sort & Shred Ocean HDPE Plastic',
          instruction: 'Collect washed HDPE bottle caps (Type 2 plastic). Chop into 2-3mm colorful confetti flakes using heavy scissors.',
          toolRequired: 'Heavy Scissors',
          tip: 'Mix contrasting turquoise, white, and yellow flakes for a stunning terrazzo look.',
        },
        {
          stepNumber: 2,
          title: 'Low-Heat Mold Compression',
          instruction: 'Pack plastic flakes into heat-resistant silicone drop earring molds. Heat at 175°C (350°F) for 12 minutes until pliable and compress.',
          toolRequired: 'Toaster Oven & Heat Gloves',
          tip: 'Work in a well-ventilated area or under exhaust hood.',
        },
        {
          stepNumber: 3,
          title: 'Cool, Demold & Polish',
          instruction: 'Allow molded plastic drop shapes to cool completely. Sand edges with 400-grit wet sandpaper and buff with carnauba wax.',
          toolRequired: 'Wet Sandpaper & Buffing Cloth',
          tip: 'Carnauba wax creates a deep, glossy ceramic-like shine.',
        },
        {
          stepNumber: 4,
          title: 'Drill Hole & Attach Silver Ear Hook',
          instruction: 'Drill a 1mm hole through top point of each earring drop. Loop jump ring and attach hypoallergenic recycled sterling silver ear hook with pliers.',
          toolRequired: 'Micro Drill & Jewelry Pliers',
          tip: 'Double-check jump rings are crimped tight for secure everyday wear.',
        },
      ],
    },
  },

  // 4th Product: Recycled Shopping Tote Bag
  {
    id: 'mp-4',
    title: 'Recycled Shopping Tote Bag',
    category: 'wearables',
    points: 120,
    originalPoints: 250,
    condition: 'Mint Upcycled',
    co2SavedKg: 12.4,
    wasteDivertedKg: 1.2,
    seller: 'Studio Reforge',
    sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
    sellerRating: 4.96,
    sellerResponseTime: 'Under 10 mins',
    sellerBio: 'Handcrafting heavy-duty reusable shopping bags from 100% recycled cotton & ocean-diverted canvas.',
    location: '420 Harbor Wharf, Dock 7',
    neighborhood: 'Greenpoint Eco-District',
    distanceKm: 1.5,
    pickupAvailable: true,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1000&q=80',
    recycledFrom: 'Recycled Organic Cotton & Post-Consumer Textile Scraps',
    description:
      'Durable, washable zero-waste shopping tote woven from 100% post-consumer cotton scraps and reinforced with zero-plastic double stitching.',
    recycledProcessStory:
      'Post-industrial cotton cutoffs were sorted by pigment, fiberized without harsh chemical dyes, and woven on solar-powered looms into ultra-strong canvas.',
    materials: [
      { name: 'Recycled Post-Consumer Cotton Canvas', percentage: 90 },
      { name: 'Reinforced Linen Threading', percentage: 10 },
    ],
    tags: ['100% Recycled Cotton', 'Zero Plastic', 'Local Pickup Ready'],
    howToMake: {
      difficulty: 'Easy',
      timeRequired: '30-40 mins',
      toolsNeeded: ['Sewing Machine', 'Fabric Shears', 'Steam Iron', 'Tailor Chalk', 'Fabric Pins'],
      steps: [
        {
          stepNumber: 1,
          title: 'Measure & Cut Canvas Panels',
          instruction: 'Cut two 42x48cm rectangles from post-consumer recycled cotton canvas, plus two 65x8cm strips for shoulder handles.',
          toolRequired: 'Fabric Shears & Chalk',
          tip: 'Pre-iron canvas to remove creases before marking dimensions.',
        },
        {
          stepNumber: 2,
          title: 'Fold & Iron Handle Straps',
          instruction: 'Fold handle strips lengthwise toward center, press with hot steam iron, and topstitch along both long edges.',
          toolRequired: 'Steam Iron & Sewing Machine',
          tip: 'Topstitching 3mm from edges adds maximum tensile strength for heavy groceries.',
        },
        {
          stepNumber: 3,
          title: 'Stitch Body Side & Bottom Seams',
          instruction: 'Pin main canvas rectangles right-sides together. Sew side and bottom seams with a 1cm seam allowance and French seam finish.',
          toolRequired: 'Sewing Machine & Linen Thread',
          tip: 'French seams completely enclose raw edges to prevent fraying when washed.',
        },
        {
          stepNumber: 4,
          title: 'Attach Handles with Box-X Stitching',
          instruction: 'Fold top hem down 2.5cm twice. Pin handles inside top rim 12cm apart and secure each strap end with a square Box-X stitch pattern.',
          toolRequired: 'Sewing Machine',
          tip: 'The Box-X stitch pattern supports up to 15kg load capacity!',
        },
      ],
    },
  },

  // 5th Product: Upcycled Glass Bottle Vase
  {
    id: 'mp-5',
    title: 'Upcycled Glass Bottle Vase',
    category: 'materials',
    points: 140,
    originalPoints: 280,
    condition: 'Mint Upcycled',
    co2SavedKg: 11.8,
    wasteDivertedKg: 1.4,
    seller: 'Vitreous Eco Works',
    sellerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80',
    sellerRating: 4.95,
    sellerResponseTime: 'Immediate',
    sellerBio: 'Flame-cut and hand-polished glassware produced from local restaurant bottle waste.',
    location: '312 Canal Basin Studio',
    neighborhood: 'Old Mill Arts Zone',
    distanceKm: 2.1,
    pickupAvailable: true,
    image: 'https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?auto=format&fit=crop&w=1000&q=80',
    recycledFrom: '100% Reclaimed Wine & Olive Oil Glass Bottles',
    description:
      'Minimalist amber glass vase flame-cut from salvaged wine bottles and diamond-wheel bevel polished for a sleek satin rim finish.',
    recycledProcessStory:
      'Rescued from restaurant glass bins, thermal shock-cut, and edge-beveled using water-cooled diamond abrasive discs.',
    materials: [{ name: 'Reclaimed Amber Glass Bottle', percentage: 100 }],
    tags: ['Flame Cut', 'Hand Polished', 'Zero Packaging Waste'],
    howToMake: {
      difficulty: 'Intermediate',
      timeRequired: '30 mins',
      toolsNeeded: ['Glass Bottle Cutter Tool', 'Boiling Water Kettle', 'Ice Water Basin', 'Silicon Carbide Sandpaper (220-600 grit)'],
      steps: [
        {
          stepNumber: 1,
          title: 'Score Glass Bottle Shoulder',
          instruction: 'Clamp salvaged amber wine bottle into bottle cutting jig. Rotate bottle smoothly once against carbide wheel to score a light continuous ring line.',
          toolRequired: 'Glass Cutting Tool',
          tip: 'Score only ONCE around—never overlap score marks to avoid jagged cracks.',
        },
        {
          stepNumber: 2,
          title: 'Thermal Shock Separation',
          instruction: 'Pour boiling water along score line for 10 seconds, then immediately submerge in ice water bath. Repeat 2-3 times until bottle separates with a clean pop.',
          toolRequired: 'Kettle & Ice Bath',
          tip: 'The sharp clean break occurs right along thermal expansion line.',
        },
        {
          stepNumber: 3,
          title: 'Smooth Cut Edge with Silicon Carbide',
          instruction: 'Submerge 220-grit wet silicon carbide sandpaper in water plate. Rub glass rim in figure-8 motions until razor-sharp glass edge becomes silky smooth.',
          toolRequired: 'Wet Sandpaper Plate',
          tip: 'Progress to 600-grit paper for a polished satin rim finish.',
        },
        {
          stepNumber: 4,
          title: 'Clean & Style with Fresh Flowers',
          instruction: 'Rinse glass vase clean, fill with fresh water, and arrange seasonal wildflowers or dried botanicals.',
          toolRequired: 'Water & Cloth',
          tip: 'Amber glass shields plant stems from solar degradation.',
        },
      ],
    },
  },

  // 6th Product: Upcycled Denim Pocket Wallet
  {
    id: 'mp-6',
    title: 'Upcycled Denim Pocket Wallet',
    category: 'wearables',
    points: 110,
    originalPoints: 220,
    condition: 'Raw Reclaimed',
    co2SavedKg: 9.2,
    wasteDivertedKg: 0.5,
    seller: 'Deck Revival Collective',
    sellerAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=150&q=80',
    sellerRating: 4.85,
    sellerResponseTime: 'Within 20 mins',
    sellerBio: 'Hand-stitching slim card wallets from discarded selvage jeans and vintage workwear.',
    location: '72 Timber Ramp Yard',
    neighborhood: 'Harbor Reclaim Yard',
    distanceKm: 2.6,
    pickupAvailable: true,
    image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1000&q=80',
    recycledFrom: 'Post-Consumer Vintage Denim Jeans & Leather Offcut Tab',
    description:
      'Slim EDC cardholder featuring 3 card slots and a central cash pocket made from heavy-weight 14oz upcycled selvage denim.',
    recycledProcessStory:
      'Distressed jeans beyond repair are washed, laser-cut around heavy-wear areas, and reinforced with eco-waxed hemp stitching.',
    materials: [
      { name: 'Upcycled Selvage Denim', percentage: 88 },
      { name: 'Waxed Organic Hemp Thread', percentage: 12 },
    ],
    tags: ['EDC Denim', 'Rescue Garments', 'Local Pickup'],
    howToMake: {
      difficulty: 'Easy',
      timeRequired: '25-30 mins',
      toolsNeeded: ['Fabric Scissors', 'Heavy Harness Needle', 'Eco Waxed Hemp Thread', 'Steel Ruler', 'Thimble'],
      steps: [
        {
          stepNumber: 1,
          title: 'Cut Denim Fabric Sections',
          instruction: 'Harvest clean heavy-weight 14oz selvage denim from discarded jeans. Cut 1 main back rectangle (10.5x14cm) and 2 card pocket sleeves (10.5x7cm).',
          toolRequired: 'Fabric Scissors',
          tip: 'Use section including authentic selvage ID edge for a designer accent.',
        },
        {
          stepNumber: 2,
          title: 'Layer & Align Card Slots',
          instruction: 'Stack card sleeves in staggered tiers over back piece and pin along side edges to form 3 slim cardholder slots plus 1 central cash sleeve.',
          toolRequired: 'Sewing Pins & Ruler',
          tip: 'Check that credit cards fit snugly into slots before stitching.',
        },
        {
          stepNumber: 3,
          title: 'Saddle Stitch Perimeter',
          instruction: 'Thread heavy waxed hemp thread onto 2 harness needles and saddle-stitch perimeter 3mm from edge for ultra-durable hand-worked seams.',
          toolRequired: 'Needles & Waxed Thread',
          tip: 'Saddle stitching never unravels even if one thread loop gets worn.',
        },
        {
          stepNumber: 4,
          title: 'Wax & Burnish Raw Edges',
          instruction: 'Bevel denim raw edges slightly, rub with natural beeswax, and burnish with canvas rag for a sleek water-resistant edge finish.',
          toolRequired: 'Beeswax Block & Canvas Rag',
          tip: 'Ready for everyday pocket carry!',
        },
      ],
    },
  },

  // 7th Product: Recycled Rubber Tire Planter
  {
    id: 'mp-7',
    title: 'Recycled Eco Rubber Tire Planter',
    category: 'materials',
    points: 180,
    originalPoints: 360,
    condition: 'Certified Grade A',
    co2SavedKg: 24.5,
    wasteDivertedKg: 5.2,
    seller: 'Horology Revival Co.',
    sellerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80',
    sellerRating: 4.99,
    sellerResponseTime: 'Around 5 mins',
    sellerBio: 'Upcycling discarded vulcanized automotive rubber tires into weatherproof outdoor planters.',
    location: '19 Precision Row, Suite 4',
    neighborhood: 'Old Mill Arts Zone',
    distanceKm: 3.4,
    pickupAvailable: true,
    image: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1000&q=80',
    recycledFrom: 'Scrap Vulcanized Automotive Rubber Tire',
    description:
      'Indestructible frost-proof garden planter inverted and sculpted from discarded car tires. Naturally UV-resistant and non-degrading.',
    recycledProcessStory:
      'End-of-life tires were steam-cleaned, steel belts stripped, inverted, and coated in non-toxic water-based eco-sealant.',
    materials: [{ name: 'Vulcanized Post-Consumer Rubber', percentage: 100 }],
    tags: ['Weatherproof', 'Indestructible', 'Local Delivery'],
    howToMake: {
      difficulty: 'Intermediate',
      timeRequired: '40-50 mins',
      toolsNeeded: ['Heavy Utility Knife / Utility Blade', 'Soapy Water Spray Bottle', 'Chalk Marker', 'Non-Toxic Water Shield Paint'],
      steps: [
        {
          stepNumber: 1,
          title: 'Scrub & Trace Scalloped Outline',
          instruction: 'Scrub discarded car tire with eco-degreaser and water. Use chalk marker to draw a wave or scalloped pattern around upper sidewall.',
          toolRequired: 'Chalk Marker & Brush',
          tip: 'Symmetric 5cm wave peaks yield an ornamental flowerpot rim.',
        },
        {
          stepNumber: 2,
          title: 'Cut Rubber Sidewall',
          instruction: 'Spray soapy water along cut path as lubricant. Cut along chalk outline with sharp utility knife, dipping blade frequently in soap solution.',
          toolRequired: 'Utility Blade & Soap Spray',
          tip: 'Soapy water reduces friction by 80%, making thick rubber cut smoothly.',
        },
        {
          stepNumber: 3,
          title: 'Invert Tire Inside Out',
          instruction: 'Place tire on ground, step firmly on inner bead, and muscle top rubber layer inside-out to form urn pedestal base.',
          toolRequired: 'Work Boots & Hands',
          tip: 'Inverting turns rugged tread inward while leaving sleek smooth rubber exposed.',
        },
        {
          stepNumber: 4,
          title: 'Drainage Holes & Eco Coat',
          instruction: 'Drill 4 bottom drainage holes (10mm). Coat planter in terracotta or matte black non-toxic water-based exterior paint.',
          toolRequired: 'Power Drill & Paint',
          tip: 'Indestructible frost-proof planter lasts 50+ garden seasons outdoors!',
        },
      ],
    },
  },

  // 8th Product: Upcycled Patchwork Cushion Cover
  {
    id: 'mp-8',
    title: 'Upcycled Patchwork Cushion Cover',
    category: 'furniture',
    points: 130,
    originalPoints: 260,
    condition: 'Raw Reclaimed',
    co2SavedKg: 10.5,
    wasteDivertedKg: 1.3,
    seller: 'Timber Salvage Co.',
    sellerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    sellerRating: 4.89,
    sellerResponseTime: 'Around 15 mins',
    sellerBio: 'Hand-stitching artisan home furnishings from deadstock upholstery & linen remnants.',
    location: '104 River Sawmill Road',
    neighborhood: 'Greenpoint Eco-District',
    distanceKm: 4.1,
    pickupAvailable: true,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=1000&q=80',
    recycledFrom: 'Upholstery Mill Deadstock Remnants & Linen Offcuts',
    description:
      'Geometric 18x18" square cushion cover pieced together from textured neutral linen, hemp, and woven cotton deadstock swatches.',
    recycledProcessStory:
      'High-end interior design studio swatch samples were hand-patterned, seam-serged, and fitted with an invisible recycled brass zipper.',
    materials: [
      { name: 'Deadstock Linen & Hemp Remnants', percentage: 85 },
      { name: 'Recycled Zipper Hardware', percentage: 15 },
    ],
    tags: ['Deadstock Fabric', 'Artisan Patchwork', 'Walk-in Pickup Ready'],
    howToMake: {
      difficulty: 'Easy',
      timeRequired: '35 mins',
      toolsNeeded: ['Sewing Machine', 'Rotary Fabric Cutter', 'Iron & Board', 'Recycled Brass Zipper', 'Fabric Pins'],
      steps: [
        {
          stepNumber: 1,
          title: 'Sort Deadstock Swatches into Grid',
          instruction: 'Select 9 matching 18x18cm deadstock upholstery swatches in neutral linen, hemp, and cotton textures. Arrange in a 3x3 geometric grid.',
          toolRequired: 'Cutting Mat & Rotary Cutter',
          tip: 'Balance light and dark textured fabrics evenly across grid.',
        },
        {
          stepNumber: 2,
          title: 'Sew Rows & Press Seams Flat',
          instruction: 'Pin swatches into 3 horizontal strips. Sew with 1cm seam allowance and press seam allowances open with hot steam iron.',
          toolRequired: 'Sewing Machine & Iron',
          tip: 'Pressing seams flat guarantees sharp crisp patchwork intersections.',
        },
        {
          stepNumber: 3,
          title: 'Sew Rows Together into Main Panel',
          instruction: 'Join 3 row strips together, matching grid corner seams precisely, to construct 48x48cm square front cover panel.',
          toolRequired: 'Sewing Machine & Pins',
          tip: 'Pin right through seam intersections before stitching.',
        },
        {
          stepNumber: 4,
          title: 'Install Zipper & Assemble Backing',
          instruction: 'Sew invisible recycled zipper onto bottom edge and attach backing panel. Turn right side out and insert pillow insert!',
          toolRequired: 'Sewing Machine & Zipper Foot',
          tip: 'Iron final cushion cover for gallery-worthy living room decor.',
        },
      ],
    },
  },

  // 9th Product: Reclaimed Timber Wall Display Shelf
  {
    id: 'mp-9',
    title: 'Reclaimed Timber Wall Display Shelf',
    category: 'furniture',
    points: 210,
    originalPoints: 420,
    condition: 'Raw Reclaimed',
    co2SavedKg: 18.2,
    wasteDivertedKg: 3.2,
    seller: 'Timber Salvage Co.',
    sellerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80',
    sellerRating: 4.89,
    sellerResponseTime: 'Around 15 mins',
    sellerBio: 'Deconstructing vintage factory beams into rustic floating wall shelves.',
    location: '104 River Sawmill Road',
    neighborhood: 'Greenpoint Eco-District',
    distanceKm: 5.2,
    pickupAvailable: true,
    image: 'https://images.unsplash.com/photo-1532323544230-7191fd51bc1b?auto=format&fit=crop&w=1000&q=80',
    recycledFrom: '100-Year-Old Factory Pine Floor Joists',
    description:
      'Rustic 24" floating wall shelf retaining original saw blade markings, knot holes, and dark aged pine patina. Includes concealed steel mounting brackets.',
    recycledProcessStory:
      'Salvaged from a 1910s textile mill demolition, denailed, surface-brushed, and hand-rubbed with botanical tung oil.',
    materials: [
      { name: 'Historic Reclaimed Factory Pine', percentage: 90 },
      { name: 'Concealed Steel Mounting Brackets', percentage: 10 },
    ],
    tags: ['100-Year-Old Pine', 'Concealed Brackets', 'Local Pickup'],
    howToMake: {
      difficulty: 'Artisan',
      timeRequired: '50-60 mins',
      toolsNeeded: ['Pry Bar / Nail Puller', 'Brass Wire Brush', 'Orbital Sander (120-220 grit)', 'Botanical Tung Oil & Rag', 'Concealed Steel Wall Brackets'],
      steps: [
        {
          stepNumber: 1,
          title: 'Extract Hardware & Wire Brush Timber',
          instruction: 'Extract vintage square-head nails from historic 1910s factory pine joist. Scrub surface with brass wire brush to clear loose dirt while preserving original mill blade marks.',
          toolRequired: 'Pry Bar & Wire Brush',
          tip: 'Old saw-blade mill marks give reclaimed pine its prized authentic character.',
        },
        {
          stepNumber: 2,
          title: 'Light Orbital Sanding',
          instruction: 'Sand board top and edges lightly with 180-grit orbital sander to eliminate splinters while keeping dark natural wood patina intact.',
          toolRequired: 'Orbital Sander',
          tip: 'Do not over-sand, or you will lose the vintage century-old wood grain patina.',
        },
        {
          stepNumber: 3,
          title: 'Drill Rear Mounting Holes',
          instruction: 'Drill two 12mm x 120mm deep rear holes into back edge of shelf to accommodate heavy-duty concealed steel floating brackets.',
          toolRequired: 'Drill Press / Power Drill',
          tip: 'Ensure holes are perfectly perpendicular for level wall mounting.',
        },
        {
          stepNumber: 4,
          title: 'Rub Botanical Tung Oil',
          instruction: 'Apply 2 coats of pure botanical tung oil using lint-free cotton cloth. Allow oil to penetrate wood pores for 24 hours to cure into a rich waterproof matte finish.',
          toolRequired: 'Cotton Cloth & Tung Oil',
          tip: 'Mount on wall studs—holds up to 25kg of books and decor!',
        },
      ],
    },
  },

  // 10th Product: Recycled Paper Hardcover Notebook
  {
    id: 'mp-10',
    title: 'Recycled Paper Hardcover Notebook',
    category: 'materials',
    points: 75,
    originalPoints: 150,
    condition: 'Mint Upcycled',
    co2SavedKg: 4.8,
    wasteDivertedKg: 0.6,
    seller: 'Pulp & Fiber Press',
    sellerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80',
    sellerRating: 4.94,
    sellerResponseTime: 'Under 10 mins',
    sellerBio: 'Hand-binding 100% post-consumer recycled paper journal notebooks with soy-based inks.',
    location: '55 Press Alley',
    neighborhood: 'Greenpoint Eco-District',
    distanceKm: 1.2,
    pickupAvailable: true,
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1000&q=80',
    recycledFrom: '100% Post-Consumer Office Paper & Cotton Rag Board',
    description:
      'Lay-flat hardcover journal containing 160 pages of smooth 100gsm unbleached recycled paper, Smyth-sewn binding, and organic linen bookmark Ribbon.',
    recycledProcessStory:
      'Shredded office paper repulped using closed-loop water filtration, sun-dried, and hand-bound into hardcovers covered in reclaimed textile rag.',
    materials: [
      { name: '100% Recycled Post-Consumer Fiber Paper', percentage: 92 },
      { name: 'Organic Cotton Binding Thread', percentage: 8 },
    ],
    tags: ['100% Recycled Paper', 'Lay-Flat Binding', 'Local Pickup'],
    howToMake: {
      difficulty: 'Intermediate',
      timeRequired: '35 mins',
      toolsNeeded: ['Guillotine Paper Trimmer', 'Bone Folder', 'Bookbinding Awl & Needle', 'Waxed Linen Thread', 'PVA Bookbinding Glue'],
      steps: [
        {
          stepNumber: 1,
          title: 'Fold Recycled Paper Signatures',
          instruction: 'Fold 40 sheets of 100gsm unbleached recycled paper in half using a bone folder to create 5 signature booklets (160 pages total).',
          toolRequired: 'Bone Folder',
          tip: 'Crease firmly with bone folder for flat signatures.',
        },
        {
          stepNumber: 2,
          title: 'Punch Spine Binding Stations',
          instruction: 'Align signatures in wooden sewing cradle and punch 4 binding holes along spine fold of each signature using bookbinding awl.',
          toolRequired: 'Bookbinding Awl',
          tip: 'Use hole template guide to ensure holes align across all 5 signatures.',
        },
        {
          stepNumber: 3,
          title: 'Smyth-Sew Book Block',
          instruction: 'Sew signatures together using kettle-stitch pattern with waxed organic cotton thread until book block lays completely flat.',
          toolRequired: 'Needle & Waxed Thread',
          tip: 'Smyth sewing allows notebook to open 180° flat on any desk page.',
        },
        {
          stepNumber: 4,
          title: 'Attach Rag Board Hardcovers',
          instruction: 'Glue post-consumer cotton rag board covers wrapped in reclaimed linen fabric onto book spine. Let dry under heavy book press for 2 hours.',
          toolRequired: 'PVA Glue & Heavy Press',
          tip: 'Add organic linen ribbon bookmark inside spine before casing in.',
        },
      ],
    },
  },
];
