Deno.serve(async (req)=>{
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight');
    return new Response('ok', { headers: corsHeaders });}
  try {
    const url = new URL(req.url);
    const treningId = url.searchParams.get('trening_id');
    if (!treningId) {
      return new Response(JSON.stringify({
        error: 'Missing query param: trening_id'
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return new Response(JSON.stringify({
        error: 'Supabase environment variables not set'
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const treningUrl = `${SUPABASE_URL}/rest/v1/Trening?select=IdTreninga,IdVrTreninga&IdTreninga=eq.${encodeURIComponent(treningId)}`;
    const tResp = await fetch(treningUrl, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json'
      }
    });
    if (!tResp.ok) {
      const text = await tResp.text();
      return new Response(JSON.stringify({
        error: 'Failed fetching Trening',
        details: text
      }), {
        status: tResp.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const tData = await tResp.json();
    if (!tData || tData.length === 0) {
      return new Response(JSON.stringify({
        error: 'Trening not found'
      }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const trening = tData[0];
    const vrId = trening.IdVrTreninga;
    
    const vrUrl = `${SUPABASE_URL}/rest/v1/VrstaTreninga?select=IdVrTreninga,NazivVrTreninga,Tezina&IdVrTreninga=eq.${encodeURIComponent(vrId)}`;
    const vResp = await fetch(vrUrl, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        Accept: 'application/json'
      }
    });
    if (!vResp.ok) {
      const text = await vResp.text();
      return new Response(JSON.stringify({
        error: 'Failed fetching VrstaTreninga' + text,
        details: text
      }), {
        status: vResp.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const vData = await vResp.json();
    const vr = vData && vData.length ? vData[0] : null;
    return new Response(JSON.stringify({
      data: {
        trening_id: trening.IdTreninga,
        vrsta: vr ? {
          id: vr.IdVrTreninga,
          naziv: vr.NazivVrTreninga,
          opis: vr.Opis,
          tezina: vr.Tezina
        } : null
      }
    }), {
      status: 200,
      headers: {
    ...corsHeaders, 
        'Content-Type': 'application/json'
      }
    });
  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message
    }), {
      status: 500,
      headers: {
    ...corsHeaders, 
        'Content-Type': 'application/json'
      }
    });
  }
});
