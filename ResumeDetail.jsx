// Resume Detail Page + Message Modal + Invite Modal

var { useState, useMemo } = React;

function downloadResumeFile(resume) {
  const content = `
    <html>
      <head><meta charset="utf-8"></head>
      <body style="font-family: Arial, sans-serif;">
        <h1>${resume.fullName}</h1>
        <p><strong>Должность:</strong> ${resume.position}</p>
        <p><strong>Город:</strong> ${resume.city}</p>
        <p><strong>Регион:</strong> ${resume.region}</p>
        <p><strong>Зарплата:</strong> ${fmtSalary(resume.salary)}</p>
        <p><strong>Опыт:</strong> ${fmtExp(resume.experience)}</p>
        <p><strong>Возраст:</strong> ${resume.age}</p>
        <p><strong>Пол:</strong> ${resume.gender === 'male' ? 'Мужской' : 'Женский'}</p>
        <h2>О себе</h2>
        <p>${resume.about}</p>
      </body>
    </html>
  `;
  const blob = new Blob([content], { type: 'application/msword;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${resume.id}.doc`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(link.href), 1000);
}

function InviteModal({ open, onClose, resume, vacancies, onSend }) {
  const [vacancyId, setVacancyId] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const templates = useMemo(() => ([
    'Добрый день! Мы рассмотрели ваше резюме и хотели бы пригласить вас на собеседование.',
    'Здравствуйте! Ваш опыт хорошо подходит под наши требования. Будем рады обсудить условия.',
    'Добрый день! Приглашаем вас рассмотреть нашу вакансию. Готовы ответить на ваши вопросы.',
  ]), []);

  const activeVacancies = vacancies.filter(vacancy => vacancy.status === 'active');
  const messageLength = message.length;
  const hasMessageError = messageLength > 0 && (messageLength < 10 || messageLength > 2000);

  React.useEffect(() => {
    if (!open) {
      setSent(false);
      setVacancyId('');
      setMessage('');
    }
  }, [open]);

  const resetState = () => {
    setSent(false);
    setVacancyId('');
    setMessage('');
  };

  const handleSend = () => {
    if (!vacancyId || hasMessageError) return;
    const vacancy = activeVacancies.find(item => item.id === vacancyId);
    onSend?.({
      resume,
      vacancy,
      message,
    });
    setSent(true);
  };

  if (sent) {
    return (
      <Modal open={open} onClose={() => { onClose(); resetState(); }} title="Приглашение отправлено">
        <div className="py-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
            <svg className="h-8 w-8 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div className="mb-1 text-base font-semibold text-slate-900">Приглашение отправлено</div>
          <div className="mb-5 text-sm text-slate-500">Кандидат увидит приглашение и сможет ответить из своего кабинета.</div>
          <Btn variant="primary" onClick={() => { onClose(); resetState(); }}>Закрыть</Btn>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={`Пригласить: ${resume?.fullName?.split(' ').slice(0, 2).join(' ')}`} size="lg">
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-3">
          {[
            { step: '1', title: 'Выбор вакансии', active: Boolean(vacancyId) },
            { step: '2', title: 'Сообщение', active: messageLength === 0 || !hasMessageError },
            { step: '3', title: 'Отправка', active: Boolean(vacancyId) && !hasMessageError },
          ].map(item => (
            <div key={item.step} className={`rounded-2xl border p-3 shadow-sm transition ${item.active ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-slate-50/80'}`}>
              <div className="flex items-center gap-3">
                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${item.active ? 'bg-blue-600 text-white' : 'bg-white text-slate-500 ring-1 ring-slate-200'}`}>
                  {item.step}
                </div>
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Шаг {item.step}</div>
                  <div className="mt-0.5 text-sm font-semibold text-slate-900">{item.title}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-start gap-3">
            <Avatar src={resume?.photo} name={resume?.fullName} size="md" />
            <div className="min-w-0">
              <div className="text-xs font-mono text-slate-400">{resume?.id}</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{resume?.fullName}</div>
              <div className="mt-1 text-xs text-slate-500">{resume?.position} · {resume?.city}</div>
            </div>
          </div>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Вакансия <span className="text-red-500">*</span></label>
          <Combobox
            value={vacancyId}
            onChange={setVacancyId}
            options={activeVacancies.map(vacancy => ({
              value: vacancy.id,
              label: vacancy.title,
              hint: `${vacancy.city} · ${vacancy.workMode} · ${fmtSalary(vacancy.salaryFrom)}–${fmtSalary(vacancy.salaryTo)}`,
            }))}
            placeholder="Выберите вакансию"
            searchPlaceholder="Найти вакансию"
          />
        </div>

        {vacancyId && (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Предпросмотр отправки</div>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              <div>
                <div className="text-xs text-slate-500">Кандидат</div>
                <div className="text-sm font-semibold text-slate-900">{resume?.fullName}</div>
                <div className="text-xs text-slate-500">{resume?.position} · {resume?.city}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">Вакансия</div>
                <div className="text-sm font-semibold text-slate-900">
                  {activeVacancies.find(item => item.id === vacancyId)?.title}
                </div>
                <div className="text-xs text-slate-500">
                  {activeVacancies.find(item => item.id === vacancyId)?.city} · {activeVacancies.find(item => item.id === vacancyId)?.workMode}
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <label className="mb-1.5 block text-sm font-medium text-slate-700">Сообщение <span className="text-slate-400">(необязательно)</span></label>
          <div className="mb-2 flex flex-wrap gap-1.5">
            {templates.map((template, index) => (
              <button
                key={template}
                onClick={() => setMessage(template)}
                className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-700"
              >
                Шаблон {index + 1}
              </button>
            ))}
          </div>
          <Textarea
            value={message}
            onChange={setMessage}
            placeholder="Напишите сопроводительное сообщение кандидату. Это поле необязательное."
            rows={5}
            error={hasMessageError ? (messageLength < 10 ? 'Минимум 10 символов' : 'Превышен лимит 2000 символов') : ''}
            helper={`${messageLength} / 2000`}
          />
        </div>

        <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
          <Btn variant="secondary" onClick={onClose}>Отмена</Btn>
          <Btn variant="primary" disabled={!vacancyId || hasMessageError} onClick={handleSend}>Отправить приглашение</Btn>
        </div>
      </div>
    </Modal>
  );
}

function MessageModal({ open, onClose, resume }) {
  const [text, setText] = useState('');
  const [sent, setSent] = useState(false);

  const textLength = text.length;
  const error =
    textLength > 0 && textLength < 10 ? 'Заполните более подробно текст сообщения – минимум 10 символов' :
    textLength > 2000 ? 'Превышен лимит 2000 символов' :
    '';

  React.useEffect(() => {
    if (!open) {
      setText('');
      setSent(false);
    }
  }, [open]);

  const handleSend = () => {
    if (error || textLength === 0) return;
    setSent(true);
  };

  const resetState = () => {
    setText('');
    setSent(false);
  };

  if (sent) {
    return (
      <Modal open={open} onClose={() => { onClose(); resetState(); }} title="Сообщение отправлено">
        <div className="py-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
            <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <div className="mb-1 text-base font-semibold text-slate-900">Сообщение отправлено</div>
          <div className="mb-5 text-sm text-slate-500">Кандидат получит уведомление и увидит сообщение в своём кабинете.</div>
          <Btn variant="primary" onClick={() => { onClose(); resetState(); }}>Закрыть</Btn>
        </div>
      </Modal>
    );
  }

  return (
    <Modal open={open} onClose={onClose} title={`Сообщение: ${resume?.fullName?.split(' ').slice(0, 2).join(' ')}`} size="md">
      <div className="space-y-4">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
          <div className="flex items-start gap-3">
            <Avatar src={resume?.photo} name={resume?.fullName} size="md" />
            <div className="min-w-0">
              <div className="text-xs font-mono text-slate-400">{resume?.id}</div>
              <div className="mt-1 text-sm font-semibold text-slate-900">{resume?.fullName}</div>
              <div className="mt-1 text-xs text-slate-500">{resume?.position} · {resume?.city}</div>
            </div>
          </div>
        </div>
        <Textarea
          value={text}
          onChange={setText}
          placeholder="Введите сообщение кандидату"
          rows={6}
          error={error}
          helper={`${textLength} / 2000`}
        />
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Btn variant="secondary" onClick={onClose}>Отмена</Btn>
          <Btn variant="primary" disabled={Boolean(error) || textLength === 0} onClick={handleSend}>Отправить</Btn>
        </div>
      </div>
    </Modal>
  );
}

function ResumeDetail({ resume, vacancies, onBack, onInviteSend }) {
  const [msgOpen, setMsgOpen] = useState(false);
  const [invOpen, setInvOpen] = useState(false);

  if (!resume) return null;

  const hasSvo = Boolean(resume.flags?.svo);
  const hasDisability = Boolean(resume.flags?.disability);
  const hasSpecialStatus = hasSvo || hasDisability || (resume.specialStatuses || []).length > 0;
  const hasAdditionalInfo = (resume.tests || []).length > 0 || (resume.activityAreas || []).length > 0 || resume.workMode || resume.education || resume.publishedAt;

  return (
    <div className="mx-auto max-w-6xl px-4 py-4 sm:px-6 sm:py-6">
      <MessageModal open={msgOpen} onClose={() => setMsgOpen(false)} resume={resume} />
      <InviteModal open={invOpen} onClose={() => setInvOpen(false)} resume={resume} vacancies={vacancies} onSend={onInviteSend} />

      <button onClick={onBack} className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 transition hover:text-slate-800 sm:mb-5">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        Назад к реестру
      </button>

      <Surface className="mb-5 overflow-hidden">
        <div className="grid gap-4 p-4 sm:gap-5 sm:p-6 lg:grid-cols-[300px_1fr]">
          <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
            <div className="rounded-2xl bg-slate-50 p-4 sm:p-5">
              <div className="flex items-start gap-4">
                <Avatar src={resume.photo} name={resume.fullName} size="xl" />
                <div className="min-w-0">
                  <div className="text-xs font-mono text-slate-400">{resume.id}</div>
                  <h1 className="mt-1 text-2xl font-bold text-slate-900">{resume.fullName}</h1>
                  <div className="mt-1 text-base font-semibold text-blue-700">{resume.position}</div>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {hasSvo && <Badge color="turquoise">Участник СВО</Badge>}
                    {resume.specialStatuses?.includes('Член семьи участника СВО') && <Badge color="turquoise">Член семьи участника СВО</Badge>}
                    {hasDisability && <Badge color="turquoise">ОВЗ</Badge>}
                    {resume.hasPhoto && <Badge color="green">Фото</Badge>}
                  </div>
                </div>
              </div>

              <div className="mt-5 space-y-2 rounded-xl bg-white p-4 ring-1 ring-slate-200">
                <InfoRow label="Город" value={resume.city} />
                <InfoRow label="Регион" value={resume.region} />
                <InfoRow label="Зарплата" value={fmtSalary(resume.salary)} />
                <InfoRow label="Опыт" value={fmtExp(resume.experience)} />
                <InfoRow label="Возраст" value={`${resume.age} лет`} />
                <InfoRow label="Пол" value={resume.gender === 'male' ? 'Мужской' : 'Женский'} />
              </div>

              <div className="mt-4 flex flex-col gap-2">
                <Btn variant="cyan" onClick={() => setInvOpen(true)}>Пригласить</Btn>
                <Btn variant="secondary" onClick={() => setMsgOpen(true)}>Отправить сообщение</Btn>
                <Btn variant="surface" onClick={() => downloadResumeFile(resume)}>Скачать</Btn>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Surface className="overflow-hidden p-4 sm:p-5">
              <SectionHeader
                eyebrow="Основная информация"
                title="Профиль кандидата"
                description="Сводка по кандидатy для быстрого решения: видно только заполненные поля."
              />
              <div className="mt-4 grid gap-3 lg:grid-cols-[1.3fr_0.7fr]">
                <div className="rounded-2xl bg-[linear-gradient(135deg,rgba(37,99,235,0.08),rgba(20,184,166,0.05))] p-4 ring-1 ring-blue-100">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Быстрое чтение</div>
                  <div className="mt-2 text-base font-semibold text-slate-900">{resume.position}</div>
                  <div className="mt-1 text-sm leading-relaxed text-slate-600">
                    {resume.about ? resume.about.slice(0, 180) + (resume.about.length > 180 ? '…' : '') : 'Кандидат заполнил ключевые данные профиля.'}
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Публикация</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">{fmtDate(resume.publishedAt)}</div>
                  <div className="mt-1 text-xs text-slate-500">Карточка собрана для быстрого решения без пустых секций.</div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <InfoRow label="Должность" value={resume.position} />
                <InfoRow label="Город" value={resume.city} />
                <InfoRow label="Регион" value={resume.region} />
                <InfoRow label="Возраст" value={`${resume.age} лет`} />
                <InfoRow label="Пол" value={resume.gender === 'male' ? 'Мужской' : 'Женский'} />
                <InfoRow label="Уровень зарплаты" value={fmtSalary(resume.salary)} />
              </div>

              {hasSpecialStatus && (
                <div className="mt-5 rounded-2xl border border-teal-200 bg-teal-50/70 p-4">
                  <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Особые статусы</div>
                  <div className="flex flex-wrap gap-1.5">
                    {hasSvo && <Badge color="turquoise">Участник СВО</Badge>}
                    {resume.specialStatuses?.includes('Член семьи участника СВО') && <Badge color="turquoise">Член семьи участника СВО</Badge>}
                    {hasDisability && <Badge color="turquoise">Лицо с инвалидностью</Badge>}
                  </div>
                </div>
              )}
            </Surface>

            <div className="grid gap-4 lg:grid-cols-2">
              {resume.workExperiences?.length > 0 && (
                <Surface className="p-4 sm:p-5 lg:col-span-2">
                  <SectionHeader
                    eyebrow="Опыт работы"
                    title="История карьеры"
                    description="Показываем только реальные записи, без пустых блоков."
                  />
                  <div className="mt-4 space-y-4">
                    {resume.workExperiences.map((experience, index) => (
                      <div key={experience.id} className={`relative pl-4 ${index < resume.workExperiences.length - 1 ? 'pb-4 border-b border-slate-100' : ''}`}>
                        <span className="absolute left-0 top-2 h-2.5 w-2.5 rounded-full bg-blue-500" />
                        <div className="text-xs text-slate-400">{experience.from} — {experience.to}</div>
                        <div className="mt-0.5 text-sm font-semibold text-slate-900">{experience.role}</div>
                        <div className="text-sm text-blue-700">{experience.company}</div>
                        {experience.description && <div className="mt-1 text-sm leading-relaxed text-slate-600">{experience.description}</div>}
                      </div>
                    ))}
                  </div>
                </Surface>
              )}

              {hasAdditionalInfo && (
                <Surface className="p-4 sm:p-5">
                  <SectionHeader
                    eyebrow="Дополнительная информация"
                    title="Тесты, сферы и формат"
                    description="Показаны только выбранные значения, без лишнего шума."
                  />
                  <div className="mt-4 space-y-4">
                    {(resume.tests || []).length > 0 && (
                      <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Прохождение тестов</div>
                        <div className="flex flex-wrap gap-1.5">
                          {resume.tests.map(test => <Badge key={test} color="blue">{test}</Badge>)}
                        </div>
                      </div>
                    )}
                    {(resume.activityAreas || []).length > 0 && (
                      <div>
                        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Сферы деятельности</div>
                        <div className="flex flex-wrap gap-1.5">
                          {resume.activityAreas.map(area => <Badge key={area} color="slate">{area}</Badge>)}
                        </div>
                      </div>
                    )}
                    {resume.workMode && <InfoRow label="Режим работы" value={resume.workMode} />}
                    {resume.education && <InfoRow label="Образование" value={resume.education} />}
                    {resume.publishedAt && <InfoRow label="Дата публикации" value={fmtDate(resume.publishedAt)} />}
                  </div>
                </Surface>
              )}

              {resume.about && (
                <Surface className="p-4 sm:p-5 lg:col-span-2">
                  <SectionHeader
                    eyebrow="О себе"
                    title="Краткое описание"
                    description="Вырезаем пустые поля и оставляем только содержательный текст."
                  />
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600">{resume.about}</p>
                </Surface>
              )}
            </div>
          </div>
        </div>
      </Surface>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex flex-col gap-1.5 rounded-xl bg-slate-50 px-3 py-2.5 sm:flex-row sm:items-start sm:justify-between">
      <span className="text-xs font-medium text-slate-500">{label}</span>
      <span className="text-sm font-semibold text-slate-800 sm:max-w-[70%] sm:text-right">{value || '—'}</span>
    </div>
  );
}

Object.assign(window, { ResumeDetail, InviteModal, MessageModal, downloadResumeFile });
