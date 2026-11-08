# Prompt para o Codex: Ar Livre impecável + atualizar a skill de sites

> Cole tudo abaixo no Codex com a pasta `C:\Users\Gabriel\Desktop\PROJETOS\Outras-Empresas\ar-livre-ar-condicionado` aberta. O arquivo `skills-design.zip` já está nessa pasta. Use o modelo de raciocínio mais forte disponível.

---

Você vai fazer **duas entregas**, nesta ordem:

- **PARTE A:** atualizar a sua skill de criação de sites (`newsec-sites`) para que **todo site que eu pedir daqui em diante** já saia num padrão profissional e impecável, que impressione quem vê, com animações e efeitos 3D de verdade.
- **PARTE B:** aplicar esse padrão novo para deixar o site da **Ar Livre Ar Condicionado** impecável.

Faça a Parte A primeiro, porque a Parte B deve ser executada **seguindo a skill atualizada**. Trabalhe com profundidade máxima: pense, implemente, olhe o resultado no navegador, corrija e repita. Não entregue o primeiro rascunho.

---

## PARTE A — Atualizar as skills de criação de sites

### A1. Instalar as skills de design

1. Descompacte `skills-design.zip` (está na pasta do projeto) em `C:\Users\Gabriel\.codex\skills\`. Devem surgir cinco pastas: `ui-ux-pro-max`, `design-taste-frontend`, `impeccable`, `animate` e `improve-animations`. Se alguma já existir, mantenha a versão mais completa.
2. Leia o `SKILL.md` de cada uma e as referências citadas nele, para usá-las de verdade e não só por nome. Se algum script de skill não rodar, use os `.md` e `.csv` de dados no lugar dele.

Papel de cada skill no fluxo de sites:

| Skill | Quando usar |
|---|---|
| `ui-ux-pro-max` | Design system: paleta, tipografia, espaçamento, UX de conversão e acessibilidade. Consultar `data/` (estilos, paletas, pares de fontes, presets GSAP). |
| `design-taste-frontend` | Direção de arte: **uma ideia central**, composição por seção, regras anti-“cara de IA” e o ciclo olhar e corrigir com screenshots. |
| `impeccable` | Polimento final: hierarquia, tipografia, cor, estados, responsivo, microcopy e casos de borda. |
| `animate` | Construir cada animação (filosofia Emil Kowalski). Para cada uma, decidir: deve animar? com que propósito? com que ferramenta e propriedades? com que curva e duração? como é interrompida e como sai? |
| `improve-animations` | Auditoria final de todo o movimento com a régua do `AUDIT.md`. |

### A2. Atualizar `C:\Users\Gabriel\.codex\skills\newsec-sites`

Leia o `SKILL.md` e o `references/NEWSEC-MASTER-PROMPT.md` atuais e faça o seguinte:

1. **Criar `references/PADRAO-IMPECAVEL.md`** com o padrão de qualidade da seção “Padrão impecável” abaixo, escrito como checklist operacional.
2. **Criar `references/3D-PLAYBOOK.md`** com o guia técnico da seção “Playbook 3D” abaixo, incluindo trechos de código prontos e testados (cena base Three.js, loop com pausa fora da tela e fallback).
3. **Criar `references/PREFERENCIAS-GABRIEL.md`** com a lista “Preferências do Gabriel” abaixo.
4. **Atualizar o `SKILL.md`:**
   - Antes de pesquisar ou codar, ler `NEWSEC-MASTER-PROMPT.md`, `PADRAO-IMPECAVEL.md`, `3D-PLAYBOOK.md` e `PREFERENCIAS-GABRIEL.md`, e carregar as cinco skills de design.
   - Todo site precisa ter **pelo menos um momento 3D real** (WebGL/Three.js ou CSS 3D com profundidade perceptível) ligado ao produto ou à marca, com fallback.
   - **Portão de entrega:** o site só é entregue depois de passar pela checklist do `PADRAO-IMPECAVEL.md` e pelos prints em 1440, 768 e 390 px, além dos testes com reduced motion e sem JS.
   - Atualizar o `description` do frontmatter para mencionar “padrão impecável, animações e efeitos 3D”.
5. **Resolver conflitos no `NEWSEC-MASTER-PROMPT.md`:**
   - **Stack:** para demos locais que eu abro via `file://`, o padrão é HTML/CSS/JS estático com bibliotecas locais em `assets/vendor/`. ES modules **não carregam via `file://`**, então use builds clássicos (UMD). Next.js e React só quando eu pedir ou quando o projeto já for assim.
   - **Mouse tracking:** troque “mouse tracking discreto / interação com cursor” pela regra das preferências. Não altere o cursor e não crie efeito que siga o mouse pela página. Apenas o objeto 3D principal pode reagir ao ponteiro, no máximo 3 a 4 graus e só no desktop.
   - **Loading:** vale o que está nas preferências (curto, uma vez por sessão, sem textos “CARREGANDO” e sem botão “Entrar no site”).
6. Valide a skill com `quick_validate.py` (da skill `skill-creator` do sistema), se rodar.

### Padrão impecável (conteúdo do `PADRAO-IMPECAVEL.md`)

**Ideia e composição**
- Uma ideia central por site, derivada da marca, que guia a luz, a cor, o movimento e o 3D.
- Um momento-assinatura memorável (geralmente o 3D do topo). As outras seções devem ser mais calmas e cada uma ter seu próprio ritmo.
- Títulos com no máximo 2 a 3 linhas, `text-wrap: balance`, tracking que **nunca** deixa letras encostando (fontes display: entre −0,02em e −0,04em). Medir com print.
- **Proibido:** eyebrows em caixa alta com tracking em toda seção; numeração decorativa (01, 02, “01—03”); palavra colorida em todo título; molduras de linha fina deslocadas atrás de imagens; textos em inglês sem motivo; avisos “ilustrativo” repetidos (uma legenda discreta por imagem e uma nota no rodapé); glassmorphism; névoa ou blur sobre o topo; cards idênticos em série.
- Raios de canto consistentes (uma escala só) e sombras em várias camadas (contato + ambiente + profundidade), nunca uma sombra única e dura.

**Luz e profundidade**
- Iluminação como linguagem: uma fonte de luz coerente por seção (glow radial, `mix-blend-mode: screen/plus-lighter`, rim light em objetos e reflexo especular no 3D).
- Pelo menos três planos de profundidade no topo (fundo, objeto e primeiro plano), com parallax ligado à rolagem.

**Movimento** (Emil Kowalski)
- Curvas: `--ease-out: cubic-bezier(.23,1,.32,1)` para entradas e `--ease-in-out: cubic-bezier(.77,0,.175,1)` para movimento em tela. Linear apenas em loops contínuos. Nunca `ease-in`, `transition: all` ou `scale(0)`.
- Animar só `transform`, `opacity` e `clip-path`. Interações de UI com menos de 300 ms; `:active { scale(.97) }`; hover dentro de `@media (hover:hover) and (pointer:fine)`.
- Entradas variadas por seção (máscara de linha nos títulos, clip-path em imagens, stagger de 30 a 80 ms em listas), nunca o mesmo fade-up em tudo.
- Lenis + GSAP ScrollTrigger integrados: `lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(t=>lenis.raf(t*1000)); gsap.ticker.lagSmoothing(0)`.
- `prefers-reduced-motion`: animações mais gentis, não zero (manter fades, remover deslocamentos, parallax, 3D animado e esteiras automáticas).
- Sem JS, o conteúdo aparece. Estados ocultos só sob `html.js`.

**Conversão e conteúdo**
- Em 5 segundos o visitante entende o que a empresa faz, para quem e qual é o próximo passo (WhatsApp com mensagem pronta).
- Nunca inventar fatos, números, depoimentos, garantias, preços ou horários. Imagens geradas são identificadas como ilustrativas.

**Técnica**
- Fontes e bibliotecas locais; imagens em WebP/AVIF com `srcset`, `width`/`height` e lazy abaixo da dobra; **um** CSS organizado (nada de arquivos-remendo sobrescrevendo outros); console limpo; sem rolagem horizontal; alvos de toque com pelo menos 44 px; contraste AA; foco visível; menu móvel com `inert` e Esc.

**Verificação (portão de entrega)**
- Prints (Playwright ou Chrome) em 1440, 768 e 390 px: topo, um quadro no meio de cada animação importante, avaliações, CTA final e rodapé. Testar também reduced motion e sem JS.
- Para cada print, responder: alguma letra encosta? Algo foi cortado sem intenção? Há área vazia sem propósito? O 3D aparece e está fluido? Corrigir e repetir.
- Rodar a auditoria do `improve-animations` e o polimento do `impeccable`.

### Playbook 3D (conteúdo do `3D-PLAYBOOK.md`)

- **Biblioteca:** `three@0.149.0`, arquivo `build/three.min.js` (última versão com build UMD clássico, que funciona em `file://`), salvo em `assets/vendor/`. Não use import maps nem `examples/jsm` em demos `file://`.
- **Objeto do produto feito em código** quando não houver modelo oficial: `THREE.Shape` com cantos arredondados + `ExtrudeGeometry` (com bevel). Material `MeshPhysicalMaterial` (clearcoat, roughness baixa) para acabamento “de produto”. Luzes: `HemisphereLight` + `DirectionalLight` principal + rim light colorida da marca. Sombra de contato: plano com textura radial borrada gerada em canvas (mais barato e mais bonito que shadow map).
- **Partículas:** `Points`/`InstancedMesh` com as cores da marca, em fluxos curvos (curvas de Bézier ou campo de ruído), em `BufferGeometry` atualizada no shader ou em lote.
- **Câmera e rolagem:** a rolagem (ScrollTrigger com `scrub`) controla a órbita da câmera, a abertura de partes e o “explodir/montar” de componentes. O tempo dá vida ociosa sutil (respirar e flutuar).
- **Desempenho:** `renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75))`; menos partículas no celular; `IntersectionObserver` para **pausar o render fora da tela**; `visibilitychange` para pausar em aba oculta; descartar geometrias ao sair.
- **Fallback obrigatório:** sem WebGL, com `prefers-reduced-motion` ou com `navigator.connection.saveData`, mostrar a imagem estática equivalente (que já ocupa o lugar, para não haver layout shift). O canvas entra com fade quando o primeiro frame é renderizado.
- **3D em CSS** para o restante do site: `perspective` no container, `translateZ` em camadas, `rotateX/rotateY` guiados pela rolagem (não pelo mouse), `transform-style: preserve-3d` e sombras que acompanham a inclinação.

### Preferências do Gabriel (conteúdo do `PREFERENCIAS-GABRIEL.md`)

1. Tudo em **português do Brasil**, inclusive as respostas.
2. **Não alterar o cursor do mouse** e nada de efeitos que sigam o mouse pela página.
3. **Nada de névoa, blur ou neblina** cobrindo o topo.
4. Avaliações em **esteira contínua e suave**: cards andando sem parar em loop infinito (rAF + `transform` + clones `aria-hidden`/`inert`). Desaceleram suavemente sob o mouse, aceitam arrastar com inércia, setas deslizam um card com easing e há botão Pausar. **Nunca** carrossel que para a cada card.
5. Rodapé **forte e compacto**: marca + frase, contato, endereço com Maps, links, nota de avaliações e “Voltar ao topo”. Nada de palavra gigante e espaço vazio.
6. Seleção de serviços guiada pela rolagem: a lista à esquerda acompanha a descida e o visual à direita troca (sticky + clip-path).
7. Intro de marca curta (até ~1,5 s), **uma vez por sessão** (`sessionStorage` com try/catch), com saída imediata e limite de espera. Sem textos “CARREGANDO” e sem botão “Entrar no site”.
8. Os sites são mostrados ao cliente **em vídeo**: os efeitos precisam ser visíveis e fluidos na gravação, e a entrega lista a ordem dos efeitos para gravar.
9. Abrir a versão final no Chrome. Avisar para fechar as abas do editor e não sobrescrever com buffer antigo.

---

## PARTE B — Ar Livre Ar Condicionado: do bom ao impecável

Pasta: `C:\Users\Gabriel\Desktop\PROJETOS\Outras-Empresas\ar-livre-ar-condicionado`. Leia o `RESEARCH.md` (fatos, limites, conceito “Espaço para respirar”) e todo o código. Faça backup (`backup/` com o `index.html`, `styles.css`, `rebuild.css` e `script.js` atuais).

### Diagnóstico (analisei o site no navegador em 1440 e 390 px)

1. **Intro:** tela clara com “Um respiro antes de começar.”, barra, “CARREGANDO”, “Ajustando o ambiente para você” e botão “Entrar no site”. Tem texto demais e parece um loader falso. **Trocar** por um momento de marca de no máximo 1,5 s: os pontos coloridos da espiral do logo se organizam em 3D e se dissolvem no fluxo de ar do topo.
2. **Cabeçalho:** barra cinza-clara sobre o topo azul-escuro (quebra a atmosfera) e logo PNG pequeno. Deve ficar **transparente sobre o topo** e ganhar fundo só ao rolar. Refazer o logo em **SVG** a partir do `logo-oficial.png`, mantendo o PNG como referência e anotando no `RESEARCH.md` que é preciso pedir o vetor oficial.
3. **Título do topo:** tracking tão apertado que as letras se encostam (“Seu ar,bem escolhido.”). São três linhas, com a do meio em turquesa. **Corrigir o tracking** e reduzir para 2 ou 3 linhas sem colisão.
4. **Produto do topo:** a imagem do split sai cortada pela direita sem intenção clara, o box “01—03 / ESCOLHA · INSTALAÇÃO · CUIDADO” é decorativo e há rótulos “AR LIVRE AR CONDICIONADO” e “ACLIMAÇÃO · SÃO PAULO —— AR LIVRE”. **Substituir pelo momento 3D** (abaixo) e remover os rótulos.
5. **Faixa turquesa** em caixa alta com tracking (“ESCOLHA CERTA ✳ INSTALAÇÃO CUIDADOSA…”) parece barata. Remover ou trocar por uma faixa tipográfica grande e elegante cuja velocidade acompanha a rolagem.
6. **Tiques de template em todas as seções:** eyebrow em caixa alta (“CONFORTO COMEÇA ANTES DO PRIMEIRO LIGAR”, “UM SERVIÇO PARA CADA MOMENTO”, “POR ONDE COMEÇAR?”, “VOZES REAIS”, “VAMOS CONVERSAR?”) **e** palavra colorida em todo título (“vem o espaço.”, “Sem complicar.”, “seu momento.”, “conta melhor.”, “Conte o que você precisa.”). Remova os eyebrows e mantenha **no máximo um** título com acento de cor no site inteiro.
7. **Molduras de linha fina deslocadas** atrás das fotos e cantos retos misturados com cantos arredondados. Remova as molduras e adote uma escala única de raios, com sombras em camadas.
8. **Serviços:** lista numerada 01 a 04 com imagem lateral fixa. Transformar em **seleção guiada pela rolagem** (lista à esquerda; à direita um visual sticky que troca com clip-path e leve rotação 3D). No celular, cards empilhados com imagem.
9. **“Por onde começar?”:** três botões em caixinhas parecem um formulário. Transformar em três **cartões 3D grandes** (perspectiva, `rotateX` de entrada guiado pela rolagem, sombra que acompanha) que, ao clicar, abrem o WhatsApp com a mensagem do caso.
10. **“Cuidado por dentro” (vista explodida):** hoje é uma imagem estática. Fazer a peça **se montar ou explodir com a rolagem**: em Three.js, com as partes do split procedural afastando-se no eixo Z, ou em CSS 3D com camadas recortadas. Rótulos discretos devem surgir por máscara.
11. **Avaliações:** o primeiro card começa cortado na borda esquerda, as aspas gigantes se sobrepõem ao texto e os cards são brancos e chapados com uma linha colorida no topo. Refazer como **esteira contínua** (preferência 4), com leve curvatura 3D: cada card gira em `rotateY` conforme a distância do centro, com perspectiva. Variar os cards (claro, azul profundo, um com o acento da marca). Usar só os 8 trechos reais e a nota 4,8 / 153 com o aviso de atualização.
12. **CTA final:** chips do formulário chapados. Deixar o cartão do montador de mensagem “iluminado” (glow da marca, sombras profundas, chips com estado selecionado claro) e mostrar uma **prévia do balão** da mensagem do WhatsApp atualizada ao vivo.
13. **Mobile:** a barra fixa “Pedir orçamento” cobre o conteúdo o tempo todo. Mostre-a só depois do topo e esconda-a perto do CTA final e do rodapé.
14. **Rodapé:** está ok, mas fraco. Aplicar a preferência 5 (inclui telefone fixo, e-mail e WhatsApp do `RESEARCH.md`).
15. **Técnica:**
    - `styles.css` (33 KB) mais `rebuild.css` (18 KB) sobrescrevendo um ao outro: **consolidar num CSS só**.
    - `lenis.min.js` está em `assets/vendor` mas **não é carregado**: integrar.
    - Remover a inclinação que segue o cursor (preferência 2).
    - Os PNGs originais (1,1 MB e 2 MB) não devem ser referenciados.

### Momento 3D principal (assinatura): “Espaço para respirar”

- O topo vira uma cena **Three.js**: um split **procedural** e sem marca (corpo branco em `MeshPhysicalMaterial` com clearcoat, aleta que abre devagar e LED do display com glow), iluminado por uma luz fria e uma rim light turquesa.
- Da aleta sai o **fluxo de ar em partículas nas quatro cores do logo** (vermelho, azul, turquesa e verde). As partículas desenham curvas que lembram a **espiral de pontos da marca** e atravessam o espaço.
- A rolagem orbita a câmera alguns graus, abre a aleta por completo e espalha as partículas em direção à próxima seção, criando continuidade.
- Nos 4 a 6 segundos em que a pessoa só olha, há movimento ocioso sutil (o fluxo respira).
- Fallback: a imagem `split-produto-v2-*.webp` no mesmo lugar (sem WebGL, com reduced motion ou com save-data). Canvas pausado fora da tela, DPR limitado e menos partículas no celular.
- O texto do topo continua legível e com a hierarquia de sempre: o que fazem, para quem e o CTA “Pedir orçamento” para o WhatsApp.

### Entrega da Parte B

- O site funcionando em `index.html` (abre via `file://` e via servidor local), aberto no Chrome.
- Prints antes e depois (1440, 768 e 390 px) numa pasta `review/`.
- `RESEARCH.md` atualizado com uma seção “Revisão impecável v3” (o que mudou e o que o cliente precisa confirmar: logo vetorial, fotos reais, contagem de avaliações e horários).
- Um resumo curto com a ideia, as mudanças por seção, **a ordem dos efeitos para gravar o vídeo** e a autoavaliação de 0 a 10 com justificativa (seção 12 do master prompt), sem notas automáticas.

## Regras que valem para as duas partes

- Não inventar nada sobre a empresa. Manter WhatsApp (11) 95229-6823, endereço, 4,8 / 153 com aviso e os trechos reais com autoria.
- Não publicar nem fazer deploy.
- Ao terminar, me lembrar de fechar as abas desses arquivos no editor para que nenhum buffer antigo sobrescreva a versão nova.
