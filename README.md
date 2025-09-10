# Camera Exposure Calculator

A Vue 3-based web application for calculating camera exposure values (EV) and finding equivalent exposure combinations. This tool helps photographers quickly calculate and convert between different exposure settings while maintaining the same exposure value.

## Features

- **EV Calculator**: Calculate exposure values from shutter speed, aperture, and ISO settings
- **Flexible Input**: Choose from predefined values or enter custom parameters
- **Step Size Configuration**: Support for 1/3, 1/2, and full stop increments
- **Equivalent Exposure Finder**: Find all equivalent combinations for the same EV
- **Target Parameter Locking**: Lock specific parameters to find compatible settings
- **Responsive Design**: Works on desktop and mobile devices
- **Multiple View Modes**: Table and card views for exposure combinations

## How It Works

The application uses the standard exposure value formula:
```
EV = log₂(A²/T) + log₂(S/100)
```
Where:
- A = Aperture (f-number)
- T = Shutter time (seconds)
- S = ISO value

## Tech Stack

- **Vue 3** with Composition API
- **TypeScript** for type safety
- **Vite** for fast development and building
- **Vue Router** for navigation
- Modern CSS with responsive design

## Requirements

- Node.js ^20.19.0 || >=22.12.0

## Project Setup

```sh
npm install
```

### Development

```sh
npm run dev
```

### Build for Production

```sh
npm run build
```

### Type Checking

```sh
npm run type-check
```

### Code Formatting

```sh
npm run format
```

## Usage

1. **Set Step Size**: Choose your preferred increment (1/3, 1/2, or 1 stop)
2. **Input Current Settings**: Enter or select your shutter speed, aperture, and ISO
3. **View EV**: The exposure value is calculated automatically
4. **Find Equivalents**: Browse equivalent exposure combinations in the converter section
5. **Lock Parameters**: Set target values for specific parameters to find compatible settings
6. **Apply Settings**: Click "Apply" to use any equivalent combination as your new base settings

## Development Setup

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur if installed)

### Type Support for `.vue` Imports

This project uses `vue-tsc` instead of `tsc` for TypeScript checking to handle `.vue` file imports properly.

## Configuration

See [Vite Configuration Reference](https://vite.dev/config/) for customization options.
