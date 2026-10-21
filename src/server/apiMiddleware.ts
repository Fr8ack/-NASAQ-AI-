import type { IncomingMessage, ServerResponse } from 'http';
import { conductQuranResearch, attemptRefutation } from './geminiService';

export function createApiMiddleware() {
  return async (req: IncomingMessage, res: ServerResponse, next: () => void) => {
    const url = req.url?.split('?')[0];

    if (url === '/api/status' && req.method === 'GET') {
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({
        status: 'ok',
        appName: 'NASAQ AI',
        slogan: 'القرآن يُبيّن بعضه بعضًا',
        quranSurahs: 114,
        quranVerses: 6236,
        geminiActive: !!process.env.GEMINI_API_KEY,
        researchMode: 'quran_by_quran',
        timestamp: new Date().toISOString()
      }));
      return;
    }

    if ((url === '/api/download-zip' || url === '/api/download-project') && req.method === 'GET') {
      try {
        const fs = await import('fs');
        const path = await import('path');
        const zipPath = path.resolve(process.cwd(), 'public', 'nasap-ai-v1.3.zip');
        if (fs.existsSync(zipPath)) {
          const stat = fs.statSync(zipPath);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/zip');
          res.setHeader('Content-Length', stat.size);
          res.setHeader('Content-Disposition', 'attachment; filename="nasap-ai-v1.3.zip"');
          fs.createReadStream(zipPath).pipe(res);
          return;
        } else {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'ملف الرمز المضغوط غير موجود، يرجى تشغيل python3 tools/create-zip.py' }));
          return;
        }
      } catch (e: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: e.message || 'فشل في تحميل الملف المضغوط' }));
        return;
      }
    }

    if (url === '/api/research' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body || '{}');
          const question = (parsed.question || '').trim();
          if (!question) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'السؤال مطلوب للبحث القرآني' }));
            return;
          }

          const result = await conductQuranResearch(question);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'خطأ في معالجة البحث' }));
        }
      });
      return;
    }

    if (url === '/api/hypothesis/refute' && req.method === 'POST') {
      let body = '';
      req.on('data', chunk => { body += chunk; });
      req.on('end', async () => {
        try {
          const parsed = JSON.parse(body || '{}');
          const statement = (parsed.statement || '').trim();
          if (!statement) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'نص الفرضية مطلوب' }));
            return;
          }

          const result = await attemptRefutation(statement);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(result));
        } catch (err: any) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'خطأ في معالجة نقد الفرضية' }));
        }
      });
      return;
    }

    next();
  };
}
