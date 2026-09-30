# Bichinho Mágico — instalar no tablet / celular

Endereço: **https://aggjr.github.io/bichinho-magico/**

## Android (Chrome)
1. Abra o link no Chrome.
2. Menu **⋮** → **Instalar aplicativo** (ou **Adicionar à tela inicial**).
3. Abra pelo ícone **Bichinho** — tela cheia.

## iPhone / iPad (Safari)
1. Abra o link no **Safari** (não use Chrome no iPhone para instalar).
2. Toque em **Compartilhar** (quadrado com seta para cima).
3. Role e toque em **Adicionar à Tela de Início**.
4. Toque em **Adicionar**.
5. Abra pelo ícone **Bichinho** — abre como app, com barra de status transparente.

No primeiro acesso pelo Safari, aparece um cartão com esses passos. Depois de instalar, o cartão some.

## Republicar atualizações
```bash
node scripts/bump-app-version.js
git add -A
git commit -m "atualiza o jogo"
git push
```
No aparelho, feche o app e abra de novo (ou atualize a página no Safari).
