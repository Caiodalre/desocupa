import Anthropic from "@anthropic-ai/sdk";
import type { AIProvider, SafeUserContext, CaptureAnalysisResult } from "./provider";
import { CaptureAnalysisResultSchema } from "./provider";
import { CAPTURE_SYSTEM_PROMPT } from "./prompts/capture-system-prompt";

export class AnthropicProvider implements AIProvider {
  private client: Anthropic;

  constructor() {
    this.client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
  }

  async analyzeMentalCapture(
    input: string,
    context: SafeUserContext
  ): Promise<CaptureAnalysisResult> {
    const sanitized = this.sanitizeInput(input);

    const userMessage = JSON.stringify({
      input: sanitized,
      context: {
        locale: context.locale,
        existingCategories: context.existingCategories,
        availableTemplates: context.availableTemplates,
        publishedDeadlines: context.publishedDeadlines,
      },
    });

    const response = await this.client.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-3-5-sonnet-20241022",
      max_tokens: 1500,
      temperature: 0.3,
      system: CAPTURE_SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    const textContent = response.content
      .filter((block) => block.type === "text")
      .map((block) => (block as Anthropic.TextBlock).text)
      .join("");

    const parsed = JSON.parse(textContent);
    return CaptureAnalysisResultSchema.parse(parsed);
  }

  private sanitizeInput(input: string): string {
    let sanitized = input.slice(0, 1500);

    const patterns = [
      /\d{3}\.?\d{3}\.?\d{3}-?\d{2}/g,
      /\d{2}\.?\d{3}\.?\d{3}\/?\d{4}-?\d{2}/g,
      /\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}/g,
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    ];

    for (const pattern of patterns) {
      sanitized = sanitized.replace(pattern, "[DADO_REMOVIDO]");
    }

    return sanitized;
  }
}
