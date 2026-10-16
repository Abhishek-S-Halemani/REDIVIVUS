# Full-Stack Gemini 3.8 Flash Vision AI Integration Plan

An architectural and UI implementation plan for robust, server-side Gemini 3.8 Flash Vision API waste photo analysis and upcycling blueprint generation in REDIVIVUS.

> [!IMPORTANT] User Confirmed Choices
> - **AI Vision Engine**: Full-stack Gemini 3.8 Flash Vision API analyzing actual material composition from camera and gallery uploads.
> - **API Key Security**: Server-side client initialization using `process.env.GEMINI_API_KEY` (configured via **Settings > Secrets**).
> - **UI Scope**: Preserve clean AI photo scanning interface without clutter or extraneous widgets.

---

### 1. Overview & Core Concept
When users upload a waste or scrap photo (via hardware webcam, mobile camera, gallery image, or sample preset), the image is transmitted to `/api/analyze-waste`. The server uses `@google/genai` with `gemini-3.8-flash` to inspect the visual details of the object and return an exact structured response containing:
1. **Detected Item Name**: e.g., "PET Plastic Soda Bottle", "Cracked Motherboard Circuit Scrap", "Selvedge Denim Jeans".
2. **Material Classification**: e.g., "Thermoplastic Polymer", "FR-4 Epoxy Glass PCB", "Cellulosic Fiber".
3. **Percentage Breakdown**: Exact % Recyclable, % Biodegradable, and % Reusable metrics.
4. **Custom Upcycling Blueprints**: 3 tailored upcycling project options with step-by-step instructions, material lists, and before/after outcome pictures.

---

### 2. User Experience & Visual Design
- **Clean Top Navigation & Profile Access**: Header features a single-line wordmark, points wallet indicator, and dedicated user profile launcher.
- **Riddance Card & Live Studio**: Uncluttered 3-metric interactive selector (Reusable, Recyclable, Biodegradable).
- **Instant Result Presentation**: Upon analyzing a photo, the AI's detected item name, material breakdown, and primary upcycling blueprint automatically pre-select and render on screen with zero dead clicks or empty stubs.
- **Fallback Resilience**: Image loading handles fallback URLs seamlessly so UI always remains visually complete.

---

### 3. Technical Architecture & Component Strategy

```
┌─────────────────────────────────────────────────────────────────┐
│                     Frontend React Client                       │
│  - RiddanceAIStudio / RiddanceCard / RiddanceCameraModal        │
│  - Captures Base64 Data URL (Camera, Gallery, or Samples)       │
└────────────────────────────────┬────────────────────────────────┘
                                 │ POST /api/analyze-waste
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                     Express Backend Proxy                       │
│  - Instantiates GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })│
│  - Model: 'gemini-3.8-flash'                                   │
│  - Enforces responseMimeType: 'application/json' + Schema       │
└────────────────────────────────┬────────────────────────────────┘
                                 │ Multimodal Image + Prompt
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Gemini 3.8 Flash Vision                      │
│  Returns structured JSON analysis with recyclability breakdown  │
└─────────────────────────────────────────────────────────────────┘
```

---

### 4. Step-by-Step Execution Strategy

1. **Backend Integration (`server.ts`)**:
   - Verify `process.env.GEMINI_API_KEY` resolution.
   - Refine multimodal payload formatting for `gemini-3.8-flash` (`contents: [{ role: 'user', parts: [imagePart, { text: promptText }] }]`).
   - Cleanly strip code fences (`/```json/gi`) prior to `JSON.parse`.

2. **Analysis Service (`src/services/wasteAnalysisService.ts`)**:
   - Ensure all base64 data URLs (`data:`) are routed to `/api/analyze-waste`.
   - Provide graceful fallback handling if offline or network connection is interrupted.

3. **Frontend UI Components (`src/components/RiddanceCard.tsx` & `src/components/RiddanceAIStudio.tsx`)**:
   - Pre-select the primary upcycling option upon receiving Vision API response.
   - Render exact AI-generated titles, before/after pictures, and step-by-step instructions.

---

### 5. Verification Checklist
- [x] Zero client-side API key exposure.
- [x] Server-side `@google/genai` initialization using `process.env.GEMINI_API_KEY`.
- [x] Tested camera snapshot, gallery upload, and sample preset analysis.
- [x] `compile_applet` and `lint_applet` compilation checks passed.
