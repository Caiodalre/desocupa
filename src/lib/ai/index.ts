import { AnthropicProvider } from "./anthropic-provider";
import type { AIProvider } from "./provider";

let provider: AIProvider | null = null;

export function getAIProvider(): AIProvider {
  if (!provider) {
    provider = new AnthropicProvider();
  }
  return provider;
}

export function isAIConfigured(): boolean {
  return !!process.env.ANTHROPIC_API_KEY;
}
