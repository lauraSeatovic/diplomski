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

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return json({ error: "Missing Supabase env variables" }, 500);
    }

    const body = await req.json();
    const trening = body?.trening || {};
    const vrsta = body?.vrsta || null;

    const bad = (msg: string) => json({ error: msg }, 400);

    
    let needsCreateVrsta = false;
    if (!trening.IdVrTreninga) {
      if (!vrsta) return bad("Missing vrsta object when IdVrTreninga is not provided");
      if (!vrsta.NazivVrTreninga || typeof vrsta.NazivVrTreninga !== "string") {
        return bad("NazivVrTreninga is required and must be a string");
      }
      if (typeof vrsta.Tezina !== "number" || !Number.isInteger(vrsta.Tezina)) {
        return bad("Tezina must be an integer");
      }
      if (vrsta.Tezina < 1 || vrsta.Tezina > 10) {
        return bad("Tezina must be between 1 and 10");
      }
      needsCreateVrsta = true;
    }

    
    const IdTreninga = trening.IdTreninga || crypto.randomUUID();

    
    const IdVrTreninga =
      trening.IdVrTreninga || (needsCreateVrsta ? crypto.randomUUID() : null);

    
    let createdVrsta: any = null;
    if (needsCreateVrsta) {
      const vrstaPayload = { ...vrsta, IdVrTreninga };

      const resVr = await fetch(`${SUPABASE_URL}/rest/v1/VrstaTreninga`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: SUPABASE_SERVICE_ROLE_KEY,
          Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
          Prefer: "return=representation",
        },
        body: JSON.stringify(vrstaPayload),
      });

      const dataVr = await resVr.json();
      if (!resVr.ok) {
        return json(
          { error: "Insert VrstaTreninga failed", details: dataVr },
          resVr.status
        );
      }
      createdVrsta = dataVr[0] ?? null;
    }

    
    const treningPayload = { ...trening, IdTreninga, IdVrTreninga: IdVrTreninga };

    const resTr = await fetch(`${SUPABASE_URL}/rest/v1/Trening`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=representation",
      },
      body: JSON.stringify(treningPayload),
    });

    const dataTr = await resTr.json();

    if (!resTr.ok) {
      
      if (createdVrsta && IdVrTreninga) {
        try {
          await fetch(
            `${SUPABASE_URL}/rest/v1/VrstaTreninga?IdVrTreninga=eq.${encodeURIComponent(
              IdVrTreninga
            )}`,
            {
              method: "DELETE",
              headers: {
                apikey: SUPABASE_SERVICE_ROLE_KEY,
                Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              },
            }
          );
        } catch (e) {
          
        }
      }

      return json({ error: "Insert Trening failed", details: dataTr }, resTr.status);
    }

    const createdTrening = dataTr[0] ?? null;

    return json({ trening: createdTrening, vrsta: createdVrsta }, 201);
  } catch (err: any) {
    return json(
      { error: "Internal error", details: err?.message ?? "Unknown error" },
      500
    );
  }
});
