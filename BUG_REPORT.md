# Bug Report: Multiple Issues with Uniwind Responsive Behavior and Font Configuration

## Summary

Three related issues affecting Uniwind's responsive utilities and font configuration:

1. **`--font-base` has no effect on unstyled text components** despite being documented
2. **Responsive utilities (`sm:`, `md:`, `lg:`, `xl:`) evaluate height instead of width** on React Native
3. **Media queries in `global.css` don't work** (unlike NativeWind which supports runtime responsive behavior)

## Environment

- **Uniwind version:** `1.0.1`
- **React Native:** `0.81.4`
- **Expo:** `^54.0.13`
- **Tailwind CSS:** `^4.1.17`
- **Platform:** React Native (iOS/Android)
- **Node:** (please fill in)

## Issue 1: `--font-base` Not Affecting Unstyled Text

### Description

According to the [Uniwind Global CSS documentation](https://docs.uniwind.dev/theming/global-css), `--font-base` should set the base font size across the application. However, unstyled `<Text>` components don't respect this variable.

### Steps to Reproduce

1. Set `--font-base` in `global.css`:

```css
@import "tailwindcss";
@import "uniwind";

@theme {
  --font-base: 40px; /* Large value to make it obvious */
}
```

2. Use an unstyled `<Text>` component:

```tsx
import { Text } from 'react-native';

export default function Test() {
  return <Text>This text should be 40px but isn't</Text>;
}
```

### Expected Behavior

The unstyled `<Text>` component should use `--font-base` (40px) as its font size, or at least inherit it.

### Actual Behavior

The text uses React Native's default font size (~14px), completely ignoring `--font-base`.

### Workaround

Only text with explicit Tailwind classes like `className="text-base"` respects the font scale, but this requires manually adding classes to every text component.

### Documentation Reference

The [Global CSS docs](https://docs.uniwind.dev/theming/global-css) show `--font-base` being set in `@theme`, implying it should affect the base typography:

```css
@theme {
  --font-base: 16px;
}
```

However, there's no clarification that this only affects components using Tailwind utilities, not unstyled React Native components.

---

## Issue 2: Responsive Utilities Use Height Instead of Width

### Description

Responsive breakpoint utilities (`sm:`, `md:`, `lg:`, `xl:`, `max-sm:`, `max-xl:`, etc.) appear to evaluate based on the device **height** rather than **width** on React Native, which is counterintuitive for responsive design.

### Steps to Reproduce

1. Configure breakpoints in `global.css`:

```css
@theme {
  --breakpoint-sm: 380px;
  --breakpoint-md: 420px;
  --breakpoint-lg: 680px;
  --breakpoint-xl: 1024px;
}
```

2. Use responsive utilities and compare with actual dimensions:

```tsx
import { Text, View, useWindowDimensions } from 'react-native';

export default function Test() {
  const { width, height } = useWindowDimensions();
  
  return (
    <View>
      <Text className="text-xs max-xl:text-sm">
        This text changes at xl breakpoint (1024px)
      </Text>
      <Text className="text-xs">
        Width: {width}px | Height: {height}px
      </Text>
      <Text className="text-xs">
        Expected breakpoint based on width: {width < 1024 ? 'below xl' : 'xl'}
      </Text>
    </View>
  );
}
```

### Expected Behavior

- `max-xl:` should activate when `width < 1024px`
- Breakpoints should be evaluated based on **width**, matching standard responsive design practices

### Actual Behavior

- `max-xl:` activates when **height** crosses the threshold (e.g., at 952px height)
- Breakpoint evaluation appears to use height or longest side, not width
- This causes breakpoints to trigger incorrectly, especially on portrait devices

### Example

On a device with:
- Width: ~430px (should be `md` breakpoint)
- Height: ~952px (triggers `xl` breakpoint)

The responsive utilities behave as if the device is `xl` width, when it should be `md` width.

### Impact

This makes responsive design unreliable, as developers expect width-based breakpoints but get height-based behavior instead.

---

## Issue 3: Media Queries Don't Work in `global.css`

### Description

Media queries in `global.css` (specifically `@media (min-width: ...)`) don't work as expected. Unlike NativeWind, which supports runtime responsive behavior, Uniwind appears to process these at build time or ignore them entirely.

### Steps to Reproduce

1. Add a media query in `global.css`:

```css
@layer theme {
  :root {
    --text-base: 1.5rem;
    
    @media (min-width: 2000px) {
      /* This should only apply on very large screens */
      --text-base: 1.25rem;
    }
  }
}
```

2. Use the variable:

```tsx
<Text className="text-base">This should change based on screen size</Text>
```

### Expected Behavior

- Media queries should evaluate at runtime based on actual device dimensions
- Styles should change dynamically when device size changes (e.g., orientation change)
- Behavior should match NativeWind's responsive capabilities

### Actual Behavior

- Media queries appear to be processed at build time or ignored
- The values inside `@media` blocks seem to always apply (or never apply), regardless of actual screen size
- Setting an impossible condition like `@media (min-width: 2000px)` still applies the styles, suggesting they're not being evaluated at runtime

### Comparison with NativeWind

NativeWind successfully supports runtime responsive behavior:

```tsx
// NativeWind - this works
<Text className="text-base md:text-lg">Responsive text</Text>
```

The responsive utilities (`sm:`, `md:`, etc.) work in Uniwind, but `@media` queries in `global.css` do not, which limits the ability to define responsive design tokens globally.

### Documentation Reference

The [Global CSS documentation](https://docs.uniwind.dev/theming/global-css) shows `@media` being used for platform-specific styles (`@media ios`, `@media android`), but doesn't clarify whether width-based media queries are supported or how they're processed.

---

## Code Examples

### `global.css`

```css
@import "tailwindcss";
@import "uniwind";

@theme {
  --font-base: 20px;
  --breakpoint-sm: 380px;
  --breakpoint-md: 420px;
  --breakpoint-lg: 680px;
  --breakpoint-xl: 1024px;
}

@layer theme {
  :root {
    --text-xs: 1rem;
    --text-sm: 1.25rem;
    --text-base: 1.5rem;
    
    /* This media query doesn't work as expected */
    @media (min-width: 2000px) {
      --text-base: 1.25rem;
    }
  }
}
```

### `metro.config.js`

```js
const { getDefaultConfig } = require("expo/metro-config");
const { withUniwindConfig } = require('uniwind/metro'); 

const config = getDefaultConfig(__dirname);

module.exports = withUniwindConfig(config, {  
  cssEntryFile: './global.css',
  dtsFile: './uniwind-types.d.ts'
});
```

### Test Component

```tsx
import { Text, View, useWindowDimensions } from 'react-native';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();

  return (
    <View className="flex-1 items-center justify-center gap-4">
      {/* Issue 1: Unstyled text doesn't respect --font-base */}
      <Text>Base text (should use --font-base but doesn't)</Text>
      
      {/* Issue 2: max-xl: triggers based on height, not width */}
      <Text className="text-xs max-xl:text-sm">
        Width: {width}px | Height: {height}px
      </Text>
      
      {/* Issue 3: Media query values seem to always apply */}
      <Text className="text-base">
        This should change based on @media query but doesn't
      </Text>
    </View>
  );
}
```

---

## Questions for Maintainers

1. **Is `--font-base` intended to affect unstyled React Native `<Text>` components, or only components using Tailwind utilities?**

2. **Why do responsive utilities evaluate height instead of width? Is this intentional, and if so, what's the reasoning?**

3. **Are width-based `@media` queries supported in `global.css`? If not, what's the recommended approach for responsive design tokens?**

4. **How does Uniwind's responsive behavior differ from NativeWind's, and why?**

---

## Additional Context

- Migrated from NativeWind where responsive behavior worked as expected
- These issues prevent implementing a responsive design system where base font sizes adapt to device size
- The height-based breakpoint evaluation is particularly problematic for portrait-oriented mobile apps

---

## Related Documentation

- [Uniwind Global CSS](https://docs.uniwind.dev/theming/global-css)
- [Uniwind Platform Selectors](https://docs.uniwind.dev/api/platform-select)
- [Uniwind Theming Basics](https://docs.uniwind.dev/theming/basics)

