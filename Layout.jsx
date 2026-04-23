
// App Shell — Sidebar + Header + Role Switcher

var { useState } = React;

const NAV_EMPLOYER = [
  { id:'dashboard',  label:'Обзор',          icon:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id:'registry',   label:'Реестр резюме',  icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id:'vacancies',  label:'Вакансии',       icon:'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id:'favorites',  label:'Избранное',      icon:'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
  { id:'messages',   label:'Сообщения',      icon:'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { id:'invitations',label:'Приглашения',    icon:'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id:'ux-lab',     label:'Сценарии',       icon:'M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M4 6h16M4 18h16M6 4v16m12-16v16' },
  { id:'company',    label:'Профиль компании',icon:'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
];

const NAV_SEEKER = [
  { id:'seeker-dashboard', label:'Обзор',       icon:'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { id:'my-resume',        label:'Моё резюме',  icon:'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' },
  { id:'seeker-invitations',label:'Приглашения',icon:'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id:'seeker-messages',  label:'Сообщения',   icon:'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { id:'seeker-settings',  label:'Настройки',   icon:'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
];

const NAV_ADMIN = [
  { id:'admin-dashboard', label:'Обзор',        icon:'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
  { id:'admin-resumes',   label:'Резюме',        icon:'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { id:'admin-employers', label:'Работодатели',  icon:'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { id:'admin-vacancies', label:'Вакансии',      icon:'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  { id:'admin-users',     label:'Пользователи',  icon:'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  { id:'admin-dicts',     label:'Справочники',   icon:'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
  { id:'admin-logs',      label:'Журнал событий',icon:'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
];

const NAV_BY_ROLE = {
  employer: NAV_EMPLOYER,
  seeker: NAV_SEEKER,
  admin: NAV_ADMIN,
};

const PAGE_LABELS = {
  employer: {
    dashboard: 'Обзор',
    registry: 'Реестр резюме',
    vacancies: 'Вакансии',
    favorites: 'Избранное',
    messages: 'Сообщения',
    invitations: 'Приглашения',
    'ux-lab': 'Сценарии',
    company: 'Профиль компании',
  },
  seeker: {
    'seeker-dashboard': 'Обзор',
    'my-resume': 'Моё резюме',
    'seeker-invitations': 'Приглашения',
    'seeker-messages': 'Сообщения',
    'seeker-settings': 'Настройки',
  },
  admin: {
    'admin-dashboard': 'Обзор',
    'admin-resumes': 'Резюме',
    'admin-employers': 'Работодатели',
    'admin-vacancies': 'Вакансии',
    'admin-users': 'Пользователи',
    'admin-dicts': 'Справочники',
    'admin-logs': 'Журнал событий',
  },
};

function getPageLabel(role, page) {
  return PAGE_LABELS[role]?.[page] || page;
}

function getNav(role) {
  return NAV_BY_ROLE[role] || NAV_EMPLOYER;
}

function NavIcon({ d }) {
  return (
    <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.6}>
      {d.split(' M').map((p, i) => <path key={i} strokeLinecap="round" strokeLinejoin="round" d={i===0?p:'M'+p}/>)}
    </svg>
  );
}

function Sidebar({ role, page, setPage, className = '' }) {
  const nav = getNav(role);
  return (
    <aside className={`relative hidden h-screen w-72 flex-shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white/95 shadow-[8px_0_24px_rgba(15,23,42,0.04)] sticky top-0 md:flex ${className}`}>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-slate-200" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-amber-400" />
      {/* Logo */}
      <div className="border-b border-slate-100 px-5 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-[16px] bg-slate-900 shadow-sm">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </div>
          <div>
            <div className="text-sm font-bold leading-tight tracking-[-0.02em] text-slate-900">ПРОкадры</div>
            <div className="text-[11px] leading-tight text-slate-500">ЗаказРФ · рабочее пространство подбора</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700 ring-1 ring-blue-100">
            Открытый просмотр
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 ring-1 ring-slate-200">
            Готово к показу
          </span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {nav.map(item => (
          <button key={item.id} onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm font-medium transition-colors duration-150 text-left
              ${page === item.id
                ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'}`}>
            <NavIcon d={item.icon}/>
            {item.label}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="border-t border-slate-100 px-4 py-4">
        <div className="rounded-2xl border border-slate-200/80 bg-white/80 px-3.5 py-3 text-xs text-slate-500 shadow-sm backdrop-blur">
          <div className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-emerald-700 ring-1 ring-emerald-100">Готово к показу</div>
          <div className="mt-2 text-[11px] leading-relaxed">Данные примера · роли · модульные страницы · публичный просмотр</div>
        </div>
      </div>
    </aside>
  );
}

function Header({ role, setRole, page, className = '' }) {
  const roleTitles = { employer:'Работодатель', seeker:'Соискатель', admin:'Администратор' };
  const roleColors = { employer:'bg-blue-50 text-blue-700 ring-blue-100', seeker:'bg-cyan-50 text-cyan-700 ring-cyan-100', admin:'bg-slate-100 text-slate-700 ring-slate-200' };
  return (
    <header className={`sticky top-0 z-30 hidden h-16 items-center justify-between border-b border-slate-200 bg-white/92 px-6 backdrop-blur-md shadow-[0_8px_24px_rgba(15,23,42,0.03)] md:flex ${className}`}>
      <div className="min-w-0">
        <div className="text-sm text-slate-800 font-semibold tracking-[-0.02em]">ПРОкадры</div>
        <div className="mt-0.5 flex items-center gap-2 text-xs text-slate-400">
          <span>Рабочее пространство · {getPageLabel(role, page)}</span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 ring-1 ring-slate-200">
            Режим показа
          </span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500">Роль:</span>
        <div className="flex gap-1.5 rounded-full border border-slate-200/80 bg-white/70 p-1 shadow-sm backdrop-blur">
          {['employer','seeker','admin'].map(r => (
            <button key={r} onClick={() => setRole(r)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium ring-1 ring-inset transition-all duration-150
                ${role === r ? roleColors[r] : 'text-slate-500 ring-transparent hover:bg-slate-100 hover:text-slate-700'}`}>
              {roleTitles[r]}
            </button>
          ))}
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1d4ed8,#0ea5e9)] text-xs font-semibold text-white shadow-[0_14px_32px_rgba(37,99,235,0.24)]">
          {role === 'employer' ? 'РА' : role === 'seeker' ? 'ИВ' : 'АД'}
        </div>
      </div>
    </header>
  );
}

function MobileTopBar({ role, setRole, page, setPage }) {
  const nav = getNav(role);
  const roleTitles = { employer:'Работодатель', seeker:'Соискатель', admin:'Администратор' };
  return (
    <div className="sticky top-0 z-40 border-b border-slate-200 bg-white/96 backdrop-blur md:hidden">
      <div className="flex items-center justify-between gap-3 px-4 pt-3">
        <div className="min-w-0">
          <div className="text-sm font-semibold tracking-[-0.02em] text-slate-900">ПРОкадры</div>
          <div className="text-[11px] text-slate-500">Открытый просмотр кабинета</div>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[linear-gradient(135deg,#1d4ed8,#0ea5e9)] text-xs font-semibold text-white shadow-[0_10px_24px_rgba(37,99,235,0.18)]">
          {role === 'employer' ? 'РА' : role === 'seeker' ? 'ИВ' : 'АД'}
        </div>
      </div>
      <div className="px-4 pb-3 pt-3">
        <div className="flex gap-1.5 rounded-full border border-slate-200 bg-white p-1 shadow-sm">
          {['employer','seeker','admin'].map(r => (
            <button key={r} onClick={() => setRole(r)}
              className={`flex-1 rounded-full px-2.5 py-1.5 text-[11px] font-medium transition-colors
                ${role === r ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-100' : 'text-slate-500 hover:bg-slate-100'}`}>
              {roleTitles[r]}
            </button>
          ))}
        </div>
        <div className="mt-2 flex items-center gap-2 overflow-x-auto whitespace-nowrap px-0 pb-0.5">
          <span className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-blue-700 ring-1 ring-blue-100">
            Открытый просмотр
          </span>
          <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500 ring-1 ring-slate-200">
            Готово к показу
          </span>
        </div>
        <div className="mt-3 -mx-4 overflow-x-auto px-4 pb-1">
          <div className="flex gap-2 whitespace-nowrap">
            {nav.map(item => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[12px] font-medium transition-colors ${
                  page === item.id
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span className="text-[11px]">
                  <NavIcon d={item.icon} />
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppShell({ role, setRole, page, setPage, children }) {
  return (
    <div
      className="flex min-h-screen flex-col overflow-hidden bg-slate-50 md:h-screen md:flex-row"
      style={{
        backgroundImage: 'linear-gradient(180deg, rgba(248,250,252,1), rgba(244,246,248,1))',
      }}
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-slate-900 focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white focus:shadow-lg"
      >
        Перейти к содержимому
      </a>
      <Sidebar role={role} page={page} setPage={setPage}/>
      <div className="flex-1 flex min-w-0 flex-col overflow-hidden">
        <Header role={role} setRole={setRole} page={page}/>
        <MobileTopBar role={role} setRole={setRole} page={page} setPage={setPage}/>
        <main id="main-content" className="flex-1 overflow-y-auto overscroll-contain">
          {children}
        </main>
      </div>
    </div>
  );
}

Object.assign(window, { AppShell, Sidebar, Header });
