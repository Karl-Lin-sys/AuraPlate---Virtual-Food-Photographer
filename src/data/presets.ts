import { Dish, MenuData } from '../types';

// Procedural gourmet food illustrations as SVG data URLs for instant presentation
function createFoodSvgDataUrl(dishType: string, style: 'rustic' | 'bright' | 'social'): string {
  const bg =
    style === 'rustic'
      ? 'radial-gradient(circle at 50% 40%, #2a201a 0%, #15100d 70%, #0a0807 100%)'
      : style === 'bright'
      ? 'radial-gradient(circle at 45% 35%, #ffffff 0%, #f4efe9 60%, #e2d8cd 100%)'
      : 'radial-gradient(circle at 50% 50%, #fdf8f2 0%, #faede2 70%, #f0dcc9 100%)';

  const plateColor = style === 'rustic' ? '#1f1b18' : style === 'bright' ? '#fdfdfd' : '#ffffff';
  const rimColor = style === 'rustic' ? '#4a3b32' : style === 'bright' ? '#e2d7cb' : '#d8cbbe';
  const shadowColor = style === 'rustic' ? 'rgba(0,0,0,0.85)' : 'rgba(100,80,60,0.25)';

  let dishSvgContent = '';

  if (dishType.includes('steak') || dishType.includes('bistecca') || dishType.includes('meat')) {
    dishSvgContent = `
      <!-- Slate or Plate -->
      <rect x="70" y="80" width="260" height="240" rx="16" fill="${plateColor}" stroke="${rimColor}" stroke-width="3" filter="drop-shadow(0 15px 25px ${shadowColor})"/>
      <!-- Grilled Steak -->
      <path d="M120,130 C150,110 230,120 270,160 C290,190 270,250 220,260 C170,270 120,240 110,190 Z" fill="#4d1e12" stroke="#2c0e08" stroke-width="4"/>
      <!-- Sear Marks -->
      <path d="M130,140 L250,230 M150,130 L270,220 M120,180 L220,260" stroke="#1f0a05" stroke-width="5" stroke-linecap="round" opacity="0.8"/>
      <!-- Herb Butter & Rosemary -->
      <ellipse cx="190" cy="180" rx="22" ry="14" fill="#efd07b" opacity="0.9"/>
      <path d="M170,195 Q190,160 230,175" stroke="#2d5a27" stroke-width="4" stroke-linecap="round" fill="none"/>
      <!-- Flaky Sea Salt flakes -->
      <rect x="180" y="165" width="4" height="4" fill="#ffffff" transform="rotate(45 180 165)"/>
      <rect x="210" y="195" width="5" height="5" fill="#ffffff" transform="rotate(25 210 195)"/>
      <rect x="150" y="210" width="4" height="4" fill="#ffffff" transform="rotate(10 150 210)"/>
    `;
  } else if (dishType.includes('pasta') || dishType.includes('tagliatelle') || dishType.includes('noodle')) {
    dishSvgContent = `
      <!-- Deep Bowl -->
      <circle cx="200" cy="200" r="130" fill="${plateColor}" stroke="${rimColor}" stroke-width="4" filter="drop-shadow(0 18px 25px ${shadowColor})"/>
      <circle cx="200" cy="200" r="95" fill="${style === 'rustic' ? '#120f0d' : '#f5ece1'}" stroke="${rimColor}" stroke-width="2"/>
      <!-- Pasta Twirls -->
      <path d="M140,190 Q170,140 210,180 T260,190 T210,230 T150,210" fill="none" stroke="#e9b860" stroke-width="9" stroke-linecap="round"/>
      <path d="M150,170 Q190,130 240,170 T230,220 T170,230" fill="none" stroke="#f4c878" stroke-width="7" stroke-linecap="round"/>
      <path d="M165,185 Q205,160 225,195 T180,215" fill="none" stroke="#fed892" stroke-width="6" stroke-linecap="round"/>
      <!-- Truffle Slices -->
      <ellipse cx="195" cy="180" rx="14" ry="10" fill="#2b231f" stroke="#483b34" stroke-width="2"/>
      <ellipse cx="225" cy="200" rx="12" ry="8" fill="#241d1a" stroke="#483b34" stroke-width="2"/>
      <!-- Parsley & Parmesan -->
      <circle cx="185" cy="195" r="3" fill="#387a32"/>
      <circle cx="215" cy="175" r="3" fill="#387a32"/>
      <circle cx="190" cy="165" r="2" fill="#fffef5"/>
      <circle cx="230" cy="210" r="2.5" fill="#fffef5"/>
    `;
  } else if (dishType.includes('salad') || dishType.includes('burrata') || dishType.includes('crudo')) {
    dishSvgContent = `
      <!-- Elegant Ceramic Plate -->
      <circle cx="200" cy="200" r="135" fill="${plateColor}" stroke="${rimColor}" stroke-width="3" filter="drop-shadow(0 14px 24px ${shadowColor})"/>
      <!-- Burrata Center -->
      <circle cx="200" cy="195" r="45" fill="#faf6f0" stroke="#e8ded2" stroke-width="2"/>
      <path d="M190,155 Q200,145 210,155 Q205,165 190,155" fill="#e0d0bd"/>
      <!-- Heirloom Tomatoes -->
      <circle cx="145" cy="180" r="22" fill="#d93829"/>
      <circle cx="250" cy="185" r="20" fill="#e06928"/>
      <circle cx="170" cy="245" r="18" fill="#e2a82b"/>
      <circle cx="230" cy="240" r="21" fill="#c42b22"/>
      <!-- Basil Leaves & Microgreens -->
      <path d="M175,165 Q160,145 180,140 Q185,160 175,165" fill="#2e7d32"/>
      <path d="M225,160 Q245,145 240,165 Q225,170 225,160" fill="#388e3c"/>
      <!-- Basil Oil Droplets -->
      <circle cx="150" cy="220" r="5" fill="#558b2f" opacity="0.8"/>
      <circle cx="245" cy="220" r="6" fill="#558b2f" opacity="0.8"/>
      <circle cx="195" cy="255" r="4" fill="#558b2f" opacity="0.8"/>
    `;
  } else if (dishType.includes('ramen') || dishType.includes('soup') || dishType.includes('bowl')) {
    dishSvgContent = `
      <!-- Ceramic Ramen Bowl -->
      <circle cx="200" cy="200" r="130" fill="${plateColor}" stroke="${rimColor}" stroke-width="6" filter="drop-shadow(0 18px 30px ${shadowColor})"/>
      <!-- Rich Broth -->
      <circle cx="200" cy="200" r="110" fill="#c97c36"/>
      <!-- Ramen Noodles -->
      <path d="M150,180 Q190,160 230,190 T180,240 T150,200" fill="none" stroke="#f6d376" stroke-width="8" stroke-linecap="round"/>
      <!-- Chashu Pork -->
      <circle cx="160" cy="170" r="32" fill="#7a3224" stroke="#4a1c13" stroke-width="3"/>
      <!-- Ajitsuke Soft Egg -->
      <ellipse cx="235" cy="170" rx="26" ry="32" fill="#ffffff" stroke="#c88b4b" stroke-width="4"/>
      <circle cx="235" cy="170" r="16" fill="#f7941d"/>
      <!-- Nori Seaweed -->
      <rect x="230" y="115" width="45" height="55" rx="4" fill="#1b2e23" transform="rotate(25 230 115)"/>
      <!-- Scallions & Black Garlic Drizzle -->
      <path d="M185,210 Q210,225 195,250" stroke="#1a120b" stroke-width="5" fill="none"/>
      <circle cx="180" cy="220" r="4" fill="#43a047"/>
      <circle cx="210" cy="215" r="4" fill="#43a047"/>
      <circle cx="195" cy="195" r="3.5" fill="#43a047"/>
    `;
  } else if (dishType.includes('dessert') || dishType.includes('pancake') || dishType.includes('tiramisu') || dishType.includes('tart')) {
    dishSvgContent = `
      <!-- Dessert Plate -->
      <circle cx="200" cy="200" r="130" fill="${plateColor}" stroke="${rimColor}" stroke-width="3" filter="drop-shadow(0 15px 25px ${shadowColor})"/>
      <!-- Fluffy Cake / Tart -->
      <ellipse cx="200" cy="210" rx="65" ry="40" fill="#e0a96d" stroke="#b07a43" stroke-width="2"/>
      <ellipse cx="200" cy="180" rx="65" ry="35" fill="#f5caa0" stroke="#b07a43" stroke-width="2"/>
      <!-- Mascarpone / Cream dollop -->
      <path d="M170,170 C175,140 225,140 230,170 C220,185 180,185 170,170 Z" fill="#fffdfa" stroke="#ecdcc9" stroke-width="2"/>
      <!-- Cocoa Powder / Berry -->
      <circle cx="200" cy="150" r="12" fill="#c2185b"/>
      <circle cx="215" cy="158" r="8" fill="#ad1457"/>
      <!-- Mint leaf -->
      <path d="M205,140 Q225,125 220,142 Z" fill="#2e7d32"/>
      <!-- Drizzled Coulis / Sauce -->
      <path d="M130,230 Q170,255 240,240 T270,210" fill="none" stroke="#880e4f" stroke-width="4" stroke-linecap="round"/>
    `;
  } else {
    dishSvgContent = `
      <!-- Gourmet Platter -->
      <circle cx="200" cy="200" r="130" fill="${plateColor}" stroke="${rimColor}" stroke-width="4" filter="drop-shadow(0 15px 25px ${shadowColor})"/>
      <!-- Artisanal Dish Core -->
      <ellipse cx="200" cy="200" rx="75" ry="60" fill="#d97736" stroke="#9e4712" stroke-width="3"/>
      <path d="M150,180 Q200,160 250,190 T200,240 Z" fill="#e89855"/>
      <!-- Garnish and Details -->
      <circle cx="185" cy="185" r="7" fill="#43a047"/>
      <circle cx="215" cy="205" r="6" fill="#e53935"/>
      <circle cx="195" cy="220" r="4" fill="#ffffff"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">
    <defs>
      <radialGradient id="backdropGrad" cx="50%" cy="50%" r="50%">
        ${
          style === 'rustic'
            ? '<stop offset="0%" stop-color="#2d221c"/><stop offset="60%" stop-color="#16110e"/><stop offset="100%" stop-color="#090706"/>'
            : style === 'bright'
            ? '<stop offset="0%" stop-color="#ffffff"/><stop offset="70%" stop-color="#f5efe6"/><stop offset="100%" stop-color="#e3d6c7"/>'
            : '<stop offset="0%" stop-color="#fff8f0"/><stop offset="65%" stop-color="#faeee0"/><stop offset="100%" stop-color="#edd8c2"/>'
        }
      </radialGradient>
      <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="6" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>
    <!-- Background Texture -->
    <rect width="400" height="400" fill="url(#backdropGrad)"/>
    ${dishSvgContent}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const PRESET_MENUS: { id: string; name: string; cuisine: string; description: string; menu: MenuData; rawText: string }[] = [
  {
    id: 'rustic-italian',
    name: "L'Osteria di Pietra",
    cuisine: 'Authentic Tuscan Trattoria',
    description: 'Rustic handmade pasta, prime grilled Fiorentina, wood-fired burrata, and classic tiramisu in a moody, historic cellar setting.',
    rawText: `L'Osteria di Pietra - Menù Tradizionale

Antipasti:
- Bruschetta al Burrata & Fichi ($18): Grilled sourdough, creamy Pugliese burrata, caramelized black mission figs, aged Modena balsamic glaze, fresh thyme.
- Carpaccio di Manzo Stagionato ($22): Paper-thin dry-aged beef tenderloin, shaved Parmigiano-Reggiano 36 mesi, wild arugula, cold-pressed olive oil, caper berries.

Primi Piatti:
- Tagliatelle al Tartufo & Porcini ($34): Hand-cut egg tagliatelle, foraged autumn porcini mushrooms, black Norcia truffle shavings, browned butter, aged pecorino.
- Ravioli di Zucca con Salvia ($28): Butternut squash ravioli with crushed amaretti crumble, crispy sage leaves, hazelnut brown butter reduction.

Secondi Piatti:
- Bistecca alla Fiorentina ($68): 28-day dry-aged Florentine T-bone steak grilled over Tuscan oak embers, rosemary sea salt crystals, charred lemon half.
- Polpo Grigliato su Crema di Ceci ($36): Char-grilled octopus tentacle, velvety rosemary chickpea purée, smoked paprika emulsion, pickled red onion.

Dolci:
- Tiramisù Tradizionale al Mascarpone ($14): Espresso & amaretto dipped savoiardi biscuits, rich zabaglione mascarpone mousse, Valrhona cocoa dusting.`,
    menu: {
      restaurantName: "L'Osteria di Pietra",
      cuisineType: 'Authentic Tuscan Trattoria',
      dishes: [
        {
          id: 'osteria-1',
          name: 'Tagliatelle al Tartufo & Porcini',
          category: 'Primi Piatti',
          description: 'Hand-cut egg tagliatelle tossed in browned Alpine butter, wild foraged porcini mushrooms, generous black Norcia truffle shavings, and aged Pecorino.',
          ingredients: ['Handmade tagliatelle', 'Wild porcini mushrooms', 'Black Norcia truffle', 'Browned butter', 'Pecorino Romano'],
          price: '$34',
          suggestedStyle: 'rustic',
          photographyNotes: 'Moody chiaroscuro lighting on dark rustic slate, steam wafting off pasta, freshly microplaned truffle flakes caught in side-rim light.',
          status: 'idle',
        },
        {
          id: 'osteria-2',
          name: 'Bistecca alla Fiorentina',
          category: 'Secondi Piatti',
          description: 'Prime 28-day dry-aged T-bone steak grilled over aromatic oak embers, seasoned with coarse sea salt crystals and fresh rosemary sprig.',
          ingredients: ['Dry-aged Chianina beef', 'Tuscan rosemary', 'Maldon sea salt', 'Extra virgin olive oil', 'Charred lemon'],
          price: '$68',
          suggestedStyle: 'rustic',
          photographyNotes: 'Cast iron skillet or dark wood board, sizzling grill marks, glistening herb oil, coarse sea salt flakes, dramatic low-key tungsten warmth.',
          status: 'idle',
        },
        {
          id: 'osteria-3',
          name: 'Bruschetta al Burrata & Fichi',
          category: 'Antipasti',
          description: 'Charred artisan sourdough crowned with silky Pugliese burrata cheese, caramelized mission figs, and 25-year aged balsamic drizzle.',
          ingredients: ['Artisan sourdough', 'Pugliese burrata', 'Black mission figs', 'Traditional balsamic of Modena', 'Micro-thyme'],
          price: '$18',
          suggestedStyle: 'rustic',
          photographyNotes: 'Tilted 45-degree angle, creamy burrata split open revealing velvety stracciatella, glistening balsamic reduction drips.',
          status: 'idle',
        },
        {
          id: 'osteria-4',
          name: 'Tiramisù Tradizionale al Mascarpone',
          category: 'Dolci',
          description: 'Espresso and amaretto soaked ladyfingers layered with airy mascarpone cream and finished with dark Valrhona cocoa powder.',
          ingredients: ['Savoiardi ladyfingers', 'Espresso roast', 'Disaronno amaretto', 'Mascarpone cheese', 'Valrhona cocoa powder'],
          price: '$14',
          suggestedStyle: 'rustic',
          photographyNotes: 'Vintage ceramic plate, crisp dusting of dark cocoa on white cream, dark roasted espresso beans alongside.',
          status: 'idle',
        },
      ],
    },
  },
  {
    id: 'bright-bistro',
    name: 'Maison Solstice Bistro',
    cuisine: 'Modern California French Bistro',
    description: 'Vibrant farm-to-table cuisine bathed in natural morning light, featuring pristine seafood crudo, heirloom produce, and artisan tarts.',
    rawText: `Maison Solstice Bistro - Seasonal All-Day Menu

Starters:
- Citrus-Cured Wild Salmon Crudo ($24): King salmon ribbons, Cara Cara orange & grapefruit supremes, pickled mustard seeds, dill oil, edible borage blossoms.
- Roasted Heirloom Beet & Chèvre Tart ($19): Candy-striped beets, lemon-whipped artisan goat cheese, thyme puff pastry, toasted pistachios, wildflower honey.

Mains:
- Pan-Seared Dayboat Scallops ($38): Jumbo Georges Bank scallops, sweet summer corn velouté, crispy pancetta lardons, baby watercress.
- Duck Breast à l'Orange & Fennel ($42): Crispy skin Rohan duck breast, spiced blood orange glaze, caramelized baby fennel, parsnip silk.

Dessert:
- Yuzu & Meyer Lemon Tartlet ($16): Crisp almond sablé crust, silky yuzu curd, charred Italian meringue torched peaks, candied Meyer lemon wheel.`,
    menu: {
      restaurantName: 'Maison Solstice Bistro',
      cuisineType: 'Modern California French Bistro',
      dishes: [
        {
          id: 'solstice-1',
          name: 'Citrus-Cured Wild Salmon Crudo',
          category: 'Starters',
          description: 'King salmon ribbons with Cara Cara orange supremes, pickled mustard seeds, vibrant dill herb oil, and edible violet blossoms.',
          ingredients: ['King salmon', 'Blood orange', 'Dill oil', 'Pickled mustard seeds', 'Edible flowers'],
          price: '$24',
          suggestedStyle: 'bright',
          photographyNotes: 'Sunlit Carrara marble surface, crisp morning daylight with soft organic shadows, delicate translucency in the salmon ribbons.',
          status: 'idle',
        },
        {
          id: 'solstice-2',
          name: 'Pan-Seared Dayboat Scallops',
          category: 'Mains',
          description: 'Golden caramelized jumbo sea scallops resting on sweet corn velouté with crispy pancetta lardons and tender micro watercress.',
          ingredients: ['Dayboat sea scallops', 'Sweet corn purée', 'Pancetta', 'Micro watercress', 'Brown butter'],
          price: '$38',
          suggestedStyle: 'bright',
          photographyNotes: 'Minimalist off-white ceramic dish, golden-brown scallop crust contrasting with vibrant yellow sweet corn purée.',
          status: 'idle',
        },
        {
          id: 'solstice-3',
          name: 'Heirloom Beet & Chèvre Tart',
          category: 'Starters',
          description: 'Thinly sliced candy-striped and golden beets atop lemon-whipped goat cheese, buttery puff pastry, and crushed pistachios.',
          ingredients: ['Heirloom beets', 'Goat chèvre', 'Puff pastry', 'Pistachios', 'Wildflower honey'],
          price: '$19',
          suggestedStyle: 'bright',
          photographyNotes: 'Top 60-degree hero angle, vibrant ruby and amber beet concentric rings, dusting of bright green crushed pistachios.',
          status: 'idle',
        },
        {
          id: 'solstice-4',
          name: 'Yuzu & Meyer Lemon Tartlet',
          category: 'Dessert',
          description: 'Flaky almond sablé pastry filled with tart yuzu citrus curd, crowned with delicate torched peaks of Italian meringue.',
          ingredients: ['Almond shortcrust', 'Yuzu citrus', 'Meyer lemon curd', 'Torched Italian meringue', 'Candied peel'],
          price: '$16',
          suggestedStyle: 'bright',
          photographyNotes: 'Crisp high-key lighting, delicate golden toast on meringue peaks, light linen napkin in soft background.',
          status: 'idle',
        },
      ],
    },
  },
  {
    id: 'social-izakaya',
    name: 'Neo-Tokyo Craft Ramen & Bar',
    cuisine: 'Contemporary Japanese Izakaya & Ramen',
    description: 'Instagrammable flat-lay compositions with rich ramen broths, torched pork belly, lace-skirted gyoza, and fluffy souffle pancakes.',
    rawText: `Neo-Tokyo Craft Ramen & Izakaya

Signature Bowls:
- Rich Tonkotsu Black Garlic Ramen ($19.50): 18-hour simmered pork bone broth, thin handmade ramen noodles, slow-braised torched chashu belly, jammy ajitsuke tamago egg, black garlic mayu oil, wood ear mushrooms, scallions.
- Spicy Miso Truffle Ramen ($21): Red fermented miso broth, wavy noodles, spicy minced pork tantan, chili threads, shaved white truffle oil, pak choi.

Izakaya Small Plates:
- Crispy Wagyu Lace Gyoza ($16): Pan-fried dumplings with delicate golden lace skirt, spicy rayu chili oil, scallion ponzu dipping sauce.
- Torched Salmon Aburi Nigiri ($17): Seared salmon over sushi rice, spicy mentaiko mayo, sweet unagi glaze, black tobiko.

Sweet Finale:
- Fluffy Soufflé Pancake Stack ($16): Triple-stacked jiggly Japanese soufflé pancakes, Hokkaido strawberry cream, pure maple drizzle, powdered sugar dust.`,
    menu: {
      restaurantName: 'Neo-Tokyo Craft Ramen & Bar',
      cuisineType: 'Contemporary Japanese Izakaya & Ramen',
      dishes: [
        {
          id: 'tokyo-1',
          name: 'Rich Tonkotsu Black Garlic Ramen',
          category: 'Signature Bowls',
          description: 'Rich 18-hour pork bone broth with artisanal noodles, flame-seared chashu belly, golden jammy soft-boiled egg, and aromatic black garlic drizzle.',
          ingredients: ['Tonkotsu broth', 'Chashu pork belly', 'Ajitsuke egg', 'Black garlic oil', 'Menma bamboo', 'Scallions'],
          price: '$19.50',
          suggestedStyle: 'social',
          photographyNotes: '90-degree overhead flat-lay, chopsticks resting across black textured bowl, ceramic spoon with broth and ramen, side dish of rayu chili oil.',
          status: 'idle',
        },
        {
          id: 'tokyo-2',
          name: 'Crispy Wagyu Lace Gyoza',
          category: 'Izakaya Small Plates',
          description: 'Five pan-fried dumplings unified by a delicate, gossamer golden crispy lace lattice skirt, served with rayu ponzu sauce.',
          ingredients: ['Wagyu beef filling', 'Dumpling wrapper', 'Crispy lace skirt', 'Chili rayu oil', 'Scallion ponzu'],
          price: '$16',
          suggestedStyle: 'social',
          photographyNotes: 'Flat-lay social composition, stunning spiderweb golden skirt, shallow saucer of crimson chili oil, bamboo chopsticks.',
          status: 'idle',
        },
        {
          id: 'tokyo-3',
          name: 'Torched Salmon Aburi Nigiri',
          category: 'Izakaya Small Plates',
          description: 'Glazed Atlantic salmon seared with open flame over seasoned sushi rice, topped with mentaiko aioli and popping black tobiko pearls.',
          ingredients: ['Atlantic salmon', 'Sushi rice', 'Mentaiko aioli', 'Unagi tare', 'Black tobiko'],
          price: '$17',
          suggestedStyle: 'social',
          photographyNotes: 'Long minimalist ceramic sushi platter, flame-kissed sear marks, pickled ginger rosette and fresh wasabi mound on side.',
          status: 'idle',
        },
        {
          id: 'tokyo-4',
          name: 'Fluffy Soufflé Pancake Stack',
          category: 'Sweet Finale',
          description: 'Sky-high triple stack of jiggly Japanese soufflé pancakes crowned with fresh Hokkaido cream, ripe strawberries, and maple syrup cascade.',
          ingredients: ['Souffle pancake batter', 'Hokkaido milk cream', 'Fresh strawberries', 'Pure maple syrup', 'Powdered sugar'],
          price: '$16',
          suggestedStyle: 'social',
          photographyNotes: 'Vibrant Instagram top-down aesthetic, maple syrup pouring moment or golden pool, scattered berry halves, gold fork beside plate.',
          status: 'idle',
        },
      ],
    },
  },
];

export function getSampleSvgForDish(dishName: string, style: 'rustic' | 'bright' | 'social'): string {
  const lower = dishName.toLowerCase();
  return createFoodSvgDataUrl(lower, style);
}
