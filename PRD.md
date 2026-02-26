# Pokédex App — Product Requirements Document

**Version 1.0 · February 2026**
**React Native · Zustand · Immer · PokéAPI**

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Product Vision & Strategy](#2-product-vision--strategy)
3. [Functional Requirements](#3-functional-requirements)
4. [Non-Functional Requirements](#4-non-functional-requirements)
5. [Technical Architecture](#5-technical-architecture)
6. [Data Model](#6-data-model)
7. [Design System](#7-design-system)
8. [User Flows & Wireframes](#8-user-flows--wireframes)
9. [API Integration Specs](#9-api-integration-specs)
10. [Development Phases](#10-development-phases-roadmap)

---

## 1. Executive Summary

The Pokédex App is a application built with React Native. It lets users explore, search and manage detailed information on the 1,025+ Pokémon available today. The app connects to PokéAPI as its primary data source and relies on Zustand combined with Immer for reactive, immutable state management.

| Aspect | Detail |
|---|---|
| Platform | Android, Web |
| Framework | React Native 0.73+ with Expo SDK 50+ |
| Global State | Zustand 4.x + Immer middleware |
| Data Source | PokéAPI v2 (REST, free, no authentication) |
| Language | TypeScript 5.x in strict mode |
| Navigation | React Navigation 6.x |
| Dev Environment | Visual Studio Code |
| Purpose | Portfolio project · Demonstrates technical competence |

### 1.1 Project Goals

- Build a functional, fast and visually appealing Pokédex.
- Demonstrate proficiency in React Native, modern state management and REST API consumption.
- Apply scalable patterns such as caching, infinite pagination and offline-first.
- Deliver a portfolio-ready project with clean, well-documented code.

### 1.2 MVP Scope

The MVP covers the following capabilities:

- Paginated Pokémon list with infinite scroll and search.
- Full detail view with stats, types, evolutions and moves.
- Persistent favorites system using AsyncStorage.
- Filtering by type, generation and stat ranges.
- Smart caching to reduce unnecessary API calls.

---

## 2. Product Vision & Strategy

### 2.1 Product Vision

We want this to be the go-to Pokédex app for fans and developers alike: a fast, beautiful and intuitive mobile experience that also serves as a showcase of modern React Native best practices.

### 2.2 Value Proposition

| For whom | What it delivers |
|---|---|
| Pokémon fans | Quick access to complete info on every Pokémon, with no ads or distractions |
| Recruiters / Hiring Managers | Tangible evidence of React Native, TypeScript and architecture skills |
| Junior developers | Reference codebase for learning modern mobile development patterns |

### 2.3 Design Principles

1. **Performance First** — Every interaction responds in under 300ms. The FlatList is configured with keyExtractor, getItemLayout and an optimized windowSize.
2. **Offline-Resilient** — Cached data allows browsing without a connection. Favorites persist locally.
3. **Type-Safe** — 100% TypeScript strict. Zero usage of "any". Every API response is fully typed.
4. **Clean Architecture** — Clear separation between UI, business logic and data layer.
5. **Accessibility** — Full TalkBack support, WCAG AA contrast ratios, minimum 44px touch targets.

### 2.4 Competitive Differentiation

| Feature | Existing apps | Our Pokédex |
|---|---|---|
| Search | Basic name search | Name, number, type, generation |
| Performance | Slow loads, no cache | Zustand cache + infinite pagination |
| State | Basic useState | Zustand + Immer (immutable, predictable) |
| Code | JavaScript, untyped | TypeScript strict, SOLID patterns |
| Offline | Does not work | Cached data + local favorites |

---

## 3. Functional Requirements

### 3.1 Module: Pokémon List

**[US-001]** As a user, I want to see a list of Pokémon when I open the app, so I can start exploring the Pokédex right away.

Acceptance criteria:
- The main screen shows a scrollable list with each Pokémon's image, name and number
- 30 Pokémon load initially, with more fetched via infinite scroll
- Each card displays: sprite, #ID, name and type(s) with colored badges
- Skeleton loading appears while data is being fetched
- The list works with TalkBack

**[US-002]** As a user, I want to search Pokémon by name or number, so I can quickly find the one I'm looking for.

Acceptance criteria:
- Search bar visible at the top of the list
- Partial name search (e.g. "char" finds Charmander, Charmeleon, Charizard)
- Exact number search (e.g. "25" finds Pikachu)
- Results update with a 300ms debounce
- A friendly message appears when there are no results

**[US-003]** As a user, I want to filter Pokémon by type and generation, so I can explore specific categories.

Acceptance criteria:
- Filter button opens a bottom sheet
- Type filter: selectable chips (fire, water, grass, etc.)
- Generation filter: I through IX
- Filters can be combined (e.g. Fire type + Gen I)
- A badge on the button shows how many filters are active
- "Clear filters" button resets everything

### 3.2 Module: Pokémon Detail

**[US-004]** As a user, I want to see detailed information about a Pokémon, so I can learn all its characteristics.

Acceptance criteria:
- Screen shows: large image, name, number, type(s), height and weight
- Tabs or sections for: Stats, Evolutions, Moves, About
- Stats rendered as animated progress bars with numeric values
- Screen background adapts to the Pokémon's primary type color
- Smooth transition animation from the list to the detail view

**[US-005]** As a user, I want to see a Pokémon's evolution chain, so I can understand how it evolves.

Acceptance criteria:
- Evolution chain displayed horizontally with arrows between stages
- Each stage shows sprite, name and evolution level or condition
- Tapping any stage navigates to that Pokémon's detail screen
- Branching evolutions (e.g. Eevee) are displayed correctly


---

## 4. Non-Functional Requirements

### 4.1 Performance

| Metric | Target | Measurement Tool |
|---|---|---|
| Time to Interactive (TTI) | < 2 seconds on 4G | React Native Performance Monitor |
| FPS during scroll | ≥ 58 FPS steady | Perf Monitor / Flipper |
| Bundle size | < 15 MB (APK) | EAS Build metrics |
| Memory usage | < 150 MB under active use | Android Profiler |
| Search time | < 100ms for local filtering | Performance.now() |
| Image loading | < 500ms with placeholder | Custom timing hooks |

### 4.2 Security

- No sensitive user data is stored.
- All API calls go over HTTPS.
- AsyncStorage only holds favorite IDs and cached public data.
- No authentication is needed (PokéAPI is public).

### 4.3 Accessibility (WCAG 2.1 AA)

- All interactive elements carry a descriptive accessibilityLabel.
- Minimum contrast of 4.5:1 for regular text, 3:1 for large text.
- Minimum touch target size: 44×44 points.
- Full TalkBack support.
- Honors the system's "Reduce Motion" setting.


---

## 6. Data Model

### 6.1 Core TypeScript Interfaces

All interfaces live in the `src/domain/interfaces/` directory and define the contract between layers.

#### PokemonListItem

This is the lightweight representation used in the main list. It contains the Pokémon's numeric ID, its name, the resource URL, the sprite URL pointing to the front_default image, and an array of types. Each type entry has a slot (1 or 2) and a nested object with the type name and URL. The type name is constrained to a union of the 18 official Pokémon types: normal, fire, water, electric, grass, ice, fighting, poison, ground, flying, psychic, bug, rock, ghost, dragon, dark, steel and fairy.

#### PokemonDetail

This is the full data object used on the detail screen. It extends the list item's fields with height (in decimeters), weight (in hectograms), base experience, a full stats array, abilities, sprites and moves. Each stat entry holds a base stat value, an effort value and the stat's name — one of hp, attack, defense, special-attack, special-defense or speed. Each ability entry has the ability name and URL, a boolean for whether it is hidden, and its slot number. The sprites object holds frontDefault and frontShiny URLs, plus nested objects for official artwork and home artwork. Moves are limited to the first 20 entries for performance; each one holds the move name and an array of version group details including level learned at, learn method and version group.

#### EvolutionChain

The evolution chain is a tree structure. The top-level object has an ID and a root chain node. Each node contains the species reference, an array of evolution details, an array of child nodes (evolvesTo) and a resolved pokemonId extracted from the species URL. Evolution details describe the trigger (level-up, item, trade, etc.), minimum level, required item, minimum happiness and time of day. Any of these fields can be null depending on the evolution method.

#### API Response Types

The PaginatedResponse is a generic wrapper matching PokéAPI's paginated format: a total count, nullable next and previous URLs, and a results array of the parameterized type. NamedAPIResource is the basic reference object used throughout the API, containing a name and URL. PokemonSpecies holds the species-level data used for the About tab: flavor text entries, genera, evolution chain URL reference, generation, color, habitat (nullable), gender rate (-1 for genderless, 0–8 as the female probability out of eight), capture rate, base happiness and growth rate.

### 6.2 Entity Relationships

PokemonListItem has a one-to-many relationship with PokemonType. Fetching by ID yields a PokemonDetail, which has one-to-many relationships with PokemonStat, PokemonAbility and PokemonMove. From the detail, following the species URL leads to a PokemonSpecies, which has a one-to-one link to its EvolutionChain. The chain is a recursive tree of EvolutionNode objects, each of which can hold one or more EvolutionDetail records describing how the evolution is triggered.

---
## 7. Design System

### 7.1 Color Palette

#### Primary Colors

| Token | Hex | Usage |
|---|---|---|
| colors.primary | #DC0A2D | Pokédex red: header, CTAs, main accents |
| colors.secondary | #3B4CCA | Pokémon blue: links, secondary elements |
| colors.accent | #FFDE00 | Pokémon yellow: highlights, active badges |
| colors.background | #F5F5F5 | Main app background |
| colors.surface | #FFFFFF | Card, modal and sheet backgrounds |
| colors.text.primary | #1A1A2E | Primary text |
| colors.text.secondary | #6B7280 | Secondary text, captions |
| colors.text.disabled | #9CA3AF | Disabled text |
| colors.border | #E5E7EB | Borders and separators |

#### Pokémon Type Colors

Each of the 18 types has a designated color. Normal is #A8A77A, fire is #EE8130, water is #6390F0, electric is #F7D02C, grass is #7AC74C, ice is #96D9D6, fighting is #C22E28, poison is #A33EA1, ground is #E2BF65, flying is #A98FF3, psychic is #F95587, bug is #A6B91A, rock is #B6A136, ghost is #735797, dragon is #6F35FC, dark is #705746, steel is #B7B7CE and fairy is #D685AD. These colors are used in type badges, detail screen backgrounds and filter chips.

### 7.2 Typography

| Token | Font | Size | Weight | Line Height | Usage |
|---|---|---|---|---|---|
| typography.h1 | System (Roboto) | 32px | Bold (700) | 38px | Screen titles |
| typography.h2 | System | 24px | SemiBold (600) | 30px | Section titles |
| typography.h3 | System | 20px | SemiBold (600) | 26px | Subtitles |
| typography.body | System | 16px | Regular (400) | 24px | Main body text |
| typography.bodySmall | System | 14px | Regular (400) | 20px | Secondary text |
| typography.caption | System | 12px | Medium (500) | 16px | Labels, badges |
| typography.number | Roboto Mono | 14px | Medium (500) | 18px | IDs, numeric stats |

### 7.3 Spacing (8px base)

The spacing scale uses a base unit of 8px. The tokens are: xs at 4 (half unit, minimum inline separation), sm at 8 (one unit, small internal padding), md at 16 (two units, standard card and container padding), lg at 24 (three units, section separation), xl at 32 (four units, screen margin) and xxl at 48 (six units, separation between major blocks).

### 7.4 Border Radius

The scale goes: sm at 8px for badges and type chips, md at 12px for Pokémon cards, lg at 16px for bottom sheets and modals, xl at 24px for the search bar, and full at 9999px for circular avatars and FABs.

### 7.5 Shadows / Elevation

Three levels are defined. The small shadow uses a 1px vertical offset with 0.05 opacity and elevation 1 on Android. The medium shadow uses a 2px offset with 0.1 opacity and elevation 3. The large shadow uses a 4px offset with 0.15 opacity and elevation 6. All three use black as the shadow color with respective blur radii of 2, 4 and 8.

---

## 8. User Flows & Wireframes

### 8.1 Main Flow: Explore Pokédex

```
[App Launch]
     │
     ▼
[Splash Screen] ──2s──▶ [Home Screen: Pokémon List]
                              │
                 ┌────────────┼────────────┐
                 │            │            │
            [Scroll Down] [Search]    [Filter]
            Load +30      Debounce    Bottom Sheet
                 │         300ms       Type/Gen
                 ▼            │            │
          [Infinite List]     ▼            ▼
                 │      [Filtered Results]
                 │            │
                 └──────┬─────┘
                        │
                   [Tap Card]
                        │
                        ▼
                 [Detail Screen]
                 ┌───┬───┬───┐
                 │   │   │   │
              [About][Stats][Evo][Moves]
                        │
                   [Tap Evo Stage]
                        │
                        ▼
                 [New Detail Screen]
```

### 8.2 Wireframes

#### Home Screen (List)

```
┌──────────────────────────────────┐
│  Pokédex              [filter]   │  ◄── Header
├──────────────────────────────────┤
│  ┌──────────────────────────────┐│
│  │  🔍 Search Pokémon...        ││  ◄── Search Bar
│  └──────────────────────────────┘│
│                                  │
│  ┌─────────────┐ ┌─────────────┐ │
│  │  ┌─────┐    │ │  ┌─────┐    │ │
│  │  │ IMG │    │ │  │ IMG │    │ │
│  │  └─────┘    │ │  └─────┘    │ │  ◄── Pokémon Grid
│  │ #001       ♥ │ │ #002       ♥ │ │
│  │ Bulbasaur    │ │ Ivysaur      │ │
│  │ [Grass][Poi] │ │ [Grass][Poi] │ │
│  └─────────────┘ └─────────────┘ │
│                                  │
│  ┌─────────────┐ ┌─────────────┐ │
│  │  ┌─────┐    │ │  ┌─────┐    │ │
│  │  │ IMG │    │ │  │ IMG │    │ │
│  │  └─────┘    │ │  └─────┘    │ │
│  │ #003       ♥ │ │ #004       ♥ │ │
│  │ Venusaur     │ │ Charmander   │ │
│  │ [Grass][Poi] │ │ [Fire]       │ │
│  └─────────────┘ └─────────────┘ │
│                                  │
├──────────────────────────────────┤
│  [🏠 Home]  [♥ Favs]  [⚔ Compare] │  ◄── Tab Bar
└──────────────────────────────────┘
```

#### Detail Screen

```
┌──────────────────────────────────┐
│  [←]  #025 Pikachu         [♥]  │  ◄── Header + back + fav
├──────────────────────────────────┤
│ ████████████████████████████████ │
│ ████████████████████████████████ │  ◄── Background matches type
│ ███████ [ ARTWORK ] ████████████ │      (Electric = #F7D02C)
│ ████████████████████████████████ │
│ ████████████████████████████████ │
├──────────────────────────────────┤
│                                  │
│   [Electric]                     │  ◄── Type badge
│                                  │
│   [About] [Stats] [Evo] [Moves] │  ◄── Tabs
│   ─────── ═══════                │
│                                  │
│   HP          ████████░░░  35    │
│   Attack      █████████░░  55    │  ◄── Animated bars
│   Defense     ██████░░░░░  40    │
│   Sp.Atk      ████████░░░  50    │
│   Sp.Def      ████████░░░  50    │
│   Speed       ███████████  90    │
│                                  │
│   Total: 320                     │
│                                  │
└──────────────────────────────────┘
```

#### Favorites Screen

```
┌──────────────────────────────────┐
│  My Favorites (12)               │  ◄── Header + count
├──────────────────────────────────┤
│                                  │
│  ┌────────┐┌────────┐┌────────┐  │
│  │ [IMG]  ││ [IMG]  ││ [IMG]  │  │
│  │ #025   ││ #006   ││ #150   │  │  ◄── 3-column grid
│  │Pikachu ││Chariza ││Mewtwo  │  │
│  └────────┘└────────┘└────────┘  │
│                                  │
│  ┌────────┐┌────────┐┌────────┐  │
│  │ [IMG]  ││ [IMG]  ││ [IMG]  │  │
│  │ #094   ││ #130   ││ #149   │  │
│  │Gengar  ││Gyarado ││Dragnit │  │
│  └────────┘└────────┘└────────┘  │
│                                  │
├──────────────────────────────────┤
│  [🏠 Home]  [♥ Favs]  [⚔ Compare] │
└──────────────────────────────────┘
```

#### Empty State — Favorites

```
┌──────────────────────────────────┐
│  My Favorites (0)                │
├──────────────────────────────────┤
│                                  │
│                                  │
│         ┌────────────┐           │
│         │  (empty)   │           │
│         │ illustration│          │
│         └────────────┘           │
│                                  │
│    You have no favorites yet.    │
│    Explore the Pokédex and mark  │
│    your favorite Pokémon.        │
│                                  │
│      ┌──────────────────┐        │
│      │ Explore Pokédex   │       │  ◄── CTA
│      └──────────────────┘        │
│                                  │
├──────────────────────────────────┤
│  [🏠 Home]  [♥ Favs]  [⚔ Compare] │
└──────────────────────────────────┘
```

#### Filter Bottom Sheet

```
┌──────────────────────────────────┐
│                                  │
│  (dimmed background)             │
│                                  │
├──────────────────────────────────┤
│  ───  (drag handle)              │
│                                  │
│  Filter by Type                  │
│  [Fire][Water][Grass][Electric]  │
│  [Psychic][Dragon][Dark][Steel]  │
│  [Ice][Fighting][Poison][Ground] │
│  [Flying][Bug][Rock][Ghost]      │
│  [Fairy][Normal]                 │
│                                  │
│  Filter by Generation            │
│  [I] [II] [III] [IV] [V]        │
│  [VI] [VII] [VIII] [IX]         │
│                                  │
│  [Clear]            [Apply (3)] │
└──────────────────────────────────┘
```

---

## 9. API Integration Specs

### 9.1 Base Configuration

The API client is built on top of Axios with a base URL pointing to `https://pokeapi.co/api/v2`. It uses a global timeout of 10 seconds and sets the Accept header to application/json.

A response interceptor is configured at the client level. On success, it unwraps the Axios response object and returns the data payload directly, so service methods never have to deal with the response wrapper. On failure, it distinguishes between timeouts (connection aborted errors, surfaced as a "connection timed out" message), network errors (no response at all, surfaced as "no internet connection"), and standard HTTP errors which are re-thrown as-is.

### 9.2 Endpoints Used

The app consumes six PokéAPI endpoints:

- **Pokémon list** (`GET /pokemon`) — Accepts offset and limit query parameters. Returns a paginated response with the total count, next and previous page URLs, and an array of name/URL references.
- **Pokémon detail** (`GET /pokemon/{id}`) — Returns the full dataset for a single Pokémon, including types, stats, abilities, sprites and moves.
- **Pokémon species** (`GET /pokemon-species/{id}`) — Returns species-level data such as flavor text, genera, the evolution chain URL, generation, color, habitat and breeding info.
- **Evolution chain** (`GET /evolution-chain/{id}`) — Returns a recursive tree of species references with evolution triggers and conditions.
- **Type** (`GET /type/{name}`) — Returns all Pokémon belonging to a given type. Used for type-based filtering.
- **Generation** (`GET /generation/{id}`) — Returns all Pokémon species introduced in a given generation. Used for generation-based filtering.

### 9.3 Pokémon Service

A PokemonService class encapsulates all API interactions and data transformation. Its job is to call the raw endpoints through the Axios client and return properly typed, camelCase objects that match the TypeScript interfaces defined in the data model.

The **getList** method takes an offset and limit (defaulting to 0 and 20), calls the Pokémon list endpoint and returns the paginated response directly, since the top-level structure already matches our PaginatedResponse interface.

The **getDetail** method fetches a single Pokémon by ID and runs it through a transformation function. This transformer maps snake_case fields from the API into camelCase: base_experience becomes baseExperience, base_stat becomes baseStat, is_hidden becomes isHidden, front_default becomes frontDefault, and so on. Nested structures like the official-artwork sprites get reorganized into a cleaner officialArtwork property. Moves are trimmed to the first 20 entries to keep the detail object lightweight.

The **getSpecies** method similarly fetches and transforms species data, converting flavor_text_entries into flavorTextEntries, evolution_chain into evolutionChain, gender_rate into genderRate, capture_rate into captureRate, base_happiness into baseHappiness and growth_rate into growthRate.

The **getEvolutionChain** method accepts a full URL (since the species response provides the chain URL directly rather than just an ID), fetches the chain data and recursively transforms it. Each node in the chain is mapped to an EvolutionNode with a species reference, a pokemonId extracted from the species URL, an array of evolution details (with trigger, minLevel, item, minHappiness and timeOfDay) and a recursive evolvesTo array containing the next stages.

A small helper function handles the URL-to-ID extraction: it splits a PokéAPI resource URL by slashes, filters out empty segments and parses the last segment as an integer.

### 9.4 Cache Strategy

The app uses an in-memory cache manager built on a simple Map structure. Each cache entry holds the stored data, a timestamp of when it was written and a TTL (time-to-live) in milliseconds.

When reading from the cache, the manager checks whether the entry exists and whether the elapsed time since its timestamp exceeds the TTL. Expired entries are deleted and treated as misses.

Default TTLs are 5 minutes for list data and 30 minutes for detail data, since individual Pokémon info rarely changes. The cache can also be explicitly invalidated per key or cleared entirely.

The Pokémon store checks the cache before making network requests. On a cache hit for a detail view, the API call is skipped entirely and the cached object is returned. This cuts down network usage significantly when users go back and forth between the list and detail screens.

### 9.5 Rate Limiting and Error Handling

PokéAPI is free and requires no authentication, but it does enforce an implicit rate limit. The app handles this with five strategies:

- **Aggressive caching** — As described above, with 5-minute and 30-minute TTLs depending on the data type.
- **Request deduplication** — If a request is already in flight for the same resource URL, the existing Promise is reused instead of firing a duplicate call.
- **Exponential backoff retry** — Failed requests are retried up to 3 times with increasing delays of 1, 2 and 4 seconds.
- **Global timeout** — Every request times out after 10 seconds.
- **Error boundaries** — React ErrorBoundary components wrap major screen areas. When an unhandled error is caught, they display a friendly fallback UI with a retry button instead of crashing the app.

---