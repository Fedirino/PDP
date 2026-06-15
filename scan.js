// Netlify Function: /api/scan
// Proxies Produce Department Portal scan requests to the Anthropic Messages API.
// The API key lives ONLY here (set as an environment variable in Netlify),
// never in the client bundle. The frontend POSTs {model, max_tokens, messages}
// and receives the raw Anthropic response back unchanged.

exports.handler = async (event) => {
  // CORS / preflight (same-origin in practice, but harmless to allow)
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 204, headers, body: "" };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: { type: "method_not_allowed", message: "Use POST." } }),
    };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: {
          type: "config_error",
          message: "Server is missing ANTHROPIC_API_KEY. Set it in Netlify → Site settings → Environment variables.",
        },
      }),
    };
  }

  // Parse + lightly validate the incoming body.
  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch (e) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: { type: "bad_request", message: "Body was not valid JSON." } }),
    };
  }
  if (!payload.messages || !Array.isArray(payload.messages)) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: { type: "bad_request", message: "Missing messages array." } }),
    };
  }

  // Forward to Anthropic. Cap max_tokens defensively.
  const body = {
    model: payload.model || "claude-sonnet-4-6",
    max_tokens: Math.min(payload.max_tokens || 4096, 8192),
    messages: payload.messages,
  };

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(body),
    });

    const text = await upstream.text(); // pass through verbatim
    return {
      statusCode: upstream.status,
      headers,
      body: text,
    };
  } catch (e) {
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({
        error: { type: "upstream_error", message: "Could not reach Anthropic: " + (e && e.message ? e.message : "unknown") },
      }),
    };
  }
};
