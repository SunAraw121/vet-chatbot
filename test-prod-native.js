async function testChat() {
    try {
        console.log("Testing POST to https://vet-chatbot-backend.onrender.com/api/chat...");
        const res = await fetch('https://vet-chatbot-backend.onrender.com/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Can I give my dog chocolate?', sessionId: 'test-script-native' })
        });
        const data = await res.json();
        console.log('STATUS:', res.status);
        console.log('BODY:', JSON.stringify(data, null, 2));
    } catch (e) {
        console.error('ERROR:', e);
    }
}

testChat();
