cratedigger.js
===========

3D vinyl records exploration & crate digging plugin, using WebGL with Three.js.

[![cratedigger.js demo](https://github.com/risq/cratedigger/blob/master/src/images/demo.gif?raw=true)](https://heneni.github.io/cratedigger/)

**demo** : [https://heneni.github.io/cratedigger/](https://heneni.github.io/cratedigger/)


Screenshots
-----------

![cratedigger.js screenshot #1](https://github.com/risq/cratedigger/blob/master/src/images/screenshot1.png?raw=true)
![cratedigger.js screenshot #2](https://github.com/risq/cratedigger/blob/master/src/images/screenshot2.png?raw=true)


Using with npm
-----------

Install cratedigger.js :

    npm install --save cratedigger.js

Use the library in your app :

`````javascript
var cratedigger = require('cratedigger.js');
cratedigger.init(options);
`````


Building & testing
-----------

Clone repo :

    git clone https://github.com/Heneni/cratedigger.git cratedigger
    cd cratedigger

**Note**: This project requires Node.js 14.x due to legacy dependencies. You can use [nvm](https://github.com/nvm-sh/nvm) to manage Node.js versions:

    nvm install 14
    nvm use 14

Install dependencies :
    
    npm install
    
Build vendors & assets :

    npm run build
    
Run cratedigger.js (with browsersync & watchers) :
    
    npm start
    
Build  :

    gulp build
    
The built application will be output to the `lib/` directory.

Deployment
----------

### Automatic Deployment

This repository is configured with GitHub Actions for automatic deployment to GitHub Pages. Every push to the `main` or `master` branch will:

1. Build the application using `npm run build`
2. Deploy the contents of the `lib/` directory to GitHub Pages
3. Make the app available at `https://heneni.github.io/cratedigger/`

### Manual Local Deployment

To deploy manually to GitHub Pages:

1. Build the application: `npm run build`
2. The built files in `lib/` can be deployed to any static hosting service
3. Ensure all assets (JS, CSS, images) are properly referenced

### Customizing Data

To customize the vinyl records data displayed in the application:

1. Edit the data files in the `src/` directory
2. Modify the JavaScript files in `src/scripts/` to change record information
3. Update images in `src/images/` to change album covers
4. Rebuild with `npm run build` to see changes
5. Changes will be automatically deployed when pushed to main/master branch

Enjoy !!
