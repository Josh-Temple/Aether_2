# Aether_2
App name: Aether.  Minimal Weather App

# Minimal Weather PWA — Implementation Checklist (for Codex)

> Rule: proceed top-to-bottom. Mark items as you finish them. If something is ambiguous, pick the simplest robust option and continue.

---

## 0) Repo scaffolding / baseline
- [ ] Initialize Next.js (App Router) + TypeScript project
- [ ] Add basic mobile-first layout shell (single-column, safe-area friendly)
- [ ] Add global typography (sans-serif; large numerals; minimal text styles)
- [ ] Add Tailwind (optional) OR plain CSS modules (choose one and stay consistent)
- [ ] Add PWA baseline:
  - [ ] `manifest.webmanifest` (name, short_name, start_url, display=standalone)
    - [ ] Basic icons placeholders (can be temporary)
      - [ ] Service worker setup (minimal; can refine later)
      - [ ] Add env handling:
        - [ ] `.env.local` template
          - [ ] `WEATHERAPI_KEY` used server-side only
          - [ ] Add README skeleton with this checklist

          ---

          ## 1) UI skeleton with MOCK DATA (NO API)
          ### 1.1 Current screen layout
          - [ ] Build `Current` screen:
            - [ ] Top: City name (tap target) + optional tiny indicator icon
              - [ ] Center: weather visual (CSS shapes) + large temperature
                - [ ] Small: 1-word condition label (accessibility)
                  - [ ] No extra labels; minimal text
                  - [ ] Implement minimal loading placeholder (skeleton in temp area)

                  ### 1.2 Theme system (6 categories) — CSS SHAPES ONLY
                  - [ ] Create normalization target categories:
                    - [ ] Clear
                      - [ ] Cloudy
                        - [ ] Rain
                          - [ ] Snow
                            - [ ] Thunder
                              - [ ] Fog
                              - [ ] Implement theme structure:
                                - [ ] `getTheme(category)` returns CSS vars / classes
                                  - [ ] Per-theme background + layered shapes
                                  - [ ] Implement Cloudy theme (must match):
                                    - [ ] Neutral light-gray base
                                      - [ ] Overlapping organic shapes
                                        - [ ] Depth via blur/opacity/layering
                                        - [ ] Implement remaining themes (simple but distinct)
                                        - [ ] Optional: subtle animation (slow drift/breathing) — keep minimal

                                        ---

                                        ## 2) Location system (STILL NO API)
                                        ### 2.1 Data model + persistence
                                        - [ ] Define types:
                                          - [ ] `SavedLocation` (id, name, query params OR lat/lon, createdAt)
                                            - [ ] `AppSettings` (tempUnit, measureSystem, timeFormat)
                                              - [ ] `CacheEntry` (locationId, timestamp, payload)
                                              - [ ] Implement local persistence:
                                                - [ ] Saved locations (max 3)
                                                  - [ ] Manual reorder (default insertion order)
                                                    - [ ] Settings persistence
                                                      - [ ] Cache persistence placeholder (structure only for now)

                                                      ### 2.2 Location switch menu (tap city name ONLY)
                                                      - [ ] Tap city name opens a switch menu (modal/bottom sheet/popover):
                                                        - [ ] “Current location” entry
                                                          - [ ] Saved locations list (<=3)
                                                            - [ ] “Add location” entry -> goes to Search screen
                                                              - [ ] Optional small entry/icon for Settings
                                                              - [ ] Current vs saved location subtle visual distinction:
                                                                - [ ] Slight background tone shift OR tiny marker without adding text

                                                                ### 2.3 Reorder UI (simple & reliable)
                                                                - [ ] Implement reorder for saved locations:
                                                                  - [ ] Choose simplest robust approach:
                                                                      - [ ] Up/Down buttons (recommended for mobile reliability) OR
                                                                          - [ ] Drag-and-drop (only if stable on mobile)
                                                                          - [ ] Persist order after reorder

                                                                          ### 2.4 Search screen (MOCK)
                                                                          - [ ] Build `Search` screen:
                                                                            - [ ] Search input
                                                                              - [ ] Results list (mock array)
                                                                                - [ ] Selecting a result adds to saved locations (if slots available)
                                                                                  - [ ] If already 3 saved:
                                                                                      - [ ] Show minimal “Limit reached”
                                                                                          - [ ] Provide replace flow (see next section)
                                                                                            - [ ] After add/replace, return to Current and switch to that location

                                                                                            ### 2.5 Replace flow (when saved locations full)
                                                                                            - [ ] Implement minimal replace UI:
                                                                                              - [ ] User selects which of the 3 to replace
                                                                                                - [ ] Replace, persist, return to Current

                                                                                                ---

                                                                                                ## 3) Details drawer + SWIPE gesture (MOCK METRICS)
                                                                                                ### 3.1 Drawer UI
                                                                                                - [ ] Implement right-side drawer that slides in from the right:
                                                                                                  - [ ] Drawer open state
                                                                                                    - [ ] Tap outside to close
                                                                                                      - [ ] Optional close affordance (icon) kept subtle

                                                                                                      ### 3.2 Swipe gestures (dedicated; no conflicts)
                                                                                                      - [ ] Implement swipe LEFT on Current screen -> opens drawer
                                                                                                      - [ ] Implement swipe RIGHT on drawer -> closes drawer
                                                                                                      - [ ] Ensure gestures do not trigger location switching (location switching is tap menu only)

                                                                                                      ### 3.3 Drawer content (max 6 items, number-first)
                                                                                                      - [ ] Show up to 6 metrics (mock data):
                                                                                                        - [ ] Humidity (label: `Hum`)
                                                                                                          - [ ] Wind speed (`Wind`)
                                                                                                            - [ ] Feels like (`Feels`)
                                                                                                              - [ ] Precipitation (`Rain` or `Prec`)
                                                                                                                - [ ] UV (`UV`)
                                                                                                                  - [ ] Visibility (`Vis`) (or Pressure `Pres`)
                                                                                                                  - [ ] Ensure layout remains minimal (no charts)

                                                                                                                  ---

                                                                                                                  ## 4) WeatherAPI integration via SERVER PROXY (REAL DATA)
                                                                                                                  ### 4.1 Next.js Route Handlers (server-side only)
                                                                                                                  - [ ] Implement `/api/weather/search?q=...`
                                                                                                                    - [ ] Calls WeatherAPI search endpoint
                                                                                                                      - [ ] Returns sanitized minimal fields
                                                                                                                      - [ ] Implement `/api/weather/current?...`
                                                                                                                        - [ ] Support query by:
                                                                                                                            - [ ] `q=CityName` OR
                                                                                                                                - [ ] `lat,lon` for geolocation
                                                                                                                                  - [ ] Returns sanitized minimal fields needed by UI

                                                                                                                                  ### 4.2 Wire Search screen to real API
                                                                                                                                  - [ ] Replace mock results with real results from `/api/weather/search`
                                                                                                                                  - [ ] Ensure add/replace stores enough info to fetch current weather later

                                                                                                                                  ### 4.3 Wire Current screen to real API
                                                                                                                                  - [ ] Fetch current weather through `/api/weather/current`
                                                                                                                                  - [ ] Implement normalization:
                                                                                                                                    - [ ] WeatherAPI condition -> one of the 6 categories
                                                                                                                                      - [ ] Condition text -> short 1-word label for display
                                                                                                                                      - [ ] Map normalized category -> theme (background + shapes)

                                                                                                                                      ---

                                                                                                                                      ## 5) Caching + offline fallback (10-minute rule)
                                                                                                                                      ### 5.1 Cache behavior
                                                                                                                                      - [ ] Cache per location:
                                                                                                                                        - [ ] Store payload + `timestamp`
                                                                                                                                          - [ ] If data age < 10 minutes, use cache (no fetch)
                                                                                                                                            - [ ] If older, fetch and refresh cache

                                                                                                                                            ### 5.2 Failure handling
                                                                                                                                            - [ ] If fetch fails:
                                                                                                                                              - [ ] Use last cached payload for that location (if exists)
                                                                                                                                                - [ ] Show minimal indicator text: `Offline` (or `No data` if none)

                                                                                                                                                ### 5.3 Loading states
                                                                                                                                                - [ ] Skeleton for temp area during fetch
                                                                                                                                                - [ ] Avoid verbose loading text; keep minimal

                                                                                                                                                ### 5.4 Geolocation permission handling
                                                                                                                                                - [ ] If user denies geolocation:
                                                                                                                                                  - [ ] Fall back to saved locations if any
                                                                                                                                                    - [ ] If none, prompt to add via Search with minimal copy

                                                                                                                                                    ---

                                                                                                                                                    ## 6) Units + minimal settings UI
                                                                                                                                                    ### 6.1 Settings model
                                                                                                                                                    - [ ] Temperature unit: C/F (default C)
                                                                                                                                                    - [ ] Measurement system: Metric/Imperial (default Metric)
                                                                                                                                                    - [ ] Time format: 24h/12h (default 24h)
                                                                                                                                                    - [ ] Persist settings locally

                                                                                                                                                    ### 6.2 Conversions
                                                                                                                                                    - [ ] Temperature display conversion
                                                                                                                                                    - [ ] Wind speed conversion
                                                                                                                                                    - [ ] Any other metric conversion needed (keep minimal)

                                                                                                                                                    ### 6.3 Settings access path
                                                                                                                                                    - [ ] Add Settings entry/icon inside the location switch menu
                                                                                                                                                    - [ ] Settings UI is minimal (toggles/segmented controls)

                                                                                                                                                    ---

                                                                                                                                                    ## 7) PWA polish (deploy-ready)
                                                                                                                                                    - [ ] Refine manifest fields (icons, theme_color, background_color)
                                                                                                                                                    - [ ] Ensure installable on mobile (basic criteria)
                                                                                                                                                    - [ ] Add offline fallback route/page (minimal)
                                                                                                                                                    - [ ] Verify service worker caching is not overly aggressive (avoid stale UI beyond 10-min rule)

                                                                                                                                                    ---

                                                                                                                                                    ## 8) Final QA / constraints validation
                                                                                                                                                    - [ ] Confirm: NO client-side exposure of WeatherAPI key
                                                                                                                                                    - [ ] Confirm: location switching ONLY via tapping city name -> menu
                                                                                                                                                    - [ ] Confirm: details drawer appears via swipe LEFT, closes via swipe RIGHT/tap outside
                                                                                                                                                    - [ ] Confirm: saved locations max = 3, reorder works, persists
                                                                                                                                                    - [ ] Confirm: 6-category normalization is implemented and used for themes
                                                                                                                                                    - [ ] Confirm: condition text is short (1 word) and small
                                                                                                                                                    - [ ] Confirm: minimal text overall; weather state communicated primarily via visuals
                                                                                                                                                    - [ ] Confirm: caching works (<10 min reuse; offline uses last cached)
                                                                                                                                                    - [ ] Confirm: mobile-first layout, safe tap targets, basic contrast

                                                                                                                                                    ---

                                                                                                                                                    ## README requirements (must be updated as you go)
                                                                                                                                                    - [ ] Add “How to run locally”
                                                                                                                                                    - [ ] Add env var instructions (`WEATHERAPI_KEY`)
                                                                                                                                                    - [ ] Add “Deploy on Vercel” steps
                                                                                                                                                    - [ ] Document caching rule (10 minutes) and offline behavior
                                                                                                                                                    - [ ] Document gestures (swipe drawer) and location switching behavior

                                                                                                                                                    ---