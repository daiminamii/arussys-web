// POST /api/contact — Resend API でメール転送
import type { Env } from './env';
import { json, errorResponse } from './utils/response';

const MAX_NAME = 100;
const MAX_MESSAGE = 5000;
const RATE_LIMIT_TTL = 60; // seconds

/** HTML エスケープ（XSS 防止） */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** 改行・制御文字を除去（ヘッダインジェクション防止） */
function sanitizeEmail(email: string): string {
  return email.replace(/[\r\n\x00-\x1f]/g, '');
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function handleContact(request: Request, env: Env): Promise<Response> {
  if (request.method !== 'POST') {
    return errorResponse('Method not allowed', 405);
  }

  // CSRF: Origin チェック
  const origin = request.headers.get('Origin');
  const siteOrigin = new URL(request.url).origin;
  if (!origin || origin !== siteOrigin) {
    return errorResponse('Forbidden', 403);
  }

  // JSON ボディ解析
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse('Invalid JSON', 400);
  }

  const { name, email, message } = body as Record<string, unknown>;

  // バリデーション
  if (typeof name !== 'string' || name.trim().length === 0) {
    return errorResponse('Name is required', 400);
  }
  if (name.length > MAX_NAME) {
    return errorResponse(`Name must be ${MAX_NAME} characters or less`, 400);
  }
  if (typeof email !== 'string' || !isValidEmail(email)) {
    return errorResponse('Valid email is required', 400);
  }
  if (typeof message !== 'string' || message.trim().length === 0) {
    return errorResponse('Message is required', 400);
  }
  if (message.length > MAX_MESSAGE) {
    return errorResponse(`Message must be ${MAX_MESSAGE} characters or less`, 400);
  }

  // IP レート制限（Resend 呼び出しの前に設定 — DoS 防止）
  const ip = request.headers.get('CF-Connecting-IP') ?? 'unknown';
  const rateLimitKey = `ratelimit:contact:${ip}`;
  const existing = await env.STRAVA_KV.get(rateLimitKey);
  if (existing) {
    return errorResponse('Too many requests. Please wait a moment.', 429);
  }
  await env.STRAVA_KV.put(rateLimitKey, '1', { expirationTtl: RATE_LIMIT_TTL });

  // Resend API 呼び出し
  const sanitizedEmail = sanitizeEmail(email);
  const escapedName = escapeHtml(name.trim());
  const escapedMessage = escapeHtml(message.trim());

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Contact Form <onboarding@resend.dev>',
      to: env.CONTACT_EMAIL,
      reply_to: sanitizedEmail,
      subject: `[arussys.com] Contact from ${escapedName}`,
      html: `<p><strong>Name:</strong> ${escapedName}</p>
<p><strong>Email:</strong> ${escapeHtml(sanitizedEmail)}</p>
<p><strong>Message:</strong></p>
<p>${escapedMessage.replace(/\n/g, '<br>')}</p>`,
    }),
  });

  if (!res.ok) {
    return errorResponse('Failed to send message', 500);
  }

  return json({ success: true });
}
