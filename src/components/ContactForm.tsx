// 問い合わせフォーム（ContactPage 用）
import { useState } from 'react';
import { useLanguage } from '@/i18n/LanguageContext';

type Status = 'idle' | 'sending' | 'sent' | 'error';

function ContactForm() {
  const { t } = useLanguage();
  const c = t.contact;

  // 状態管理
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // メールアドレス簡易バリデーション
  const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  // フォーム送信処理
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // クライアント側バリデーション
    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMsg(c.errorRequired);
      setStatus('error');
      return;
    }
    if (!isValidEmail(email)) {
      setErrorMsg(c.errorEmail);
      setStatus('error');
      return;
    }
    if (name.length > 100 || message.length > 5000) {
      setErrorMsg(c.errorGeneric);
      setStatus('error');
      return;
    }

    // API 送信
    setStatus('sending');
    setErrorMsg('');

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), email: email.trim(), message: message.trim() }),
      });

      // レスポンス処理
      if (res.status === 429) {
        setErrorMsg(c.errorRateLimit);
        setStatus('error');
        return;
      }
      if (!res.ok) {
        setErrorMsg(c.errorGeneric);
        setStatus('error');
        return;
      }

      setStatus('sent');
      setName('');
      setEmail('');
      setMessage('');
    } catch {
      setErrorMsg(c.errorGeneric);
      setStatus('error');
    }
  }

  // 共通入力スタイル
  const inputClass =
    'w-full rounded border border-gray-700 bg-gray-800/50 px-3 py-2 text-sm text-gray-100 placeholder-gray-500 focus:border-blue-500 focus:outline-none';

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid gap-3 sm:grid-cols-2">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={c.namePlaceholder}
          maxLength={100}
          className={inputClass}
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={c.emailPlaceholder}
          className={inputClass}
        />
      </div>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={c.messagePlaceholder}
        maxLength={5000}
        rows={3}
        className={`${inputClass} resize-none`}
      />

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={status === 'sending'}
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-500 disabled:opacity-50"
        >
          {status === 'sending' ? c.sending : c.submit}
        </button>

        {status === 'sent' && <span className="text-sm text-green-400">{c.success}</span>}
        {status === 'error' && <span className="text-sm text-red-400">{errorMsg}</span>}
      </div>
    </form>
  );
}

export default ContactForm;
