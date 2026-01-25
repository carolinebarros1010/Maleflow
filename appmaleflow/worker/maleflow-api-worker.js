export default {
  async fetch(request, env, ctx) {
    const GAS_URL =
      env.GAS_URL ||
      "https://script.google.com/macros/s/AKfycbxPwSQqmrJiDX5299PdgXHd97r1tqvig2jgLP65EXXviKT0YwTL8CcxXsEzQTZTCepV/exec";

    const WORKER_ID = env.WORKER_ID || "maleflow-api";

    // Se true, força tudo a virar POST (inclusive GET)
    const FORCE_POST = env.FORCE_POST === "true";

    // Lista (separada por vírgula) de actions que DEVEM permanecer GET
    // Ex: "validar,status,health"
    const GET_ACTIONS = new Set(
      String(env.GET_ACTIONS || "")
        .split(",")
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean)
    );

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
    if (subpath) targetUrl.searchParams.set("path", subpath);

    const actionFromQuery =
      incomingUrl.searchParams.get("action") ||
      incomingUrl.searchParams.get("acao") ||
      "";

    const derivedAction = String(actionFromQuery || firstSegment || "")
      .toLowerCase()
      .trim();

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

    // Decide se deve forçar POST
    const actionWantsGet = derivedAction && GET_ACTIONS.has(derivedAction);
    const shouldForcePost =
      FORCE_POST || (method === "GET" && !actionWantsGet);

    if (shouldForcePost) {
      method = "POST";

      // Monta payload que seu parseBody_ entende (JSON)
      const payload = {
        ...(derivedAction ? { action: derivedAction } : {}),
        ...Object.fromEntries(incomingUrl.searchParams.entries()),
        ...(subpath ? { path: subpath } : {}),
        __via: "worker",
        __originalMethod: request.method
      };

      if (bodyObj && typeof bodyObj === "object") {
        Object.assign(payload, bodyObj);
      }

      headers.set("Content-Type", "application/json; charset=utf-8");
      bodyText = JSON.stringify(payload);
    } else if (bodyObj && typeof bodyObj === "object") {
      // Mantém método original e só injeta action/path se faltar
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

    // Preserva o status real do upstream (melhor para debug)
    const status = upstream.status;

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
  const requestMethod = request.headers.get("Access-Control-Request-Method");

  const allowHeaders = requestHeaders || "Content-Type, Authorization";

  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": allowHeaders,
    "Access-Control-Max-Age": "86400",
    Vary: [
      "Origin",
      "Access-Control-Request-Headers",
      "Access-Control-Request-Method"
    ].join(", "),
    ...(requestMethod ? { "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,OPTIONS" } : {})
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
