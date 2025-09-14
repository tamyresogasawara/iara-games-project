


# Documento de Acessibilidade - Iara Games

## Introdução

Este documento detalha as funcionalidades de acessibilidade implementadas no protótipo da página de listagem de jogos da Iara Games. O nosso objetivo é garantir que a plataforma seja utilizável e acessível a todos os utilizadores, incluindo pessoas com deficiência, seguindo as diretrizes do WCAG (Web Content Accessibility Guidelines).




## Funcionalidades de Acessibilidade Implementadas

### 1. Estrutura Semântica do HTML

- **Tags Semânticas**: O código utiliza tags HTML5 semânticas para estruturar o conteúdo de forma clara e lógica. Isso ajuda os leitores de ecrã a interpretar a página corretamente.
  - `<header>`: Define o cabeçalho da página.
  - `<nav>`: Identifica a navegação principal.
  - `<main>`: Contém o conteúdo principal da página.
  - `<section>`: Agrupa conteúdos relacionados, como a secção de jogos e a secção "Sobre".
  - `<article>`: Representa cada jogo como um item independente.
  - `<footer>`: Define o rodapé da página.

### 2. Navegação pelo Teclado

- **Ordem de Foco Lógica**: A ordem de navegação com a tecla `Tab` segue uma sequência lógica e intuitiva, facilitando a interação para utilizadores que dependem do teclado.
- **Link "Pular para o Conteúdo"**: Um link oculto no topo da página permite que os utilizadores de teclado pulem diretamente para o conteúdo principal (`#main-content`), evitando a navegação por todo o menu a cada visita.
- **Foco Visível**: Todos os elementos interativos (links, botões) têm um estado de `:focus` claramente visível, com um contorno destacado para indicar a sua posição na página.

### 3. Atributos `alt` para Imagens

- **Texto Alternativo Descritivo**: Todas as imagens (`<img>`) possuem um atributo `alt` com uma descrição concisa e informativa do seu conteúdo. Isto garante que os utilizadores de leitores de ecrã compreendam o contexto visual.

### 4. Contraste de Cores

- **Alto Contraste**: A paleta de cores foi escolhida para garantir um alto contraste entre o texto e o fundo, em conformidade com os níveis de contraste do WCAG. O texto branco sobre um fundo escuro proporciona uma excelente legibilidade.

### 5. Rótulos Descritivos e Atributos ARIA

- **ARIA Roles**: Atributos como `role="navigation"`, `role="banner"`, `role="main"`, `role="contentinfo"`, `role="grid"` e `role="gridcell"` são utilizados para fornecer um contexto semântico adicional aos leitores de ecrã.
- **ARIA Labels**: `aria-label` e `aria-labelledby` são usados para fornecer descrições claras para botões e secções, como `aria-label="Buscar jogos"` e `aria-labelledby="hero-title"`.

### 6. Design Responsivo e Tipografia Legível

- **Layout Flexível**: O design é responsivo e adapta-se a diferentes tamanhos de ecrã, garantindo uma boa experiência em dispositivos móveis e desktops.
- **Fontes Legíveis**: A tipografia foi escolhida para ser clara e legível, com tamanhos de fonte adequados para uma leitura confortável.

### 7. Recursos Adicionais de Acessibilidade

- **Suporte para Movimento Reduzido**: O CSS inclui uma media query `@media (prefers-reduced-motion: reduce)` para desativar ou reduzir animações e transições para utilizadores que preferem menos movimento.
- **Suporte para Alto Contraste**: Uma media query `@media (prefers-contrast: high)` foi adicionada para garantir que os elementos da interface tenham uma apresentação adequada em modos de alto contraste do sistema operativo.


