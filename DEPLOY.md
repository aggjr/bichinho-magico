# Bichinho Mágico — deploy no tablet Android

## O que foi preparado
O jogo é um **PWA** (Progressive Web App): no tablet Android ele instala como aplicativo, com ícone na tela inicial, tela cheia e funciona offline depois da primeira abertura.

## Endereço (depois do publish)
https://aggjr.github.io/bichinho-magico/

## Como instalar no tablet Android
1. Abra o Chrome no tablet.
2. Entre no endereço acima.
3. Toque no menu **⋮** → **Instalar aplicativo** (ou **Adicionar à tela inicial**).
4. Confirme. O ícone **Bichinho** aparece na tela inicial.
5. Abra pelo ícone — abre em tela cheia, sem barra do navegador.

## Como republicar depois de mudanças
No computador, na pasta do projeto:

```bash
node scripts/bump-app-version.js
git add -A
git commit -m "atualiza o jogo"
git push
```

O GitHub Pages atualiza em 1–2 minutos. No tablet, abra o app e puxe para atualizar, ou feche e abra de novo.
