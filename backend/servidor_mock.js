const http = require('http');
const fs = require('fs');
const path = require('path');

const dbPath = path.resolve(process.argv[2] || 'db.json');
const port = Number(process.argv[3] || 3000);
const publicDir = path.join(__dirname, 'public');

function readDb() {
    return JSON.parse(fs.readFileSync(dbPath, 'utf8'));
}

function writeDb(db) {
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2) + '\n', 'utf8');
}

function send(res, status, body, contentType = 'application/json; charset=utf-8') {
    res.writeHead(status, {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    });

    if (status === 204) {
        return res.end();
    }

    res.end(typeof body === 'string' ? body : JSON.stringify(body));
}

function parseBody(req) {
    return new Promise((resolve, reject) => {
        let data = '';

        req.on('data', chunk => data += chunk);
        req.on('end', () => {
            if (!data) {
                return resolve({});
            }

            try {
                resolve(JSON.parse(data));
            } catch (error) {
                reject(error);
            }
        });
    });
}

function nextId(items) {
    const nums = items
        .map(item => Number(item.id))
        .filter(Number.isFinite);

    return String((nums.length ? Math.max(...nums) : 100) + 1);
}

const server = http.createServer(async (req, res) => {
    try {
        if (req.method === 'OPTIONS') {
            return send(res, 204);
        }

        const url = new URL(req.url, `http://${req.headers.host}`);

        if (url.pathname === '/' || url.pathname === '/api-tester.html') {
            const file = path.join(publicDir, 'api-tester.html');

            if (fs.existsSync(file)) {
                return send(
                    res,
                    200,
                    fs.readFileSync(file, 'utf8'),
                    'text/html; charset=utf-8'
                );
            }
        }

        let parts = url.pathname.split('/').filter(Boolean);

        // Angular usa /api/citas mediante proxy.
        // La API real sigue trabajando con el recurso /citas.
        if (parts[0] === 'api') {
            parts = parts.slice(1);
        }

        if (!parts.length) {
            return send(res, 200, { ok: true });
        }

        const resource = parts[0];
        const id = parts[1];
        const db = readDb();
        const items = db[resource];

        if (!Array.isArray(items)) {
            return send(res, 404, { error: 'Recurso no encontrado' });
        }

        if (req.method === 'GET' && !id) {
            return send(res, 200, items);
        }

        if (req.method === 'GET' && id) {
            const item = items.find(x => String(x.id) === String(id));

            return item
                ? send(res, 200, item)
                : send(res, 404, { error: 'Elemento no encontrado' });
        }

        if (req.method === 'POST' && !id) {
            const body = await parseBody(req);
            const created = {
                ...body,
                id: body.id ? String(body.id) : nextId(items)
            };

            items.push(created);
            writeDb(db);

            return send(res, 201, created);
        }

        const index = items.findIndex(x => String(x.id) === String(id));

        if (index < 0) {
            return send(res, 404, { error: 'Elemento no encontrado' });
        }

        if (req.method === 'PATCH') {
            const body = await parseBody(req);
            const updated = {
                ...items[index],
                ...body,
                id: String(items[index].id)
            };

            items[index] = updated;
            writeDb(db);

            return send(res, 200, updated);
        }

        if (req.method === 'PUT') {
            const body = await parseBody(req);
            const updated = {
                ...body,
                id: String(id)
            };

            items[index] = updated;
            writeDb(db);

            return send(res, 200, updated);
        }

        if (req.method === 'DELETE') {
            items.splice(index, 1);
            writeDb(db);

            return send(res, 204);
        }

        return send(res, 405, { error: 'Método no permitido' });
    } catch (error) {
        return send(res, 500, { error: error.message });
    }
});

server.listen(port, '0.0.0.0', () => {
    console.log(`Mock REST API: http://localhost:${port}`);
    console.log(`DB: ${dbPath}`);
    console.log(`Tester: http://localhost:${port}/api-tester.html`);
});