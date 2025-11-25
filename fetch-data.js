import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Setup for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_URL = 'http://127.0.0.1:3001/stats';
const REGIONS = ['na', 'eu', 'ap', 'la', 'br', 'kr', 'cn', 'jp', 'oce', 'mn', 'gc'];
const OUTPUT_DIR = path.join(__dirname, 'public', 'data');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)){
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function fetchData() {
    console.log("🚀 Starting data snapshot...");
    console.log(`Target: ${OUTPUT_DIR}`);

    for (const region of REGIONS) {
        try {
            const url = `${API_URL}?region=${region}&timespan=90`;
            console.log(`\nFetching ${region.toUpperCase()}...`);
            
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            const data = await response.json();
            
            // Save to file
            const filePath = path.join(OUTPUT_DIR, `${region}.json`);
            fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
            
            console.log(`✅ Saved ${region}.json`);
        } catch (error) {
            console.error(`❌ Error fetching ${region}:`, error.message);
            // Create empty fallback file so app doesn't crash
            const filePath = path.join(OUTPUT_DIR, `${region}.json`);
            fs.writeFileSync(filePath, JSON.stringify({ data: { segments: [] } }));
        }
    }
    console.log("\n✨ Snapshot complete! You can now deploy to Vercel.");
}

fetchData();