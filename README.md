# Satellite Intelligence Interface (Frontend Task)

A high-fidelity, React-based single-page application (SPA) for visualizing satellite imagery and defining Areas of Interest (AOI). This project was engineered to pixel-perfectly match the provided Figma "Wizard" workflow, featuring a custom-built drawing interface and seamless WMS integration.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm or yarn

### Installation
```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
The application will be available at http://localhost:5173.

Running Tests
This project uses Playwright for End-to-End (E2E) testing to ensure the map and UI interactions work as expected.

Bash

# Install Playwright browsers (first time only)
npx playwright install

# Run the test suite
npx playwright test
🛠 Tech Stack
Core: React, TypeScript, Vite

Styling: Tailwind CSS (Custom color config for Figma compliance)

Mapping: Leaflet, React-Leaflet

Drawing: Leaflet-Draw (with custom "Headless" UI wrapper)

Testing: Playwright

Icons: Lucide-React

📖 Architecture & Design Decisions
1. Map Library Choice: Why Leaflet?
Selection: Leaflet (via react-leaflet) Reasoning: The primary requirement was to render a specific WMS Raster Layer (NRW Aerial Imagery). Leaflet is the industry standard for 2D raster manipulation. It is lightweight, mature, and handles WMS overlays natively with zero friction.

Alternatives Considered:

MapLibre GL: While powerful for Vector Tiles and WebGL rendering, setting up simple raster WMS layers is often more verbose. Since the task didn't require heavy 3D visualizations, MapLibre would have been over-engineering.

OpenLayers: Extremely robust but has a much larger bundle size and steeper learning curve. Leaflet provided the best balance of performance and development speed.

2. Architecture: The "Wizard" Flow
I implemented a "Lifted State" architecture to manage the transition between the "Search View" and the "Project Scope View".

App.tsx (Orchestrator): Manages the "Single Source of Truth" (Search coordinates, list of drawn Areas, and View Mode). It passes down handlers to children, ensuring the Sidebar and Map remain synchronized.

Sidebar.tsx (Presentation): A pure UI component that handles the complex conditional rendering of the Figma sidebar (Search input vs. Accordion Tree).

CustomDrawControl.tsx (UX Pattern): To achieve the specific "White Pill" design from Figma, I built a custom React component that programmatically triggers the underlying Leaflet Draw methods. This separates the logic (Leaflet) from the visuals (Tailwind), allowing for a pixel-perfect UI without fighting the library's default styles.

3. Performance Considerations (Scaling to 1000s of Polygons)
Currently, Leaflet renders vector layers as SVG DOM nodes. This is performant for hundreds of items but can lag with thousands.

Future Optimization Strategy:

Canvas Renderer: I would switch the map renderer to L.canvas(). This draws all shapes on a single HTML5 <canvas> element rather than creating 1000s of DOM nodes, drastically improving FPS during panning/zooming.

Clustering: For point data, I would implement react-leaflet-markercluster to aggregate data at low zoom levels.

Vector Tiles / WebGL: If the requirement grows to rendering 100,000+ dynamic points, I would migrate the map component to Deck.gl or MapLibre GL to utilize GPU acceleration.

4. Testing Strategy
Tool: Playwright Why? Mapping applications are deeply visual and interactive. Unit testing a canvas wrapper often provides false confidence. E2E testing ensures the actual user value is delivered. What is Tested:

Map container initialization and WMS layer loading.

UI interaction (Search input, Sidebar state switching).

Presence of custom drawing tools. With More Time: I would implement visual regression testing to ensure the custom styling of the sidebar and map controls remains consistent across updates.

5. Tradeoffs
Custom Controls: To match the Figma design exactly, I hid the default Leaflet controls via CSS and built a custom React interface. This relies on the internal class names of leaflet-draw, which is a slight stability risk if the library updates significantly.

Persistence: State is currently persisted to LocalStorage. In a real-world scenario, this would be replaced by a backend API call to a geospatial database (like PostGIS).

6. Production Readiness
To make this application production-ready, I would:

Environment Variables: Securely manage API keys and WMS URLs using .env files.

Error Boundaries: Wrap the Map component to handle WebGL context losses or tile loading failures gracefully.

CI/CD Pipeline: Automate the Playwright test suite to run on every Pull Request.

Accessibility (A11y): Ensure all custom map controls have proper aria-labels and keyboard navigation support.

⏱ Time Spent Breakdown
Setup & Config: 15 mins

Core Map & WMS Logic: 30 mins

UI Implementation (Figma Match): 2 hours (Focus on custom Sidebar & Layout)

Custom Draw Controls: 1 hour

Testing & Documentation: 45 mins

Total: ~4.5 Hours

✅ Bonus Features Implemented
Search Integration: Real-time geocoding using Nominatim API.

Persistence: AOIs are saved to LocalStorage and persist on page reload.

Custom UI: Completely custom "White Pill" drawing toolbar matching the provided design.

Advanced Layout: Implemented a semi-transparent sidebar overlaying the map using backdrop-filter.