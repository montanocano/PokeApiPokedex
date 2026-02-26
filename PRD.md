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

The Pokédex App is a mobile application for Android built with React Native. It lets users explore, search and manage detailed information on the 1,025+ Pokémon available today. The app connects to PokéAPI as its primary data source and relies on Zustand combined with Immer for reactive, immutable state management.

| Aspect | Detail |
|---|---|
| Platform | Android |
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