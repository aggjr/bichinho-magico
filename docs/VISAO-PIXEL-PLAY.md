# Pixel Play — Documento de visão e ideias (validação)

**Versão do documento:** 1.1 (decisões do autor após avaliação)  
**Data:** 2026-10-01  
**Marca atual:** Pixel Play (antes: Bichinho Mágico)  
**Objetivo deste arquivo:** reunir **100% das ideias levantadas** na conversa de produto, com as decisões finais do autor, para validação por humanos ou outro agente.  
**Status:** visão / backlog de produto — **não** é especificação de implementação fechada. Itens já existentes no código estão marcados.

---

## 0. Decisões do autor (v1.1) — leia antes de tudo

Após avaliação de pontos fortes/fracos, o autor fixou o seguinte. **Em caso de conflito, esta seção prevalece sobre o resto do documento.**

### 0.1 Natureza do projeto
- Projeto **solo**, começado em 2026-09-30, com apoio de agente de IA.
- **Educativo, não financeiro.** Renda é efeito colateral, nunca motor.
- As ideias vêm das filhas e amigas do autor (insumo abundante); o trabalho difícil é **reduzir** ao escopo.
- Autor é pesquisador: o jogo é também um **experimento**.

### 0.2 Meta e prazo
- **Até novembro de 2026:** boa infra (nuvem no servidor próprio) + interação com o PIXEL muito mais divertida (ele se esconde, brinca, surpreende).
- Marco de campo: **feira de comércio do 4º ano** do colégio da filha (crianças de 9–10 anos compram itens e revendem). Teste: **produto virtual vs produto físico** — a criança troca a bala/chocolate por um ovinho de PIXEL, roupinhas, comidinhas especiais?
- Hipótese secundária: o colégio pode vetar tablet/itens virtuais; o autor quer observar isso de perto (debate sobre preparar crianças para um mundo imerso em tecnologia: tradução simultânea, óculos adaptativos, etc.).
- Observação do autor: o projeto escolar atual é mal feito — a criança não anota custo, o que vendeu nem por quanto.

### 0.3 Princípios de engajamento
- **Não premiar "voltar todo dia"** (sem login diário, sem streak). A criança volta porque o PIXEL **precisa** dela — sede, fome, carinho — como um animal de verdade.
- Consequência real: PIXEL mal cuidado **fica mal por semanas** até voltar a brincar como antes. Dói um pouco; é educativo, como um hamster ou um carro sem manutenção.

### 0.4 Hospital veterinário / oficina pública (decisão fechada)
- **Grátis sempre.** Não há vet pago. A ideia "vet/oficina pago" da seção 9 fica **cortada**.
- Hospital **público**, com **fila visível** e **tempo de espera bem claro** (a criança vê o tamanho da fila).
- No início, a fila é preenchida por **PIXELs virtuais do servidor** para gerar demanda de voluntariado; o PIXEL da criança **passa na frente** desses virtuais e é atendido na hora.
- Voluntariado = fundamental para civilidade e **lei da reciprocidade**.
- **Anjo do Mês:** por volume de ajuda **e/ou sorteio** entre quem ajudou (sorteio amplia empatia e visão coletiva; não é só quem mais "trabalhou").
- Voluntário pode ganhar **o mesmo presente** que o mais estiloso do desfile — o prêmio não exige gastar.

### 0.5 Monetização — o que fica e o que sai
- **Contra demanda empurrada por definição.**
- **Correio Pixel (R$ 0,99/mês) — CORTADO.** Era ideia da IA. Sem pacotes mensais, sem assinatura.
- **Titanic / únicos — CORTADO.** A filha chorou só de saber que existiria algo que ela nunca teria. No máximo vira **figurinha rara que qualquer um pode ter**.
- **Álbum:** começa com volume **bem pequeno**; 1000 é exagero (sem tempo nem IA para tanta arte).
- **Figurinhas/envelopes:** a criança compra **se quiser**, com a própria mesada / dinheiro de aniversário, pedindo ao pai. Nada recorrente.
- **O que pode custar:** itens que a própria criança **deseja** para se apresentar — salão de beleza, look novo, acessórios, comidinhas especiais, ovinho. Demanda **puxada** pela criança.
- **Desfile:** candidatar e votar **grátis**. Autor prefere arriscar "5 candidatas e 30 amiguinhas votando" a empurrar qualquer coisa.

### 0.6 Escopo prático até novembro
1. Infra nuvem (servidor próprio, deviceId; vínculo ao responsável se houver venda).
2. PIXEL mais vivo e divertido (esconder, brincar, reagir).
3. Hospital/oficina pública voluntária com fila visível + PIXELs virtuais.
4. Armário: roupinhas e acessórios para vários PIXELs (insumo para a feira).
5. Desfile simples com voto grátis.
6. Álbum pequeno.
7. Forma de "vender" na feira (ver 0.7).

### 0.7 Nota técnica para a feira (sugestão do agente, a validar)
Para contornar veto a tablet e, ao mesmo tempo, atender a falha pedagógica do projeto do colégio:
- Vender **cartões físicos impressos com código de resgate** (ovinho, roupinha, comidinha). O comprador digita no app em casa.
- O app registra automaticamente **o que foi vendido, por quanto, quando** — a filha tem o "caderno de vendas" que o projeto escolar não ensina.
- Serve também como experimento controlado: item virtual com embalagem física vs doce.

**Fluxo decidido pelo autor:**
1. O autor gera os cartões antes da feira, numerados (nº 001, 002…), cada um ligado a um produto.
2. A filha vende cartões físicos e controla pelo número qual cartão é qual produto, por quanto vendeu e quando.
3. Em casa, a criança fotografa o QR code e ativa a compra no app.

**Detalhes técnicos:**
- QR com link `https://<domínio>/?resgatar=<código>`: a câmera do celular abre o app direto no resgate.
- Dois identificadores por cartão: o **número visível** (001), para controle da vendedora, e um **código secreto aleatório** no QR, que não dá para adivinhar a partir do número.
- Cada código vale **uma vez só**. O servidor guarda tabela `cartão → produto → resgatado? por qual deviceId, quando`. Por isso o resgate precisa da nuvem pronta antes da feira.
- O QR precisa ficar **escondido até a compra** (raspadinha, adesivo, cartão dobrado ou envelope fechado). Senão alguém fotografa na banca sem pagar.
- Painel simples para o autor/filha: cartões gerados, vendidos (marcados por ela), resgatados.

---

## 1. Resumo executivo

Pixel Play é um Tamagotchi / cuidador de **PIXELs** (animais, slime, veículos/máquinas) em PWA, pensado para crianças, com:

- Cuidado local rico (fome, sede, banho, carinho, sono, **saúde**, brincar).
- **Customização** (armário: brinquedos, roupas, fantasias).
- **Coleção** de PIXELs salvos no aparelho (e depois na nuvem).
- Camada social de **empatia** (hospital público voluntário, refeitório comunitário, Anjo do Mês).
- Camada de **desfile / voto** (mês, estação, ano) com candidatura e voto grátis.
- Camada de **coleção educativa** (álbum pequeno: países, biomas, extinção).
- Monetização **secundária e puxada pela criança**, via PWA (sem loja Apple/Google), gateway **sem taxa fixa** (ex.: Mercado Pago).
- **Renda não é o objetivo**; comportamentos bons do mundo real e diversão vêm primeiro.

Princípio-guia:

> Cuidar e ajudar é grátis. Brilhar e colecionar é escolha da criança.

---

## 2. O que já existe (código / produto atual)

Estado ~V0.1.27:

| Área | Status | Notas |
|------|--------|--------|
| PWA (manifest, SW, instalar na tela inicial) | Existe | Marca Pixel Play |
| Ovo + aquecer + nascimento justo (bag) | Existe | Filtro menina/menino/ambos |
| Muitas espécies (animais, slime, veículos) | Existe | Arte webp + moods |
| Necessidades + cuidados 1–6 | Existe | Comer, beber, banho, carinho, dormir |
| Saúde + botão Heal + humor doente | Parcial | Decay por abandono; heal lateral |
| Brincar + perseguição do brinquedo | Parcial | Combo; toy arrastável |
| Armário (brinquedos / roupas / fantasias) overlays emoji | Parcial | Tudo liberado ao nascer (v1) |
| Coleção em `localStorage` + retomar pet | Parcial | Tecla `0` arquiva e nasce ovo novo |
| Galeria últimos PIXELs / progresso | Existe | `ultimos-10.html`, `progresso.html` |
| Nuvem EasyPanel / API | **Não implementado** | Planejado |
| Hospital / refeitório / álbum / desfile / pagamentos | **Não implementado** | Visão |

Chaves locais (não renomear sem migração): `bichinho-collection-v1`, `bichinho-audience`, `bichinho-hatch-bag`, cache SW `bichinho-v*`.

---

## 3. Personagens: o que é um PIXEL

### 3.1 Tipos
1. **Animais / criaturas** (gatinho, dinossauro, unicórnio, morcego, foca, slime, etc.).
2. **Máquinas / veículos** (carro, trem, navio, foguete, trator, helicóptero) — cuidados em linguagem de máquina (peças, óleo, oficina).
3. ~~Lendas / únicos (Titanic etc.)~~ — **cortado (0.5)**; no máximo figurinha rara acessível a todos.

### 3.2 Ciclo de vida
- Ovo → aquecer → nascer → crescer por estágios.
- Necessidades caem; humor (feliz / triste / nervoso / doente / sono).
- Skits / trapalhadas por espécie; traços fortes sorteados.

### 3.3 Público
- Escolha no início: menina / menino / tanto faz — filtra pool de nascimento.

---

## 4. Cuidado e interatividade do PIXEL (solo)

### 4.1 Necessidades
- Fome, sede, higiene, carinho, energia/sono, **saúde**.
- Saúde sobe com bom cuidado e cai com abandono.

### 4.2 Ações
- Comer, beber, banho, carinho (também arrastar no pet), dormir/acordar.
- Saúde / heal (remédio ou "conserto" se máquina).
- Brincar: arrastar brinquedo, PIXEL corre atrás; cansa e aumenta amor; combo.

### 4.3 Meta até novembro: PIXEL mais vivo
- Ele **se esconde**, brinca de alguma coisa, reage de surpresa — brincar precisa ser **divertido**, não só gauge.

### 4.4 Customização (Armário)
- Abas: Brinquedos (toy do chase), Roupas (chapéu, pescoço, corpo, mão), Fantasias (óculos, máscaras, tiaras).
- v1: overlays emoji/CSS para todas as espécies.
- É o **insumo principal da feira**: roupinhas e acessórios para vários PIXELs.

### 4.5 Coleção local
- Vários PIXELs salvos; um ativo; retoma ao abrir; novo ovo arquiva o atual.

---

## 5. Persistência e distribuição

### 5.1 Atual
- `localStorage`; teste via GitHub Pages ou arquivo local.

### 5.2 Nuvem (meta novembro)
- Servidor do autor (EasyPanel + Cloudflare); **Node + SQLite** em volume.
- Identidade **sem senha:** `deviceId` por aparelho.
- Limites conhecidos: limpar dados = novo id; outro aparelho = outra coleção.
- **Se houver venda**, vincular ao responsável antes (código de família / e-mail) para não perder compras.
- Git privado; jogadores acessam pelo domínio.
- Offline: cache local + sync.

---

## 6. Monetização (secundária, puxada pela criança)

### 6.1 Distribuição
- PWA fora das lojas; cobrança web (Mercado Pago / Pix). Se um dia for app nativo, regras de IAP mudam.

### 6.2 Gateway
- Perfil: R$ 0,99–9,99. Preferir **% sem valor fixo**.
- Mercado Pago: cartão ~3,98–4,98%, Pix ~0,99%, sem fixo → melhor encaixe.
- InfinitePay: sem fixo, crédito D+1 ~4,20%.
- Stripe / PagBank / Asaas / Pagar.me: % + fixo → ruins para microticket.

### 6.3 Itens que podem custar (demanda puxada)
| Item | Preço ideia |
|------|-------------|
| Ovo surpresa | R$ 1,99 |
| Ovo escolhido | R$ 4,99 |
| Brinquedo | R$ 0,99 (para sempre) |
| Roupas / acessórios / salão de beleza / cabelos | R$ 0,99–4,99 |
| Comidinha especial (cosmética, não essencial) | ~R$ 0,99 |
| Envelope de figurinhas (5) | R$ 2,99 |
| Salão de festas premium | R$ 9,99 (festinha simples grátis) |

### 6.4 ~~Assinatura / Correio Pixel~~
> **CORTADO (v1.1).** Ideia da IA; autor é contra demanda empurrada. Sem assinatura, sem pacote mensal.

### 6.5 Princípios
- Quem paga é o responsável (PIN); dinheiro da **mesada / aniversário** da criança, pedido ao pai.
- LGPD / dados de criança.
- Nunca travar sobrevivência atrás de paywall.
- Sem streak, sem "volte amanhã".

---

## 7. Álbum de figurinhas (coleção educativa)

- Começa **pequeno** (dezenas, não 1000).
- Páginas por país / bioma (canguru – Austrália); raridades comum → rara → dourada (prêmio).
- Página **em extinção**: texto curto e respeitoso.
- Nem toda figurinha precisa ser PIXEL jogável.
- Envelope R$ 2,99 → 5; algumas grátis por jogar / ajudar / prêmios.
- **Troca entre crianças:** rejeitada como eixo (mal vista, risco de briga/golpe).

---

## 8. Desfile, moda e demanda invertida

- Candidatar: **grátis**. Votar: **grátis**.
- A criança **quer** look/salão para aparecer bem — demanda puxada.
- Categorias: mais fofo, mais engraçado, mais diferente, melhor look, mais bem cuidado.
- Calendário: Melhor do mês → Rainha da estação → Melhor do trimestre → PIXEL do Ano.
- Prêmios: figurinha dourada / rara / escolher 1 PIXEL novo. **Voluntário do hospital pode ganhar o mesmo prêmio.**
- Armário sazonal redefine moda a cada estação.
- Anti pay-to-win: cuidado + criatividade pesam; possível "mais votado sem itens pagos".
- ~~Únicos / Titanic~~ — **cortado**.

---

## 9. Saúde crítica, hospital e oficina

> **v1.1: vet/oficina PAGO está CORTADO.** O que vale é a seção 0.4.

- Sem cuidado → PIXEL passa mal de verdade e **fica mal por semanas**.
- Tratamento caseiro grátis até um ponto.
- Depois: **hospital veterinário / oficina pública** — grátis, fila visível, tempo de espera claro, atendido por voluntários (e passa na frente dos PIXELs virtuais do servidor).
- Comida básica grátis; comidinha especial é cosmética.
- Nada de morte forçada para converter compra.

---

## 10. Social de empatia (núcleo)

### 10.1 Hospital / oficina pública voluntária
- Criança pede ajuda; PIXEL entra na fila pública.
- Voluntário ajuda de graça: carinho, comida básica, remédio simples, **exame com equipamento**.
- Conta só se melhorar de verdade; limites anti-farm.
- Fila inicial com PIXELs virtuais do servidor.

### 10.2 Refeitório comunitário
- Comida do refeitório acelera a melhora.
- Produzir exige **PIXELs voluntários** (lavar, cozinhar, servir).
- Panela comunitária → pratos na fila. Panela vazia = recuperação mais lenta, não trava.

### 10.3 Anjo do Mês
- Por volume de ajuda **e/ou sorteio** entre quem ajudou.
- Critério é cura real, não dinheiro. 100% grátis.
- Prêmio igual ao do desfile (figurinha dourada etc.).

### 10.4 Trabalho em grupo mínimo
- Missão da semana: "ajudar N PIXELs" — barra global, celebração ao completar.

### 10.5 Futuro
- Brincar juntos, festinha/aniversário (`hatchAt`), PIXEL artista cantando na língua da espécie.

---

## 11. Escopo e simplicidade

- Jogo deve permanecer **simples**.
- Ordem de construção = seção 0.6.

---

## 12. Grátis vs pago (consolidado)

**Sempre grátis:** nascer/cuidar básico, brincar, pedir/dar ajuda, refeitório voluntário, candidatar/votar, Anjo do Mês, hospital público, festinha simples.

**Opcional (se a criança quiser):** ovo surpresa/escolhido, brinquedos, roupas/fantasias/salão de beleza, envelope, salão de festas premium, comidinha especial.

---

## 13. Ideias rejeitadas, cortadas ou com ressalva

| Ideia | Decisão |
|-------|---------|
| Troca de figurinhas entre crianças | Não é eixo |
| Correio Pixel / assinatura | **Cortado (v1.1)** |
| Titanic / PIXEL único | **Cortado (v1.1)** — rara acessível no máximo |
| Vet / oficina pago | **Cortado (v1.1)** — hospital público grátis |
| Álbum de 1000 | Reduzido a pequeno |
| Streak / recompensa por voltar | **Rejeitado (v1.1)** |
| Clube VIP caro | Rejeitado |
| Taxa fixa por venda | Evitar |
| Repo público obrigatório | Não |
| Nuvem antes de fechar local | Não; local primeiro |

---

## 14. Riscos para o validador

1. Escopo vs prazo (novembro) para um dev solo.
2. Social precisa de gente — mitigado por PIXELs virtuais na fila; checar se é suficiente.
3. Moderação de votos/nomes/looks em público infantil.
4. deviceId + compras: perda de save → precisa vínculo ao responsável antes de vender.
5. "Fica mal por semanas" pode frustrar; calibrar para que ajudar/cuidar encurte de forma visível.
6. Tom da página de extinção.
7. Veto do colégio ao tablet — plano B dos cartões com código.

---

## 15. Checklist para outro agente

Para cada épico: `manter | adiar | cortar | reformular`, verificando:
- [ ] alinhado a "cuidar/ajudar grátis; brilhar é escolha"
- [ ] simples para criança
- [ ] viável em PWA + Node/SQLite até novembro
- [ ] sem demanda empurrada
- [ ] tem métrica (ajudas/dia, tempo médio na fila, % que nunca paga)
- [ ] tem "frase de pai"

---

## 16. Épicos (backlog v1.1)

1. Core solo + PIXEL mais vivo  
2. Nuvem deviceId (+ vínculo responsável se venda)  
3. Hospital/oficina pública com fila visível + PIXELs virtuais  
4. Refeitório voluntário  
5. Anjo do Mês (volume e/ou sorteio)  
6. Missão coletiva semanal  
7. Desfile / votos grátis + armário sazonal  
8. Álbum pequeno + envelopes  
9. Loja avulsa puxada (ovos, roupas, salão de beleza, comidinha)  
10. Cartões com código para a feira  
11. Pagamentos Mercado Pago + PIN  
12. Deploy EasyPanel + Cloudflare + Git privado  
13. Multi-pet festa / artista (futuro)

---

## 17. Frases de produto

- *Pixel Play — aqueça o ovo, cuide do seu PIXEL, vista, brinque e veja ele crescer.*
- *Cuidar e ajudar é grátis. Brilhar e colecionar é escolha.*
- *No hospital a gente cuida. No refeitório a gente cozinha junto.*
- *Quem ajuda pode ser o Anjo do Mês.*
- *Desfile Pixel — vote grátis, candidate grátis, prepare o look.*

---

## 18. Histórico da conversa

1. Máxima interatividade; saúde + brincar.
2. Armário + coleção local.
3. Nuvem no servidor próprio; sem senha; Git privado depois.
4. Social futuro: festa, aniversário, artista.
5. Terminar local primeiro.
6. PWA fora das lojas; micropreços; Mercado Pago sem fixo.
7. Correio R$0,99 (IA) → **cortado pelo autor**.
8. Álbum / envelopes / extinção; troca rejeitada.
9. Desfile + demanda invertida; estações; Titanic → **cortado**.
10. Vet pago → **cortado**; hospital público com fila visível; refeitório voluntário; Anjo do Mês.
11. Marca Pixel Play.
12. Avaliação de forças/fraquezas → decisões v1.1 (seção 0), meta novembro, experimento da feira.

---

*Fim do documento de visão Pixel Play v1.1*
