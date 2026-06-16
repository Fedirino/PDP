const https = require("https");

function anthropicRequest(apiKey, body) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(body);
    const options = {
      hostname: "api.anthropic.com",
      path: "/v1/messages",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(data),
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
    };
    const req = https.request(options, (res) => {
      let raw = "";
      res.on("data", (chunk) => { raw += chunk; });
      res.on("end", () => resolve({ status: res.statusCode, body: raw }));
    });
    req.on("error", (e) => reject(e));
    req.setTimeout(25000, () => { req.destroy(new Error("Timed out waiting for Anthropic (25s)")); });
    req.write(data);
    req.end();
  });
}

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (event.httpMethod === "OPTIONS") return { statusCode: 204, headers, body: "" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ error: { type: "method_not_allowed", message: "Use POST." } }) };
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: { type: "config_error", message: "ANTHROPIC_API_KEY not set in Netlify environment variables." } }) };
  }

  let payload;
  try { payload = JSON.parse(event.body || "{}"); }
  catch (e) { return { statusCode: 400, headers, body: JSON.stringify({ error: { type: "bad_request", message: "Body was not valid JSON." } }) }; }

  if (!payload.messages || !Array.isArray(payload.messages)) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: { type: "bad_request", message: "Missing messages array." } }) };
  }

  const body = {
    model: payload.model || "claude-sonnet-4-6",
    max_tokens: Math.min(payload.max_tokens || 4096, 8192),
    messages: payload.messages,
  };

  try {
    const result = await anthropicRequest(apiKey, body);
    // Pass Anthropic's response straight through — status and body unchanged.
    // This includes 401 (bad key), 429 (rate limit), 500, etc.
    return { statusCode: result.status, headers, body: result.body };
  } catch (e) {
    // Network-level failure (DNS, timeout, connection refused)
    const msg = e && e.message ? e.message : "Unknown network error";
    return {
      statusCode: 502,
      headers,
      body: JSON.stringify({ error: { type: "upstream_error", message: msg } }),
    };
  }
};
