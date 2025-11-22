import type { Blink, B402TierInfo, DiscountInfo } from './types.js';
export declare class Blink402Client {
    private baseUrl;
    private timeout;
    constructor(baseUrl?: string, timeout?: number);
    /**
     * Get B402 holder tier and benefits for a wallet
     */
    getB402Tier(wallet: string): Promise<B402TierInfo>;
    /**
     * Get discount info for a wallet and blink
     */
    getDiscount(wallet: string, basePrice: number): Promise<DiscountInfo>;
    /**
     * List available blinks with optional filters
     */
    listBlinks(category?: string, limit?: number): Promise<Blink[]>;
    /**
     * Get a specific blink by slug
     */
    getBlink(slug: string): Promise<Blink>;
    /**
     * Execute a blink (payment-gated API call)
     * Note: This requires the user to have a connected wallet and sign transactions
     * For MCP server, we'll return instructions instead of executing directly
     */
    executeBlink(slug: string, params: Record<string, any>): Promise<unknown>;
    /**
     * Buy B402 tokens via PumpPortal
     * Returns transaction information
     */
    buyB402(amountSol: number, wallet: string): Promise<unknown>;
    /**
     * Helper method to make API requests
     */
    private fetch;
}
