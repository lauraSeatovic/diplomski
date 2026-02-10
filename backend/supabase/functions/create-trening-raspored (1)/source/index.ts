import { randomUUID } from 'node:crypto';

Deno.serve(async (req: Request) => {
  try {
    const url = new URL(req.url);
    if (req.method !== 'POST') return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405, headers: { 'Content-Type': 'application/json' } });

    const body = await req.json();
    const trening = body.trening || {};
    const raspored = body.raspored || {};

    
    const IdTreninga = trening.IdTreninga || randomUUID();
    const IdRasporeda = raspored.IdRasporeda || randomUUID();

    
    const treningPayload = { ...trening, IdTreninga };
    const rasporedPayload = { ...raspored, IdRasporeda, IdTreninga };

    
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Missing Supabase env variables' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    
    const res1 = await fetch(`${SUPABASE_URL}/rest/v1/Trening`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: 'return=representation'
      },
      body: JSON.stringify(treningPayload)
    });
    const data1 = await res1.json();
    if (!res1.ok) return new Response(JSON.stringify({ error: 'Insert trening failed', details: data1 }), { status: res1.status, headers: { 'Content-Type': 'application/json' } });

    
    const res2 = await fetch(`${SUPABASE_URL}/rest/v1/Raspored`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: 'return=representation'
      },
      body: JSON.stringify(rasporedPayload)
    });
    const data2 = await res2.json();
    if (!res2.ok) return new Response(JSON.stringify({ error: 'Insert raspored failed', details: data2 }), { status: res2.status, headers: { 'Content-Type': 'application/json' } });

    return new Response(JSON.stringify({ trening: data1[0], raspored: data2[0] }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal error', details: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
