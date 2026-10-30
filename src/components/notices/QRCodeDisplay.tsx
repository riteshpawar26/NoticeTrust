import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Copy, Check, Download, QrCode as QrIcon } from 'lucide-react';
import { useNotification } from '../../contexts/NotificationContext';

interface QRCodeDisplayProps {
  canonicalUrl: string;
  noticeId: string;
  size?: number;
}

export const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ canonicalUrl, noticeId, size = 180 }) => {
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const { showToast } = useNotification();

  useEffect(() => {
    QRCode.toDataURL(canonicalUrl, {
      width: size,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    })
      .then(url => setDataUrl(url))
      .catch(err => console.error('QR generation error:', err));
  }, [canonicalUrl, size]);

  const handleCopy = () => {
    navigator.clipboard.writeText(canonicalUrl);
    setCopied(true);
    showToast('success', 'Canonical Link Copied', canonicalUrl);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!dataUrl) return;
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = `NoticeTrust_QR_${noticeId}.png`;
    a.click();
    showToast('info', 'QR Code Downloaded', `NoticeTrust_QR_${noticeId}.png`);
  };

  return (
    <div className="flex flex-col items-center p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-navy-900 shadow-sm text-center">
      <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-inner">
        {dataUrl ? (
          <img src={dataUrl} alt={`QR Code for ${noticeId}`} className="w-36 h-36 rounded-lg" />
        ) : (
          <div className="w-36 h-36 flex items-center justify-center bg-slate-100 rounded-lg animate-pulse">
            <QrIcon className="w-8 h-8 text-slate-400" />
          </div>
        )}
      </div>

      <div className="mt-3 text-center">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Canonical QR Verification
        </p>
        <p className="text-xs font-mono text-slate-800 dark:text-slate-200 font-semibold mt-0.5">
          {noticeId}
        </p>
      </div>

      <div className="flex items-center gap-2 mt-3 w-full">
        <button
          onClick={handleCopy}
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-brand-500 transition-colors"
          title="Copy canonical verification URL"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied' : 'Copy Link'}</span>
        </button>

        <button
          onClick={handleDownload}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:text-brand-500 transition-colors"
          title="Download printable high-res QR Code"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
