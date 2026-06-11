import { useState } from 'react';
import { Loader2, DatabaseZap, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { EMPTY_NUTRITION } from '../../lib/types';
import seedData from './seed-data.json';

const imageModules = import.meta.glob('/src/assets/products/**/*', {
  eager: true,
  as: 'url',
}) as Record<string, string>;

type Status = 'idle' | 'confirm' | 'running' | 'done' | 'error';

export default function SeedButton({ onDone }: { onDone?: () => void }) {
  const [status, setStatus] = useState<Status>('idle');
  const [currentLabel, setCurrentLabel] = useState('');
  const [done, setDone] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');

  const total = seedData.folders.length + seedData.products.length;

  const handleRun = async () => {
    setStatus('running');
    setDone(0);
    setErrorMsg('');

    try {
      // ── 1. Seed folders + products via PHP (preserves IDs) ────────────────
      setCurrentLabel('Criando pastas e produtos…');
      const seedRes = await fetch('/api/seed.php', { method: 'POST' });
      if (!seedRes.ok) throw new Error('Falha ao executar seed no servidor.');
      const seedResult = await seedRes.json();
      if (seedResult.errors?.length) {
        console.warn('[seed] erros parciais:', seedResult.errors);
      }
      setDone(seedData.folders.length);

      // ── 2. Upload images for each product ─────────────────────────────────
      for (const product of seedData.products) {
        setCurrentLabel(`Imagem: ${product.name}`);

        const moduleKey = `/src/assets/products/${product.localImagePath}`;
        const resolvedUrl = imageModules[moduleKey];

        if (resolvedUrl) {
          try {
            const response = await fetch(resolvedUrl);
            const blob = await response.blob();
            const filename = product.localImagePath.split('/').pop() ?? 'image.jpg';
            const file = new File([blob], filename, { type: blob.type });

            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', 'products');
            formData.append('id', product.id);
            const uploadRes = await fetch('/api/upload.php', { method: 'POST', body: formData });

            if (uploadRes.ok) {
              const { imageUrl, imagePath } = await uploadRes.json();
              await fetch(`/api/products.php?id=${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: product.name,
                  weight: product.weight,
                  folderId: product.folderId,
                  imageUrl,
                  imagePath,
                  nutrition: EMPTY_NUTRITION,
                }),
              });
            }
          } catch {
            console.warn(`[seed] imagem não encontrada: ${moduleKey}`);
          }
        }

        setDone((n) => n + 1);
      }

      setStatus('done');
      onDone?.();
    } catch (err) {
      console.error('[seed]', err);
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setStatus('error');
    }
  };

  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <>
      <button
        onClick={() => setStatus('confirm')}
        className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-sm font-semibold hover:bg-amber-200 transition-colors"
        title="Popular banco com dados iniciais"
      >
        <DatabaseZap className="w-4 h-4" />
        Seed
      </button>

      {status !== 'idle' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            {status !== 'running' && (
              <button
                onClick={() => setStatus('idle')}
                className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {status === 'confirm' && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <DatabaseZap className="w-6 h-6 text-amber-500 shrink-0" />
                  <h2 className="text-lg font-bold text-foreground">Popular Banco de Dados</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Serão criados <strong>{seedData.folders.length} pastas</strong> e{' '}
                  <strong>{seedData.products.length} produtos</strong> com upload das imagens.
                </p>
                <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-6">
                  Dados existentes com o mesmo ID serão sobrescritos.
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={handleRun}
                    className="flex-1 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Executar
                  </button>
                  <button
                    onClick={() => setStatus('idle')}
                    className="flex-1 py-2.5 text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-gray-100 rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}

            {status === 'running' && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <Loader2 className="w-5 h-5 text-primary animate-spin shrink-0" />
                  <h2 className="text-base font-bold text-foreground">Populando banco…</h2>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mb-4">
                  <span className="truncate pr-2">{currentLabel}</span>
                  <span className="shrink-0">{done}/{total}</span>
                </div>
              </>
            )}

            {status === 'done' && (
              <div className="flex flex-col items-center text-center gap-4">
                <CheckCircle2 className="w-12 h-12 text-green-500" />
                <div>
                  <h2 className="text-lg font-bold text-foreground">Banco populado!</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    {seedData.folders.length} pastas e {seedData.products.length} produtos criados com sucesso.
                  </p>
                </div>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Fechar
                </button>
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center text-center gap-4">
                <AlertCircle className="w-12 h-12 text-red-500" />
                <div>
                  <h2 className="text-lg font-bold text-foreground">Erro ao popular</h2>
                  <p className="text-sm text-muted-foreground mt-1 break-all">{errorMsg}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {done} de {total} itens foram processados antes do erro.
                  </p>
                </div>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2.5 bg-gray-100 text-foreground rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors"
                >
                  Fechar
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
