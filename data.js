// ============================================================
// DADOS DE EXEMPLO — troque, adicione ou edite colaboradores aqui.
// Cada objeto representa um colaborador e alimenta todo o dashboard.
// ============================================================

const EMPLOYEES_SEED = [
  {
    id: "carolina",
    name: "Carolina Andrade",
    role: "Eng. de Automação",
    initials: "CA",
    accent: "#6C5CE7",
    notifications: 3,
    dica: "Pequenos passos hoje constroem grandes conquistas amanhã!",
    journey: {
      progress: 64,
      steps: [
        { label: "Integração", sub: "Concluído", status: "done" },
        { label: "Desenvolvimento", sub: "Em andamento", status: "active" },
        { label: "Consolidação", sub: "Próxima etapa", status: "next" },
        { label: "Contribuição", sub: "Futuro", status: "future" },
      ],
    },
    nextPaths: [
      { icon: "🎓", title: "1. PDE", desc: "Aprofunde seus estudos e desenvolva pesquisas de alto impacto.", detalhes: "O Programa de Desenvolvimento em Excelência (PDE) oferece bolsa de estudos, orientação de mentores seniores e tempo dedicado para pesquisa aplicada. Dura em média 18 meses e é indicado para quem quer se aprofundar tecnicamente antes de assumir projetos mais complexos.", cta: "Quero seguir", tone: "green" },
      { icon: "🌐", title: "2. Movimentação", desc: "Atue em novas áreas ou projetos dentro do CIMATEC.", detalhes: "A movimentação interna permite migrar para outra área ou unidade do CIMATEC mantendo tempo de casa e benefícios. É uma boa opção para quem quer ampliar repertório sem sair da instituição — o processo leva cerca de 60 dias, incluindo entrevistas com o novo time.", cta: "Explorar opções", tone: "purple" },
      { icon: "✈️", title: "3. Intercâmbio Tecnológico", desc: "Viva uma experiência em instituições parceiras e traga inovação.", detalhes: "Programa de 3 a 6 meses em instituições parceiras internacionais, com passagem, hospedagem e bolsa cobertas. Ao retornar, o colaborador apresenta um projeto de inovação aplicado à sua área de origem.", cta: "Quero saber mais", tone: "orange" },
    ],
    metas: [
      { icon: "🎯", title: "Reduzir tempo de parada de equipamentos", progress: 70 },
      { icon: "📡", title: "Desenvolver solução IoT para monitoramento", progress: 40 },
      { icon: "📄", title: "Publicar artigo em congresso", progress: 20 },
    ],
    dev: { competencias: 12, certificacoes: 3, horas: 48 },
    competencias: [
      { name: "Automação Industrial", level: "Avançado", pct: 90 },
      { name: "Programação (Python)", level: "Intermediário", pct: 60 },
      { name: "Gestão de Projetos", level: "Intermediário", pct: 55 },
      { name: "Liderança", level: "Básico", pct: 30 },
    ],
    experiencias: [
      { icon: "⭐", title: "Projeto Smart Flow", sub: "Líder de equipe · 05/2024" },
      { icon: "📖", title: "Artigo publicado no CONEMI 2024", sub: "Coautor · 09/2023" },
      { icon: "🎓", title: "Ministrei treinamento interno", sub: "Automação com CLP · 03/2023" },
    ],
    reconhecimentos: 3,
  },
  {
    id: "bruno",
    name: "Bruno Ferreira",
    role: "Analista de Dados",
    initials: "BF",
    accent: "#0EA5A4",
    notifications: 1,
    dica: "Revise seus dados duas vezes, decida uma vez.",
    journey: {
      progress: 38,
      steps: [
        { label: "Integração", sub: "Concluído", status: "done" },
        { label: "Desenvolvimento", sub: "Próxima etapa", status: "next" },
        { label: "Consolidação", sub: "Futuro", status: "future" },
        { label: "Contribuição", sub: "Futuro", status: "future" },
      ],
    },
    nextPaths: [
      { icon: "📊", title: "1. Especialização em BI", desc: "Aprofunde-se em dashboards e storytelling com dados.", detalhes: "Trilha de 4 meses com certificações em ferramentas de BI, workshops de storytelling com dados e um projeto final apresentado à diretoria. Ideal para quem quer se tornar referência técnica em análise de dados.", cta: "Quero seguir", tone: "green" },
      { icon: "🤝", title: "2. Mentoria", desc: "Compartilhe conhecimento orientando novos analistas.", detalhes: "Torne-se mentor de analistas juniores por 6 meses, com encontros quinzenais e material de apoio estruturado. Conta pontos para promoção e desenvolve competências de liderança.", cta: "Explorar opções", tone: "purple" },
      { icon: "🧪", title: "3. Projeto Piloto de IA", desc: "Participe de uma squad experimental de dados.", detalhes: "Squad multidisciplinar dedicada a testar modelos de IA aplicados a processos internos, por 3 meses, com dedicação parcial mantendo as atividades atuais.", cta: "Quero saber mais", tone: "orange" },
    ],
    metas: [
      { icon: "📈", title: "Automatizar relatórios mensais", progress: 55 },
      { icon: "🧮", title: "Migrar dashboards para novo BI", progress: 25 },
      { icon: "🎓", title: "Concluir certificação em SQL avançado", progress: 80 },
    ],
    dev: { competencias: 9, certificacoes: 2, horas: 31 },
    competencias: [
      { name: "SQL", level: "Avançado", pct: 85 },
      { name: "Python (Dados)", level: "Avançado", pct: 80 },
      { name: "Power BI", level: "Intermediário", pct: 65 },
      { name: "Comunicação", level: "Básico", pct: 35 },
    ],
    experiencias: [
      { icon: "📊", title: "Dashboard de Produção em Tempo Real", sub: "Autor · 02/2024" },
      { icon: "🏆", title: "Prêmio Inovação Interna", sub: "Finalista · 11/2023" },
    ],
    reconhecimentos: 2,
  },
  {
    id: "renata",
    name: "Renata Souza",
    role: "Coordenadora de Projetos",
    initials: "RS",
    accent: "#F97316",
    notifications: 5,
    dica: "Liderar é servir o time com clareza e presença.",
    journey: {
      progress: 82,
      steps: [
        { label: "Integração", sub: "Concluído", status: "done" },
        { label: "Desenvolvimento", sub: "Concluído", status: "done" },
        { label: "Consolidação", sub: "Em andamento", status: "active" },
        { label: "Contribuição", sub: "Próxima etapa", status: "next" },
      ],
    },
    nextPaths: [
      { icon: "🧭", title: "1. Liderança Avançada", desc: "Desenvolva um programa de formação para líderes.", detalhes: "Programa de 6 meses para desenhar e implementar uma trilha de formação de líderes no CIMATEC, com apoio de consultoria externa e orçamento próprio.", cta: "Quero seguir", tone: "green" },
      { icon: "🏗️", title: "2. Novo Programa Estratégico", desc: "Assuma a coordenação de uma nova frente do CIMATEC.", detalhes: "Oportunidade de liderar do zero uma nova frente estratégica, definindo escopo, time e metas junto à diretoria. Alto impacto e visibilidade institucional.", cta: "Explorar opções", tone: "purple" },
      { icon: "🌍", title: "3. Rede de Parcerias Internacionais", desc: "Represente o CIMATEC em parcerias globais.", detalhes: "Passa a representar o CIMATEC em fóruns e parcerias internacionais, com viagens trimestrais e responsabilidade por acordos de cooperação técnica.", cta: "Quero saber mais", tone: "orange" },
    ],
    metas: [
      { icon: "👥", title: "Estruturar novo squad de inovação", progress: 90 },
      { icon: "📅", title: "Reduzir atrasos de entrega em 20%", progress: 60 },
      { icon: "🤝", title: "Firmar 2 novas parcerias externas", progress: 50 },
    ],
    dev: { competencias: 18, certificacoes: 5, horas: 62 },
    competencias: [
      { name: "Gestão de Projetos", level: "Avançado", pct: 95 },
      { name: "Liderança", level: "Avançado", pct: 90 },
      { name: "Negociação", level: "Intermediário", pct: 60 },
      { name: "Inglês", level: "Intermediário", pct: 55 },
    ],
    experiencias: [
      { icon: "🚀", title: "Lançamento do Programa Conecta", sub: "Coordenadora · 01/2025" },
      { icon: "⭐", title: "Reconhecimento Liderança do Ano", sub: "Premiada · 12/2024" },
      { icon: "🎤", title: "Palestra em evento de inovação", sub: "Palestrante · 08/2024" },
    ],
    reconhecimentos: 6,
  },
  {
    id: "diego",
    name: "Diego Martins",
    role: "Técnico de Manutenção",
    initials: "DM",
    accent: "#22C55E",
    notifications: 0,
    dica: "Manutenção preventiva evita dor de cabeça futura.",
    journey: {
      progress: 21,
      steps: [
        { label: "Integração", sub: "Em andamento", status: "active" },
        { label: "Desenvolvimento", sub: "Próxima etapa", status: "next" },
        { label: "Consolidação", sub: "Futuro", status: "future" },
        { label: "Contribuição", sub: "Futuro", status: "future" },
      ],
    },
    nextPaths: [
      { icon: "🔧", title: "1. Curso Técnico Avançado", desc: "Amplie seu domínio em manutenção preditiva.", detalhes: "Curso de 3 meses, com aulas presenciais e práticas em manutenção preditiva usando sensores e análise de vibração. Inclui certificado reconhecido pelo setor.", cta: "Quero seguir", tone: "green" },
      { icon: "🛠️", title: "2. Rotação de Setor", desc: "Conheça outras linhas de produção do CIMATEC.", detalhes: "Passa 2 meses acompanhando outra linha de produção, com um técnico sênior como referência, para ampliar a visão de todo o processo produtivo.", cta: "Explorar opções", tone: "purple" },
      { icon: "📋", title: "3. Programa de Mentoria Técnica", desc: "Aprenda com técnicos seniores da equipe.", detalhes: "Programa estruturado de 4 meses com encontros semanais com um técnico sênior, focado em resolução de problemas complexos de manutenção.", cta: "Quero saber mais", tone: "orange" },
    ],
    metas: [
      { icon: "⚙️", title: "Concluir treinamento de segurança", progress: 100 },
      { icon: "🧰", title: "Reduzir chamados corretivos", progress: 30 },
      { icon: "📚", title: "Obter certificação NR-12", progress: 15 },
    ],
    dev: { competencias: 6, certificacoes: 1, horas: 18 },
    competencias: [
      { name: "Manutenção Elétrica", level: "Intermediário", pct: 60 },
      { name: "Manutenção Mecânica", level: "Intermediário", pct: 55 },
      { name: "Segurança do Trabalho", level: "Avançado", pct: 85 },
      { name: "Leitura de Manuais Técnicos", level: "Básico", pct: 25 },
    ],
    experiencias: [
      { icon: "🏅", title: "Certificado de Segurança NR-10", sub: "Concluído · 04/2024" },
    ],
    reconhecimentos: 0,
  },
];
