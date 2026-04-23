
// Employer Pages: Dashboard, Vacancies, Favorites, Messages, Invitations, Company

var { useState, useEffect, useMemo } = React;

function EmployerPageHero({ eyebrow, title, description, badges = [], actions, aside }) {
  return (
    <Surface className="mb-6 overflow-hidden">
      <div className="grid gap-4 px-4 py-4 sm:px-6 sm:py-6 xl:grid-cols-[1.18fr_0.82fr]">
        <div>
          <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-500">
            {eyebrow}
          </div>
          <h1 className="mt-4 max-w-3xl text-[30px] font-semibold leading-tight tracking-[-0.04em] text-slate-900">
            {title}
          </h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-7 text-slate-600">
            {description}
          </p>
          {(badges.length > 0 || actions) && (
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              {badges.map((badge, index) => (
                <Badge key={`${badge.label}-${index}`} color={badge.color || 'slate'}>
                  {badge.label}
                </Badge>
              ))}
              {actions}
            </div>
          )}
        </div>
        <div className="rounded-[20px] border border-slate-200 bg-[linear-gradient(180deg,rgba(248,250,252,0.96),rgba(241,245,249,0.92))] p-4 shadow-sm sm:p-5">
          {aside}
        </div>
      </div>
    </Surface>
  );
}

function EmployerSection({ eyebrow, title, description, action, children, className = '' }) {
  return (
    <Surface className={`overflow-hidden ${className}`}>
      <div className="border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-4">
        <SectionHeader eyebrow={eyebrow} title={title} description={description} action={action} />
      </div>
      {children}
    </Surface>
  );
}

function EmployerInlineStat({ label, value, hint, tone = 'blue' }) {
  const tones = {
    blue: 'border-blue-200',
    cyan: 'border-cyan-200',
    amber: 'border-amber-200',
    green: 'border-emerald-200',
    slate: 'border-slate-200',
  };

  return (
    <div className={`rounded-2xl border bg-white px-4 py-3 shadow-sm ${tones[tone] || tones.blue}`}>
      <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{label}</div>
      <div className="mt-2 text-2xl font-semibold tracking-[-0.03em] text-slate-900">{value}</div>
      {hint && <div className="mt-1 text-xs leading-relaxed text-slate-500">{hint}</div>}
    </div>
  );
}

function EmployerListCard({ title, subtitle, meta, right, footer, onClick, accent = 'blue' }) {
  const accents = {
    blue: 'border-blue-500',
    cyan: 'border-cyan-500',
    amber: 'border-amber-500',
    green: 'border-emerald-500',
    slate: 'border-slate-300',
  };

  const content = (
    <div className={`rounded-2xl border border-slate-200 bg-white p-4 transition-colors hover:border-slate-300 hover:bg-slate-50/60 ${onClick ? 'cursor-pointer' : ''}`}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className={`min-w-0 border-l-2 pl-3 ${accents[accent] || accents.blue}`}>
          <div className="truncate text-sm font-semibold text-slate-900">{title}</div>
          {subtitle && <div className="mt-1 text-xs text-slate-500">{subtitle}</div>}
        </div>
        {right}
      </div>
      {(meta || footer) && (
        <div className="mt-3">
          {meta && <div className="text-xs leading-5 text-slate-500">{meta}</div>}
          {footer && <div className="mt-3">{footer}</div>}
        </div>
      )}
    </div>
  );

  if (!onClick) return content;
  return <button className="w-full text-left" onClick={onClick}>{content}</button>;
}

// ── Employer Dashboard ─────────────────────────────────────────────────────
function EmployerDashboard({ resumes, vacancies, invitations, messages }) {
  const favCount = resumes.filter(r => r.isFavorite).length;
  const activeVac = vacancies.filter(v => v.status === 'active').length;
  const pendingInv = invitations.filter(i => i.status === 'sent').length;
  const unreadMessages = messages.filter(message => !message.isRead).length;
  const recentResumes = [...resumes].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 5);
  const savedSearches = window.MockData.SAVED_SEARCHES || [];
  const activeVacancies = vacancies.filter(v => v.status === 'active').slice(0, 4);
  const responseRate = invitations.length ? Math.round(((invitations.length - pendingInv) / invitations.length) * 100) : 0;

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-4 sm:px-6 sm:py-6">
      <EmployerPageHero
        eyebrow="Работодатель · обзор"
        title="Кабинет работодателя"
        description="Единый рабочий контур для поиска кандидатов, короткого списка и приглашений. Здесь работодатель видит приоритеты дня и быстро переводит подбор в действие."
        badges={[
          { label: `${savedSearches.length} сохранённых поисков`, color: 'blue' },
          { label: `${unreadMessages} непрочитанных`, color: 'cyan' },
          { label: `${responseRate}% ответов по приглашениям`, color: 'amber' },
        ]}
        aside={
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Приоритеты дня</div>
            <div className="mt-3 space-y-3">
              <EmployerListCard
                title="Разобрать новые резюме"
                subtitle="Самые свежие публикации уже в верхней части реестра."
                right={<Badge color="blue">{recentResumes.length}</Badge>}
                meta="Откройте табличный режим и соберите первый shortlist без лишних переключений."
                accent="blue"
              />
              <EmployerListCard
                title="Дожать приглашения"
                subtitle="Часть кандидатов ещё не ответила."
                right={<Badge color="cyan">{pendingInv}</Badge>}
                meta="Вся история контакта уже под рукой: вакансии, ответы и текущий статус."
                accent="cyan"
              />
            </div>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Резюме в реестре" value={resumes.length} icon="📄" color="blue" sub="Быстрый поиск по всем резюме" />
        <StatCard label="В избранном" value={favCount} icon="⭐" color="amber" sub="Shortlist кандидатов" />
        <StatCard label="Активные вакансии" value={activeVac} icon="💼" color="green" sub="Вакансии доступны для приглашений" />
        <StatCard label="Ожидают ответа" value={pendingInv} icon="📨" color="cyan" sub="Отправленные приглашения" />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.35fr_0.85fr]">
        <EmployerSection
          eyebrow="Рабочий стол"
          title="Что делать сегодня"
          description="Новые резюме, короткий shortlist и приглашения собраны в одной секции."
        >
          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-2">
            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/90 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Новые резюме</div>
                  <div className="mt-1 text-sm text-slate-500">Последние обновления в реестре</div>
                </div>
                <Badge color="blue">{recentResumes.length}</Badge>
              </div>
              <div className="space-y-2">
                {recentResumes.map(resume => (
                  <button
                    key={resume.id}
                    className="flex w-full items-center gap-3 rounded-2xl border border-slate-200/80 bg-white px-3.5 py-3 text-left transition hover:border-slate-300 hover:bg-white"
                  >
                    <Avatar src={resume.photo} name={resume.fullName} size="sm" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-slate-900">{resume.position}</div>
                      <div className="truncate text-xs text-slate-500">{resume.city} · {fmtSalary(resume.salary)}</div>
                    </div>
                    <div className="text-xs text-slate-400">{fmtDate(resume.publishedAt)}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[24px] border border-slate-200/70 bg-slate-50/90 p-4">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Вакансии в работе</div>
                  <div className="mt-1 text-sm text-slate-500">Выбор для приглашений и shortlist</div>
                </div>
                <Badge color="green">{activeVacancies.length}</Badge>
              </div>
              <div className="space-y-2">
                {activeVacancies.map(vacancy => (
                  <EmployerListCard
                    key={vacancy.id}
                    title={vacancy.title}
                    subtitle={vacancy.department || 'Рабочая вакансия'}
                    right={<StatusBadge status={vacancy.status} />}
                    meta={`${vacancy.city} · ${vacancy.workMode}`}
                    accent="green"
                  />
                ))}
              </div>
            </div>
          </div>
        </EmployerSection>

        <div className="space-y-4">
          <EmployerSection eyebrow="Shortlist" title="Сохранённые поиски" description="Быстрые сценарии для повторной работы.">
            <div className="space-y-3 p-4 sm:p-5">
              {savedSearches.map(search => (
                <EmployerListCard
                  key={search.id}
                  title={search.name}
                  subtitle={`${Object.keys(search.filters || {}).filter(key => search.filters[key]).length} условий поиска`}
                  right={<Badge color="slate">сценарий</Badge>}
                  meta={search.query ? `Запрос: ${search.query}` : 'Без текстового запроса'}
                  accent="amber"
                />
              ))}
            </div>
          </EmployerSection>

          <EmployerSection eyebrow="Коммуникации" title="Статусы очереди" description="Что уже отправлено и что требует реакции.">
      <div className="grid gap-3 p-4 sm:grid-cols-2 sm:p-5">
              <EmployerInlineStat label="В очереди" value={pendingInv} hint="Нужен follow-up" tone="blue" />
              <EmployerInlineStat label="Непрочитанные" value={unreadMessages} hint="Новые ответы кандидатов" tone="cyan" />
              <EmployerInlineStat label="Избранные" value={favCount} hint="Текущий shortlist" tone="amber" />
              <EmployerInlineStat label="Все резюме" value={resumes.length} hint="Общий пул кандидатов" tone="slate" />
            </div>
          </EmployerSection>
        </div>
      </div>
    </div>
  );
}

// ── Vacancies ──────────────────────────────────────────────────────────────
function VacancyModal({ open, onClose, vacancy, onSave }) {
  const [form, setForm] = useState(vacancy || { title:'', department:'', city:'', workMode:'В офисе', salaryFrom:'', salaryTo:'', description:'', status:'active' });
  const upd = (k, v) => setForm(f => ({...f, [k]: v}));

  useEffect(() => { setForm(vacancy || { title:'', department:'', city:'', workMode:'В офисе', salaryFrom:'', salaryTo:'', description:'', status:'active' }); }, [vacancy, open]);

  return (
    <Modal open={open} onClose={onClose} title={vacancy ? 'Редактировать вакансию' : 'Новая вакансия'} size="lg">
      <div className="mb-5 rounded-[22px] border border-slate-200/80 bg-slate-50/80 p-4">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Параметры вакансии</div>
        <div className="mt-2 text-sm text-slate-500">Соберите ключевую рамку вакансии: название, статус, локацию и компенсацию. Описание поможет в приглашениях и сравнении внутри кабинета.</div>
      </div>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-600 mb-1 block">Название вакансии</label>
          <Input value={form.title} onChange={v=>upd('title',v)} placeholder="Специалист по закупкам"/>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Отдел</label>
          <Input value={form.department} onChange={v=>upd('department',v)} placeholder="Отдел закупок"/>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Город</label>
          <Input value={form.city} onChange={v=>upd('city',v)} placeholder="Москва"/>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Режим работы</label>
          <Select value={form.workMode} onChange={v=>upd('workMode',v)} options={['В офисе','Удалённо','Гибрид']}/>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Статус</label>
          <Select value={form.status} onChange={v=>upd('status',v)} options={[{value:'active',label:'Активна'},{value:'archived',label:'В архиве'},{value:'draft',label:'Черновик'}]}/>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Зарплата от, ₽</label>
          <Input value={form.salaryFrom} onChange={v=>upd('salaryFrom',v)} placeholder="80 000" type="number"/>
        </div>
        <div>
          <label className="text-xs font-medium text-slate-600 mb-1 block">Зарплата до, ₽</label>
          <Input value={form.salaryTo} onChange={v=>upd('salaryTo',v)} placeholder="150 000" type="number"/>
        </div>
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-slate-600 mb-1 block">Описание</label>
          <Textarea value={form.description} onChange={v=>upd('description',v)} rows={4} placeholder="Требования, условия, обязанности..." helper="Короткое описание помогает быстрее выбирать вакансию при приглашении и удерживает контекст в рабочих списках." />
        </div>
      </div>
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Btn variant="secondary" onClick={onClose}>Отмена</Btn>
        <Btn variant="primary" onClick={()=>{ onSave(form); onClose(); }}>Сохранить</Btn>
      </div>
    </Modal>
  );
}

function EmployerVacancies({ vacancies, setVacancies }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const summary = useMemo(() => ({
    active: vacancies.filter(v => v.status === 'active').length,
    draft: vacancies.filter(v => v.status === 'draft').length,
    archived: vacancies.filter(v => v.status === 'archived').length,
  }), [vacancies]);

  const filtered = vacancies.filter(v => {
    const matchesSearch = fuzzyIncludes(`${v.title} ${v.department} ${v.city} ${v.employerName}`, search);
    const matchesStatus = statusFilter === 'all' ? true : v.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleSave = (form) => {
    if (editing) {
      setVacancies(prev => prev.map(v => v.id === editing.id ? {...v, ...form} : v));
    } else {
      const newV = { ...form, id:`VAC-${String(vacancies.length+1).padStart(3,'0')}`, employerId:'EMP-001', employerName:'ООО «ТехноСервис»', region:'Москва', createdAt: new Date().toISOString().split('T')[0], skills:[] };
      setVacancies(prev => [newV, ...prev]);
    }
    setEditing(null);
  };

  const cards = [
    { label:'Активные', value: summary.active, tone:'green' },
    { label:'На подготовке', value: summary.draft, tone:'amber' },
    { label:'Архив', value: summary.archived, tone:'slate' },
    { label:'Всего', value: vacancies.length, tone:'blue' },
  ];

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-4 sm:px-6 sm:py-6">
      <VacancyModal open={modalOpen} onClose={()=>{setModalOpen(false);setEditing(null);}} vacancy={editing} onSave={handleSave}/>

      <EmployerPageHero
        eyebrow="Работодатель · вакансии"
        title="Вакансии"
        description="Список вакансий должен быть похож на операционный стол: статус, зарплатный коридор и быстрые действия читаются за один взгляд."
        badges={[
          { label: `${summary.active} активных`, color: 'green' },
          { label: `${summary.draft} на подготовке`, color: 'amber' },
          { label: `${summary.archived} в архиве`, color: 'slate' },
        ]}
        actions={
          <Btn
            variant="primary"
            onClick={()=>{setEditing(null);setModalOpen(true);}}
            icon={<svg fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4"/></svg>}
          >
            Создать вакансию
          </Btn>
        }
        aside={
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Состояние воронки</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <EmployerInlineStat label="В работе" value={summary.active} hint="Можно приглашать кандидатов" tone="green" />
              <EmployerInlineStat label="На подготовке" value={summary.draft} hint="Нужно довести до публикации" tone="amber" />
            </div>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map(card => <StatCard key={card.label} label={card.label} value={card.value} icon="•" color={card.tone} />)}
      </div>

      <EmployerSection
        eyebrow="Фильтры"
        title="Управление списком вакансий"
        description="Сначала быстрый поиск, затем фильтр по статусу. Ничего лишнего перед основной таблицей."
        className="mt-5"
      >
        <div className="grid gap-3 lg:grid-cols-[1.3fr_0.7fr_auto]">
          <Input value={search} onChange={setSearch} placeholder="Поиск по вакансиям, отделу, городу..." prefix={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>} />
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value:'all', label:'Все статусы' },
              { value:'active', label:'Активные' },
              { value:'draft', label:'На подготовке' },
              { value:'archived', label:'Архив' },
            ]}
          />
          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={()=>{setSearch('');setStatusFilter('all');}}>Сброс</Btn>
          </div>
        </div>
      </EmployerSection>

      {filtered.length === 0 ? (
        <Surface className="mt-5">
          <EmptyState
            icon="💼"
            title="Список пуст по текущим условиям"
            description="Попробуйте другой статус или снимите поисковый фильтр."
            action={<Btn variant="secondary" onClick={()=>{setSearch('');setStatusFilter('all');}}>Сбросить фильтры</Btn>}
          />
        </Surface>
      ) : (
        <EmployerSection
          eyebrow="Список вакансий"
          title="Рабочий кабинет вакансий"
          description="Каждая строка должна приводить к действию: открыть, редактировать, архивировать."
          className="mt-5"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90">
                  {['Вакансия','Город','Режим','Зарплата','Статус','Создана',''].map((h,i)=>(
                    <th key={i} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map(v => (
                  <tr key={v.id} className="transition hover:bg-slate-50/80">
                    <td className="px-4 py-3.5">
                      <div className="font-semibold text-slate-800">{v.title}</div>
                      <div className="mt-1 text-xs text-slate-400">{v.department}</div>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600">{v.city}</td>
                    <td className="px-4 py-3.5"><Badge color="slate">{v.workMode}</Badge></td>
                    <td className="px-4 py-3.5 whitespace-nowrap font-medium text-slate-700">{v.salaryFrom?.toLocaleString('ru-RU')} – {v.salaryTo?.toLocaleString('ru-RU')} ₽</td>
                    <td className="px-4 py-3.5"><StatusBadge status={v.status}/></td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{fmtDate(v.createdAt)}</td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-1.5">
                        <Btn size="xs" variant="ghost" onClick={()=>{setEditing(v);setModalOpen(true);}}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/></svg>
                        </Btn>
                        <Btn size="xs" variant="ghost" onClick={()=>setVacancies(prev=>prev.map(vv=>vv.id===v.id?{...vv,status:'archived'}:vv))}>
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"/></svg>
                        </Btn>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </EmployerSection>
      )}
    </div>
  );
}

// ── Favorites ──────────────────────────────────────────────────────────────
function EmployerFavorites({ resumes, setResumes, onOpenResume, vacancies, onInviteSend }) {
  const [invOpen, setInvOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const favs = resumes.filter(r => r.isFavorite);
  const toggleFav = (id) => setResumes(prev => prev.map(r => r.id === id ? {...r, isFavorite: !r.isFavorite} : r));
  const withPhoto = favs.filter(r => r.hasPhoto).length;
  const withTests = favs.filter(r => (r.tests || []).length > 0).length;

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-4 sm:px-6 sm:py-6">
      <InviteModal open={invOpen} onClose={()=>setInvOpen(false)} resume={selected} vacancies={vacancies} onSend={onInviteSend}/>
      <EmployerPageHero
        eyebrow="Работодатель · shortlist"
        title="Избранное"
        description="Короткий список кандидатов, которых удобно показать внутри команды, быстро открыть и сразу перевести к приглашению."
        badges={[
          { label: `${withPhoto} с фото`, color: 'blue' },
          { label: `${withTests} с тестами`, color: 'cyan' },
          { label: `${favs.filter(r => r.specialStatuses.length > 0).length} со статусами`, color: 'amber' },
        ]}
        aside={
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Состояние shortlist</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <EmployerInlineStat label="Всего" value={favs.length} hint="кандидатов в фокусе" tone="amber" />
              <EmployerInlineStat label="Готовы к контакту" value={withPhoto} hint="есть фото и контекст" tone="blue" />
            </div>
          </div>
        }
      />
      {favs.length === 0 ? (
        <Surface>
          <EmptyState icon="⭐" title="Избранных нет" description="Добавляйте кандидатов в избранное прямо из реестра резюме"/>
        </Surface>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {favs.map(r => (
            <Surface key={r.id} className="cursor-pointer p-4 transition hover:border-slate-300 hover:shadow-md" onClick={()=>onOpenResume(r)}>
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar src={r.photo} name={r.fullName} size="md"/>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">{r.id}</div>
                    <div className="mt-1 text-xs text-slate-500">{r.fullName.split(' ').slice(0,2).join(' ')}</div>
                  </div>
                </div>
                <StarBtn active={true} onToggle={()=>toggleFav(r.id)}/>
              </div>
              <div className="text-base font-semibold leading-6 text-slate-900 line-clamp-2">{r.position}</div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <span>{r.city}</span>
                <span>·</span>
                <span>{fmtSalary(r.salary)}</span>
                <span>·</span>
                <span>{fmtExp(r.experience)}</span>
              </div>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {r.tests.map(t=><Badge key={t} color="blue" size="xs">{t}</Badge>)}
                {r.specialStatuses.map(s=><Badge key={s} color="cyan" size="xs">{s}</Badge>)}
              </div>
              <div className="mt-5 flex gap-2">
                <Btn size="xs" variant="secondary" className="flex-1" onClick={e=>{e.stopPropagation();onOpenResume(r);}}>Открыть</Btn>
                <Btn size="xs" variant="cyan" className="flex-1" onClick={e=>{e.stopPropagation();setSelected(r);setInvOpen(true);}}>Пригласить</Btn>
              </div>
            </Surface>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Messages ───────────────────────────────────────────────────────────────
function EmployerMessages({ messages }) {
  const [active, setActive] = useState(messages[0] || null);
  const [reply, setReply] = useState('');
  const unread = messages.filter(m => !m.isRead).length;

  if (messages.length === 0) {
    return (
      <div className="mx-auto max-w-[1480px] px-4 py-4 sm:px-6 sm:py-6">
        <Surface>
          <EmptyState
            icon="💬"
            title="Диалоги появятся после первого контакта"
            description="Ответы кандидатов и рабочая переписка соберутся в единую ленту с быстрым переходом к профилю и вакансии."
          />
        </Surface>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-4 sm:px-6 sm:py-6">
      <EmployerPageHero
        eyebrow="Работодатель · сообщения"
        title="Сообщения"
        description="Мастер-детайл для рабочей переписки: слева поток диалогов, справа контекст и быстрый ответ без лишнего шума."
        badges={[
          { label: `${messages.length} диалогов`, color: 'blue' },
          { label: `${unread} непрочитанных`, color: 'cyan' },
        ]}
        aside={
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Темп коммуникации</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <EmployerInlineStat label="Inbox" value={messages.length} hint="все активные треды" tone="blue" />
              <EmployerInlineStat label="Unread" value={unread} hint="нужна реакция" tone="cyan" />
            </div>
          </div>
        }
      />

      <Surface className="flex min-h-[620px] flex-col overflow-hidden lg:flex-row">
    <div className="w-full border-b border-slate-200 bg-slate-50/80 lg:w-80 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200 p-3">
            <Input value="" onChange={()=>{}} placeholder="Поиск..." prefix={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>}/>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {messages.map(m => (
              <button key={m.id} onClick={()=>setActive(m)}
                className={`w-full text-left px-4 py-3 transition ${active?.id===m.id?'bg-white shadow-[inset_4px_0_0_0_rgba(37,99,235,1)]':'hover:bg-white/70'}`}>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-semibold text-slate-800 text-sm truncate flex-1">{m.fromName}</span>
                  {!m.isRead && <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"/>}
                </div>
                <div className="text-xs text-slate-400 truncate">{m.text}</div>
                <div className="text-[10px] text-slate-300 mt-1">{fmtDate(m.createdAt)}</div>
              </button>
            ))}
          </div>
        </div>

        {active ? (
          <div className="flex-1 flex flex-col">
            <div className="flex flex-col gap-3 border-b border-slate-100 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(248,250,252,0.9))] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-center gap-3">
                <Avatar name={active.fromName} size="sm"/>
                <div>
                  <div className="font-semibold text-slate-800 text-sm">{active.fromName}</div>
                  <div className="text-xs text-slate-400">{fmtDate(active.createdAt)}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge color={active.fromRole === 'employer' ? 'blue' : 'cyan'}>{active.fromRole}</Badge>
                {!active.isRead && <Badge color="amber">непрочитано</Badge>}
              </div>
            </div>
            <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-5">
              <div className={`flex gap-3 ${active.fromRole==='employer'?'flex-row-reverse':''}`}>
                <Avatar name={active.fromName} size="sm"/>
                <div className={`max-w-md rounded-[22px] px-4 py-3 text-sm shadow-sm ${active.fromRole==='employer'?'bg-blue-600 text-white':'bg-slate-100 text-slate-700'}`}>
                  {active.text}
                </div>
              </div>
              {active.fromRole !== 'employer' && (
                <div className="flex gap-3 flex-row-reverse">
                  <Avatar name="ООО ТехноСервис" size="sm"/>
                  <div className="max-w-md rounded-[22px] px-4 py-3 text-sm bg-blue-600 text-white shadow-sm">
                    Добрый день! Спасибо за интерес. Пришлите, пожалуйста, удобное для вас время.
                  </div>
                </div>
              )}
            </div>
            <div className="border-t border-slate-100 p-4">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {['Спасибо за отклик', 'Пришлите удобное время', 'Подтверждаем приглашение'].map(template => (
                  <button key={template} onClick={() => setReply(template)} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-600 transition hover:bg-blue-50 hover:text-blue-700">
                    {template}
                  </button>
                ))}
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                <Input value={reply} onChange={setReply} placeholder="Написать ответ..." className="flex-1"/>
                <Btn variant="primary" disabled={reply.length < 2} onClick={()=>setReply('')}>Отправить</Btn>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">Выберите диалог</div>
        )}
      </Surface>
    </div>
  );
}

// ── Invitations ────────────────────────────────────────────────────────────
function EmployerInvitations({ invitations }) {
  const stats = [
    { label:'Отправлено', status:'sent', color:'blue' },
    { label:'Просмотрено', status:'viewed', color:'purple' },
    { label:'Принято', status:'accepted', color:'green' },
    { label:'Отклонено', status:'rejected', color:'red' },
  ];

  return (
    <div className="mx-auto max-w-[1480px] px-4 py-4 sm:px-6 sm:py-6">
      <EmployerPageHero
        eyebrow="Работодатель · приглашения"
        title="Приглашения"
        description="Отслеживание статусов приглашений без лишних экранов: отправлено, просмотрено, принято или отклонено."
        badges={stats.map(stat => ({ label: `${invitations.filter(i=>i.status===stat.status).length} ${stat.label.toLowerCase()}`, color: stat.color }))}
        aside={
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Статусы отправок</div>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {stats.slice(0, 2).map(stat => (
                <EmployerInlineStat
                  key={stat.status}
                  label={stat.label}
                  value={invitations.filter(i=>i.status===stat.status).length}
                  tone={stat.color === 'purple' ? 'slate' : stat.color}
                />
              ))}
            </div>
          </div>
        }
      />
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(s => (
          <StatCard key={s.status} label={s.label} value={invitations.filter(i=>i.status===s.status).length} icon="✦" color={s.color === 'red' ? 'amber' : s.color} />
        ))}
      </div>
      <EmployerSection
        eyebrow="Журнал приглашений"
        title="Все отправки"
        description="Компактный список для контроля по кандидату, вакансии и итоговому статусу."
      >
        <div className="space-y-3 p-4 sm:p-5 md:hidden">
          {invitations.map(inv => (
            <div key={inv.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">{inv.candidateName.split(' ').slice(0,2).join(' ')}</div>
                  <div className="mt-1 text-xs text-slate-500">{inv.vacancyTitle}</div>
                  <div className="mt-1 text-[10px] text-slate-400">{inv.employerName}</div>
                </div>
                <StatusBadge status={inv.status}/>
              </div>
              <div className="mt-3 text-xs text-slate-400">{fmtDate(inv.createdAt)}</div>
            </div>
          ))}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/90">
                {['Кандидат','Вакансия','Работодатель','Статус','Дата'].map(h=>(
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-500">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invitations.map(inv => (
                <tr key={inv.id} className="transition hover:bg-slate-50/80">
                  <td className="px-4 py-3.5 font-medium text-slate-800">{inv.candidateName.split(' ').slice(0,2).join(' ')}</td>
                  <td className="px-4 py-3.5 text-slate-600">{inv.vacancyTitle}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-500">{inv.employerName}</td>
                  <td className="px-4 py-3.5"><StatusBadge status={inv.status}/></td>
                  <td className="px-4 py-3.5 text-xs text-slate-400">{fmtDate(inv.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </EmployerSection>
    </div>
  );
}

// ── Company Profile ────────────────────────────────────────────────────────
function CompanyProfile() {
  const [form, setForm] = useState({ name:'ООО «ТехноСервис»', inn:'7700000001', region:'Москва', city:'Москва', contactName:'Иванов Алексей Петрович', email:'hr1@company1.ru', phone:'+7 (900) 300-10-20', description:'Ведущая компания в сфере государственных закупок и тендерного сопровождения.' });
  const [saved, setSaved] = useState(false);
  const upd = (k,v) => { setForm(f=>({...f,[k]:v})); setSaved(false); };

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-6">
      <EmployerPageHero
        eyebrow="Работодатель · профиль"
        title="Профиль компании"
        description="Базовые реквизиты и краткое позиционирование компании. Этот экран должен выглядеть спокойно и официально."
        badges={[
          { label: form.region, color: 'slate' },
          { label: form.contactName, color: 'blue' },
        ]}
        aside={
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Статус профиля</div>
            <div className="mt-3 grid gap-3">
              <EmployerInlineStat label="Реквизиты" value="Заполнены" tone="green" />
            </div>
          </div>
        }
      />
      <Surface className="p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-600 mb-1 block">Название организации</label>
            <Input value={form.name} onChange={v=>upd('name',v)}/>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">ИНН</label>
            <Input value={form.inn} onChange={v=>upd('inn',v)}/>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Регион</label>
            <Input value={form.region} onChange={v=>upd('region',v)}/>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Контактное лицо</label>
            <Input value={form.contactName} onChange={v=>upd('contactName',v)}/>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Email</label>
            <Input value={form.email} onChange={v=>upd('email',v)} type="email"/>
          </div>
          <div>
            <label className="text-xs font-medium text-slate-600 mb-1 block">Телефон</label>
            <Input value={form.phone} onChange={v=>upd('phone',v)}/>
          </div>
        <div className="sm:col-span-2">
            <label className="text-xs font-medium text-slate-600 mb-1 block">О компании</label>
            <Textarea value={form.description} onChange={v=>upd('description',v)} rows={4} helper="Короткий абзац, который объясняет профиль работодателя и помогает кандидату понять контекст вакансий." />
          </div>
        </div>
        <div className="mt-4 flex flex-col-reverse gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:justify-end">
          {saved && <span className="text-sm text-emerald-600 flex items-center gap-1">✓ Сохранено</span>}
          <Btn variant="primary" onClick={()=>setSaved(true)}>Сохранить изменения</Btn>
        </div>
      </Surface>
    </div>
  );
}

function MiniMetric({ label, value, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-100',
    cyan: 'bg-cyan-50 text-cyan-700 ring-cyan-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    slate: 'bg-slate-100 text-slate-600 ring-slate-200',
    green: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
  };

  return (
    <div className={`rounded-[22px] p-4 ring-1 ring-inset shadow-sm ${tones[tone] || tones.blue}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.18em] opacity-70">{label}</div>
      <div className="mt-2 text-2xl font-bold">{value}</div>
    </div>
  );
}

function EmployerUXLab({ resumes, vacancies, invitations, messages }) {
  const topResumes = [...resumes].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt)).slice(0, 3);
  const shortlist = resumes.filter(r => r.isFavorite).slice(0, 3);
  const activeVacancies = vacancies.filter(v => v.status === 'active').slice(0, 3);
  const unreadMessages = messages.filter(m => !m.isRead).length;
  const sentInvites = invitations.filter(i => i.status === 'sent').length;

  return (
    <div className="mx-auto max-w-[1560px] px-4 py-4 sm:px-6 sm:py-6">
      <EmployerPageHero
        eyebrow="Работодатель · Сценарии"
        title="Демо-сценарии employer-опыта"
        description="На этой странице собраны ключевые сценарии работодателя: быстрый скрининг, shortlist, приглашения, сообщения и состояния интерфейса."
        badges={[
          { label: `${resumes.length} резюме`, color: 'blue' },
          { label: `${shortlist.length} shortlist`, color: 'cyan' },
          { label: `${sentInvites} приглашений`, color: 'amber' },
        ]}
        aside={
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Ключевые принципы</div>
            <div className="mt-3 space-y-3">
              <EmployerListCard title="Табличный режим по умолчанию" subtitle="Лучше работает для массового скрининга" meta="Карточки остаются вторичным режимом для мягкого просмотра и обсуждения shortlist." accent="blue" />
              <EmployerListCard title="Меньше лишних действий" subtitle="Чистая панель фильтров и быстрых сценариев" meta="Фильтры, статусы и быстрые действия должны читаться с первого взгляда без перегруза." accent="amber" />
            </div>
          </div>
        }
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Сканируемость" value="Табличный режим" icon="▦" color="blue" sub="Для 20+ резюме" />
        <StatCard label="Shortlist" value={shortlist.length} icon="⭐" color="amber" sub="Быстрый отбор" />
        <StatCard label="Вакансии" value={activeVacancies.length} icon="💼" color="green" sub="Выбор для приглашений" />
        <StatCard label="Сообщения" value={unreadMessages} icon="✉" color="cyan" sub="Непрочитанные" />
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
        <Surface className="overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-4">
            <SectionHeader eyebrow="Dashboard" title="Рабочий стол" description="Сегодняшняя работа: shortlist, вакансии, сообщения и приглашения." />
          </div>
          <div className="grid gap-3 p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-4">
            <MiniMetric label="Резюме" value={resumes.length} tone="blue" />
            <MiniMetric label="Избранные" value={shortlist.length} tone="amber" />
            <MiniMetric label="Активные вакансии" value={activeVacancies.length} tone="green" />
            <MiniMetric label="Непрочитанные" value={unreadMessages} tone="cyan" />
          </div>
          <div className="grid gap-4 border-t border-slate-100 p-4 sm:p-5 lg:grid-cols-2">
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Новые резюме</div>
                  <div className="text-sm text-slate-500">Сканирование по свежести и релевантности</div>
                </div>
                <Badge color="blue">{topResumes.length}</Badge>
              </div>
              <div className="space-y-2">
                {topResumes.map(resume => (
                  <div key={resume.id} className="rounded-xl bg-white px-3 py-2 shadow-sm">
                    <div className="flex items-center gap-3">
                      <Avatar src={resume.photo} name={resume.fullName} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-slate-900">{resume.position}</div>
                        <div className="truncate text-xs text-slate-500">{resume.city} · {fmtSalary(resume.salary)}</div>
                      </div>
                      <div className="text-xs text-slate-400">{fmtDate(resume.publishedAt)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl bg-slate-50 p-4">
              <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Shortlist</div>
                  <div className="text-sm text-slate-500">Кандидаты с высоким приоритетом</div>
                </div>
                <Badge color="amber">{shortlist.length}</Badge>
              </div>
              <div className="space-y-2">
                {shortlist.map(resume => (
                  <div key={resume.id} className="rounded-xl bg-white px-3 py-2 shadow-sm">
                    <div className="text-sm font-semibold text-slate-900">{resume.position}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {(resume.tests || []).map(test => <Badge key={test} color="blue" size="xs">{test}</Badge>)}
                      {(resume.specialStatuses || []).map(status => <Badge key={status} color="turquoise" size="xs">{status}</Badge>)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Surface>

        <div className="space-y-4">
          <Surface className="overflow-hidden">
            <div className="border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-4">
              <SectionHeader eyebrow="Flow" title="Приглашение" description="Выбор вакансии, сообщение и подтверждение." />
            </div>
            <div className="space-y-3 p-4 sm:p-5">
              {[
                { title: '1. Выбрать вакансию', text: 'Picker с поиском и контекстом по локации/режиму.' },
                { title: '2. Добавить сообщение', text: 'Шаблоны + свободный текст, лимиты и счетчик.' },
                { title: '3. Подтвердить отправку', text: 'Успешное состояние с понятным фидбеком.' },
              ].map(step => (
                <div key={step.title} className="rounded-2xl bg-slate-50 px-3 py-2.5">
                  <div className="text-sm font-semibold text-slate-900">{step.title}</div>
                  <div className="mt-1 text-xs text-slate-500">{step.text}</div>
                </div>
              ))}
            </div>
          </Surface>

          <Surface className="overflow-hidden">
            <div className="border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-4">
              <SectionHeader eyebrow="Messages" title="Диалоги" description="Master-detail layout для быстрой работы." />
            </div>
            <div className="space-y-3 p-4 sm:p-5">
              {messages.slice(0, 3).map(message => (
                <div key={message.id} className="rounded-2xl bg-slate-50 px-3 py-2.5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-sm font-semibold text-slate-900">{message.fromName}</div>
                    {!message.isRead && <Badge color="amber">new</Badge>}
                  </div>
                  <div className="mt-1 line-clamp-2 text-xs text-slate-500">{message.text}</div>
                </div>
              ))}
            </div>
          </Surface>
        </div>
      </div>

      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        <Surface className="overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-4">
            <SectionHeader eyebrow="Registry" title="Таблица vs карточки" description="Таблица для сканирования, карточки для shortlist и фотоориентированного просмотра." />
          </div>
          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-2">
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Table mode</div>
              <div className="rounded-2xl border border-slate-200 bg-white p-3">
                <div className="grid grid-cols-[1.4fr_0.7fr_0.7fr] gap-2 text-xs font-semibold text-slate-500">
                  <div>Резюме</div>
                  <div>Зарплата</div>
                  <div>Опыт</div>
                </div>
                <div className="mt-3 space-y-2">
                  {topResumes.map(resume => (
                    <div key={resume.id} className="grid grid-cols-[1.4fr_0.7fr_0.7fr] gap-2 rounded-xl bg-slate-50 px-3 py-2 text-sm">
                      <div className="truncate font-medium text-slate-900">{resume.position}</div>
                      <div className="text-slate-600">{fmtSalary(resume.salary)}</div>
                      <div className="text-slate-600">{fmtExp(resume.experience)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Card mode</div>
              <div className="space-y-2">
                {topResumes.map(resume => (
                  <div key={resume.id} className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex items-start gap-3">
                      <Avatar src={resume.photo} name={resume.fullName} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-semibold text-slate-900">{resume.position}</div>
                        <div className="text-xs text-slate-500">{resume.city} · {fmtSalary(resume.salary)}</div>
                      </div>
                      <StarBtn active={resume.isFavorite} onToggle={()=>{}} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Surface>

        <Surface className="overflow-hidden">
          <div className="border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-4">
            <SectionHeader eyebrow="States" title="Empty / Loading / Error" description="Так интерфейс должен выглядеть при сбоях и в пустых выборках." />
          </div>
          <div className="grid gap-4 p-4 sm:p-5 md:grid-cols-3">
            <LoadingState title="Скелетон реестра" rows={3} compact />
            <EmptyState icon="🔎" title="Пустая выдача" description="Фильтры слишком узкие или запрос не совпал." />
            <ErrorState title="Не удалось обновить данные" description="Проверьте соединение или повторите запрос позже." action={<Btn variant="secondary">Повторить</Btn>} />
          </div>
        </Surface>
      </div>

      <Surface className="mt-5 overflow-hidden">
        <div className="border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-4">
          <SectionHeader
            eyebrow="Architecture"
            title="Секции и иерархия компонентов"
            description="Краткий каркас employer-опыта: что пользователь видит первым, что вторым и где действует."
          />
        </div>
        <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-3">
          {[
            {
              title: 'Dashboard',
              items: ['KPI strip', 'Today focus', 'Saved searches', 'Recent resumes'],
            },
            {
              title: 'Registry',
              items: ['Sticky search bar', 'Filter drawer', 'Chips', 'Bulk action bar', 'Table/card results'],
            },
            {
              title: 'Detail & flows',
              items: ['Resume detail', 'Invite modal', 'Messages master-detail', 'Favorites shortlist'],
            },
          ].map(section => (
            <div key={section.title} className="rounded-2xl bg-slate-50 p-4">
              <div className="text-sm font-semibold text-slate-900">{section.title}</div>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                {section.items.map(item => (
                  <li key={item} className="flex items-start gap-2">
                    <span className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Surface>

      <Surface className="mt-5 p-4 sm:p-5">
        <SectionHeader eyebrow="Обоснование" title="Почему таблица по умолчанию" description="Для employer-режима таблица лучше подходит для плотного сканирования, а карточки остаются вторичным режимом просмотра." />
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <MiniMetric label="Scanability" value="Высокая" tone="blue" />
          <MiniMetric label="Bulk actions" value="Лучше" tone="green" />
          <MiniMetric label="Card mode" value="Вторичный" tone="amber" />
        </div>
      </Surface>
    </div>
  );
}

Object.assign(window, { EmployerDashboard, EmployerVacancies, EmployerFavorites, EmployerMessages, EmployerInvitations, CompanyProfile });
Object.assign(window, { MiniMetric, EmployerUXLab });
