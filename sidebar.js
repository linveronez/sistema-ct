// sidebar.js — Sistema CT v5.1
(function () {
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

  const navLinks = [
    { section: 'Principal' },
    { href: 'dashboard.html',      label: 'Painel',           icon: '🏠' },
    { section: 'Clínico' },
    { href: 'pacientes.html',      label: 'Pacientes',        icon: '👤' },
    { href: 'timeline.html',       label: 'Timeline',         icon: '📌' },
    { href: 'evolucoes.html',      label: 'Evoluções',        icon: '📝' },
    { href: 'escalas.html',        label: 'Escalas Clínicas', icon: '📊' },
    { href: 'enfermagem.html',     label: 'Enfermagem',       icon: '💊' },
    { section: 'Operacional' },
    { href: 'agenda.html',         label: 'Agenda',           icon: '📅' },
    { href: 'quartos.html',        label: 'Quartos e Leitos', icon: '🛏️' },
    { section: 'Administrativo' },
    { href: 'financeiro.html',     label: 'Financeiro',       icon: '💰' },
    { href: 'documentos.html',     label: 'Documentos',       icon: '📄' },
    { href: 'relatorios.html',     label: 'Relatórios',       icon: '🖨️' },
    { href: 'funcionarios.html',   label: 'Funcionários',     icon: '👥' },
    { section: 'Configurações' },
    { href: 'instituicao.html',    label: 'Instituição',      icon: '🏥' },
    { href: 'log.html',            label: 'Log de Atividades',icon: '🔐' },
  ];

  const sidebar = document.querySelector('.sidebar');
  if (sidebar) {
    let html = '';
    navLinks.forEach(item => {
      if (item.section) {
        html += `<div class="sidebar-section">${item.section}</div>`;
      } else {
        const active = currentPage === item.href ? 'class="active"' : '';
        html += `<a href="${item.href}" ${active}>
          <span style="font-size:15px;width:20px;text-align:center;">${item.icon}</span>
          ${item.label}
        </a>`;
      }
    });
    sidebar.innerHTML = `${html}
      <div class="sidebar-footer">
        <a href="#" onclick="sair()">
          <span style="font-size:15px;width:20px;text-align:center;">🚪</span>
          Sair
        </a>
      </div>`;
  }

  // GLOBAL HEADER
  if (!document.querySelector('.global-header')) {
    const header = document.createElement('div');
    header.className = 'global-header';
    header.innerHTML = `
      <a class="header-brand" href="dashboard.html">
        <div class="header-brand-icon" id="headerBrandIcon">
          <span id="headerBrandText">CT</span>
          <img id="headerBrandLogo" style="display:none;width:100%;height:100%;object-fit:contain;border-radius:var(--radius-md);" alt="Logo">
        </div>
        <span class="header-brand-name" id="headerInstName">Sistema CT</span>
      </a>
      <div class="header-right">
        <div class="header-user" id="headerUser">
          <div class="header-user-avatar" id="headerAvatar">U</div>
          <span class="header-user-name" id="headerNome">...</span>
        </div>
      </div>`;
    document.body.insertBefore(header, document.body.firstChild);
  }

  window.addEventListener('DOMContentLoaded', async () => {
    try {
      if (typeof supabase === 'undefined') return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const email = user.email || '';
      const avatarEl = document.getElementById('headerAvatar');
      const nomeEl   = document.getElementById('headerNome');

      try {
        const { data: userData } = await supabase
          .from('usuarios').select('nome, instituicao_id').eq('id', user.id).single();

        const displayName = userData?.nome || email.split('@')[0];
        if (avatarEl) avatarEl.textContent = displayName.charAt(0).toUpperCase();
        if (nomeEl)   nomeEl.textContent   = displayName;

        if (userData?.instituicao_id) {
          const { data: inst } = await supabase
            .from('instituicoes').select('nome, logo_url')
            .eq('id', userData.instituicao_id).single();

          if (inst) {
            const instNameEl = document.getElementById('headerInstName');
            const logoImg    = document.getElementById('headerBrandLogo');
            const brandText  = document.getElementById('headerBrandText');
            if (instNameEl && inst.nome) instNameEl.textContent = inst.nome;
            if (inst.logo_url && logoImg && brandText) {
              logoImg.src = inst.logo_url;
              logoImg.style.display = 'block';
              brandText.style.display = 'none';
            }
          }
        }
      } catch(e) {
        if (avatarEl) avatarEl.textContent = email.charAt(0).toUpperCase();
        if (nomeEl)   nomeEl.textContent   = email.split('@')[0];
      }
    } catch (e) { console.warn('sidebar.js error:', e); }
  });

  window.sair = async function () {
    if (typeof supabase !== 'undefined') await supabase.auth.signOut();
    window.location.href = 'index.html';
  };

  window.registrarLog = async function(acao, entidade, entidade_nome, descricao) {
    try {
      if (!window._logInstId) {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        const { data: u } = await supabase.from('usuarios').select('instituicao_id, nome').eq('id', user.id).single();
        window._logInstId  = u?.instituicao_id;
        window._logNomeUsr = u?.nome || user.email;
        window._logEmailUsr = user.email;
      }
      await supabase.from('log_atividades').insert([{
        instituicao_id: window._logInstId,
        acao, entidade, entidade_nome, descricao,
        usuario_nome:  window._logNomeUsr,
        usuario_email: window._logEmailUsr,
      }]);
    } catch(e) { /* silencioso */ }
  };
})();
