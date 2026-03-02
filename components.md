# Base Reusable Components

All components live in `src/UI/Components/common/` and are built with Tamagui's `styled()` API. Import them from the barrel:

```ts
import { Button, Card, SearchInput, Chip, LoadingSpinner, ErrorMessage } from "@/UI/Components/common";
```

---

## Button

Customizable button with three visual variants and three sizes.

**Variants:** `primary` (filled red), `secondary` (outlined red), `ghost` (transparent).
**Sizes:** `sm` (36px), `md` (44px), `lg` (52px).
**Props:** `fullWidth` (boolean), plus all standard Tamagui button props.

```tsx
<Button variant="primary" size="md">Explore Pokédex</Button>
<Button variant="secondary" size="sm" onPress={handleRetry}>Retry</Button>
<Button variant="ghost" onPress={handleCancel}>Cancel</Button>
```

---

## Card

Container component for Pokémon cards and content sections.

**Variants:** `default` (elevated with border), `outlined` (no shadow), `flat` (no border, tinted background).
**Props:** `pressable` (boolean) — adds scale-down animation and hover state on press.

```tsx
<Card pressable onPress={() => navigate(pokemon.id)}>
  {/* card content */}
</Card>
```

---

## SearchInput

Controlled text input with search icon, clear button and accessibility labels.

**Props:** `value` (string), `onChangeText` (callback), `placeholder` (optional string).

The clear button (X) only appears when there is text. The component handles its own focus border color through Tamagui's focusStyle.

```tsx
const [query, setQuery] = useState("");
<SearchInput value={query} onChangeText={setQuery} />
```

---

## Chip

Used for Pokémon type badges and filter chips.

**Variants:** `filled` (colored background), `outlined` (transparent with border).
**Sizes:** `sm`, `md`.
**Props:** `label` (string), `color` (background hex), `textColor` (text hex), `selected` (boolean), `onPress` (callback).

```tsx
<Chip label="Electric" color="$typeElectric" />
<Chip label="Fire" color="$typeFire" variant="outlined" selected={true} onPress={toggleFilter} />
```

---

## LoadingSpinner

Animated spinner with an optional message. Uses React Native's Animated API for a smooth rotation.

**Props:** `message` (optional string), `size` (icon size, default 32), `fullScreen` (boolean — centers in available space).

```tsx
<LoadingSpinner message="Loading Pokémon..." fullScreen />
```

---

## ErrorMessage

Displays an error icon, message and optional retry button.

**Props:** `message` (string), `onRetry` (optional callback), `fullScreen` (boolean).

When `onRetry` is provided, a "Try Again" button appears below the message using the secondary Button variant.

```tsx
<ErrorMessage
  message="Could not load Pokémon. Check your connection."
  onRetry={() => fetchPokemonList()}
  fullScreen
/>
```