const fs = require('fs');
const path = require('path');

async function listModels() {
    // Load Env manually
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

    const key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.error("No API Key found in backend/.env!");
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

listModels();
