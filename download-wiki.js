const https = require('https');
const fs = require('fs');
const path = require('path');

const items = [
  { name: 'pickle', title: 'South_Asian_pickle' },
  { name: 'podi', title: 'Idli_podis' }, // Or Idli
  { name: 'gongura', title: 'Gongura' },
  { name: 'chicken', title: 'Chicken_curry' },
  { name: 'mutton', title: 'Mutton_curry' },
  { name: 'snack', title: 'Murukku' },
  { name: 'oil', title: 'Sesame_oil' },
  { name: 'millet', title: 'Millet' },
  { name: 'sweet', title: 'Laddu' }
];

const dir = path.join(__dirname, 'public', 'images', 'placeholders');
fs.mkdirSync(dir, { recursive: true });

items.forEach(item => {
  const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&titles=${item.title}&prop=pageimages&format=json&pithumbsize=800`;
  
  https.get(apiUrl, { headers: { 'User-Agent': 'PickleCart-Dev/1.0' } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(data);
        const pages = json.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pageId !== '-1' && pages[pageId].thumbnail) {
          const imgUrl = pages[pageId].thumbnail.source;
          console.log(`Found image for ${item.name}: ${imgUrl}`);
          
          https.get(imgUrl, { headers: { 'User-Agent': 'PickleCart-Dev/1.0' } }, (imgRes) => {
            imgRes.pipe(fs.createWriteStream(path.join(dir, `${item.name}.jpg`)));
            console.log(`Downloaded ${item.name}.jpg`);
          });
        } else {
          console.log(`No image found for ${item.name}`);
        }
      } catch (e) {
        console.log('Error parsing JSON for', item.name, e.message);
      }
    });
  }).on('error', console.error);
});
