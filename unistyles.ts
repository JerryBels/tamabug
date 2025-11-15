/* eslint-disable @typescript-eslint/no-empty-object-type */
import { StyleSheet } from 'react-native-unistyles'

const fontSizes = {
    xs: 12,
    sm: 34,
    md: 16,
    lg: 18,
    xl: 20,
}

const lightTheme = {
    colors: {
        primary: '#0000ff', // blue
        secondary: '#008000', // green
        background: '#f0f0f0',
        // any nesting, spreading, arrays, etc.
    },
    // functions, external imports, etc.
    gap: (v: number) => v * 8,
    fontSizes
}

const darkTheme = {
    colors: {
        primary: '#ff0000', // red
        secondary: '#ffc0cb', // pink
        background: '#333'
    },
    gap: (v: number) => v * 8,
    fontSizes
}

const appThemes = {
    light: lightTheme,
    dark: darkTheme
}

const breakpoints = {
    xs: 0, // <-- make sure to register one breakpoint with value 0
    sm: 300,
    md: 500,
    lg: 800,
    xl: 1200
    // use as many breakpoints as you need
}

const settings = {
    adaptiveThemes: true
}

type AppThemes = typeof appThemes
type AppBreakpoints = typeof breakpoints

declare module 'react-native-unistyles' {
    export interface UnistylesThemes extends AppThemes { }
    export interface UnistylesBreakpoints extends AppBreakpoints { }
}

StyleSheet.configure({
    themes: appThemes,
    breakpoints,
    settings
})