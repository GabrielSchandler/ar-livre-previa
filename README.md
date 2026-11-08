# Ar Livre Ar Condicionado — Prévia do site

Prévia do novo site da Ar Livre Ar Condicionado: venda, instalação e manutenção de ar-condicionado em São Paulo.
Preview of the new website for Ar Livre Ar Condicionado, an air-conditioning sales, installation and maintenance company in São Paulo.

[🇧🇷 Português](#-português) · [🇺🇸 English](#-english)

---

## 🇧🇷 Português

### Sobre o projeto

Página única para a **Ar Livre Ar Condicionado**, empresa da Aclimação, em São Paulo. O site acompanha o cliente da escolha do aparelho até a manutenção, e todas as chamadas levam a um orçamento pelo **WhatsApp**. No topo há uma cena 3D animada (Three.js) ligada à rolagem.

> ℹ️ **Prévia de demonstração**, feita para apresentar ao cliente. Ainda não foi publicada. Contatos, avaliações e informações comerciais precisam ser confirmados com a empresa antes de ir ao ar. As fontes e pendências estão em `RESEARCH.md`.

**Seções da página:**
- **Abertura:** "Respire melhor. Da escolha ao cuidado.", com cena 3D.
- **O espaço antes do aparelho:** a importância de avaliar o ambiente.
- **Serviços:** orientação e venda, instalação, manutenção preventiva e assistência corretiva.
- **Encontre o seu próximo passo:** caminhos para cada necessidade.
- **Cuidado contínuo:** manutenção depois da instalação.
- **Avaliações** de clientes.
- **Orçamento:** chamada final para o WhatsApp.

### Tecnologias

- HTML, CSS e JavaScript puro (sem build)
- [Three.js](https://threejs.org/) para a cena 3D
- [GSAP](https://gsap.com/) + ScrollTrigger para as animações de rolagem
- Fontes locais (Bricolage Grotesque e DM Sans)

### Como ver localmente

Abra o `index.html` no navegador ou suba um servidor simples na pasta (recomendado, por causa das animações):

```bash
python -m http.server 8000   # http://localhost:8000
```

### Estrutura

```
index.html        página completa
styles.css        estilos (rebuild.css: camada da versão anterior)
script.js         interações e animações
scene.js          cena 3D do topo
assets/           imagens em WebP, logo, fontes e bibliotecas (vendor/)
review/           capturas de tela de antes e depois
RESEARCH.md       pesquisa, fontes e pendências
```

---

## 🇺🇸 English

### About

A single-page site for **Ar Livre Ar Condicionado**, based in Aclimação, São Paulo. It walks customers from choosing a unit to maintaining it, and every call-to-action leads to a **WhatsApp** quote. The hero has a scroll-driven 3D scene (Three.js).

> ℹ️ **Demo preview** built to pitch to the client. It hasn't been published yet. Contacts, reviews and business details must be confirmed with the company before going live. Sources and open items are in `RESEARCH.md`.

**Page sections:**
- **Hero:** "Breathe better. From choice to care.", with a 3D scene.
- **The space comes first:** why the room is assessed before the unit.
- **Services:** guidance and sales, installation, preventive maintenance and repairs.
- **Find your next step:** a path for each need.
- **Ongoing care:** maintenance after installation.
- **Customer reviews.**
- **Quote:** a final WhatsApp call-to-action.

### Tech stack

- Vanilla HTML, CSS and JavaScript (no build step)
- [Three.js](https://threejs.org/) for the 3D scene
- [GSAP](https://gsap.com/) + ScrollTrigger for scroll animations
- Self-hosted fonts (Bricolage Grotesque and DM Sans)

### Viewing locally

Open `index.html` in a browser, or serve the folder (recommended, because of the animations):

```bash
python -m http.server 8000   # http://localhost:8000
```
