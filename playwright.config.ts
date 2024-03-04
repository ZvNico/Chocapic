import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: 'end_to_end_tests',
    use: {
        headless: false,
    }
});