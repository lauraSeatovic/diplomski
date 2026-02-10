Deno.serve(async (req)=>{
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };

  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS preflight');
    return new Response('ok', { headers: corsHeaders });}
  try {
    if (req.method !== 'POST') return new Response(JSON.stringify({
      error: 'Method not allowed'
    }), {
      status: 405,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const body = await req.json().catch(()=>null);
    const korisnik_id = body?.korisnik_id;
    const raspored_id = body?.raspored_id;
    if (!korisnik_id || !raspored_id) {
      return new Response(JSON.stringify({
        error: 'Missing body params: korisnik_id and raspored_id are required'
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
    
    const checkUrl = `${SUPABASE_URL}/rest/v1/Prijava?select=IdPrijave&IdRasporeda=eq.${encodeURIComponent(raspored_id)}&IdSportasa=eq.${encodeURIComponent(korisnik_id)}`;
    const checkResp = await fetch(checkUrl, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
    if (!checkResp.ok) {
      const txt = await checkResp.text();
      return new Response(JSON.stringify({
        error: 'Failed checking existing prijava',
        details: txt
      }), {
        status: checkResp.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const existing = await checkResp.json();
    if (existing.length > 0) return new Response(JSON.stringify({
      error: 'User already signed up for this training'
    }), {
      status: 409,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    const rUrl = `${SUPABASE_URL}/rest/v1/Raspored?select=IdRasporeda,IdTreninga&IdRasporeda=eq.${encodeURIComponent(raspored_id)}&limit=1`;
    const rResp = await fetch(rUrl, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
    if (!rResp.ok) {
      const txt = await rResp.text();
      return new Response(JSON.stringify({
        error: 'Failed fetching Raspored',
        details: txt
      }), {
        status: rResp.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const rData = await rResp.json();
    if (!rData.length) return new Response(JSON.stringify({
      error: 'Raspored not found'
    }), {
      status: 404,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const trening_id = rData[0].IdTreninga;
    
    const tUrl = `${SUPABASE_URL}/rest/v1/Trening?select=IdTreninga,MaksBrojSportasa&IdTreninga=eq.${encodeURIComponent(trening_id)}&limit=1`;
    const tResp = await fetch(tUrl, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
    if (!tResp.ok) {
      const txt = await tResp.text();
      return new Response(JSON.stringify({
        error: 'Failed fetching Trening',
        details: txt
      }), {
        status: tResp.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const tData = await tResp.json();
    const maxParticipants = tData[0]?.MaksBrojSportasa ?? null;
    
    const countUrl = `${SUPABASE_URL}/rest/v1/Prijava?select=IdPrijave,IdRasporeda&IdRasporeda=eq.${encodeURIComponent(raspored_id)}`;
    const countResp = await fetch(countUrl, {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    });
    if (!countResp.ok) {
      const txt = await countResp.text();
      return new Response(JSON.stringify({
        error: 'Failed fetching Prijava count',
        details: txt
      }), {
        status: countResp.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    const countData = await countResp.json();
    const current = countData.length;
    if (maxParticipants != null && current >= maxParticipants) {
      return new Response(JSON.stringify({
        error: 'Training is full'
      }), {
        status: 409,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
    
    const insertUrl = `${SUPABASE_URL}/rest/v1/Prijava`;
    const insertResp = await fetch(insertUrl, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        IdPrijave: crypto.randomUUID(),
        IdSportasa: korisnik_id,
        DolazakNaTrening: false,
        OcjenaTreninga: null,
        IdRasporeda: raspored_id
      })
    });
    if (!(insertResp.ok || insertResp.status === 201)) {
      const txt = await insertResp.text();
      return new Response(JSON.stringify({
        error: 'Failed creating Prijava' + txt,
        details: txt
      }), {
        status: insertResp.status,
        headers: {
          'Content-Type': 'application/json'
        }
      });
    }
   
    return new Response(JSON.stringify({
      success: true
    }), {
      status: 201,
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
