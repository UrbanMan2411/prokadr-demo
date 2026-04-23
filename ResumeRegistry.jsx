// Resume Registry — Main employer workflow

var { useState, useEffect, useMemo } = React;

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debouncedValue;
}

const INITIAL_FILTERS = {
  region: '',
  positions: [],
  specialStatuses: [],
  tests: [],
  activityAreas: [],
  salaryFrom: '',
  salaryTo: '',
  dateFrom: '',
  dateTo: '',
  expMin: '',
  workMode: '',
  ageFrom: '',
  ageTo: '',
  gender: '',
  education: '',
  onlyPhoto: false,
  onlyFavorites: false,
};

function toFilterChipEntries(filters) {
  const chips = [];

  if (filters.region) chips.push({ key: 'region', value: filters.region, label: `Регион: ${filters.region}` });
  filters.positions.forEach(position => chips.push({ key: 'positions', value: position, label: `Должность: ${position}` }));
  filters.specialStatuses.forEach(status => chips.push({ key: 'specialStatuses', value: status, label: `Статус: ${status}` }));
  filters.tests.forEach(test => chips.push({ key: 'tests', value: test, label: `Тест: ${test}` }));
  filters.activityAreas.forEach(area => chips.push({ key: 'activityAreas', value: area, label: `Сфера: ${area}` }));
  if (filters.salaryFrom) chips.push({ key: 'salaryFrom', value: filters.salaryFrom, label: `Зарплата от ${filters.salaryFrom}` });
  if (filters.salaryTo) chips.push({ key: 'salaryTo', value: filters.salaryTo, label: `Зарплата до ${filters.salaryTo}` });
  if (filters.dateFrom) chips.push({ key: 'dateFrom', value: filters.dateFrom, label: `Дата от ${fmtDate(filters.dateFrom)}` });
  if (filters.dateTo) chips.push({ key: 'dateTo', value: filters.dateTo, label: `Дата до ${fmtDate(filters.dateTo)}` });
  if (filters.expMin) chips.push({ key: 'expMin', value: filters.expMin, label: `Опыт от ${filters.expMin} лет` });
  if (filters.workMode) chips.push({ key: 'workMode', value: filters.workMode, label: `Режим: ${filters.workMode}` });
  if (filters.ageFrom) chips.push({ key: 'ageFrom', value: filters.ageFrom, label: `Возраст от ${filters.ageFrom}` });
  if (filters.ageTo) chips.push({ key: 'ageTo', value: filters.ageTo, label: `Возраст до ${filters.ageTo}` });
  if (filters.gender) chips.push({ key: 'gender', value: filters.gender, label: `Пол: ${filters.gender === 'male' ? 'Мужской' : 'Женский'}` });
  if (filters.education) chips.push({ key: 'education', value: filters.education, label: `Образование: ${filters.education}` });
  if (filters.onlyPhoto) chips.push({ key: 'onlyPhoto', value: true, label: 'Только с фото' });
  if (filters.onlyFavorites) chips.push({ key: 'onlyFavorites', value: true, label: 'Только избранное' });

  return chips;
}

function removeChip(filters, chip) {
  if (Array.isArray(filters[chip.key])) {
    return {
      ...filters,
      [chip.key]: filters[chip.key].filter(item => item !== chip.value),
    };
  }

  return {
    ...filters,
    [chip.key]: chip.key === 'onlyPhoto' || chip.key === 'onlyFavorites' ? false : '',
  };
}

function getRegionMatches(region) {
  return window.MockData.REGION_LOCATIONS?.[region] || [];
}

function scoreResumeForQuery(resume, query) {
  const q = normalizeText(query);
  if (!q) return 0;

  const fields = [
    resume.position,
    resume.about,
    resume.city,
    resume.region,
    resume.searchArea,
    ...(resume.activityAreas || []),
  ].map(value => normalizeText(value));

  let score = 0;
  q.split(' ').forEach(token => {
    fields.forEach(field => {
      if (!field) return;
      if (field.startsWith(token)) score += 4;
      else if (field.includes(token)) score += 2;
    });
  });

  return score;
}

function ResumeRegistry({ resumes, setResumes, vacancies, onOpenResume, onInvite }) {
  const [query, setQuery] = useState('');
  const [viewMode, setViewMode] = useState(() => (window.innerWidth < 768 ? 'cards' : 'table'));
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [filters, setFilters] = useState(INITIAL_FILTERS);
  const [savedSearches, setSavedSearches] = useState(window.MockData.SAVED_SEARCHES || []);
  const [selectedPreset, setSelectedPreset] = useState('');
  const [selectedIds, setSelectedIds] = useState([]);
  const debouncedQuery = useDebounce(query, 240);

  const updateFilter = (key, value) => setFilters(prev => ({ ...prev, [key]: value }));
  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
    setQuery('');
    setSelectedPreset('');
  };

  const applyPreset = presetId => {
    setSelectedPreset(presetId);
    const preset = savedSearches.find(item => item.id === presetId);
    if (!preset) return;
    setFilters({ ...INITIAL_FILTERS, ...preset.filters });
    if (preset.query) setQuery(preset.query);
  };

  const saveCurrentSearch = () => {
    const queryPart = debouncedQuery ? debouncedQuery.slice(0, 28) : 'Ручной поиск';
    const name = `${queryPart}${debouncedQuery && debouncedQuery.length > 28 ? '…' : ''}`;
    const nextPreset = {
      id: `custom-${Date.now()}`,
      name,
      query: debouncedQuery || '',
      filters,
    };
    setSavedSearches(prev => [nextPreset, ...prev]);
    setSelectedPreset(nextPreset.id);
  };

  const activeChips = toFilterChipEntries(filters);

  const filtered = useMemo(() => {
    const queryResults = resumes
      .filter(resume => {
        if (filters.onlyFavorites && !resume.isFavorite) return false;
        if (filters.onlyPhoto && !resume.hasPhoto) return false;

        if (filters.region) {
          const regionMatches = resume.region === filters.region;
          const localityMatches = getRegionMatches(filters.region).includes(resume.city);
          if (!regionMatches && !localityMatches) return false;
        }

        if (filters.positions.length && !filters.positions.some(position => normalizeText(resume.position).includes(normalizeText(position)))) return false;

        if (filters.specialStatuses.length) {
          const resumeStatuses = resume.specialStatuses || [];
          if (!filters.specialStatuses.some(status => resumeStatuses.includes(status))) return false;
        }

        if (filters.tests.length && !filters.tests.some(test => (resume.tests || []).includes(test))) return false;

        if (filters.activityAreas.length && !filters.activityAreas.some(area => (resume.activityAreas || []).includes(area))) return false;

        if (filters.salaryFrom && (resume.salary ?? 0) < Number(filters.salaryFrom)) return false;
        if (filters.salaryTo && (resume.salary ?? 0) > Number(filters.salaryTo)) return false;
        if (filters.dateFrom && resume.publishedAt < filters.dateFrom) return false;
        if (filters.dateTo && resume.publishedAt > filters.dateTo) return false;
        if (filters.expMin && resume.experience < Number(filters.expMin)) return false;
        if (filters.workMode && resume.workMode !== filters.workMode) return false;
        if (filters.ageFrom && resume.age < Number(filters.ageFrom)) return false;
        if (filters.ageTo && resume.age > Number(filters.ageTo)) return false;
        if (filters.gender && resume.gender !== filters.gender) return false;
        if (filters.education && resume.education !== filters.education) return false;
        if (debouncedQuery && !fuzzyIncludes(`${resume.position} ${resume.about} ${resume.city} ${resume.region} ${(resume.activityAreas || []).join(' ')}`, debouncedQuery)) return false;
        return true;
      })
      .sort((left, right) => {
        const leftScore = scoreResumeForQuery(left, debouncedQuery);
        const rightScore = scoreResumeForQuery(right, debouncedQuery);
        if (rightScore !== leftScore) return rightScore - leftScore;
        if (left.isFavorite !== right.isFavorite) return Number(right.isFavorite) - Number(left.isFavorite);
        return new Date(right.publishedAt) - new Date(left.publishedAt);
      });

    return queryResults;
  }, [resumes, filters, debouncedQuery]);

  const selectedResumes = useMemo(() => resumes.filter(resume => selectedIds.includes(resume.id)), [resumes, selectedIds]);
  const allVisibleSelected = filtered.length > 0 && filtered.every(resume => selectedIds.includes(resume.id));
  const someVisibleSelected = filtered.some(resume => selectedIds.includes(resume.id));

  useEffect(() => {
    setSelectedIds(prev => prev.filter(id => filtered.some(resume => resume.id === id)));
  }, [filtered]);

  const toggleSelected = resumeId => {
    setSelectedIds(prev => (
      prev.includes(resumeId)
        ? prev.filter(id => id !== resumeId)
        : [...prev, resumeId]
    ));
  };

  const toggleAllVisible = () => {
    if (allVisibleSelected) {
      setSelectedIds(prev => prev.filter(id => !filtered.some(resume => resume.id === id)));
      return;
    }
    setSelectedIds(prev => [...new Set([...prev, ...filtered.map(resume => resume.id)])]);
  };

  const toggleFavoriteBatch = nextValue => {
    setResumes(prev => prev.map(resume => (
      selectedIds.includes(resume.id) ? { ...resume, isFavorite: nextValue } : resume
    )));
  };

  const clearSelection = () => setSelectedIds([]);

  const regionOptions = window.MockData.DICTIONARIES.regionOptions || [];
  const positionOptions = (window.MockData.DICTIONARIES.positions || []).map(position => ({ value: position, label: position }));
  const specialStatusOptions = (window.MockData.DICTIONARIES.specialStatuses || []).map(status => ({ value: status, label: status }));
  const testOptions = (window.MockData.DICTIONARIES.tests || []).map(test => ({ value: test, label: test }));
  const activityOptions = (window.MockData.DICTIONARIES.activityAreas || []).map(area => ({ value: area, label: area }));
  const selectedPresetName = savedSearches.find(preset => preset.id === selectedPreset)?.name;
  const visibleFavorites = filtered.filter(resume => resume.isFavorite).length;
  const visibleSpecialStatuses = filtered.filter(resume => resume.flags?.svo || resume.flags?.disability).length;

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-4 sm:px-6 sm:py-6">
      <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-slate-400">Работодатель · реестр резюме</div>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Реестр резюме</h1>
          <p className="mt-1 text-sm text-slate-500">
            Найдено <span className="font-semibold text-slate-700">{filtered.length}</span> из {resumes.length}
            {debouncedQuery ? <span className="ml-2 text-blue-600">· запрос: “{debouncedQuery}”</span> : null}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Btn variant="surface" onClick={() => setFiltersOpen(open => !open)}>
            {filtersOpen ? 'Свернуть фильтры' : 'Расширенные фильтры'}
          </Btn>
          <Btn variant="secondary" onClick={saveCurrentSearch}>Сохранить поиск</Btn>
        </div>
      </div>

      <Surface className="mb-4 overflow-hidden border-slate-200/90 bg-slate-950 text-white">
        <div className="grid gap-4 px-4 py-4 sm:px-5 sm:py-5 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-200">
              Employer registry
            </div>
            <div className="mt-3 text-xl font-semibold tracking-[-0.03em] text-white">Быстрый отбор кандидатов без лишних переходов</div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              Табличный режим остаётся основным инструментом для скрининга. Карточки помогают мягче просматривать shortlist и обсуждать кандидатов с командой.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <RegistryPill label="В выдаче" value={filtered.length} tone="slate-dark" />
            <RegistryPill label="Избранные" value={visibleFavorites} tone="amber-soft" />
            <RegistryPill label="Со статусами" value={visibleSpecialStatuses} tone="teal-soft" />
          </div>
        </div>
      </Surface>

      <Surface className="sticky top-3 z-20 mb-4 overflow-visible border-slate-200/90 bg-white/96 p-4 sm:top-4">
        <div className="mb-4 flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <RegistryTag>{selectedPresetName || 'Ручной сценарий'}</RegistryTag>
          </div>
          <div className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50 p-1.5">
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${viewMode === 'table' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Таблица
            </button>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              className={`rounded-xl px-3.5 py-2 text-xs font-semibold transition ${viewMode === 'cards' ? 'bg-white text-blue-700 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
            >
              Карточки
            </button>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-[1.45fr_0.95fr_0.55fr_0.55fr]">
          <Input
            value={query}
            onChange={setQuery}
            placeholder="Поиск по должности, о себе, сфере, городу..."
            prefix={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            suffix={query ? <button onClick={() => setQuery('')} className="text-slate-400 transition hover:text-slate-700">✕</button> : null}
          />
          <Select
            value={selectedPreset}
            onChange={applyPreset}
            options={[{ value: '', label: 'Сохранённые поиски' }, ...savedSearches.map(preset => ({ value: preset.id, label: preset.name }))]}
          />
          <Btn variant="primary" onClick={() => setFiltersOpen(true)}>Найти</Btn>
          <Btn variant="ghost" onClick={resetFilters}>Сброс</Btn>
        </div>

        {(debouncedQuery || activeChips.length > 0) && (
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
            {debouncedQuery && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700 ring-1 ring-blue-100">Активный запрос</span>}
            {activeChips.length > 0 && <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">{activeChips.length} фильтров</span>}
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-500">{viewMode === 'table' ? 'Режим быстрого скрининга' : 'Режим обсуждения shortlist'}</span>
          </div>
        )}
      </Surface>

      {activeChips.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {activeChips.map(chip => (
            <Chip
              key={`${chip.key}-${chip.value}`}
              label={chip.label}
              onRemove={() => setFilters(prev => removeChip(prev, chip))}
            />
          ))}
        </div>
      )}

      {selectedIds.length > 0 && (
        <Surface className="mb-4 overflow-hidden border-slate-900 bg-slate-900 px-4 py-3 text-white">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10 text-white">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <div>
                <div className="text-sm font-semibold text-white">{selectedIds.length} резюме выбрано</div>
                <div className="text-xs text-slate-300">Можно быстро отметить shortlist, добавить кандидатов в избранное или отправить точечное приглашение.</div>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
              <Btn variant="secondary" onClick={() => toggleFavoriteBatch(true)}>Добавить в избранное</Btn>
              <Btn variant="surface" onClick={clearSelection}>Снять выделение</Btn>
              <Btn
                variant="primary"
                disabled={selectedIds.length !== 1}
                onClick={() => onInvite(selectedResumes[0])}
              >
                Пригласить выбранного
              </Btn>
            </div>
          </div>
        </Surface>
      )}

      {filtersOpen && (
        <Surface className="mb-5">
          <div className="border-b border-slate-100 px-4 py-4 sm:px-5 sm:py-4">
            <SectionHeader
              eyebrow="Фильтры"
              title="Расширенный поиск"
              description="Регион учитывает города внутри субъекта, а списки поддерживают множественный выбор и поиск по названию."
              action={<Btn variant="ghost" onClick={resetFilters}>Сбросить всё</Btn>}
            />
          </div>

        <div className="grid gap-4 px-4 py-4 sm:px-5 sm:py-5 lg:grid-cols-4 md:grid-cols-2">
            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Субъект РФ</label>
              <Combobox
                value={filters.region}
                onChange={value => updateFilter('region', value)}
                options={regionOptions}
                placeholder="Выберите регион"
                searchPlaceholder="Найти регион или город"
              />
            </div>

            <div className="lg:col-span-2">
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Должность</label>
              <Combobox
                value={filters.positions}
                onChange={value => updateFilter('positions', value)}
                options={positionOptions}
                placeholder="Выберите должности"
                multiple
                searchPlaceholder="Найти должность"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Участники СВО и члены их семей</label>
              <Combobox
                value={filters.specialStatuses}
                onChange={value => updateFilter('specialStatuses', value)}
                options={specialStatusOptions}
                placeholder="Любые статусы"
                multiple
                searchPlaceholder="Найти статус"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Прохождение тестов</label>
              <Combobox
                value={filters.tests}
                onChange={value => updateFilter('tests', value)}
                options={testOptions}
                placeholder="Любые тесты"
                multiple
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Сферы деятельности</label>
              <Combobox
                value={filters.activityAreas}
                onChange={value => updateFilter('activityAreas', value)}
                options={activityOptions}
                placeholder="Любые сферы"
                multiple
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Режим работы</label>
              <Select
                value={filters.workMode}
                onChange={value => updateFilter('workMode', value)}
                options={['В офисе', 'Удалённо', 'Гибрид']}
                placeholder="Любой режим"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Образование</label>
              <Select
                value={filters.education}
                onChange={value => updateFilter('education', value)}
                options={['Высшее', 'Среднее специальное', 'Среднее']}
                placeholder="Любое"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Пол</label>
              <Select
                value={filters.gender}
                onChange={value => updateFilter('gender', value)}
                options={[
                  { value: '', label: 'Не имеет значения' },
                  { value: 'female', label: 'Женский' },
                  { value: 'male', label: 'Мужской' },
                ]}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Зарплата от, ₽</label>
              <Input value={filters.salaryFrom} onChange={value => updateFilter('salaryFrom', value)} placeholder="60 000" type="number" />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Зарплата до, ₽</label>
              <Input value={filters.salaryTo} onChange={value => updateFilter('salaryTo', value)} placeholder="200 000" type="number" />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Дата публикации от</label>
              <Input value={filters.dateFrom} onChange={value => updateFilter('dateFrom', value)} type="date" />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Дата публикации до</label>
              <Input value={filters.dateTo} onChange={value => updateFilter('dateTo', value)} type="date" />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Опыт, минимум лет</label>
              <Input value={filters.expMin} onChange={value => updateFilter('expMin', value)} placeholder="0" type="number" />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">Возраст от / до</label>
              <div className="grid gap-2 sm:grid-cols-2">
                <Input value={filters.ageFrom} onChange={value => updateFilter('ageFrom', value)} placeholder="18" type="number" />
                <Input value={filters.ageTo} onChange={value => updateFilter('ageTo', value)} placeholder="65" type="number" />
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Уточнения выдачи</div>
                <div className="flex flex-col gap-3">
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={filters.onlyPhoto}
                      onChange={event => updateFilter('onlyPhoto', event.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Только с фото
                  </label>
                  <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={filters.onlyFavorites}
                      onChange={event => updateFilter('onlyFavorites', event.target.checked)}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Только избранные
                  </label>
                </div>
              </div>
            </div>
          </div>
        </Surface>
      )}

      {filtered.length === 0 ? (
        <Surface className="py-6">
          <EmptyState
            icon="🔍"
            title="Подходящих резюме нет по текущим условиям"
            description="Измените запрос, ослабьте фильтры или откройте другой сохранённый сценарий поиска."
            action={<Btn variant="secondary" onClick={resetFilters}>Сбросить фильтры</Btn>}
          />
        </Surface>
      ) : viewMode === 'table' ? (
        <ResumeTable
          resumes={filtered}
          onOpen={onOpenResume}
          onInvite={onInvite}
          onToggleFav={id => setResumes(prev => prev.map(resume => (resume.id === id ? { ...resume, isFavorite: !resume.isFavorite } : resume)))}
          selectedIds={selectedIds}
          allVisibleSelected={allVisibleSelected}
          someVisibleSelected={someVisibleSelected}
          onToggleSelected={toggleSelected}
          onToggleAllVisible={toggleAllVisible}
        />
      ) : (
        <ResumeCards
          resumes={filtered}
          onOpen={onOpenResume}
          onInvite={onInvite}
          onToggleFav={id => setResumes(prev => prev.map(resume => (resume.id === id ? { ...resume, isFavorite: !resume.isFavorite } : resume)))}
          selectedIds={selectedIds}
          onToggleSelected={toggleSelected}
        />
      )}
    </div>
  );
}

function StatusFlag({ label, active }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${active ? 'bg-teal-50 text-teal-700 ring-teal-100' : 'bg-slate-100 text-slate-500 ring-slate-200'}`}>
      {label}
    </span>
  );
}

function RegistryPill({ label, value, tone = 'blue' }) {
  const tones = {
    blue: 'bg-blue-50 text-blue-700 ring-blue-200',
    amber: 'bg-amber-50 text-amber-700 ring-amber-200',
    teal: 'bg-teal-50 text-teal-700 ring-teal-200',
  };
  return (
    <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ring-1 ring-inset ${tones[tone] || tones.blue}`}>
      <span className="opacity-80">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function RegistryTag({ children }) {
  return <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200">{children}</span>;
}

function ResumeTable({ resumes, onOpen, onInvite, onToggleFav, selectedIds, onToggleSelected, onToggleAllVisible, allVisibleSelected, someVisibleSelected }) {
  return (
    <Surface className="overflow-hidden">
      <div className="flex flex-col gap-3 border-b border-slate-100 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Table-first</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">Плотное сравнение кандидатов без лишнего шума</div>
        </div>
        <div className="text-xs text-slate-500">Сильные действия рядом: `избранное`, `открыть`, `пригласить`</div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[1180px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50/90">
              {['№','Фото','Город','Регион','Должность','СВО','ОВЗ','Тесты','Сферы','ЗП','Опыт','Дата','Изб.','Действия'].map((head, index) => (
                <th
                  key={head}
                  className={`whitespace-nowrap px-3 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-slate-500 ${index === 1 ? 'w-16' : ''}`}
                >
                  {index === 0 ? (
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={allVisibleSelected}
                        ref={node => {
                          if (node) node.indeterminate = someVisibleSelected && !allVisibleSelected;
                        }}
                        onChange={onToggleAllVisible}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span>{head}</span>
                    </label>
                  ) : head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {resumes.map(resume => (
              <tr
                key={resume.id}
                className={`group cursor-pointer align-top transition hover:bg-slate-50/80 ${selectedIds.includes(resume.id) ? 'bg-blue-50/50' : ''} ${resume.flags?.svo || resume.flags?.disability ? 'bg-teal-50/20' : ''}`}
                onClick={() => onOpen(resume)}
              >
                <td className="whitespace-nowrap px-3 py-3 text-xs font-mono text-slate-400">
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(resume.id)}
                      onClick={event => event.stopPropagation()}
                      onChange={event => {
                        event.stopPropagation();
                        onToggleSelected(resume.id);
                      }}
                      className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span>{resume.id}</span>
                  </label>
                </td>
                <td className="px-3 py-3"><Avatar src={resume.photo} name={resume.fullName} size="sm" /></td>
                <td className="px-3 py-3">
                  <div className="font-medium text-slate-800">{resume.city}</div>
                  <div className="mt-1 text-xs text-slate-400">{resume.workMode || 'Режим не указан'}</div>
                </td>
                <td className="px-3 py-3 text-slate-600">
                  <div className="max-w-[160px]">
                    <div className="truncate font-medium">{resume.region}</div>
                    <div className="truncate text-xs text-slate-400">{resume.searchArea}</div>
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="max-w-[220px]">
                    <div className="truncate font-semibold text-slate-800">{resume.position}</div>
                    <div className="mt-1 text-xs text-slate-400">{resume.education}</div>
                    {resume.about ? <div className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">{resume.about}</div> : null}
                  </div>
                </td>
                <td className="px-3 py-3">
                  {resume.flags?.svo ? <StatusFlag label="СВО" active /> : <span className="text-slate-300">—</span>}
                </td>
                <td className="px-3 py-3">
                  {resume.flags?.disability ? <StatusFlag label="ОВЗ" active /> : <span className="text-slate-300">—</span>}
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(resume.tests || []).length > 0 ? resume.tests.map(test => <Badge key={test} color="blue" size="xs">{test}</Badge>) : <span className="text-slate-300">—</span>}
                  </div>
                </td>
                <td className="px-3 py-3">
                  <div className="flex flex-wrap gap-1">
                    {(resume.activityAreas || []).length > 0 ? (resume.activityAreas || []).map(area => <Badge key={area} color="slate" size="xs">{area}</Badge>) : <span className="text-slate-300">—</span>}
                  </div>
                </td>
                <td className="whitespace-nowrap px-3 py-3 font-semibold text-slate-800">{fmtSalary(resume.salary)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-slate-600">{fmtExp(resume.experience)}</td>
                <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-500">{fmtDate(resume.publishedAt)}</td>
                <td className="px-3 py-3">
                  <StarBtn active={resume.isFavorite} onToggle={() => onToggleFav(resume.id)} />
                </td>
                <td className="px-3 py-3">
                  <div className="flex items-center gap-2 opacity-70 transition group-hover:opacity-100">
                    <Btn size="xs" variant="secondary" onClick={event => { event.stopPropagation(); onOpen(resume); }}>Открыть</Btn>
                    <Btn size="xs" variant="cyan" onClick={event => { event.stopPropagation(); onInvite(resume); }}>Пригласить</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Surface>
  );
}

function ResumeCards({ resumes, onOpen, onInvite, onToggleFav, selectedIds, onToggleSelected }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {resumes.map(resume => (
        <Surface
          key={resume.id}
          className={`group cursor-pointer p-4 transition-colors hover:border-slate-300 ${selectedIds.includes(resume.id) ? 'ring-2 ring-blue-200' : ''}`}
          onClick={() => onOpen(resume)}
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <label className="mt-1 inline-flex items-center">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(resume.id)}
                  onClick={event => event.stopPropagation()}
                  onChange={event => {
                    event.stopPropagation();
                    onToggleSelected(resume.id);
                  }}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
              </label>
              <Avatar src={resume.photo} name={resume.fullName} size="md" />
              <div>
                <div className="text-xs font-mono text-slate-400">{resume.id}</div>
                <h3 className="mt-1 text-sm font-semibold leading-snug text-slate-900 line-clamp-2">{resume.position}</h3>
                <div className="mt-1 text-xs text-slate-500">{resume.city} · {resume.region}</div>
                <div className="mt-1 text-xs text-slate-400">{resume.education}</div>
              </div>
            </div>
            <StarBtn active={resume.isFavorite} onToggle={() => onToggleFav(resume.id)} />
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {resume.flags?.svo && <Badge color="turquoise" size="xs">СВО</Badge>}
            {resume.flags?.disability && <Badge color="turquoise" size="xs">ОВЗ</Badge>}
            {(resume.tests || []).map(test => <Badge key={test} color="blue" size="xs">{test}</Badge>)}
            {(resume.activityAreas || []).map(area => <Badge key={area} color="slate" size="xs">{area}</Badge>)}
          </div>

          {resume.about && <div className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-500">{resume.about}</div>}

          <div className="mt-4 grid gap-2 border-t border-slate-100 pt-3 text-sm sm:grid-cols-2">
            <div>
              <div className="text-xs text-slate-400">Зарплата</div>
              <div className="font-semibold text-slate-800">{fmtSalary(resume.salary)}</div>
            </div>
            <div>
              <div className="text-xs text-slate-400">Опыт</div>
              <div className="font-semibold text-slate-800">{fmtExp(resume.experience)}</div>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
            <span>{fmtDate(resume.publishedAt)}</span>
            <span>{resume.workMode || 'Формат не указан'}</span>
          </div>

          <div className="mt-4 flex flex-col gap-2 opacity-90 transition group-hover:opacity-100 sm:flex-row">
            <Btn size="xs" variant="secondary" className="flex-1" onClick={event => { event.stopPropagation(); onOpen(resume); }}>Открыть</Btn>
            <Btn size="xs" variant="cyan" className="flex-1" onClick={event => { event.stopPropagation(); onInvite(resume); }}>Пригласить</Btn>
          </div>
        </Surface>
      ))}
    </div>
  );
}

Object.assign(window, { ResumeRegistry, ResumeTable, ResumeCards, RegistryPill, RegistryTag });
