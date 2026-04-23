// Seeker and Admin pages for ПРОкадры

var { useState, useMemo } = React;

function KPIGrid({ items }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map(item => <StatCard key={item.label} {...item} />)}
    </div>
  );
}

function ColumnSurface({ title, description, children, action }) {
  return (
    <Surface className="p-4 sm:p-5">
      <SectionHeader eyebrow={title} title={title} description={description} action={action} />
      <div className="mt-4">{children}</div>
    </Surface>
  );
}

function WorkspaceHero({ eyebrow, title, description, badges = [], aside }) {
  return (
    <Surface className="mb-5 overflow-hidden bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94))]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-20 top-0 h-48 w-48 rounded-full bg-blue-200/20 blur-3xl" />
        <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full bg-cyan-200/20 blur-3xl" />
      </div>
      <div className="grid gap-4 px-4 py-4 sm:px-6 sm:py-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="relative">
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">
              {eyebrow}
            </div>
            <div className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-blue-700 ring-1 ring-blue-100">
              Открытый просмотр
            </div>
          </div>
          <h1 className="mt-4 max-w-2xl text-[26px] font-semibold tracking-[-0.03em] text-slate-900 sm:text-[28px]">{title}</h1>
          <p className="mt-3 max-w-2xl text-[15px] leading-6 text-slate-600">{description}</p>
          {badges.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {badges.map(item => <Badge key={item.label} color={item.color || 'slate'}>{item.label}</Badge>)}
            </div>
          )}
        </div>
        <div className="relative rounded-[20px] border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-5">
          {aside}
        </div>
      </div>
    </Surface>
  );
}

function QuietListCard({ eyebrow, title, subtitle, meta, right }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 border-l-2 border-blue-400 pl-3">
          {eyebrow && <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">{eyebrow}</div>}
          <div className="mt-1 text-sm font-semibold text-slate-900">{title}</div>
          {subtitle && <div className="mt-1 text-xs text-slate-500">{subtitle}</div>}
        </div>
        {right}
      </div>
      {meta && <div className="mt-3 text-xs leading-5 text-slate-500">{meta}</div>}
    </div>
  );
}

function PanelEmptyState({ icon = '—', title, description }) {
  return (
    <div className="rounded-[22px] border border-dashed border-slate-200 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(248,250,252,0.82))] px-4 py-8 text-center shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
      <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-semibold text-slate-500 ring-1 ring-slate-200 shadow-sm">
        {icon}
      </div>
      <div className="mt-3 text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-1 text-sm leading-relaxed text-slate-500">{description}</div>
    </div>
  );
}

function TableEmptyRow({ colSpan, title, description }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-10">
        <PanelEmptyState icon="∅" title={title} description={description} />
      </td>
    </tr>
  );
}

function SeekerDashboard({ resume, invitations, messages }) {
  const completion = useMemo(() => {
    const fields = [
      resume?.fullName,
      resume?.photo,
      resume?.position,
      resume?.city,
      resume?.salary,
      resume?.about,
      resume?.workExperiences?.length > 0,
      resume?.education,
    ];
    const filled = fields.filter(Boolean).length;
    return Math.round((filled / fields.length) * 100);
  }, [resume]);

  const stats = [
    { label: 'Профиль заполнен', value: `${completion}%`, icon: '✓', color: 'blue', sub: 'Резюме готово к показу' },
    { label: 'Приглашения', value: invitations.length, icon: '✉', color: 'cyan', sub: 'Новые и прочитанные' },
    { label: 'Сообщения', value: messages.length, icon: '💬', color: 'green', sub: 'Диалоги с работодателями' },
    { label: 'Опубликовано', value: resume?.publishedAt ? fmtDate(resume.publishedAt) : '—', icon: '⏱', color: 'amber', sub: 'Дата последнего обновления' },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6">
      <WorkspaceHero
        eyebrow="Соискатель · обзор"
        title="Кабинет соискателя"
        description="Здесь собраны статус резюме, свежие приглашения и диалоги с работодателями. Вся ключевая информация видна сразу."
        badges={[
          { label: `${completion}% профиль`, color: 'blue' },
          { label: `${invitations.length} приглашений`, color: 'cyan' },
          { label: `${messages.length} диалогов`, color: 'green' },
        ]}
        aside={
          <div className="space-y-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">Фокус на сегодня</div>
            <QuietListCard
              eyebrow="Профиль"
              title={completion < 100 ? 'Довести профиль до полной готовности' : 'Профиль выглядит убедительно'}
              subtitle={completion < 100 ? 'Чем полнее резюме, тем проще работодателю принять решение.' : 'Карточка уже содержит ключевые данные для просмотра.'}
              meta={`Последнее обновление: ${resume?.publishedAt ? fmtDate(resume.publishedAt) : 'дата не указана'}`}
              right={<Badge color="blue">{completion}%</Badge>}
            />
            <QuietListCard
              eyebrow="Предложения"
              title={invitations[0]?.vacancyTitle || 'Новых приглашений пока нет'}
              subtitle={invitations[0]?.employerName || 'Когда появятся новые предложения, они будут видны здесь.'}
              meta={messages[0]?.text || 'Последние сообщения и приглашения собраны в один поток.'}
              right={<Badge color="cyan">{invitations.length}</Badge>}
            />
          </div>
        }
      />

      <KPIGrid items={stats} />

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Surface className="p-4 sm:p-5">
          <SectionHeader eyebrow="Следующий шаг" title="Что важно сейчас" description="Поддерживайте профиль в актуальном состоянии и быстро отвечайте на интересные предложения." />
          <div className="mt-4 space-y-4">
            <div>
              <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                <span>Готовность профиля</span>
                <span>{completion}%</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100">
                <div className="h-2 rounded-full bg-blue-600" style={{ width: `${completion}%` }} />
              </div>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Приглашение</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">Последнее: {invitations[0]?.vacancyTitle || 'пока нет приглашений'}</div>
                <div className="mt-1 text-sm text-slate-500">{invitations[0]?.employerName || '—'}</div>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Сообщения</div>
                <div className="mt-2 text-sm font-semibold text-slate-900">{messages[0]?.fromName || 'Пока тишина'}</div>
                <div className="mt-1 text-sm text-slate-500 line-clamp-2">{messages[0]?.text || 'Работодатели пока не написали.'}</div>
              </div>
            </div>
          </div>
        </Surface>

        <Surface className="p-4 sm:p-5">
          <SectionHeader eyebrow="Профиль" title="Ключевые данные резюме" description="Краткая сводка по карточке, которую увидит работодатель." />
          <div className="mt-4 space-y-2">
            <InfoRow label="Должность" value={resume?.position} />
            <InfoRow label="Город" value={resume?.city} />
            <InfoRow label="Зарплата" value={fmtSalary(resume?.salary)} />
            <InfoRow label="Опыт" value={fmtExp(resume?.experience)} />
            <InfoRow label="Образование" value={resume?.education} />
          </div>
        </Surface>
      </div>
    </div>
  );
}

function SeekerResumeEditor({ resume, onSave }) {
  const [form, setForm] = useState(() => ({
    ...resume,
    tests: [...(resume.tests || [])],
    activityAreas: [...(resume.activityAreas || [])],
    specialStatuses: [...(resume.specialStatuses || [])],
    workExperiences: (resume.workExperiences || []).map(item => ({ ...item })),
  }));
  const [saved, setSaved] = useState(false);

  const update = (key, value) => {
    setSaved(false);
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const updateExperience = (index, key, value) => {
    setSaved(false);
    setForm(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.map((experience, experienceIndex) => (
        experienceIndex === index ? { ...experience, [key]: value } : experience
      )),
    }));
  };

  const addExperience = () => {
    setSaved(false);
    setForm(prev => ({
      ...prev,
      workExperiences: [
        ...prev.workExperiences,
        { id: Date.now(), from: '', to: '', role: '', company: '', description: '' },
      ],
    }));
  };

  const removeExperience = index => {
    setSaved(false);
    setForm(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.filter((_, experienceIndex) => experienceIndex !== index),
    }));
  };

  const handleSave = () => {
    setSaved(true);
    onSave?.(form);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Соискатель · моё резюме</div>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Редактор резюме</h1>
        <p className="mt-1 text-sm text-slate-500">Заполняйте профиль по секциям: так работодателю проще быстро понять ваш опыт и специализацию.</p>
      </div>

      <div className="grid gap-4 xl:grid-cols-[1fr_320px]">
        <Surface className="p-4 sm:p-5">
          <SectionHeader
            eyebrow="Основное"
            title="Профиль"
            description="Ключевые данные, по которым работодатели принимают первое решение."
            action={<Btn variant="primary" onClick={handleSave}>{saved ? 'Сохранено' : 'Сохранить'}</Btn>}
          />

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Фото / URL</label>
              <Input value={form.photo || ''} onChange={value => update('photo', value)} placeholder="Ссылка на фото" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Должность</label>
              <Input value={form.position || ''} onChange={value => update('position', value)} placeholder="Контрактный управляющий" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Город</label>
              <Input value={form.city || ''} onChange={value => update('city', value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Регион</label>
              <Input value={form.region || ''} onChange={value => update('region', value)} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Желаемая зарплата</label>
              <Input value={String(form.salary ?? '')} onChange={value => update('salary', value ? Number(value) : null)} type="number" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Возраст</label>
              <Input value={String(form.age ?? '')} onChange={value => update('age', value ? Number(value) : '')} type="number" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Пол</label>
              <Select value={form.gender || ''} onChange={value => update('gender', value)} options={[{ value: '', label: 'Не указано' }, { value: 'female', label: 'Женский' }, { value: 'male', label: 'Мужской' }]} />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Режим работы</label>
              <Select value={form.workMode || ''} onChange={value => update('workMode', value)} options={['В офисе', 'Удалённо', 'Гибрид']} placeholder="Выберите режим" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Образование</label>
              <Select value={form.education || ''} onChange={value => update('education', value)} options={['Высшее', 'Среднее специальное', 'Среднее']} placeholder="Выберите образование" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-600">О себе</label>
              <Textarea value={form.about || ''} onChange={value => update('about', value)} rows={5} placeholder="Коротко опишите опыт и сильные стороны" />
            </div>
          </div>
        </Surface>

        <div className="space-y-4">
          <Surface className="p-4 sm:p-5">
            <SectionHeader eyebrow="Параметры профиля" title="Статусы и сферы" description="Дополнительные параметры помогают точнее попадать в релевантные подборки." />
            <div className="mt-4 space-y-4">
              <div>
                <div className="mb-1.5 text-xs font-medium text-slate-600">Особые статусы</div>
                <Combobox
                  value={form.specialStatuses}
                  onChange={value => update('specialStatuses', value)}
                  options={(window.MockData.DICTIONARIES.specialStatuses || []).map(item => ({ value: item, label: item }))}
                  multiple
                  placeholder="Выберите статусы"
                />
              </div>
              <div>
                <div className="mb-1.5 text-xs font-medium text-slate-600">Тесты</div>
                <Combobox
                  value={form.tests}
                  onChange={value => update('tests', value)}
                  options={(window.MockData.DICTIONARIES.tests || []).map(item => ({ value: item, label: item }))}
                  multiple
                  placeholder="Выберите тесты"
                />
              </div>
              <div>
                <div className="mb-1.5 text-xs font-medium text-slate-600">Сферы деятельности</div>
                <Combobox
                  value={form.activityAreas}
                  onChange={value => update('activityAreas', value)}
                  options={(window.MockData.DICTIONARIES.activityAreas || []).map(item => ({ value: item, label: item }))}
                  multiple
                  placeholder="Выберите сферы"
                />
              </div>
            </div>
          </Surface>
        </div>
      </div>

      <Surface className="mt-4 p-4 sm:p-5">
        <SectionHeader eyebrow="Опыт" title="История работы" description="Каждая запись усиливает доверие к профилю и делает карточку содержательнее." action={<Btn variant="secondary" onClick={addExperience}>Добавить опыт</Btn>} />
        <div className="mt-4 space-y-4">
          {form.workExperiences.map((experience, index) => (
            <div key={experience.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-3 md:grid-cols-2">
                <Input value={experience.from || ''} onChange={value => updateExperience(index, 'from', value)} placeholder="Период с" />
                <Input value={experience.to || ''} onChange={value => updateExperience(index, 'to', value)} placeholder="Период до" />
                <Input value={experience.role || ''} onChange={value => updateExperience(index, 'role', value)} placeholder="Должность" />
                <Input value={experience.company || ''} onChange={value => updateExperience(index, 'company', value)} placeholder="Место работы" />
                <div className="md:col-span-2">
                  <Textarea value={experience.description || ''} onChange={value => updateExperience(index, 'description', value)} rows={3} placeholder="Описание обязанностей" />
                </div>
              </div>
              <div className="mt-3 flex justify-end">
                <Btn variant="ghost" onClick={() => removeExperience(index)}>Удалить</Btn>
              </div>
            </div>
          ))}
        </div>
      </Surface>
    </div>
  );
}

function SeekerMessages({ messages }) {
  const [active, setActive] = useState(messages[0] || null);
  const [reply, setReply] = useState('');

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
        <div className="mb-5">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Соискатель · сообщения</div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Диалоги</h1>
        </div>

      <Surface className="flex min-h-[560px] flex-col overflow-hidden lg:flex-row">
        <div className="w-full border-b border-slate-200 bg-slate-50 lg:w-80 lg:border-b-0 lg:border-r">
          <div className="border-b border-slate-200 p-3">
            <Input value="" onChange={() => {}} placeholder="Поиск по диалогам" ariaLabel="Поиск по диалогам" prefix={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>} />
          </div>
          <div className="max-h-72 divide-y divide-slate-200 overflow-y-auto lg:max-h-none">
            {messages.map(message => (
              <button
                key={message.id}
                onClick={() => setActive(message)}
                className={`w-full px-4 py-3 text-left transition ${active?.id === message.id ? 'bg-white' : 'hover:bg-white/70'}`}
              >
                <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                  <div className="truncate font-semibold text-slate-900">{message.fromName}</div>
                  {!message.isRead && <span className="h-2 w-2 rounded-full bg-blue-600" />}
                </div>
                <div className="mt-1 line-clamp-2 text-xs text-slate-500">{message.text}</div>
                <div className="mt-1 text-[10px] text-slate-400">{fmtDate(message.createdAt)}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1">
          {active ? (
            <div className="flex h-full flex-col">
              <div className="flex flex-col gap-3 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:px-5">
                <Avatar name={active.fromName} size="sm" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{active.fromName}</div>
                  <div className="text-xs text-slate-400">{fmtDate(active.createdAt)}</div>
                </div>
              </div>
              <div className="flex-1 space-y-4 p-4 sm:p-5">
                <div className={`flex gap-3 ${active.fromRole === 'employer' ? 'flex-row-reverse' : ''}`}>
                  <Avatar name={active.fromName} size="sm" />
                  <div className={`max-w-xl rounded-2xl px-4 py-3 text-sm ${active.fromRole === 'employer' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'}`}>
                    {active.text}
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-200 p-4">
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Input value={reply} onChange={setReply} placeholder="Ответить работодателю" ariaLabel="Ответ работодателю" className="flex-1" />
                  <Btn variant="primary" disabled={reply.trim().length < 2} onClick={() => setReply('')}>Отправить</Btn>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">Выберите диалог</div>
          )}
        </div>
      </Surface>
    </div>
  );
}

function SeekerInvitations({ invitations }) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Соискатель · приглашения</div>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Входящие приглашения</h1>
      </div>

      <Surface>
        <div className="space-y-3 p-4 sm:p-5 md:hidden">
          {invitations.map(invitation => (
            <div key={invitation.id} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-slate-900">{invitation.vacancyTitle}</div>
                  <div className="mt-1 text-xs text-slate-500">{invitation.employerName}</div>
                </div>
                <StatusBadge status={invitation.status} />
              </div>
              <div className="mt-2 text-xs text-slate-400">{fmtDate(invitation.createdAt)}</div>
            </div>
          ))}
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                {['Вакансия', 'Работодатель', 'Статус', 'Дата'].map(head => <th key={head} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{head}</th>)}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {invitations.map(invitation => (
                <tr key={invitation.id} className="hover:bg-slate-50/70">
                  <td className="px-4 py-3 font-medium text-slate-900">{invitation.vacancyTitle}</td>
                  <td className="px-4 py-3 text-slate-600">{invitation.employerName}</td>
                  <td className="px-4 py-3"><StatusBadge status={invitation.status} /></td>
                  <td className="px-4 py-3 text-slate-500">{fmtDate(invitation.createdAt)}</td>
                </tr>
            ))}
          </tbody>
          </table>
        </div>
      </Surface>
    </div>
  );
}

function SeekerSettings() {
  const [form, setForm] = useState({
    notifications: true,
    showPhone: false,
    showEmail: true,
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Соискатель · настройки</div>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Настройки видимости</h1>
      </div>

      <Surface className="p-4 sm:p-5">
        <SectionHeader eyebrow="Видимость" title="Что показывать работодателям" description="Управляйте видимостью профиля и каналами уведомлений." />
        <div className="mt-4 space-y-3">
          {[
            { key: 'notifications', label: 'Показывать новые приглашения по email' },
            { key: 'showPhone', label: 'Показывать телефон в профиле' },
            { key: 'showEmail', label: 'Показывать email в профиле' },
          ].map(item => (
            <label key={item.key} className="flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form[item.key]}
                onChange={event => setForm(prev => ({ ...prev, [item.key]: event.target.checked }))}
                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              {item.label}
            </label>
          ))}
        </div>
      </Surface>
    </div>
  );
}

function AdminDashboard({ stats, resumes, employers, vacancies, users }) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Администратор · обзор</div>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Панель управления</h1>
      </div>

      <KPIGrid items={[
        { label: 'Резюме', value: stats.totalResumes, icon: '📄', color: 'blue', sub: `${stats.activeResumes} активных` },
        { label: 'Работодатели', value: stats.totalEmployers, icon: '🏢', color: 'cyan', sub: `${stats.approvedEmployers} одобрены` },
        { label: 'Вакансии', value: stats.totalVacancies, icon: '💼', color: 'green', sub: `${stats.activeVacancies} активных` },
        { label: 'Пользователи', value: users.length, icon: '👥', color: 'amber', sub: 'Единый реестр' },
      ]} />

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Surface className="p-4 sm:p-5">
          <SectionHeader eyebrow="Проверка" title="Очередь модерации" description="Кандидаты и работодатели, которым нужна ручная проверка." />
          <div className="mt-4 space-y-3">
            {resumes.filter(item => item.status !== 'active').slice(0, 5).map(item => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 px-3 py-2.5">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{item.fullName}</div>
                  <div className="text-xs text-slate-400">{item.position}</div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        </Surface>

      <Surface className="p-4 sm:p-5">
          <SectionHeader eyebrow="События" title="Последние действия" description="Краткая лента для контроля текущей активности." />
          <div className="mt-4 space-y-3">
            {window.MockData.AUDIT_LOGS.slice(0, 5).map(log => (
              <div key={log.id} className="rounded-xl bg-slate-50 px-3 py-2.5">
                <div className="text-sm font-medium text-slate-900">{log.action}</div>
                <div className="mt-1 text-xs text-slate-500">{log.user} · {fmtDate(log.timestamp)}</div>
              </div>
            ))}
          </div>
        </Surface>
      </div>
    </div>
  );
}

function TableWrap({ title, description, children, action }) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Администратор</div>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      <Surface className="p-0">
        <div className="flex flex-col gap-2 border-b border-slate-200 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <div className="text-sm font-semibold text-slate-800">{title}</div>
          {action}
        </div>
        {children}
      </Surface>
    </div>
  );
}

function AdminUsers({ users }) {
  const [query, setQuery] = useState('');
  const filtered = users.filter(user => fuzzyIncludes(`${user.fullName} ${user.email} ${user.organization}`, query));

  return (
    <TableWrap title="Пользователи" description="Работодатели и соискатели в едином реестре." action={<Input value={query} onChange={setQuery} placeholder="Поиск пользователей" ariaLabel="Поиск пользователей" className="w-72" />}>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Пользователь', 'Email', 'Роль', 'Организация', 'Статус', 'Дата'].map(head => <th key={head} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{head}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map(user => (
              <tr key={user.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-medium text-slate-900">{user.fullName}</td>
                <td className="px-4 py-3 text-slate-600">{user.email}</td>
                <td className="px-4 py-3"><Badge color={user.role === 'employer' ? 'blue' : 'cyan'}>{user.role}</Badge></td>
                <td className="px-4 py-3 text-slate-600">{user.organization}</td>
                <td className="px-4 py-3"><StatusBadge status={user.status} /></td>
                <td className="px-4 py-3 text-slate-500">{fmtDate(user.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableWrap>
  );
}

function AdminResumes({ resumes }) {
  return (
    <TableWrap title="Резюме" description="Проверка, одобрение и контроль качества данных.">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Резюме', 'Город', 'Должность', 'Статус', 'Дата', 'Действия'].map(head => <th key={head} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{head}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {resumes.map(resume => (
              <tr key={resume.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3">
                  <div className="font-medium text-slate-900">{resume.fullName}</div>
                  <div className="text-xs text-slate-400">{resume.id}</div>
                </td>
                <td className="px-4 py-3 text-slate-600">{resume.city}</td>
                <td className="px-4 py-3 text-slate-600">{resume.position}</td>
                <td className="px-4 py-3"><StatusBadge status={resume.status} /></td>
                <td className="px-4 py-3 text-slate-500">{fmtDate(resume.publishedAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Btn size="xs" variant="primary">Одобрить</Btn>
                    <Btn size="xs" variant="secondary">Отклонить</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableWrap>
  );
}

function AdminEmployers({ employers }) {
  return (
    <TableWrap title="Работодатели" description="Статус регистрации, контакты и количество вакансий.">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Компания', 'Контакт', 'Регион', 'Статус', 'Вакансии'].map(head => <th key={head} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{head}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employers.map(employer => (
              <tr key={employer.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-medium text-slate-900">{employer.name}</td>
                <td className="px-4 py-3 text-slate-600">{employer.contactName}</td>
                <td className="px-4 py-3 text-slate-600">{employer.region}</td>
                <td className="px-4 py-3"><StatusBadge status={employer.status} /></td>
                <td className="px-4 py-3 text-slate-500">{employer.vacancyCount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableWrap>
  );
}

function AdminVacancies({ vacancies }) {
  return (
    <TableWrap title="Вакансии" description="Контроль активных, черновиков и архивов.">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Вакансия', 'Компания', 'Город', 'Режим', 'Статус', 'Дата'].map(head => <th key={head} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{head}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {vacancies.map(vacancy => (
              <tr key={vacancy.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-medium text-slate-900">{vacancy.title}</td>
                <td className="px-4 py-3 text-slate-600">{vacancy.employerName}</td>
                <td className="px-4 py-3 text-slate-600">{vacancy.city}</td>
                <td className="px-4 py-3"><Badge color="slate">{vacancy.workMode}</Badge></td>
                <td className="px-4 py-3"><StatusBadge status={vacancy.status} /></td>
                <td className="px-4 py-3 text-slate-500">{fmtDate(vacancy.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableWrap>
  );
}

function AdminDictionaries() {
  const dictionaries = window.MockData.DICTIONARIES;

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-5">
        <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Администратор · справочники</div>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Справочники</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { title: 'Должности', values: dictionaries.positions },
          { title: 'Регионы', values: dictionaries.regions },
          { title: 'Образование', values: dictionaries.educations },
          { title: 'Режимы работы', values: dictionaries.workModes },
          { title: 'Сферы деятельности', values: dictionaries.activityAreas },
          { title: 'Тесты', values: dictionaries.tests },
        ].map(dictionary => (
          <Surface key={dictionary.title} className="p-4 sm:p-5">
            <SectionHeader eyebrow="Справочник" title={dictionary.title} description={`${dictionary.values.length} значений`} />
            <div className="mt-4 flex flex-wrap gap-1.5">
              {dictionary.values.map(value => <Badge key={value} color="slate">{value}</Badge>)}
            </div>
          </Surface>
        ))}
      </div>
    </div>
  );
}

function AdminLogs({ logs }) {
  return (
    <TableWrap title="Журнал событий" description="Аудит действий системы и пользователей.">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr>
              {['Событие', 'Пользователь', 'Роль', 'Детали', 'Время'].map(head => <th key={head} className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">{head}</th>)}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {logs.map(log => (
              <tr key={log.id} className="hover:bg-slate-50/70">
                <td className="px-4 py-3 font-medium text-slate-900">{log.action}</td>
                <td className="px-4 py-3 text-slate-600">{log.user}</td>
                <td className="px-4 py-3 text-slate-600">{log.role}</td>
                <td className="px-4 py-3 text-slate-500">{log.details}</td>
                <td className="px-4 py-3 text-slate-500">{fmtDate(log.timestamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </TableWrap>
  );
}

Object.assign(window, {
  KPIGrid,
  ColumnSurface,
  SeekerDashboard,
  SeekerResumeEditor,
  SeekerMessages,
  SeekerInvitations,
  SeekerSettings,
  AdminDashboard,
  AdminUsers,
  AdminResumes,
  AdminEmployers,
  AdminVacancies,
  AdminDictionaries,
  AdminLogs,
});
