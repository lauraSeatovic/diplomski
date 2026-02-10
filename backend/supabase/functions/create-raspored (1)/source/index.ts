import { v4 as uuidv4 } from "npm:uuid@9.0.0";

console.info("create-raspored function starting");

Deno.serve(async (req: Request) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  if (req.method === "OPTIONS") {
    console.log("Handling OPTIONS preflight");
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return json({ error: "Method not allowed" }, 405);
    }

    const body = await req.json();
    const r = body?.raspored ?? body;

    if (!r) {
      return json({ error: "Missing raspored object" }, 400);
    }

    const { IdRasporeda, IdTreninga, PocetakVrijeme, ZavrsetakVrijeme, IdTrenera } = r;

    if (!IdTreninga || !PocetakVrijeme || !ZavrsetakVrijeme || !IdTrenera) {
      return json(
        { error: "Required fields: IdTreninga, PocetakVrijeme, ZavrsetakVrijeme, IdTrenera" },
        400
      );
    }

    const start = new Date(PocetakVrijeme);
    const end = new Date(ZavrsetakVrijeme);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return json({ error: "Invalid datetime format" }, 400);
    }

    if (start >= end) {
      return json({ error: "Pocetak must be before Zavrsetak" }, 400);
    }

    const id = IdRasporeda || uuidv4();

    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    if (!supabaseUrl) {
      return json({ error: "SUPABASE_URL not set in environment" }, 500);
    }

    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!serviceKey) {
      return json({ error: "SUPABASE_SERVICE_ROLE_KEY not set in environment" }, 500);
    }

    const insertBody = [
      {
        IdRasporeda: id,
        IdTreninga,
        PocetakVrijeme: start.toISOString(),
        ZavrsetakVrijeme: end.toISOString(),
        IdTrenera,
      },
    ];

    const res = await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/Raspored`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: serviceKey,
        Authorization: `Bearer ${serviceKey}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(insertBody),
    });

    const text = await res.text();

    
    if (!res.ok) {
      
      return new Response(text, {
        status: res.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(text, {
      status: 201,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error(err);
    return json({ error: err?.message ?? "Unknown error" }, 500);
  }
});
