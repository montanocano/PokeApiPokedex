// creates the store instance with the default filter implementation
// in tests we use createSearchFilterStore directly with a vanilla store

import { create } from "zustand";
import { createSearchFilterStore } from "./searchFilterStore";
import type { SearchFilterStore } from "./searchFilterStore";

export const useSearchFilterStore = create<SearchFilterStore>()(
  createSearchFilterStore(),
);
