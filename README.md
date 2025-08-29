cratedigger.js
===========

3D vinyl records exploration & crate digging webapp, using WebGL with Three.js.

[![cratedigger.js demo](https://github.com/risq/cratedigger/blob/master/src/images/demo.gif?raw=true)](https://heneni.github.io/cratedigger/)

**Live Demo** : [https://heneni.github.io/cratedigger/](https://heneni.github.io/cratedigger/)

## New Features

This modern version includes:
- **CSV Data Loading**: Loads vinyl record data from `cratediggerDB.csv` with fields: title, artist, year, genre, label, imageUrl
- **3D Interactive Visualization**: Floating album covers arranged in a spiral pattern in 3D space
- **Click Interaction**: Click on any record to view detailed information
- **Smooth Animations**: Floating animations and smooth camera transitions
- **Modern Build System**: Built with Vite for fast development and optimized production builds


## Getting Started

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/Heneni/cratedigger.git
cd cratedigger
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

To build the project for production deployment:

```bash
npm run build
```

To deploy to GitHub Pages (builds and copies to `/docs` folder):

```bash
npm run deploy
```

### Data Format

The application loads data from `cratediggerDB.csv` with the following format:
```csv
title,artist,year,genre,label,imageUrl
Kind of Blue,Miles Davis,1959,Jazz,Columbia Records,https://example.com/image.jpg
```

### Controls

- **Mouse Movement**: Rotate the camera around the scene
- **Mouse Click**: Select a record to view details
- **Mouse Wheel**: Zoom in/out
- **Click Empty Space**: Deselect current record

## Legacy Documentation

The sections below are for the legacy version of this project:
-----------

Clone repo :

    git clone git@github.com:risq/cratedigger.js.git cratedigger.js
    cd cratedigger.js

Install dependencies :
    
    npm install
    
Build vendors & assets :

    npm run build
    
Run cratedigger.js (with browsersync & watchers) :
    
    npm start
    
Build  :

    gulp build
    
Enjoy !!
