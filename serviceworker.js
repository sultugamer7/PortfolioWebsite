//set up cache name and files to add to it
const CACHE_NAME = 'sultan-portfolio-site-v1';
const CACHE_URLS = [
    'index.html',
    'education.html',
    'contact.html',
    'skills.html',
    'guess.html',
    'hangman.html',
    'images/contact.svg',
    'images/contact-1x.jpg',
    'images/contact-2x.jpg',
    'images/contact-4x.jpg',
    'images/contact-big-1x.webp',
    'images/contact-big-2x.webp',
    'images/contact-big-4x.webp',
    'images/contact-medium-1x.webp',
    'images/contact-medium-2x.webp',
    'images/contact-medium-4x.webp',
    'images/contact-small-1x.webp',
    'images/contact-small-2x.webp',
    'images/contact-small-4x.webp',
    'images/down.svg',
    'images/education.svg',
    'images/education-1x.jpg',
    'images/education-2x.jpg',
    'images/education-4x.jpg',
    'images/education-big-1x.webp',
    'images/education-big-2x.webp',
    'images/education-big-4x.webp',
    'images/education-medium-1x.webp',
    'images/education-medium-2x.webp',
    'images/education-medium-4x.webp',
    'images/education-small-1x.webp',
    'images/education-small-2x.webp',
    'images/education-small-4x.webp',
    'images/facebook.svg',
    'images/github.svg',
    'images/hangman-0.jpg',
    'images/hangman-1.jpg',
    'images/hangman-1x.jpg',
    'images/hangman-2.jpg',
    'images/hangman-2x.jpg',
    'images/hangman-3.jpg',
    'images/hangman-4.jpg',
    'images/hangman-4x.jpg',
    'images/hangman-5.jpg',
    'images/hangman-6.jpg',
    'images/hangman-7.jpg',
    'images/hangman-8.jpg',
    'images/hangman-big-1x.webp',
    'images/hangman-big-2x.webp',
    'images/hangman-big-4x.webp',
    'images/hangmanGame.jpg',
    'images/hangmanGameWon.jpg',
    'images/hangman-medium-1x.webp',
    'images/hangman-medium-2x.webp',
    'images/hangman-medium-4x.webp',
    'images/hangman-small-1x.webp',
    'images/hangman-small-2x.webp',
    'images/hangman-small-4x.webp',
    'images/home.svg',
    'images/instagram.svg',
    'images/linkedin.svg',
    'images/logo.jpg',
    'images/myPic-1x.jpg',
    'images/myPic-2x.jpg',
    'images/myPic-4x.jpg',
    'images/myPic-big-1x.webp',
    'images/myPic-big-2x.webp',
    'images/myPic-big-4x.webp',
    'images/myPic-medium-1x.webp',
    'images/myPic-medium-2x.webp',
    'images/myPic-medium-4x.webp',
    'images/myPic-small-1x.webp',
    'images/myPic-small-2x.webp',
    'images/myPic-small-4x.webp',
    'images/number-1x.jpg',
    'images/number-2x.jpg',
    'images/number-4x.jpg',
    'images/number-big-1x.webp',
    'images/number-big-2x.webp',
    'images/number-big-4x.webp',
    'images/number-medium-1x.webp',
    'images/number-medium-2x.webp',
    'images/number-medium-4x.webp',
    'images/number-small-1x.webp',
    'images/number-small-2x.webp',
    'images/number-small-4x.webp',
    'images/right.svg',
    'images/skills.svg',
    'images/technology-1x.jpg',
    'images/technology-2x.jpg',
    'images/technology-4x.jpg',
    'images/technology-big-1x.webp',
    'images/technology-big-2x.webp',
    'images/technology-big-4x.webp',
    'images/technology-medium-1x.webp',
    'images/technology-medium-2x.webp',
    'images/technology-medium-4x.webp',
    'images/technology-small-1x.webp',
    'images/technology-small-2x.webp',
    'images/technology-small-4x.webp',
    'scripts/guess.js',
    'scripts/hangman.js',
    'styles/normalize.css',
    'styles/style.css',
    '404.html',
    'android-chrome-192x192.png',
    'android-chrome-512x512.png',
    'apple-touch-icon.png',
    'browserconfig.xml',
    'favicon.ico',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'manifest.json',
    'mstile-150x150.png',
    'phrases.json',
    'safari-pinned-tab.svg',
];


//set up cache and files to add to it
//...

//add all URLs to cache when installed
self.addEventListener("install", function (event) {
    console.log("Service worker installed");
    event.waitUntil(
        //create and open cache
        caches.open(CACHE_NAME)
            .then(function (cache) {
                console.log("Cache opened");
                //add all URLs to cache
                return cache.addAll(CACHE_URLS);
            })
    );
});



//On activate update the cache with the new version and clean out old caches
self.addEventListener('activate', function (event) {
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    if (cacheName.startsWith('sultan-portfolio-site-') && CACHE_NAME !== cacheName) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});



//add all URLs to cache when installed
//...
//user has navigated to page - fetch required assets
self.addEventListener("fetch", function (event) {
    event.respondWith(
        caches.match(event.request).then(function (response) {
            //check whether asset is in cache
            if (response) {
                //asset in cache, so return it
                console.log(`Return ${event.request.url} from cache`);
                return response;
            }
            //asset not in cache so fetch asset from network
            console.log(`Fetch ${event.request.url} from network`);
            return fetch(event.request);
        })
    );
});
