const fs = require('fs');
const path = require('path');

if (fs.existsSync('.env.local')) {
  fs.readFileSync('.env.local', 'utf8').split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      let val = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = val;
    }
  });
}

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const IMAGES_TO_UPLOAD = [
  // Hero Desktop
  'picklecartimg1.png',
  'picklecartimg2.png',
  'picklecartimg3.png',
  'picklecartimg4.png',
  'picklecartimg5.png',

  // Hero Mobile
  'mobileimg1.png',
  'mobileimg2.png',
  'mobileimg3.png',
  'mobileimg4.png',
  'mobileimg5.png',

  // Regions Home Cards
  'AndhraPradeshregionhome.png',
  'Telanganaregionhome.png',
  'karnatakaregionhome.png',
  'Tamilnaduregionhome.png',
  'NorthIndia.png',

  // Page Backgrounds & Hero Banners
  'aboutuspagebackground.png',
  'bulkorderhomebackgroundimage.png',
  'contactusbackground.png',
  'northindianpagebackground.png',
  'southindianpagebackground.png',

  // About & Story Sections
  'Traditional Pickle Jar Display.png',
  'PickleCart Andhra Traditions.png',
  'Picklecart Jar Display Shelf.png',
  'Overhead Pickle Jar Market Display.png',
  'shopPhoto.png',

  // Story Directory
  'images/story/ingredients.jpg',
  'images/story/preparation.jpg',
  'images/story/spicing.jpg',
  'images/story/final.jpg',
  'images/hero/hero-5.png',

  // Placeholders
  'images/placeholders/food-1.jpg',
  'images/placeholders/gongura.jpg',
  'images/placeholders/millet.jpg',
  'images/placeholders/mutton.jpg',
  'images/placeholders/oil.jpg',
  'images/placeholders/pickle.jpg',
  'images/placeholders/snack.jpg',
  'images/placeholders/sweet.jpg',

  // Logos
  'logo.png',
  'footerlogo.png',
  'razorpay-icon.png',

  // Regional extras and heroes
  'AndhraPradesh.png',
  'Telangana.png',
  'Karnataka.jpeg',
  'Tamilnadu.jpeg',
  'images/hero/hero-1.png',
  'images/hero/hero-2.jpg',
  'images/hero/hero-3.jpg',
  'images/hero/hero-4.jpg',
  'Picklecart Favicon.png',
  'favicon.png'
];

async function uploadAll() {
  console.log(`Starting Cloudinary upload for ${IMAGES_TO_UPLOAD.length} images...`);
  const outputPath = path.join('src', 'lib', 'cloudinary-map.json');
  let mapping = {};
  if (fs.existsSync(outputPath)) {
    mapping = JSON.parse(fs.readFileSync(outputPath, 'utf8'));
  }

  for (let i = 0; i < IMAGES_TO_UPLOAD.length; i++) {
    const relPath = IMAGES_TO_UPLOAD[i];
    const fullPath = path.join('public', relPath);

    if (mapping['/' + relPath.replace(/\\/g, '/')]) {
      console.log(`[Skip] Already uploaded: ${relPath}`);
      continue;
    }

    if (!fs.existsSync(fullPath)) {
      console.warn(`[Skip] File not found: ${fullPath}`);
      continue;
    }

    const cleanName = path.parse(relPath).name.replace(/[^a-zA-Z0-9_-]/g, '_');

    try {
      console.log(`[${i + 1}/${IMAGES_TO_UPLOAD.length}] Uploading ${relPath}...`);
      const result = await cloudinary.uploader.upload(fullPath, {
        folder: 'picklecart_assets',
        public_id: cleanName,
        overwrite: true,
        resource_type: 'image'
      });

      // Inject automatic format and quality optimization
      const optimizedUrl = result.secure_url.replace('/image/upload/', '/image/upload/f_auto,q_auto/');
      
      mapping['/' + relPath.replace(/\\/g, '/')] = optimizedUrl;
      mapping[relPath.replace(/\\/g, '/')] = optimizedUrl;
      // Also map basename without slash
      mapping[path.basename(relPath)] = optimizedUrl;
      mapping['/' + path.basename(relPath)] = optimizedUrl;

      console.log(`  -> Success: ${optimizedUrl}`);
    } catch (err) {
      console.error(`  -> Failed to upload ${relPath}:`, err.message);
    }
  }

  fs.writeFileSync(outputPath, JSON.stringify(mapping, null, 2), 'utf8');
  console.log(`\nAll done! Successfully saved mapping to ${outputPath}`);
}

uploadAll().catch(console.error);
