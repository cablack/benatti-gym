# Publicar seu app como PWA no GitHub Pages

## O que você já tem
- `index.html`: está no Canvas (Arquivo "Academia do Benatti – App").
- **Baixe também estes dois arquivos** deste pacote:
  - `sw.js` — service worker (offline)
  - `manifest.webmanifest` — manifesto do app

## Passo a passo (GitHub Pages)
1. Crie um repositório no GitHub com o nome que quiser (ex.: `benatti-gym`).
2. Faça upload de **3 arquivos** na raiz do repositório:
   - `index.html` (do Canvas)
   - `sw.js` (deste pacote)
   - `manifest.webmanifest` (deste pacote)
3. No GitHub: **Settings → Pages → Build and deployment → Source: `Deploy from a branch`**.
4. Em **Branch**, escolha `main` e a pasta `/ (root)`. Clique em **Save**.
5. Aguarde a URL do seu site aparecer (algo como `https://seuusuario.github.io/benatti-gym`).
6. Abra no celular e toque **Adicionar à tela inicial** para instalar.

## Dicas
- Se mudar o nome dos arquivos, ajuste a linha do `manifest` no `<head>` do seu `index.html`:
  ```html
  <link rel="manifest" href="manifest.webmanifest">
  ```
- O **service worker** fica ativo após o primeiro carregamento.
- Para forçar atualização offline após mudanças, aumente a versão do cache em `sw.js` (ex.: `benatti-gym-v2`).

## Próximos passos (opcionais)
- Adicionar ícones ao `manifest.webmanifest` (PNG 192x192 e 512x512).
- Habilitar Web Push para lembretes com a tela bloqueada (posso te guiar depois).
