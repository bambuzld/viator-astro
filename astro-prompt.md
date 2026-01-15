# Astro.js Rent-a-Car Application - Development Prompt

Create a modern, high-performance rent-a-car web application using **Astro.js** with React integration and shadcn/ui components. This application is for a Croatian car rental company called "LastMinute".

## Tech Stack Requirements

- **Framework**: Astro.js (latest version)
- **UI Components**: shadcn/ui (React components in Astro)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Form Handling**: React Hook Form with Zod validation
- **Date Picker**: React Day Picker
- **Internationalization**: Support for Croatian (Hrvatski), English, French, and German

## Design System & Theme

### Color Palette
```css
/* Primary Colors */
--primary: 220 90% 56%;        /* Vibrant Blue #2563eb */
--primary-foreground: 0 0% 100%;

/* Secondary Colors */
--secondary: 220 14% 96%;      /* Light Gray */
--secondary-foreground: 220 9% 46%;

/* Accent Colors */
--accent: 220 90% 56%;         /* Same as primary for cohesion */
--accent-foreground: 0 0% 100%;

/* Neutral Colors */
--background: 0 0% 100%;       /* White */
--foreground: 222 47% 11%;     /* Dark Blue-Gray */
--muted: 220 14% 96%;
--muted-foreground: 220 9% 46%;

/* Border & Input */
--border: 220 13% 91%;
--input: 220 13% 91%;
--ring: 220 90% 56%;

/* Destructive */
--destructive: 0 84% 60%;
--destructive-foreground: 0 0% 100%;

/* Card */
--card: 0 0% 100%;
--card-foreground: 222 47% 11%;

/* Radius */
--radius: 0.5rem;
```

### Typography
- **Font Family**: Inter or system fonts
- **Headings**: Bold, large sizes with tight letter spacing
- **Body**: Regular weight, comfortable reading size

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── ui/              # shadcn/ui components
│   │   ├── react/           # Interactive React components
│   │   │   ├── BookingForm.tsx
│   │   │   ├── LanguageSelector.tsx
│   │   │   ├── DateTimePicker.tsx
│   │   │   ├── LocationSelector.tsx
│   │   │   └── ImageCarousel.tsx
│   │   ├── Header.astro
│   │   ├── Hero.astro
│   │   ├── FeatureCards.astro
│   │   ├── SpecialOffers.astro
│   │   ├── RentalStations.astro
│   │   └── Footer.astro
│   ├── layouts/
│   │   └── Layout.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── fleet.astro
│   │   ├── special-offers.astro
│   │   ├── offices.astro
│   │   └── customer-support.astro
│   ├── lib/
│   │   ├── utils.ts
│   │   └── i18n.ts
│   └── styles/
│       └── global.css
├── public/
│   └── images/
└── astro.config.mjs
```

## Required Features & Components

### 1. Header/Navigation
- Logo: "LastMinute" branding
- Navigation links: Fleet, Special Offers, Offices, Customer Support, Login
- Language selector (modal) with flags: Hrvatski, English, French, Deutsche
- "Manage booking" button (primary action)
- Floating notification bar (dismissible): "Hey, this is floating notification! You can turn it on and off."

### 2. Hero Section
- **Background**: Black/dark gradient
- **Heading**: "Your No1 rent a car in Croatia title" (large, white, centered)
- **Booking Form** (white card overlay):
  - Pick-up & drop-off location (with search/autocomplete)
  - Checkbox: "Different return location"
  - Pick-up date & time (date picker + time dropdown)
  - Return date & time (date picker + time dropdown)
  - "Show" button (primary CTA)
  
**React Component Note**: Use `client:load` for the booking form as it's above the fold and needs immediate interactivity.

### 3. Feature Section: "Simple and fast service"
- Centered heading
- Descriptive paragraph about the service
- Three feature cards in a row:
  1. **A wide range of vehicles**
     - Icon/image placeholder
     - Description: "Small city vehicles, Compact, SUV, Limousine, MPV..."
     - Link: "Vehicle fleet"
  2. **Additional services**
     - Icon/image placeholder
     - Description: "Insurance, child seats, GPS, WiFi, roadside..."
     - Link: "More informations"
  3. **Branches in 6 airports**
     - Icon/image placeholder
     - Description: "Split, Rijeka, Zadar, Zagreb, Pula i Dubrovnik"
     - Link: "All offices"

**Static Component**: Render as static HTML (no client directive needed)

### 4. Special Offers Section
- Heading: "Special offers"
- Subtitle text about finding offers + "Contact us" link
- Offer cards (2 visible, carousel for more):
  - Image of happy travelers in a car
  - Offer title: "Black friday -20% discount!" / "Enjoy a first-class experience..."
  - Call-to-action

**React Component Note**: Use `client:visible` for the carousel to lazy-load JavaScript

### 5. Rental Stations Map
- Heading: "Rental stations"
- Description about branches across Croatia
- Interactive map of Croatia showing locations (use a map library or SVG)
- City name pills: Split, Zadar, Rijeka, Zagreb, Zadar, Dubrovnik, Pula

**React Component Note**: Use `client:visible` for the interactive map

### 6. Why Rent Section (Dark background)
- Heading: "Why rent with Last Minute?"
- Two columns of benefits with checkmarks:
  - Left: "Free cancellation when you pay on arrival", "Car rental made quick and easy", "Premium fleet of genuine cars"
  - Right: "Friendly 24/7 customer service", "New cars - an average 1 year old"

### 7. Footer
- Company information
- Links to important pages
- Social media icons
- Copyright notice

## shadcn/ui Components to Install

```bash
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add select
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add popover
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add checkbox
npx shadcn-ui@latest add badge
npx shadcn-ui@latest add separator
```

## Implementation Guidelines

### Astro Islands Strategy
1. **Static HTML (no JS)**:
   - Header navigation links
   - Feature cards section
   - Why rent section
   - Footer
   - Text content and headings

2. **client:load** (immediate hydration):
   - Booking form (above the fold, critical UX)
   - Language selector modal

3. **client:visible** (lazy hydration):
   - Special offers carousel
   - Interactive map
   - Image galleries

### TypeScript Types
```typescript
interface Location {
  id: string;
  name: string;
  city: string;
  airport?: boolean;
}

interface Booking {
  pickupLocation: string;
  dropoffLocation?: string;
  pickupDate: Date;
  pickupTime: string;
  returnDate: Date;
  returnTime: string;
}

interface Language {
  code: string;
  name: string;
  flag: string;
}
```

### Internationalization
- Create translation files for each language
- Use Astro's built-in i18n support or a lightweight library
- Default language: Croatian (Hrvatski)
- Store language preference in localStorage

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Hamburger menu on mobile
- Stack booking form fields vertically on mobile
- Single column for feature cards on mobile

### Performance Optimizations
- Use Astro's image optimization for all images
- Lazy load images below the fold
- Minimize JavaScript bundle by using Astro components where possible
- Use React only for interactive components
- Consider using Preact instead of React for smaller bundle size

### API Integration (for future)
- Prepare structure to connect to Symfony/API Platform backend
- Create API utility functions in `/src/lib/api.ts`
- Use `fetch` for API calls
- Handle loading states and errors gracefully

## Sample Code Snippets

### BookingForm.tsx (React Component)
```typescript
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

export function BookingForm() {
  // Implement booking form logic
  // Include date pickers, location selectors, time dropdowns
  // Form validation with Zod
}
```

### Hero.astro
```astro
---
import BookingForm from '@/components/react/BookingForm';
---

<section class="relative bg-gradient-to-b from-gray-900 to-black py-20">
  <div class="container mx-auto px-4">
    <h1 class="text-5xl md:text-6xl font-bold text-white text-center mb-12">
      Your No1 rent a car<br />in Croatia title
    </h1>
    
    <div class="max-w-4xl mx-auto">
      <BookingForm client:load />
    </div>
  </div>
</section>
```

## Additional Requirements

1. **Accessibility**: 
   - ARIA labels for all interactive elements
   - Keyboard navigation support
   - Proper heading hierarchy
   - Alt text for all images

2. **SEO**:
   - Meta tags for each page
   - Open Graph tags
   - Structured data (Schema.org) for rental car business
   - Sitemap generation

3. **Form Validation**:
   - Real-time validation
   - Clear error messages in the selected language
   - Prevent invalid date selections (return before pickup)

4. **Testing Considerations**:
   - Ensure all forms work without JavaScript (progressive enhancement where possible)
   - Test on multiple browsers and devices
   - Validate responsive design

## Deliverables

1. Fully functional Astro.js application
2. All pages implemented with routing
3. Responsive design working on all screen sizes
4. Language switching functional
5. Booking form with validation
6. Clean, commented code
7. README with setup instructions
8. Environment variables documented

## Getting Started Commands

```bash
# Create new Astro project
npm create astro@latest

# Add React integration
npx astro add react

# Add Tailwind CSS
npx astro add tailwind

# Install shadcn/ui
npx shadcn-ui@latest init

# Install additional dependencies
npm install react-hook-form zod @hookform/resolvers lucide-react date-fns
```

---

**Note**: Focus on performance and SEO as primary goals. Use React strategically only where interactivity is required. The majority of the landing page should be static HTML for optimal load times and search engine crawling.
