export default {
  async fetch(request, env, ctx) {
    const GAS_URL =
      "https://script.google.com/macros/s/AKfycbxPwSQqmrJiDX5299PdgXHd97r1tqvig2jgLP65EXXviKT0YwTL8CcxXsEzQTZTCepV/exec";

    const WORKER_ID = env.WORKER_ID || "maleflow-api";
    const FORCE_POST = env.FORCE_POST === "true";

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: withDebug(corsHeaders(request), WORKER_ID)
      });
    }

    const incomingUrl = new URL(request.url);
    const subpath = incomingUrl.pathname.replace(/^\/api\/?/, "");
    const firstSegment = subpath ? subpath.split("/")[0] : "";

    const targetUrl = new URL(GAS_URL);
    incomingUrl.searchParams.forEach((value, key) => {
      targetUrl.searchParams.set(key, value);
    });

    if (subpath) {
      targetUrl.searchParams.set("path", subpath);
    }

    const actionFromQuery =
      incomingUrl.searchParams.get("action") ||
      incomingUrl.searchParams.get("acao") ||
      "";

    const derivedAction = (actionFromQuery || firstSegment || "").toLowerCase().trim();

    let method = request.method.toUpperCase();
    const headers = new Headers();
    headers.set("Accept", "application/json");

    const auth = request.headers.get("authorization");
    if (auth) headers.set("Authorization", auth);

    let bodyText = "";
    let bodyObj = null;

    if (method !== "GET" && method !== "HEAD") {
      bodyText = await request.text();
      if (bodyText) {
        try {
          bodyObj = JSON.parse(bodyText);
        } catch {
          bodyObj = null;
        }
      }
    }

    const shouldForcePost = FORCE_POST || method === "GET";

    if (shouldForcePost) {
      method = "POST";
      const payload = {
        action: derivedAction || "",
        ...Object.fromEntries(incomingUrl.searchParams.entries()),
        path: subpath || "",
        __via: "worker",
        __originalMethod: request.method
      };

      if (bodyObj && typeof bodyObj === "object") {
        Object.assign(payload, bodyObj);
      }

      headers.set("Content-Type", "application/json; charset=utf-8");
      bodyText = JSON.stringify(payload);
    } else if (bodyObj && typeof bodyObj === "object") {
      if (!bodyObj.action && derivedAction) bodyObj.action = derivedAction;
      if (!bodyObj.path && subpath) bodyObj.path = subpath;
      bodyText = JSON.stringify(bodyObj);
      headers.set("Content-Type", "application/json; charset=utf-8");
    } else {
      const reqCT = request.headers.get("content-type");
      if (reqCT) headers.set("Content-Type", reqCT);
    }

    let upstream;
    try {
      upstream = await fetch(targetUrl.toString(), {
        method,
        headers,
        body: method === "GET" || method === "HEAD" ? null : bodyText,
        redirect: "follow",
        cf: { timeout: 15 }
      });
    } catch (err) {
      return json(
        {
          ok: false,
          error: "gas_unreachable",
          message: "Não foi possível conectar ao Google Apps Script",
          details: String(err)
        },
        502,
        request,
        WORKER_ID
      );
    }

    const upstreamText = await upstream.text();
    let payload;

    try {
      payload = JSON.parse(upstreamText);
    } catch {
      payload = {
        ok: false,
        error: "non_json_from_backend",
        status: upstream.status,
        message: "O backend retornou conteúdo não-JSON (provavelmente HTML).",
        raw: upstreamText.slice(0, 4000)
      };
    }

    const status = upstream.ok ? 200 : upstream.status;

    return new Response(JSON.stringify(payload), {
      status,
      headers: withDebug(
        {
          ...corsHeaders(request),
          "Content-Type": "application/json; charset=utf-8"
        },
        WORKER_ID
      )
    });
  }
};

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "*";
  const requestHeaders = request.headers.get("Access-Control-Request-Headers");
  const allowHeaders = requestHeaders || "Content-Type, Authorization";

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": allowHeaders,
    "Access-Control-Max-Age": "86400",
    Vary: "Origin"
  };
}

function withDebug(headersObj, workerId) {
  return { ...headersObj, "X-Worker": workerId };
}

function json(obj, status, request, workerId) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: withDebug(
      {
        ...corsHeaders(request),
        "Content-Type": "application/json; charset=utf-8"
      },
      workerId
    )
  });
}
