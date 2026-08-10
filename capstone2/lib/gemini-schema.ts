const unsupportedSchemaKeywords = new Set(["$schema", "minLength", "maxLength"]);

function stripUnsupportedKeywords(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(stripUnsupportedKeywords);
  if (!value || typeof value !== "object") return value;

  return Object.fromEntries(
    Object.entries(value)
      .filter(([key]) => !unsupportedSchemaKeywords.has(key))
      .map(([key, item]) => [key, stripUnsupportedKeywords(item)]),
  );
}

export function toGeminiResponseSchema(schema: Record<string, unknown>): Record<string, unknown> {
  return stripUnsupportedKeywords(schema) as Record<string, unknown>;
}
