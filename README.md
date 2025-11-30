# FlowbitAI (Frontend Task)

A React-based single-page application (SPA) for visualizing satellite imagery and defining Areas of Interest (AOI). This project was engineered to match the provided Figma "Wizard" workflow, featuring a custom-built drawing interface and seamless WMS integration.
[Figma](https://www.figma.com/proto/mtvRfVu94PTKLaOkbPmqOX/UI-Design---AOI-Creation?node-id=1-168&t=vH9qNnjR9K50tHSU-1&scaling=min-zoom&content-scaling=fixed&page-id=0%3A1&starting-point-node-id=1%3A419)

[Demo Video](https://drive.google.com/file/d/1DrJSofsV7CErB_uFVz6UQMPVfQBJ_FeV/view?usp=drivesdk)

##  Tech Stack

* **Core:** React, TypeScript, Vite
* **Styling:** Tailwind CSS (Custom color config for Figma compliance)
* **Mapping:** Leaflet, React-Leaflet
* **Drawing:** Leaflet-Draw (with custom "Headless" UI wrapper)
* **Testing:** Playwright
* **Icons:** Lucide-React

---

##  Quick Start

### Prerequisites
* Node.js (v18+ recommended)
* npm

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Start the development server
npm run dev
```
The application will be available at http://localhost:5173.

## Running Tests

This project uses Playwright for End-to-End (E2E) testing to ensure the map and UI interactions work as expected.
```
# Install Playwright browsers (first time only)
npx playwright install

# Run the test suite
npx playwright test
```

## Architecture & Documentation
### 1. Map Library Choice
Selection: Leaflet (via react-leaflet)

Why? The primary requirement was to render a specific WMS Raster Layer (NRW Aerial Imagery). Leaflet is the industry standard for 2D raster manipulation. It is lightweight, mature, and handles WMS overlays natively with zero friction.
Alternatives Considered:
MapLibre GL: While powerful for Vector Tiles and WebGL rendering, setting up simple raster WMS layers is often more verbose. Since the task didn't require heavy 3D visualizations, MapLibre would have been over-engineering.
OpenLayers: Extremely robust but has a much larger bundle size and a steeper learning curve. Leaflet provided the best balance of performance and development speed.

### 2. Architecture Decisions
I implemented a "Lifted State" architecture to manage the transition between the "Search View" and the "Project Scope View".
App.tsx (Orchestrator): Manages the "Single Source of Truth" (Search coordinates, list of drawn Areas, and View Mode). It passes down handlers to children, ensuring the Sidebar and Map remain synchronized.
Sidebar.tsx (Presentation): A pure UI component that handles the complex conditional rendering of the Figma sidebar (Search input vs. Accordion Tree).
CustomDrawControl.tsx (UX Pattern): To achieve the specific "White Pill" design from Figma, I built a custom React component that programmatically triggers the underlying Leaflet Draw methods. This separates the logic (Leaflet) from the visuals (Tailwind), allowing for a pixel-perfect UI without fighting the library's default styles.

### 3. Performance Considerations
How does the implementation handle the requirement of 1000s of points/polygons?
Currently, Leaflet renders vector layers as SVG DOM nodes. This is performant for hundreds of items but can lag with thousands.
Future Optimization Strategy:
Canvas Renderer: I would switch the map renderer to L.canvas(). This draws all shapes on a single HTML5 <canvas> element rather than creating 1000s of DOM nodes, drastically improving FPS during panning/zooming.
Clustering: For point data, I would implement react-leaflet-markercluster to aggregate data at low zoom levels.
Vector Tiles / WebGL: If the requirement grows to rendering 100,000+ dynamic points, I would migrate the map component to Deck.gl or MapLibre GL to utilize GPU acceleration.

### 4. Testing Strategy
Tool: Playwright
Why? Mapping applications are deeply visual and interactive. Unit testing a canvas wrapper often provides false confidence. I focused on Value-Based Testing using E2E scenarios to ensure the actual user deliverables work.
What was tested:
Smoke Test: Verifies the Map and Sidebar mount correctly (no crash on load).
UI Interaction: Validated the Search Input accepts text and the Sidebar state switches correctly.
Custom UI Validation: Since I implemented a custom "Headless" drawing bar, I added specific tests to ensure these custom buttons are interactable, as default Leaflet tests wouldn't catch if my custom CSS hid the controls.
With more time: I would implement Visual Regression Testing to ensure the custom styling of the sidebar and map controls remains pixel-perfect across updates.

### 5. Tradeoffs Made
Custom Controls vs. Native: To match the Figma design exactly, I hid the default Leaflet controls via CSS and built a custom React interface. This relies on the internal class names of leaflet-draw, which is a slight stability risk if the library updates significantly.
Persistence: State is currently persisted to LocalStorage. In a real-world scenario, this would be replaced by a backend API call to a geospatial database (like PostGIS).

### 6. Production Readiness
To make this application production-ready, I would add:
Environment Variables: Securely manage API keys and WMS URLs using .env files.
Error Boundaries: Wrap the Map component to handle WebGL context losses or tile loading failures gracefully.
CI/CD Pipeline: Automate the Playwright test suite to run on every Pull Request.
Accessibility (A11y): Ensure all custom map controls have proper aria-labels and keyboard navigation support.

## Data Schema & API
Client-Side Data Schema (AOI)
JSON
```

{
  "type": "Feature",
  "properties": {},
  "geometry": {
    "type": "Polygon",
    "coordinates": [
      [
        [6.95, 50.93],
        [6.96, 50.94],
        [6.97, 50.93],
        [6.95, 50.93]
      ]
    ]
  }

}
```
<img width="1470" height="833" alt="Screenshot 2025-11-30 at 7 46 47 PM" src="https://github.com/user-attachments/assets/045e6755-a7c5-4d00-983f-1325800f2d14" />

## External Services
### Nominatim Geocoding API: Used for converting city names into coordinates.
### Endpoint: https://nominatim.openstreetmap.org/search
### NRW WMS Service: Used for fetching aerial satellite imagery.
### Endpoint: https://www.wms.nrw.de/geobasis/wms_nw_dop
### Layer: nw_dop_rgb

