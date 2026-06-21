const tintColorLight = '#005c55'; // Web Primary Teal
const tintColorDark = '#80d5cb';  // Web Fixed Dim Teal

export default {
  light: {
    text: '#181c1c',            // Web on-background
    background: '#f7faf8',      // Web background (sage-white)
    tint: tintColorLight,
    tabIconDefault: '#8e9a97',  // Sage outline-like color
    tabIconSelected: tintColorLight,
    border: '#bdc9c6',          // Web outline-variant
    card: '#ffffff',            // Pure white for cards
    secondary: '#4e6260',
    secondaryContainer: '#d1e7e4',
  },
  dark: {
    text: '#e2e3e2',
    background: '#181c1c',      // Web on-background as dark base
    tint: tintColorDark,
    tabIconDefault: '#6e7977',
    tabIconSelected: tintColorDark,
    border: '#3e4947',
    card: '#242827',
    secondary: '#b5cbc8',
    secondaryContainer: '#374a49',
  },
};
