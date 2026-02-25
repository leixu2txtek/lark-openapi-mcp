/**
 * Parse a single header string like "Key: Value" into a key-value pair.
 * Splits on the first colon only, so values can contain colons.
 */
function parseHeaderString(header: string): Record<string, string> {
  const colonIndex = header.indexOf(':');
  if (colonIndex === -1) return {};
  const key = header.substring(0, colonIndex).trim();
  const value = header.substring(colonIndex + 1).trim();
  if (!key) return {};
  return { [key]: value };
}

/**
 * Parse headers from various input formats into a Record<string, string>.
 *
 * Supported formats:
 * - Object: { "Key": "Value" } (from config JSON)
 * - Array of strings: ["Key: Value", "Key2: Value2"] (from CLI --header)
 * - JSON string: '{"Key":"Value"}' (from env variable)
 * - Single header string: "Key: Value"
 */
export function parseHeaders(input?: string | string[] | Record<string, string>): Record<string, string> {
  if (!input) return {};

  // If it's already an object (e.g., from config JSON), return it
  if (typeof input === 'object' && !Array.isArray(input)) {
    return input;
  }

  // If it's a string, try parsing as JSON first, then treat as a single header
  if (typeof input === 'string') {
    try {
      const parsed = JSON.parse(input);
      if (typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed;
      }
    } catch {
      // Not JSON, treat as a single header string
    }
    return parseHeaderString(input);
  }

  // If it's an array of strings
  const result: Record<string, string> = {};
  for (const item of input) {
    Object.assign(result, parseHeaderString(item));
  }
  return result;
}
