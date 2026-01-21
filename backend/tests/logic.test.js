import { detectIntent } from '../src/utils/intentDetector.js';
import { describe, it, expect } from '@jest/globals';

describe('Intent Detector', () => {
    it('should detect appointment intent', () => {
        const inputs = [
            "I want to book an appointment",
            "schedule a visit",
            "need to see a vet",
            "book appointment"
        ];
        inputs.forEach(input => {
            expect(detectIntent(input)).toBe("BOOK_APPOINTMENT");
        });
    });

    it('should detect general query intent', () => {
        const inputs = [
            "What do dogs eat?",
            "My cat is vomiting",
            "Why is the sky blue?",
            "Hello"
        ];
        inputs.forEach(input => {
            expect(detectIntent(input)).toBe("GENERAL_QUERY");
        });
    });
});
