# CIMATEC · Jornada do Colaborador (Dashboard Demo)

Réplica interativa do dashboard "Sua Jornada no CIMATEC", em **HTML, CSS e JavaScript puros** (sem build, sem dependências). Funciona como site estático — ideal para publicar em segundos no Vercel a partir do GitHub.

- ✅ Responsivo: vira automaticamente "app mobile" (menu inferior) em telas pequenas — abra o link no celular.
- ✅ 4 colaboradores de exemplo prontos (Carolina, Bruno, Renata, Diego) — troque pelo seletor no topo.
- ✅ Edição embutida em cada aba: em **Minha Jornada**, **Competências**, **Experiências**, **METAS PA** e **Reconhecimento**, clique em "✏️ Editar" para alterar os dados daquele colaborador direto ali — inclusive adicionar/remover itens de listas — e "✅ Concluir edição" para salvar.
- ✅ Botão **"Simular atualização"** muda metas, progresso e conquistas em tempo real, como se fosse uso real.
- ✅ Botão **"Restaurar dados originais"** volta tudo ao estado inicial.
- ✅ Dados ficam salvos no navegador (localStorage) — nada é enviado para nenhum servidor.
- ✅ Logo: a barra lateral está pronta para a logo oficial do CIMATEC — veja `assets/LEIA-ME.txt`.

## Estrutura

```
├── index.html      → estrutura da página
├── style.css        → visual (cores, layout, responsividade)
├── data.js           → colaboradores de exemplo (edite/adicione aqui)
├── app.js            → lógica: navegação, simulação, troca de colaborador
├── vercel.json       → configuração mínima do Vercel
└── README.md
```

## Como colocar no ar (GitHub + Vercel)

### 1. Suba os arquivos para o GitHub
```bash
cd cimatec-dashboard
git init
git add .
git commit -m "Dashboard CIMATEC - demo"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/cimatec-dashboard.git
git push -u origin main
```
(Crie antes um repositório vazio em github.com/new)

### 2. Publique no Vercel
1. Acesse [vercel.com](https://vercel.com) e faça login com sua conta GitHub.
2. Clique em **Add New → Project**.
3. Selecione o repositório `cimatec-dashboard`.
4. Em "Framework Preset", deixe **Other** (site estático — não precisa de build command).
5. Clique em **Deploy**.

Em cerca de 30 segundos o Vercel gera uma URL pública, por exemplo:
```
https://cimatec-dashboard.vercel.app
```

Esse é o **link público** que você pode colocar num slide, QR code ou compartilhar com quem for assistir à apresentação — qualquer pessoa acessa direto pelo navegador, sem login.

## Colocar a logo oficial do CIMATEC

Por direitos de marca, o projeto não vem com a logo oficial — vem só com um ícone placeholder. Para usar a de verdade:
1. Pegue o arquivo oficial da logo (PNG, fundo transparente, de preferência quadrado).
2. Renomeie para `logo-cimatec.png`.
3. Coloque dentro da pasta `assets/`.

Assim que esse arquivo existir nesse caminho, ele aparece sozinho na barra lateral — não precisa mexer em nenhum código.

## Editar os colaboradores de exemplo

Abra `data.js` e edite o array `EMPLOYEES_SEED`. Cada colaborador tem: nome, cargo, jornada (etapas + progresso), próximos passos, metas, competências, experiências e reconhecimentos. Basta copiar um bloco existente e ajustar os valores.

## Rodar localmente antes de publicar

Não precisa de instalação — é só abrir `index.html` no navegador. Se preferir um servidor local (recomendado para evitar bloqueios de CORS em alguns navegadores):

```bash
npx serve .
# ou
python3 -m http.server 5500
```
