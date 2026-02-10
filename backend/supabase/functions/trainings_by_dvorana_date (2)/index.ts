Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  console.log('--- trainings_by_dvorana_date called ---');
  console.log('Method:', req.method);
  console.log('URL:', req.url);
  console.log('Headers Origin:', req.headers.get('Origin'));

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight');
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const teretanaId = url.searchParams.get('teretanaId');
    const date = url.searchParams.get('date');

    console.log('Query params:', { teretanaId, date });

    if (!teretanaId || !date) {
      console.log('Missing query params, returning 400');
      return new Response(
        JSON.stringify({
          error: 'Missing query params: teretanaId and date are required',
          received: { teretanaId, date },
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    console.log('Env check:', {
      hasUrl: !!SUPABASE_URL,
      hasKey: !!SUPABASE_KEY,
    });

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      console.log('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      return new Response(
        JSON.stringify({
          error: 'Supabase environment variables not set',
        }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    
    const dayStart = new Date(date);
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setUTCDate(dayEnd.getUTCDate() + 1);

    console.log('Computed dayStart/dayEnd:', {
      dayStart: dayStart.toISOString(),
      dayEnd: dayEnd.toISOString(),
    });

    
    const select = encodeURIComponent(
      `IdRasporeda,PocetakVrijeme,ZavrsetakVrijeme,IdTreninga,IdTrenera,Trening:IdTreninga(*)`,
    );
    const rasporedUrl = `${SUPABASE_URL}/rest/v1/Raspored?select=${select}&PocetakVrijeme=gte.${dayStart.toISOString()}&PocetakVrijeme=lt.${dayEnd.toISOString()}&order=PocetakVrijeme.asc`;

    console.log('Raspored URL:', rasporedUrl);

    const resp = await fetch(rasporedUrl, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json',
      },
    });

    console.log('Raspored status:', resp.status);

    if (!resp.ok) {
      const text = await resp.text();
      console.log('Raspored fetch failed, body:', text);
      return new Response(
        JSON.stringify({
          error: 'Failed querying Raspored',
          details: text,
        }),
        {
          status: resp.status,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        },
      );
    }

    const rasporedData = await resp.json();
    console.log('Raspored rows count:', Array.isArray(rasporedData) ? rasporedData.length : 'not array');

    
    const treningIds = Array.from(
      new Set(rasporedData.map((r: any) => r.IdTreninga).filter(Boolean)),
    );
    const trenerIds = Array.from(
      new Set(rasporedData.map((r: any) => r.IdTrenera).filter(Boolean)),
    );

    console.log('Collected IDs:', {
      treningIdsCount: treningIds.length,
      trenerIdsCount: trenerIds.length,
    });

    
    let treningMap: Record<string, any> = {};
    if (treningIds.length) {
      const q = `${SUPABASE_URL}/rest/v1/Trening?select=IdTreninga,MaksBrojSportasa,IdDvOdr,IdVrTreninga&IdTreninga=in.(${treningIds
        .map(encodeURIComponent)
        .join(',')})`;
      console.log('Trening URL:', q);
      const tResp = await fetch(q, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      console.log('Trening status:', tResp.status);
      if (!tResp.ok) {
        const text = await tResp.text();
        console.log('Trening fetch failed body:', text);
        throw new Error('Failed fetching Trening: ' + text);
      }
      const tData = await tResp.json();
      console.log('Trening rows:', tData.length);
      tData.forEach((t: any) => {
        treningMap[t.IdTreninga] = t;
      });
    }

    
    const vrIds = Array.from(
      new Set(
        Object.values(treningMap)
          .map((t: any) => t.IdVrTreninga)
          .filter(Boolean),
      ),
    );
    let vrMap: Record<string, any> = {};
    console.log('VrstaTreninga IDs:', vrIds);
    if (vrIds.length) {
      const q = `${SUPABASE_URL}/rest/v1/VrstaTreninga?select=IdVrTreninga,NazivVrTreninga&IdVrTreninga=in.(${vrIds
        .map(encodeURIComponent)
        .join(',')})`;
      console.log('VrstaTreninga URL:', q);
      const vResp = await fetch(q, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      console.log('VrstaTreninga status:', vResp.status);
      if (!vResp.ok) {
        const text = await vResp.text();
        console.log('VrstaTreninga fetch failed body:', text);
        throw new Error('Failed fetching VrstaTreninga: ' + text);
      }
      const vData = await vResp.json();
      console.log('VrstaTreninga rows:', vData.length);
      vData.forEach((v: any) => {
        vrMap[v.IdVrTreninga] = v;
      });
    }

    
    const dvoranaIds = Array.from(
      new Set(
        Object.values(treningMap)
          .map((t: any) => t.IdDvOdr)
          .filter(Boolean),
      ),
    );
    let dvoranaMap: Record<string, any> = {};
    console.log('Dvorana IDs:', dvoranaIds);
    if (dvoranaIds.length) {
      const q = `${SUPABASE_URL}/rest/v1/Dvorana?select=IdDvorane,NazivDvorane,IdTeretane&IdDvorane=in.(${dvoranaIds
        .map(encodeURIComponent)
        .join(',')})`;
      console.log('Dvorana URL:', q);
      const dResp = await fetch(q, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      console.log('Dvorana status:', dResp.status);
      if (!dResp.ok) {
        const text = await dResp.text();
        console.log('Dvorana fetch failed body:', text);
        throw new Error('Failed fetching Dvorana: ' + text);
      }
      const dData = await dResp.json();
      console.log('Dvorana rows:', dData.length);
      dData.forEach((d: any) => {
        dvoranaMap[d.IdDvorane] = d;
      });
    }

    
    let trenerMap: Record<string, any> = {};
    console.log('Trener IDs before fetch:', trenerIds);
    if (trenerIds.length) {
      const q = `${SUPABASE_URL}/rest/v1/Trener?select=IdKorisnika&IdKorisnika=in.(${trenerIds
        .map(encodeURIComponent)
        .join(',')})`;
      console.log('Trener URL:', q);
      const trResp = await fetch(q, {
        headers: {
          apikey: SUPABASE_KEY,
          Authorization: `Bearer ${SUPABASE_KEY}`,
        },
      });
      console.log('Trener status:', trResp.status);
      if (!trResp.ok) {
        const text = await trResp.text();
        console.log('Trener fetch failed body:', text);
        throw new Error('Failed fetching Trener: ' + text);
      }
      const trData = await trResp.json();
      console.log('Trener rows:', trData.length);
      const korisnikIds = trData.map((t: any) => t.IdKorisnika).filter(Boolean);
      console.log('Korisnik IDs:', korisnikIds);
      if (korisnikIds.length) {
        const kq = `${SUPABASE_URL}/rest/v1/Korisnik?select=IdKorisnika,ImeKorisnika,PrezimeKorisnika&IdKorisnika=in.(${korisnikIds
          .map(encodeURIComponent)
          .join(',')})`;
        console.log('Korisnik URL:', kq);
        const kResp = await fetch(kq, {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        });
        console.log('Korisnik status:', kResp.status);
        if (!kResp.ok) {
          const text = await kResp.text();
          console.log('Korisnik fetch failed body:', text);
          throw new Error('Failed fetching Korisnik: ' + text);
        }
        const kData = await kResp.json();
        console.log('Korisnik rows:', kData.length);
        kData.forEach((k: any) => {
          trenerMap[k.IdKorisnika] = k;
        });
      }
    }

    
    const rasporedIds = rasporedData
      .map((r: any) => r.IdRasporeda)
      .filter(Boolean);
    let prijavaCountMap: Record<string, number> = {};
    console.log('Raspored IDs for Prijava:', rasporedIds);

    if (rasporedIds.length) {
      const chunkSize = 50;
      for (let i = 0; i < rasporedIds.length; i += chunkSize) {
        const chunk = rasporedIds.slice(i, i + chunkSize);
        const q = `${SUPABASE_URL}/rest/v1/Prijava?select=IdPrijave,IdRasporeda&IdRasporeda=in.(${chunk
          .map(encodeURIComponent)
          .join(',')})`;
        console.log('Prijava URL (chunk):', q);
        const pResp = await fetch(q, {
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
          },
        });
        console.log('Prijava status:', pResp.status);
        if (!pResp.ok) {
          const text = await pResp.text();
          console.log('Prijava fetch failed body:', text);
          throw new Error('Failed fetching Prijava: ' + text);
        }
        const pData = await pResp.json();
        console.log('Prijava rows in chunk:', pData.length);
        pData.forEach((p: any) => {
          prijavaCountMap[p.IdRasporeda] =
            (prijavaCountMap[p.IdRasporeda] || 0) + 1;
        });
      }
    }

    
    const filteredRaspored = rasporedData.filter((r: any) => {
      const trening = treningMap[r.IdTreninga];
      if (!trening) return false;
      const d = dvoranaMap[trening.IdDvOdr];
      if (!d) return false;
      return d.IdTeretane === teretanaId;
    });

    console.log('Filtered raspored count:', filteredRaspored.length);

    
    const results = filteredRaspored.map((r: any) => {
      const trening = treningMap[r.IdTreninga] || {};
      const vr = vrMap[trening.IdVrTreninga] || null;
      const d = dvoranaMap[trening.IdDvOdr] || null;
      const trener = trenerMap[r.IdTrenera] || null;
      const current = prijavaCountMap[r.IdRasporeda] || 0;
      return {
        raspored_id: r.IdRasporeda,
        start_time: r.PocetakVrijeme,
        end_time: r.ZavrsetakVrijeme,
        trening_id: r.IdTreninga,
        trening_vrsta_naziv: vr?.NazivVrTreninga ?? null,
        max_participants: trening?.MaksBrojSportasa ?? null,
        dvorana_id: trening?.IdDvOdr ?? null,
        dvorana_naziv: d?.NazivDvorane ?? null,
        trener_id: r.IdTrenera,
        trener_ime: trener?.ImeKorisnika ?? null,
        trener_prezime: trener?.PrezimeKorisnika ?? null,
        current_signups: current,
        is_full:
          trening?.MaksBrojSportasa != null
            ? current >= trening.MaksBrojSportasa
            : false,
      };
    });

    console.log('Final results count:', results.length);

    return new Response(
      JSON.stringify({
        data: results,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  } catch (err: any) {
    console.error('Edge function error:', err);
    return new Response(
      JSON.stringify({
        error: err?.message ?? 'Unknown error',
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      },
    );
  }
});
