const https = require('https');
const fs = require('fs');
const path = require('path');

const urls = [
  'https://upload.wikimedia.org/wikipedia/commons/c/cb/Samosachutney.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/5/5a/Hyderabadi_Chicken_Biryani.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/2/2e/Indian_thali_at_a_restaurant_in_Delhi.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/9/91/Indian_Pickles.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/f/fa/Spices_in_an_Indian_market.jpg'
];

const dir = path.join(__dirname, 'public', 'images', 'placeholders');
fs.mkdirSync(dir, { recursive: true });

urls.forEach((u, i) => {
  https.get(u, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
    if (res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302) {
      if (res.statusCode === 301 || res.statusCode === 302) {
        https.get(res.headers.location, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res2) => {
           res2.pipe(fs.createWriteStream(path.join(dir, `food-${i+1}.jpg`)));
        });
      } else {
        res.pipe(fs.createWriteStream(path.join(dir, `food-${i+1}.jpg`)));
      }
      console.log(`Downloaded food-${i+1}.jpg`);
    } else {
      console.log('Failed', u, res.statusCode);
    }
  }).on('error', console.error);
});
