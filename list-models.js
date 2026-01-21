const fetch = require('node-fetch');

async function listModels() {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("No API Key found in env!");
        return;
    }

    // Try v1beta first as it's most likely to have newer models
    const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${key}`;

    console.log(`Checking models at: ${url.replace(key, 'HIDDEN_KEY')}`);

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.error) {
            console.error("API Error:", JSON.stringify(data.error, null, 2));
        } else {
            console.log("✅ AVAILABLE MODELS:");
            (data.models || []).forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes("generateContent")) {
                    console.log(`- ${m.name}`);
                }
            });
        }
    } catch (e) {
        console.error("Request Failed:", e.message);
    }
}

// Mock env for local run if needed, but we rely on system env in Render context
// For this script to run locally we need the key. I will assume it's in the .env file or environment.
// Since I can't easily read the .env and inject it here without dotenv, I'll rely on the user having it or reading it from the file.

// Actually, let's try to read .env manually to be safe for local execution.
const fs = require('fs');
const path = require('path');
try {
    const envPath = path.resolve(__dirname, 'backend/.env');
    if (fs.existsSync(envPath)) {
        const envConfig = fs.readFileSync(envPath, 'utf8');
        envConfig.split('\n').forEach(line => {
            const [k, v] = line.split('=');
            if (k && v) process.env[k.trim()] = v.trim();
        });
    }
} catch (e) { }

listModels();
