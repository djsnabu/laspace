export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    const origin = request.headers.get('Origin') || url.origin;

    const publicCors = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    const adminCors = {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Vary': 'Origin',
    };

    const isAdminPath =
      path === '/api/admin/events' ||
      path.startsWith('/api/admin/') ||
      path === '/api/upload' ||
      (path.startsWith('/api/') && request.method !== 'GET');

    const corsHeaders = isAdminPath ? adminCors : publicCors;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Serve images from R2
    if (path.startsWith('/images/') && request.method === 'GET') {
      const key = path.slice(8);
      const object = await env.IMAGES.get(key);
      if (!object) return new Response('Not found', { status: 404 });
      const headers = new Headers();
      object.writeHttpMetadata(headers);
      headers.set('Cache-Control', 'public, max-age=31536000');
      headers.set('Access-Control-Allow-Origin', '*');
      return new Response(object.body, { headers });
    }

    // Public API: get visible events ordered by date
    if (path === '/api/events' && request.method === 'GET') {
      const { results } = await env.DB.prepare(
        'SELECT * FROM events WHERE visible = 1 ORDER BY date ASC'
      ).all();
      return Response.json(results, { headers: publicCors });
    }

    // Admin page - serve from R2
    if (path === '/admin' || path === '/admin/') {
      const html = await env.IMAGES.get('admin.html');
      if (!html) return new Response('Admin not found', { status: 404 });
      return new Response(html.body, {
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
      });
    }

    // Auth helper
    const checkAuth = (req) => {
      const auth = req.headers.get('Authorization');
      return auth === `Bearer ${env.ADMIN_PASS}`;
    };

    // Admin API: get all events
    if (path === '/api/admin/events' && request.method === 'GET') {
      if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers: adminCors });
      const { results } = await env.DB.prepare('SELECT * FROM events ORDER BY date ASC').all();
      return Response.json(results, { headers: adminCors });
    }

    // Image upload
    if (path === '/api/upload' && request.method === 'POST') {
      if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers: adminCors });
      const formData = await request.formData();
      const file = formData.get('image');
      if (!file) return Response.json({ error: 'No image' }, { status: 400, headers: adminCors });

      const ext = file.name.split('.').pop().toLowerCase();
      const allowed = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
      if (!allowed.includes(ext)) return Response.json({ error: 'Invalid file type' }, { status: 400, headers: adminCors });

      const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      await env.IMAGES.put(key, file.stream(), {
        httpMetadata: { contentType: file.type },
      });

      const imageUrl = `${url.origin}/images/${key}`;
      return Response.json({ url: imageUrl }, { headers: adminCors });
    }

    // Protected mutations
    if (request.method !== 'GET' && path.startsWith('/api/')) {
      if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401, headers: adminCors });

      // Create event
      if (path === '/api/admin/events' && request.method === 'POST') {
        const body = await request.json();
        const result = await env.DB.prepare(
          'INSERT INTO events (name, date, date_label, venue, description, ticket_url, image_url, color, visible, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        ).bind(body.name, body.date, body.date_label, body.venue, body.description, body.ticket_url || '', body.image_url || '', body.color || 'purple', body.visible ?? 1, 0).run();
        return Response.json({ success: true, id: result.meta.last_row_id }, { headers: adminCors });
      }

      // Update event (support both /api/admin/events/:id and /api/events/:id)
      if (path.match(/^\/(?:api\/admin\/events|api\/events)\/\d+$/) && request.method === 'PUT') {
        const id = path.split('/').pop();
        const body = await request.json();
        await env.DB.prepare(
          'UPDATE events SET name=?, date=?, date_label=?, venue=?, description=?, ticket_url=?, image_url=?, color=?, visible=? WHERE id=?'
        ).bind(body.name, body.date, body.date_label, body.venue, body.description, body.ticket_url || '', body.image_url || '', body.color || 'purple', body.visible ?? 1, id).run();
        return Response.json({ success: true }, { headers: adminCors });
      }

      // Delete event: /api/admin/events/:id, /api/events/:id, or /api/admin/delete/:id (adblock-safe)
      const deleteMatch = path.match(/^\/api\/admin\/delete\/(\d+)$/) || path.match(/^\/(?:api\/admin\/events|api\/events)\/(\d+)$/);
      if (deleteMatch && request.method === 'DELETE') {
        const id = deleteMatch[1];
        await env.DB.prepare('DELETE FROM events WHERE id=?').bind(id).run();
        return Response.json({ success: true }, { headers: adminCors });
      }
    }

    return new Response('Not found', { status: 404 });
  }
};
