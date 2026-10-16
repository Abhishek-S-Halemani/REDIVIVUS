export interface DisposalItem {
  id: string;
  name: string;
  category: 'womens-hygiene' | 'mens-hygiene' | 'baby-care';
  subtitle: string;
  tag: string;
  recommendedSteps: string[];
  safetyTips: string[];
  ecoHighlight: string;
}

export interface DisposalCategory {
  id: 'womens-hygiene' | 'mens-hygiene' | 'baby-care';
  name: string;
  subtitle: string;
  itemCount: number;
  items: DisposalItem[];
}

export const SHHH_CATEGORIES: DisposalCategory[] = [
  {
    id: 'womens-hygiene',
    name: "Women's Hygiene",
    subtitle: 'Sanitary pads, tampons, menstrual cups & period wear',
    itemCount: 5,
    items: [
      {
        id: 'sanitary-pads',
        name: 'Sanitary Pads',
        category: 'womens-hygiene',
        subtitle: 'Adhesive absorbent pads & daily liners',
        tag: 'Non-Flushable • Sanitary Landfill',
        recommendedSteps: [
          'Carefully remove the used pad from underwear and roll it tightly inward so the clean adhesive side or backing covers the soiled surface.',
          'Wrap the rolled pad securely in clean scrap paper, newspaper, or the disposal wrapper provided with a fresh pad. Never discard unwrapped.',
          'Fold the wrapper ends firmly or seal using the sticky tab on the replacement pad wrapper to prevent odor and exposure.',
          'Place the wrapped package into a dedicated sanitary disposal receptacle or a lined household non-recyclable bin.',
          'Wash your hands thoroughly with antibacterial soap and warm water for at least 20 seconds.'
        ],
        safetyTips: [
          'NEVER flush sanitary pads or liners: They contain superabsorbent polymers (SAP) and plastic leak barriers that swell in water and choke domestic plumbing.',
          'Do NOT burn or incinerate at home: Household burning of synthetic plastic pads releases toxic dioxins and carcinogens into the air.',
          'Always use a lidded and lined trash bin to maintain bathroom hygiene and keep away insects and household pets.'
        ],
        ecoHighlight: 'Diverts non-biodegradable synthetic polymers from contaminating municipal sewer treatment plants.'
      },
      {
        id: 'tampons',
        name: 'Tampons',
        category: 'womens-hygiene',
        subtitle: 'Cotton cores, cords & applicators',
        tag: 'Non-Flushable • Bio-Sanitary',
        recommendedSteps: [
          'Gently pull the withdrawal cord to remove the tampon and wrap the cord snugly around the absorbent core.',
          'Wrap the tampon and its plastic or cardboard applicator in several layers of toilet tissue or a dedicated disposal sachet.',
          'Drop the wrapped tampon bundle into a closed sanitary waste bin or lined garbage can.',
          'Ensure the bin lid is closed securely to prevent odor transmission and keep surroundings sanitized.',
          'Wash hands thoroughly with soap and clean water immediately after handling.'
        ],
        safetyTips: [
          'DO NOT flush tampons, cords, or applicators: Even 100% organic cotton expands in water and snags on pipe joints, triggering severe sewer blockages.',
          'Never put used tampons in garden compost: They constitute biological human waste and can foster harmful pathogens in vegetable soil.',
          'Empty bathroom sanitary bins every 1–2 days to inhibit bacterial multiplication and odor buildup.'
        ],
        ecoHighlight: 'Prevents thousands of plastic applicators and cotton blockages from polluting waterways and coastal areas.'
      },
      {
        id: 'menstrual-cups',
        name: 'Menstrual Cups',
        category: 'womens-hygiene',
        subtitle: 'Medical-grade silicone reusable cups',
        tag: 'Reusable • Sanitizable • Scrap Silicone',
        recommendedSteps: [
          'During active cycle: Empty collected menstrual fluid directly into the toilet bowl and flush.',
          'Rinse the cup thoroughly under cold or lukewarm running water, and clean with mild, oil-free, fragrance-free soap before reinsertion.',
          'Between monthly cycles: Submerge the cup completely in a dedicated pot of boiling water for 5 to 7 minutes to sanitize.',
          'Air dry completely in a clean space and store in a breathable, clean cotton pouch (never an airtight container).',
          'End-of-life disposal (after 5 to 10 years): Cut the medical silicone cup into small pieces with clean scissors and discard in dry solid waste, or send to a silicone recycling program.'
        ],
        safetyTips: [
          'Never use dishwashing liquids, bleach, fragrant hand soaps, or vinegar: Harsh chemicals degrade medical-grade silicone and induce vaginal pH imbalance.',
          'Ensure the silicone cup does not rest on the bottom of a hot boiling pot, as direct heat can scorch the material.',
          'Retire and replace immediately if you detect sticky surfaces, deep tears, or persistent discoloration.'
        ],
        ecoHighlight: 'A single menstrual cup replaces upwards of 2,400 disposable pads and tampons over its lifespan.'
      },
      {
        id: 'reusable-period-panties',
        name: 'Reusable Period Panties',
        category: 'womens-hygiene',
        subtitle: 'Multi-layer absorbent textile underwear',
        tag: 'Washable • Textile Recycle After 40+ Washes',
        recommendedSteps: [
          'Immediate rinse: Rinse under cold tap water immediately after removal until the runoff is clear.',
          'Machine or hand wash: Wash on gentle cycle with cold water (max 30°C / 86°F) using gentle liquid laundry detergent.',
          'Do NOT add fabric softeners, bleach, or harsh chemical stain removers, as they destroy the waterproof antimicrobial membrane.',
          'Air dry completely: Hang or lay flat in a well-ventilated area or indirect sunlight. Do not tumble dry or iron.',
          'End-of-life retirement (after ~2–3 years / 40+ washes): Launder thoroughly one last time, cut away the absorbent gusset, and separate outer fabric for textile recycling programs.'
        ],
        safetyTips: [
          'Never rinse with hot water first: Hot water coagulates blood proteins, setting stains permanently into the fiber weave.',
          'Do not wring or twist aggressively: Harsh wringing ruptures the waterproof polyurethane laminate (TPU) barrier layer.',
          'Ensure panties are 100% bone-dry before storing in dark drawers to prevent mildew and fungal spores.'
        ],
        ecoHighlight: 'Cuts household sanitary waste by over 90% while providing multi-year leakproof protection.'
      },
      {
        id: 'disposable-period-underwear',
        name: 'Disposable Period Underwear',
        category: 'womens-hygiene',
        subtitle: 'Full-coverage 360° pull-up sanitary briefs',
        tag: 'Non-Flushable • Sanitary Landfill',
        recommendedSteps: [
          'Tear both side seams gently from top to bottom for hygienic, touch-free removal without pulling down over legs.',
          'Roll the disposable underwear tightly from the bottom absorbent gusset upward toward the waistband into a neat roll.',
          'Use the integrated adhesive disposal strip on the back of the underwear to seal the roll tightly shut.',
          'Place into a lidded sanitary disposal unit or regular lined household waste bin.',
          'Wash and sanitize hands thoroughly with soap and warm water.'
        ],
        safetyTips: [
          'Never attempt to flush disposable period underwear: The multi-layered leak barrier and dense superabsorbent pulp will instantly choke toilet drains.',
          'Do not place in textile recycling or organic compost bins due to biological fluids and synthetic water-repellent polymers.',
          'In public facilities, place directly into touchless sanitary bins to minimize touchpoints.'
        ],
        ecoHighlight: 'Proper containment in municipal sanitary landfills avoids catastrophic sewer pump station clogs.'
      }
    ]
  },
  {
    id: 'mens-hygiene',
    name: "Discrete Hygiene",
    subtitle: 'Discreet prophylactics, grooming sharps & personal care',
    itemCount: 2,
    items: [
      {
        id: 'condoms',
        name: 'Condoms',
        category: 'mens-hygiene',
        subtitle: 'Latex, polyisoprene & polyurethane prophylactics',
        tag: 'Non-Flushable • General Dry Waste',
        recommendedSteps: [
          'Hold the base of the condom firmly during withdrawal immediately following ejaculation to prevent fluid leakage, then slide off carefully.',
          'Tie a firm knot at the open end of the condom to seal in all bodily fluids securely.',
          'Wrap the knotted condom inside a facial tissue, paper towel, or scrap paper for cleanliness and complete discretion.',
          'Deposit the wrapped condom into the primary household non-recyclable dry waste trash bin.',
          'Wash hands thoroughly with soap and warm running water.'
        ],
        safetyTips: [
          'NEVER flush condoms down the toilet: Latex and synthetic polymers do not dissolve in water; they clog domestic sewer pipes and pose choking hazards to marine life.',
          'Do not put in organic compost or regular paper/plastic recycling: Condoms are biological waste and contain silicone/water-based lubricants or spermicides.',
          'Never leave condoms in open wastebaskets where pets or children might retrieve or ingest them.'
        ],
        ecoHighlight: 'Preventing condoms from entering sewer lines protects ocean ecosystems and municipal water filtration.'
      },
      {
        id: 'razor-blades',
        name: 'Razor Blades',
        category: 'mens-hygiene',
        subtitle: 'Safety razor blades & disposable cartridge heads',
        tag: 'Sharps Biohazard • Puncture-Proof Metal Safe',
        recommendedSteps: [
          'For safety razors: Carefully unscrew the razor head while gripping only the short, non-cutting side edges of the dull blade.',
          'Slide the dull blade directly into a puncture-proof "blade bank" (a dedicated metal sharps tin or repurposed steel can with a coin slot).',
          'For disposable cartridge heads: Snap the original plastic protective safety guard back over the blade head, or wrap securely in several layers of heavy cardboard and tape.',
          'When the blade bank is filled: Seal the slot securely with heavy-duty duct tape and label clearly: "DULL SHARPS - DO NOT OPEN".',
          'Deliver the sealed container to your local municipal hazardous waste depot, community scrap metal recycler, or pharmacy sharps drop box.'
        ],
        safetyTips: [
          'NEVER toss loose or unprotected razor blades into regular garbage bags: Thin plastic bags tear instantly, causing deep lacerations and bloodborne pathogen risk to waste handlers.',
          'Never attempt to bend, snap, or break double-edge razor blades by hand; steel shards can fly into eyes or sever skin.',
          'Store blade banks in high, child-proof, pet-inaccessible cabinets away from damp bathroom ledges.'
        ],
        ecoHighlight: '100% recyclable steel recovered safely without posing laceration hazards to sanitation workers.'
      }
    ]
  },
  {
    id: 'baby-care',
    name: 'Baby Care',
    subtitle: 'Infant diapers, training pampers & cleansing wipes',
    itemCount: 2,
    items: [
      {
        id: 'baby-diapers',
        name: 'Baby Diapers/Pampers',
        category: 'baby-care',
        subtitle: 'Disposable diapers, pull-ups & training pants',
        tag: 'Non-Flushable • Diaper Pail Landfill',
        recommendedSteps: [
          'If solid fecal matter is present, shake and scrape the solid stool directly into the toilet bowl and flush it into the municipal sewer.',
          'Fold the front half of the diaper inward toward the center absorbent core.',
          'Roll the diaper tightly from the front to the back into a dense, compact cylinder.',
          'Unfasten the adhesive side tabs, pull them across the rolled diaper, and press firmly to seal the bundle shut.',
          'Place the sealed diaper inside an odor-barrier diaper pail or a dedicated lined trash can, and disinfect changing mat and hands.'
        ],
        safetyTips: [
          'NEVER flush diapers, pull-ups, or diaper components down the toilet: Sodium polyacrylate gel crystals expand up to 300x in water, triggering massive plumbing destruction.',
          'Always empty solid fecal waste into the toilet when possible: Municipal sewage systems treat biological pathogens, preventing groundwater contamination in landfills.',
          'Never store soiled diapers in unventilated or warm spaces to prevent ammonia fumes, mold spores, and pest attraction.'
        ],
        ecoHighlight: 'Directing fecal solids to municipal sewers drastically reduces toxic biological leaching in municipal landfills.'
      },
      {
        id: 'baby-wipes',
        name: 'Baby Wipes',
        category: 'baby-care',
        subtitle: 'Cleansing wipes, diaper wipes & wet towelettes',
        tag: 'Non-Flushable • Sanitary Dry Waste',
        recommendedSteps: [
          'After cleansing, fold the soiled wipe inward so clean edges encase any residues.',
          'If changing a diaper, place the folded wipe inside the diaper before rolling and sealing it with the diaper tabs.',
          'For standalone wipe use, discard directly into a lined, lidded bathroom or diaper disposal bin.',
          'Firmly close the snap lid or resealable moisture seal on the wipe package to keep remaining wipes fresh and sterile.',
          'Wash and sanitize your hands with soap and water after changing and clean-up.'
        ],
        safetyTips: [
          'NEVER flush baby wipes down the toilet—even if labeled "flushable": Wet wipes do not dissolve like toilet paper and are the primary cause of giant sewer fatbergs.',
          'Do NOT put standard wipes in backyard compost: Most commercial wipes contain synthetic polyester or polypropylene fibers that persist for decades.',
          'Avoid using scented or alcohol-based wipes on broken skin or active diaper rashes to prevent contact dermatitis.'
        ],
        ecoHighlight: 'Eliminating wipes from wastewater prevents destructive sewer pipe fatbergs that cost cities millions.'
      }
    ]
  }
];
