// API client for Blink402 backend
import fetch from 'node-fetch';
export class Blink402Client {
    baseUrl;
    timeout;
    constructor(baseUrl, timeout = 30000) {
        this.baseUrl = baseUrl || process.env.BLINK402_API_URL || 'https://blink402.dev/api';
        this.timeout = timeout;
    }
    /**
     * Get B402 holder tier and benefits for a wallet
     */
    async getB402Tier(wallet) {
        const response = await this.fetch(`/token/holder-info?wallet=${wallet}`);
        return response.data;
    }
    /**
     * Get discount info for a wallet and blink
     */
    async getDiscount(wallet, basePrice) {
        const response = await this.fetch(`/token/discount?wallet=${wallet}&basePrice=${basePrice}&gameType=blinks`);
        return response.data;
    }
    /**
     * List available blinks with optional filters
     */
    async listBlinks(category, limit = 20) {
        let url = `/blinks?limit=${limit}`;
        if (category) {
            url += `&category=${encodeURIComponent(category)}`;
        }
        const response = await this.fetch(url);
        return response.data;
    }
    /**
     * Get a specific blink by slug
     */
    async getBlink(slug) {
        const response = await this.fetch(`/blinks/${slug}`);
        return response.data;
    }
    /**
     * Execute a blink (payment-gated API call)
     * Note: This requires the user to have a connected wallet and sign transactions
     * For MCP server, we'll return instructions instead of executing directly
     */
    async executeBlink(slug, params) {
        const response = await this.fetch(`/bazaar/${slug}`, {
            method: 'POST',
            body: JSON.stringify(params),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    }
    /**
     * Buy B402 tokens via PumpPortal
     * Returns transaction information
     */
    async buyB402(amountSol, wallet) {
        const response = await this.fetch('/pumpportal/buy-b402', {
            method: 'POST',
            body: JSON.stringify({
                amountSol,
                wallet
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response;
    }
    /**
     * Helper method to make API requests
     */
    async fetch(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), this.timeout);
        try {
            const response = await fetch(url, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(timeout);
            if (!response.ok) {
                const error = await response.text();
                throw new Error(`API error (${response.status}): ${error}`);
            }
            return await response.json();
        }
        catch (error) {
            clearTimeout(timeout);
            if (error.name === 'AbortError') {
                throw new Error('API request timeout');
            }
            throw error;
        }
    }
}
