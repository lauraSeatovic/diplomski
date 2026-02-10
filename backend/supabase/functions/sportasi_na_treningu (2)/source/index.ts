Deno.serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const rasporedId = url.searchParams.get("raspored_id");

    if (!rasporedId) {
      return new Response(
        JSON.stringify({ error: "Missing query param: raspored_id" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return new Response(
        JSON.stringify({ error: "Supabase environment variables not set" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    
    const prijavaUrl =
      `${SUPABASE_URL}/rest/v1/Prijava` +
      `?select=IdPrijave,IdSportasa,DolazakNaTrening,OcjenaTreninga` +
      `&IdRasporeda=eq.${encodeURIComponent(rasporedId)}`;

    const pResp = await fetch(prijavaUrl, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: "application/json",
      },
    });

    if (!pResp.ok) {
      const text = await pResp.text();
      return new Response(
        JSON.stringify({ error: "Failed fetching Prijava", details: text }),
        {
          status: pResp.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const prijave: any[] = await pResp.json();

    if (!Array.isArray(prijave) || prijave.length === 0) {
      return new Response(JSON.stringify({ data: [] }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    
    const sportasIds = Array.from(
      new Set(prijave.map((p) => p?.IdSportasa).filter(Boolean)),
    );

    const inList = sportasIds.map(encodeURIComponent).join(",");
    const korisnikUrl =
      `${SUPABASE_URL}/rest/v1/Korisnik` +
      `?select=IdKorisnika,ImeKorisnika,PrezimeKorisnika` +
      `&IdKorisnika=in.(${inList})`;

    const kResp = await fetch(korisnikUrl, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: "application/json",
      },
    });

    if (!kResp.ok) {
      const text = await kResp.text();
      return new Response(
        JSON.stringify({ error: "Failed fetching Korisnik", details: text }),
        {
          status: kResp.status,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const korisnici: any[] = await kResp.json();
    const korisnikMap: Record<string, any> = {};
    (korisnici ?? []).forEach((k) => {
      korisnikMap[k.IdKorisnika] = k;
    });

    
    const data = prijave.map((p) => {
      const k = korisnikMap[p.IdSportasa] ?? null;
      return {
        prijava_id: p.IdPrijave,
        sportas_id: p.IdSportasa,
        ime: k?.ImeKorisnika ?? null,
        prezime: k?.PrezimeKorisnika ?? null,
        dolazak_na_trening: p.DolazakNaTrening,
        ocjena_treninga: p.OcjenaTreninga,
      };
    });

    return new Response(JSON.stringify({ data }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err?.message ?? "Unknown error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
