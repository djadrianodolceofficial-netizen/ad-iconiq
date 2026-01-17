# AD ICONIQ Mobile App - Design Style Guide

## Design Philosophy

### Visual Language
**Premium Minimalism with Athletic Edge** - The design embodies sophisticated luxury through clean lines, strategic use of negative space, and premium materials aesthetic. Every element serves a purpose while maintaining visual elegance that appeals to discerning customers seeking high-end sportswear.

### Color Palette
- **Primary**: Deep Charcoal (#1a1a1a) - Sophisticated, premium base
- **Secondary**: Pure White (#ffffff) - Clean, modern contrast
- **Accent**: Soft Silver (#c0c0c0) - Subtle metallic luxury touch
- **Highlight**: Warm Gray (#f5f5f5) - Gentle section dividers

*Rationale*: Monochromatic palette with surgical precision, avoiding trendy colors for timeless appeal. Maximum contrast ensures accessibility while maintaining luxury aesthetic.

### Typography
- **Display Font**: "Playfair Display" - Elegant serif for headings, conveying luxury and sophistication
- **Body Font**: "Inter" - Clean, modern sans-serif for optimal mobile readability
- **Accent Font**: "Montserrat" - Geometric sans-serif for buttons and labels

*Hierarchy*: Large, bold headings (32px+) with generous letter spacing, compact body text (14-16px) for mobile optimization.

## Visual Effects & Styling

### Used Libraries & Effects
1. **Anime.js** - Smooth micro-interactions for product cards and buttons
2. **Splide** - Elegant product carousel with momentum scrolling
3. **ECharts.js** - Clean data visualization for order tracking
4. **PIXI.js** - Subtle particle effects for hero background
5. **p5.js** - Dynamic background patterns and visual elements

### Animation Strategy
- **Entrance Animations**: Subtle fade-in with 16px upward motion
- **Micro-interactions**: Scale transforms (1.02x) on touch for feedback
- **Page Transitions**: Smooth slide transitions between sections
- **Loading States**: Elegant skeleton screens with shimmer effects

### Header Effect
**Liquid Gradient Flow** - Subtle animated gradient using PIXI.js creating gentle, flowing movement that suggests premium fabric flow and athletic movement. Colors transition between charcoal and silver tones, maintaining brand consistency while adding dynamic visual interest.

### Layout Principles
- **Grid System**: 4-column mobile grid with 16px gutters
- **Vertical Rhythm**: 24px baseline grid for consistent spacing
- **Touch Targets**: Minimum 44px for all interactive elements
- **Content Hierarchy**: Clear visual hierarchy with generous white space

### Image Treatment
- **Hero Images**: Full-width, vertical orientation, no color overlays
- **Product Images**: Clean white backgrounds with subtle shadows
- **Lifestyle Images**: Maintain natural colors, avoid heavy filters
- **Aspect Ratios**: 4:5 for product cards, 16:9 for banners, 3:4 for heroes

### Interactive Elements
- **Buttons**: Rounded corners (8px), subtle shadows, scale feedback
- **Cards**: Clean borders, hover lift effects, smooth transitions
- **Navigation**: Bottom-fixed with backdrop blur effect
- **Forms**: Minimal styling with focus states and validation feedback

## Mobile-First Considerations
- **Performance**: Optimized images with lazy loading
- **Touch Gestures**: Swipe navigation for product galleries
- **Thumb Navigation**: Bottom navigation within comfortable reach
- **Loading Performance**: Progressive image loading and skeleton screens
- **Accessibility**: High contrast ratios and touch-friendly sizing