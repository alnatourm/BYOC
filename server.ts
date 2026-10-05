import express from 'express';
import cookieParser from 'cookie-parser';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';

import { env } from './server/config';
import { db } from './server/db';
import { runMigrations } from './server/db/migrate';
import { helmetMiddleware, corsMiddleware } from './server/middleware/logger';
import { recoverRunningDispatchesOnBoot, runWatchdogTimeoutCheck } from './server/pipeline/watchdog';
import { startBackgroundWorker } from './server/pipeline/worker';

import { authRouter, meHandler } from './server/routes/auth';
import { requireAuth } from './server/middleware/auth';
import { connectionsRouter } from './server/routes/connections';
import { auditRouter } from './server/routes/audit';
import { adminRouter } from './server/routes/admin';
import { pipelineRouter } from './server/routes/pipeline';
import { hostingRouter } from './server/routes/hosting';

export const app = express();

app.set('trust proxy', env.TRUST_PROXY);

app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(helmetMiddleware);
app.use(corsMiddleware);

// Health & Readiness Endpoints
app.get('/healthz', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/readyz', async (req, res) => {
  try {
    await db.query('SELECT 1');
    res.json({ status: 'ready', db: 'connected', timestamp: new Date().toISOString() });
  } catch {
    res.status(503).json({ status: 'not_ready', db: 'disconnected' });
  }
});

// Mount V1 Routers Exactly Once
app.use('/v1/auth', authRouter);
app.get('/v1/me', requireAuth, meHandler);
app.use('/v1/connections', connectionsRouter);
app.use('/v1/audit', auditRouter);
app.use('/v1/admin', adminRouter);
app.use('/v1', pipelineRouter);
app.use('/v1', hostingRouter);

// Return 404 for any unmatched API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'NOT_FOUND: Endpoint does not exist.' });
});
app.use('/v1/*', (req, res) => {
  res.status(404).json({ error: 'NOT_FOUND: Endpoint does not exist.' });
});

// Server Initialization
async function startServer() {
  try {
    await runMigrations();
    await recoverRunningDispatchesOnBoot();
    startBackgroundWorker();
    setInterval(() => {
      runWatchdogTimeoutCheck(10).catch(() => {});
    }, 60000).unref();
  } catch (err: any) {
    console.warn('⚠️ Database initialization notice during startup:', err?.message || err);
  }

  const port = process.env.PORT === '8080' ? 3000 : (process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);

  if (env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        let template = fs.readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`🚀 OGroup AI Factory Server listening on http://0.0.0.0:${port}`);
  });
}

if (process.env.NODE_ENV !== 'test' && !process.env.VITEST) {
  startServer().catch((err) => {
    console.error('Fatal Server Boot Error:', err);
    process.exit(1);
  });
}
