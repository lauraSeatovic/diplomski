Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Method not allowed" }),
        {
          status: 405,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const body = await req.json().catch(() => null);
    const rasporedId = body?.raspored_id;
    const updates = body?.updates;

    if (!rasporedId || !Array.isArray(updates) || updates.length === 0) {
      return new Response(
        JSON.stringify({
          error: "Missing body params: raspored_id and updates[]",
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SERVICE_KEY) {
      return new Response(
        JSON.stringify({ error: "Supabase env not set" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    let updated = 0;

    for (const u of updates) {
      if (!u?.sportas_id || typeof u.dolazak !== "boolean") continue;

      const patchUrl =
        `${SUPABASE_URL}/rest/v1/Prijava` +
        `?IdRasporeda=eq.${encodeURIComponent(rasporedId)}` +
        `&IdSportasa=eq.${encodeURIComponent(u.sportas_id)}`;

      const patchResp = await fetch(patchUrl, {
        method: "PATCH",
        headers: {
          apikey: SERVICE_KEY,
          Authorization: `Bearer ${SERVICE_KEY}`,
          "Content-Type": "application/json",
          Prefer: "return=minimal",
        },
        body: JSON.stringify({
          DolazakNaTrening: u.dolazak,
        }),
      });

      if (patchResp.ok) {
        updated += 1;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        updated,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({
        error: err?.message ?? "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
