Deno.serve(async (req: Request) => {
  try {
    if (req.method !== 'DELETE') {
      return new Response(JSON.stringify({ error: 'Method not allowed, use DELETE' }), { status: 405, headers: { 'Content-Type': 'application/json' } });
    }

    const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return new Response(JSON.stringify({ error: 'Missing Supabase env variables' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    const url = new URL(req.url);
    const params = url.searchParams;
    const IdRasporeda = params.get('IdRasporeda');
    if (!IdRasporeda) {
      return new Response(JSON.stringify({ error: 'IdRasporeda query parameter required' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    
    const deletePrijavaRes = await fetch(`${SUPABASE_URL}/rest/v1/Prijava?IdRasporeda=eq.${encodeURIComponent(IdRasporeda)}`, {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      }
    });

    const prijavaText = await deletePrijavaRes.text();
    if (!deletePrijavaRes.ok) {
      return new Response(JSON.stringify({ error: 'Failed to delete prijava rows', details: prijavaText }), { status: deletePrijavaRes.status, headers: { 'Content-Type': 'application/json' } });
    }

    
    const deleteRasporedRes = await fetch(`${SUPABASE_URL}/rest/v1/Raspored?IdRasporeda=eq.${encodeURIComponent(IdRasporeda)}`, {
      method: 'DELETE',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`
      }
    });

    const rasporedText = await deleteRasporedRes.text();
    if (!deleteRasporedRes.ok) {
      return new Response(JSON.stringify({ error: 'Failed to delete raspored', details: rasporedText }), { status: deleteRasporedRes.status, headers: { 'Content-Type': 'application/json' } });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Internal error', details: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});