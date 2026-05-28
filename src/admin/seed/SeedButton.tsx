import { useState } from 'react';
import { Loader2, DatabaseZap, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { EMPTY_NUTRITION } from '../../lib/types';
import seedData from './seed-data.json';

// Resolved at build/dev time by Vite — keys are like "/src/assets/products/Folder/file.png"
const imageModules = import.meta.glob('/src/assets/products/**/*', {
  eager: true,
  as: 'url',
}) as Record<string, string>;

type Status = 'idle' | 'confirm' | 'running' | 'done' | 'error';

export default function SeedButton() {
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
      // ── 1. Pastas ──────────────────────────────────────────────────────────
      for (const folder of seedData.folders) {
        setCurrentLabel(`Pasta: ${folder.name}`);
        const { id, ...data } = folder;
        await setDoc(doc(db, 'folders', id), {
          ...data,
          createdAt: serverTimestamp(),
        });
        setDone((n) => n + 1);
      }

      // ── 2. Produtos ────────────────────────────────────────────────────────
      for (const product of seedData.products) {
        setCurrentLabel(`Produto: ${product.name} ${product.weight}`);

        const { id, localImagePath, ...data } = product;

        let imageUrl = '';
        let imagePath = '';

        const moduleKey = `/src/assets/products/${localImagePath}`;
        const resolvedUrl = imageModules[moduleKey];

        if (resolvedUrl) {
          const response = await fetch(resolvedUrl);
          const blob = await response.blob();
          const ext = localImagePath.split('.').pop() ?? 'jpg';
          imagePath = `products/${id}/image.${ext}`;
          const storageRef = ref(storage, imagePath);
          await uploadBytes(storageRef, blob);
          imageUrl = await getDownloadURL(storageRef);
        } else {
          console.warn(`[seed] imagem não encontrada para chave: ${moduleKey}`);
        }

        await setDoc(doc(db, 'products', id), {
          ...data,
          imageUrl,
          imagePath,
          nutrition: EMPTY_NUTRITION,
          createdAt: serverTimestamp(),
        });

        setDone((n) => n + 1);
      }

      setStatus('done');
    } catch (err) {
      console.error('[seed]', err);
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setStatus('error');
    }
  };

  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setStatus('confirm')}
        className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-800 border border-amber-300 rounded-xl text-sm font-semibold hover:bg-amber-200 transition-colors"
        title="Popular banco com dados iniciais (temporário)"
      >
        <DatabaseZap className="w-4 h-4" />
        Seed
      </button>

      {/* Modal */}
      {status !== 'idle' && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
            {/* Close — only when not running */}
            {status !== 'running' && (
              <button
                onClick={() => setStatus('idle')}
                className="absolute top-4 right-4 p-1 text-muted-foreground hover:text-foreground rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}

            {/* ── Confirmação ──────────────────────────────────────────────── */}
            {status === 'confirm' && (
              <>
                <div className="flex items-center gap-3 mb-4">
                  <DatabaseZap className="w-6 h-6 text-amber-500 shrink-0" />
                  <h2 className="text-lg font-bold text-foreground">Popular Banco de Dados</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Serão criados <strong>{seedData.folders.length} pastas</strong> e{' '}
                  <strong>{seedData.products.length} produtos</strong> no Firestore, com upload
                  das imagens para o Firebase Storage.
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

            {/* ── Em andamento ─────────────────────────────────────────────── */}
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

            {/* ── Sucesso ──────────────────────────────────────────────────── */}
            {status === 'done' && (
              <>
                <div className="flex flex-col items-center text-center gap-4">
                  <CheckCircle2 className="w-12 h-12 text-green-500" />
                  <div>
                    <h2 className="text-lg font-bold text-foreground">Banco populado!</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      {seedData.folders.length} pastas e {seedData.products.length} produtos
                      criados com sucesso.
                    </p>
                  </div>
                  <button
                    onClick={() => setStatus('idle')}
                    className="px-6 py-2.5 bg-primary text-white rounded-xl text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Fechar
                  </button>
                </div>
              </>
            )}

            {/* ── Erro ─────────────────────────────────────────────────────── */}
            {status === 'error' && (
              <>
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
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
