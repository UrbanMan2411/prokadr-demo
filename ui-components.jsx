
// Shared UI primitives for ПРОкадры

var { useState, useRef, useEffect, useMemo } = React;

function normalizeText(value = '') {
  return String(value)
    .toLowerCase()
    .replace(/ё/g, 'е')
    .replace(/[^a-zа-я0-9]+/gi, ' ')
    .trim();
}

function fuzzyIncludes(haystack, query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;

  const normalizedHaystack = normalizeText(haystack);
  const haystackWords = normalizedHaystack.split(' ').filter(Boolean);
  return normalizedQuery.split(' ').every(token => (
    normalizedHaystack.includes(token) ||
    haystackWords.some(word => word.startsWith(token))
  ));
}

// ── Badge ──────────────────────────────────────────────────────────────────
function Badge({ children, color = 'blue', size = 'sm' }) {
  const colors = {
    blue:    'bg-blue-50 text-blue-700 ring-blue-200',
    cyan:    'bg-cyan-50 text-cyan-700 ring-cyan-200',
    turquoise:'bg-teal-50 text-teal-700 ring-teal-200',
    green:   'bg-emerald-50 text-emerald-700 ring-emerald-200',
    amber:   'bg-amber-50 text-amber-700 ring-amber-200',
    red:     'bg-red-50 text-red-700 ring-red-200',
    slate:   'bg-slate-100 text-slate-700 ring-slate-200',
    purple:  'bg-violet-50 text-violet-700 ring-violet-200',
    orange:  'bg-orange-50 text-orange-700 ring-orange-200',
  };
  const sizes = { xs: 'px-2 py-0.5 text-[10px]', sm: 'px-2.5 py-1 text-[11px]', md: 'px-3 py-1.5 text-sm' };
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-medium ring-1 ring-inset ${colors[color]||colors.slate} ${sizes[size]||sizes.sm}`}>
      {children}
    </span>
  );
}

// ── Button ─────────────────────────────────────────────────────────────────
function Btn({ children, variant='primary', size='md', onClick, disabled, className='', type='button', icon }) {
  const base = 'inline-flex min-h-11 items-center justify-center gap-1.5 rounded-xl border font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 cursor-pointer touch-manipulation disabled:cursor-not-allowed disabled:opacity-50';
  const variants = {
    primary:  'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-blue-500 shadow-sm',
    secondary:'bg-white text-slate-700 border-slate-200 hover:bg-slate-50 focus:ring-blue-500 shadow-sm',
    ghost:    'border-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 focus:ring-blue-500',
    danger:   'bg-red-600 text-white border-red-600 hover:bg-red-700 focus:ring-red-500 shadow-sm',
    cyan:     'bg-teal-600 text-white border-teal-600 hover:bg-teal-700 focus:ring-teal-500 shadow-sm',
    surface:  'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 focus:ring-blue-500',
  };
  const sizes = { xs:'px-2.5 py-1.5 text-xs', sm:'px-3.5 py-2 text-sm', md:'px-4 py-2.5 text-sm', lg:'px-5 py-3 text-base' };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`${base} ${variants[variant]||variants.primary} ${sizes[size]||sizes.md} ${className}`}>
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
}

// ── Input ──────────────────────────────────────────────────────────────────
function Input({ value, onChange, placeholder, className='', type='text', prefix, suffix }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      {prefix && <span className="absolute left-3 text-slate-400 pointer-events-none">{prefix}</span>}
      <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
        className={`w-full rounded-xl border border-slate-200 bg-white text-base text-slate-800 placeholder-slate-400 shadow-sm sm:text-sm
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition
          ${prefix ? 'pl-9' : 'pl-3'} ${suffix ? 'pr-9' : 'pr-3'} py-3 sm:py-2.5`} />
      {suffix && <span className="absolute right-3 text-slate-400 pointer-events-none">{suffix}</span>}
    </div>
  );
}

// ── Select ─────────────────────────────────────────────────────────────────
function Select({ value, onChange, options, placeholder, className='' }) {
  return (
    <select value={value} onChange={e=>onChange(e.target.value)}
      className={`w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-base text-slate-800 shadow-sm transition
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:py-2.5 sm:text-sm ${className}`}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => <option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
    </select>
  );
}

// ── Textarea ──────────────────────────────────────────────────────────────
function Textarea({ value, onChange, placeholder, rows = 4, className='', maxLength, error, helper }) {
  return (
    <div className={className}>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        maxLength={maxLength}
        className={`w-full rounded-xl border bg-white px-3 py-3 text-base text-slate-800 placeholder-slate-400 shadow-sm transition focus:outline-none focus:ring-2 resize-none sm:py-2.5 sm:text-sm ${
          error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-slate-200 focus:ring-blue-500 focus:border-blue-500'
        }`}
      />
      {(helper || error) && (
        <div className={`mt-1 text-xs ${error ? 'text-red-500' : 'text-slate-400'}`}>
          {error || helper}
        </div>
      )}
    </div>
  );
}

// ── Surface ───────────────────────────────────────────────────────────────
function Surface({ children, className='', ...props }) {
  return (
    <div
      {...props}
      className={`relative overflow-hidden rounded-[18px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94))] shadow-[0_14px_38px_rgba(15,23,42,0.06)] sm:rounded-[20px] ${className}`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-slate-200/80" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white/40 to-transparent" />
      {children}
    </div>
  );
}

// ── SectionHeader ─────────────────────────────────────────────────────────
function SectionHeader({ eyebrow, title, description, action }) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
      <div className="min-w-0">
        {eyebrow && <div className="mb-2 inline-flex items-center rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">{eyebrow}</div>}
        <h2 className="text-[18px] font-semibold tracking-[-0.02em] text-slate-900">{title}</h2>
        {description && <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-slate-500">{description}</p>}
      </div>
      {action && <div className="flex-shrink-0 sm:pt-0">{action}</div>}
    </div>
  );
}

// ── Combobox / MultiSelect ────────────────────────────────────────────────
function Combobox({
  value,
  onChange,
  options = [],
  placeholder = 'Выберите значение',
  searchPlaceholder = 'Поиск...',
  multiple = false,
  allowClear = true,
  className = '',
  emptyLabel = 'Ничего не найдено',
}) {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const onPointerDown = event => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', onPointerDown);
    return () => document.removeEventListener('mousedown', onPointerDown);
  }, []);

  useEffect(() => {
    if (!open) setSearch('');
  }, [open]);

  const normalizedOptions = useMemo(() => options.map(option => ({
    value: option.value ?? option,
    label: option.label ?? option,
    hint: option.hint ?? '',
    meta: option.meta ?? '',
    disabled: Boolean(option.disabled),
  })), [options]);

  const selectedValues = multiple ? (Array.isArray(value) ? value : []) : [value].filter(Boolean);
  const selectedLabels = selectedValues
    .map(currentValue => normalizedOptions.find(option => option.value === currentValue)?.label)
    .filter(Boolean);

  const filteredOptions = normalizedOptions.filter(option => (
    fuzzyIncludes(`${option.label} ${option.hint} ${option.meta}`, search)
  ));

  const toggleValue = nextValue => {
    if (multiple) {
      const next = selectedValues.includes(nextValue)
        ? selectedValues.filter(item => item !== nextValue)
        : [...selectedValues, nextValue];
      onChange(next);
      return;
    }

    onChange(nextValue);
    setOpen(false);
  };

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(prev => !prev)}
        className={`w-full rounded-xl border border-slate-200/90 bg-white/92 px-3 py-2.5 text-left text-sm text-slate-800 shadow-sm transition backdrop-blur hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${open ? 'ring-2 ring-blue-500 border-blue-500' : ''}`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex-1">
            {multiple ? (
              selectedLabels.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {selectedLabels.slice(0, 3).map(label => (
                    <span key={label} className="inline-flex items-center rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-blue-100">
                      {label}
                    </span>
                  ))}
                  {selectedLabels.length > 3 && (
                    <span className="text-xs text-slate-400">+{selectedLabels.length - 3}</span>
                  )}
                </div>
              ) : (
                <span className="text-slate-400">{placeholder}</span>
              )
            ) : (
              <span className={selectedLabels[0] ? '' : 'text-slate-400'}>
                {selectedLabels[0] || placeholder}
              </span>
            )}
          </div>
          <svg className={`h-4 w-4 flex-shrink-0 text-slate-400 transition ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200/90 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.96))] shadow-[0_28px_60px_rgba(15,23,42,0.14)] backdrop-blur-xl">
          <div className="border-b border-slate-100 p-2.5">
            <Input
              value={search}
              onChange={setSearch}
              placeholder={searchPlaceholder}
              prefix={<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>}
            />
          </div>
          <div className="max-h-60 overflow-auto py-1">
            {multiple && selectedLabels.length > 0 && (
              <div className="flex flex-wrap gap-1.5 border-b border-slate-100 bg-slate-50 px-3 py-2">
                {selectedLabels.map(label => (
                  <span key={label} className="inline-flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-xs font-medium text-slate-600 ring-1 ring-slate-200">
                    {label}
                  </span>
                ))}
              </div>
            )}

            {filteredOptions.length === 0 ? (
              <div className="px-3 py-5 text-sm text-slate-400">{emptyLabel}</div>
            ) : filteredOptions.map(option => {
              const active = selectedValues.includes(option.value);
              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={option.disabled}
                  onClick={() => toggleValue(option.value)}
                  className={`flex w-full items-center justify-between gap-3 px-3 py-2.5 text-left text-sm transition ${
                    active ? 'bg-blue-50/80 text-blue-700' : 'text-slate-700 hover:bg-slate-50/80'
                  } ${option.disabled ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium">{option.label}</span>
                    {option.hint && <span className="block truncate text-xs text-slate-400">{option.hint}</span>}
                  </span>
                  {multiple && (
                    <span className={`flex h-4 w-4 items-center justify-center rounded-md border text-[10px] ${active ? 'border-blue-600 bg-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                      ✓
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {multiple && allowClear && selectedValues.length > 0 && (
              <div className="flex items-center justify-between gap-2 border-t border-slate-100 bg-slate-50/80 px-3 py-2.5">
              <button
                type="button"
                onClick={() => onChange([])}
                className="text-xs font-medium text-slate-500 transition hover:text-slate-700"
              >
                Снять выбор
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-xs font-medium text-blue-600 transition hover:text-blue-700"
              >
                Готово
              </button>
            </div>
          )}

          {!multiple && allowClear && value && (
              <div className="flex items-center justify-end border-t border-slate-100 bg-slate-50/80 px-3 py-2.5">
              <button
                type="button"
                onClick={() => onChange('')}
                className="text-xs font-medium text-slate-500 transition hover:text-slate-700"
              >
                Очистить
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Modal ──────────────────────────────────────────────────────────────────
function Modal({ open, onClose, title, children, size='md' }) {
  useEffect(() => {
    const onKey = e => e.key === 'Escape' && onClose();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  const sizes = { sm:'max-w-md', md:'max-w-lg', lg:'max-w-2xl', xl:'max-w-4xl', '2xl':'max-w-6xl' };
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <div className="absolute inset-0 bg-slate-950/32 backdrop-blur-sm" onClick={onClose}/>
      <div className={`relative w-full ${sizes[size]} max-h-[92vh] overflow-y-auto rounded-t-[24px] border border-slate-200 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.14)] sm:max-h-[90vh] sm:rounded-[24px]`}>
        <div className="absolute inset-x-0 top-0 h-px bg-slate-200" />
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4 sm:px-6">
          <h2 className="text-base font-semibold tracking-[-0.01em] text-slate-900">{title}</h2>
          <button onClick={onClose} className="rounded-xl p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
        <div className="p-4 sm:p-6">{children}</div>
      </div>
    </div>
  );
}

// ── Avatar ─────────────────────────────────────────────────────────────────
function Avatar({ src, name, size = 'md' }) {
  const sizes = { sm:'w-8 h-8 text-xs', md:'w-10 h-10 text-sm', lg:'w-16 h-16 text-xl', xl:'w-24 h-24 text-3xl' };
  const initials = name ? name.split(' ').slice(0,2).map(w=>w[0]).join('') : '?';
  if (src) return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-1 ring-slate-200`}/>;
  return (
    <div className={`${sizes[size]} rounded-full bg-slate-200 flex items-center justify-center font-semibold text-slate-700 ring-1 ring-slate-200`}>
      {initials}
    </div>
  );
}

// ── StarBtn ────────────────────────────────────────────────────────────────
function StarBtn({ active, onToggle }) {
  return (
    <button onClick={e=>{e.stopPropagation();onToggle();}}
      className={`rounded-full border p-2 transition-colors duration-150 ${active ? 'border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100' : 'border-slate-200 bg-white text-slate-300 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-500'}`}>
      <svg className="w-4 h-4" fill={active?'currentColor':'none'} stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
      </svg>
    </button>
  );
}

// ── StatusBadge ────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:    { label:'Активно',   color:'green' },
    pending:   { label:'На проверке', color:'amber' },
    draft:     { label:'Черновик',  color:'slate' },
    archived:  { label:'В архиве',  color:'slate' },
    approved:  { label:'Одобрено',  color:'green' },
    rejected:  { label:'Отклонено', color:'red'   },
    sent:      { label:'Отправлено',color:'blue'  },
    viewed:    { label:'Просмотрено',color:'purple'},
    accepted:  { label:'Принято',   color:'green' },
  };
  const { label='Неизвестно', color='slate' } = map[status]||{};
  return (
    <Badge color={color}>
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {label}
    </Badge>
  );
}

// ── Chip ───────────────────────────────────────────────────────────────────
function Chip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 ring-1 ring-slate-200">
      {label}
      {onRemove && (
        <button onClick={onRemove} className="rounded-full p-0.5 transition hover:bg-slate-200 hover:text-slate-900">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
      )}
    </span>
  );
}

// ── Stat Card ──────────────────────────────────────────────────────────────
function StatCard({ label, value, icon, color='blue', sub }) {
  const colors = {
    blue: 'bg-blue-500',
    cyan: 'bg-cyan-500',
    green:'bg-emerald-500',
    amber:'bg-amber-500',
    purple:'bg-violet-500',
    slate:'bg-slate-500',
  };
  return (
    <div className="group rounded-[22px] border border-slate-200/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,250,252,0.94))] p-4 shadow-[0_10px_28px_rgba(15,23,42,0.05)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_18px_34px_rgba(15,23,42,0.08)]">
      <div className={`mb-4 h-1.5 w-14 rounded-full ${colors[color] || colors.blue}`} />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[2rem] font-semibold leading-none tracking-[-0.04em] text-slate-900">{value}</div>
          <div className="mt-1 text-sm font-medium text-slate-700">{label}</div>
          {sub && <div className="mt-1.5 text-xs leading-relaxed text-slate-500">{sub}</div>}
        </div>
        <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-white text-slate-700 ring-1 ring-slate-200">
          <span className="text-lg">{icon}</span>
        </div>
      </div>
    </div>
  );
}

// ── Empty State ────────────────────────────────────────────────────────────
function EmptyState({ icon='📄', title, description, action }) {
  return (
    <div className="relative overflow-hidden rounded-[26px] border border-dashed border-slate-200 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.98),rgba(248,250,252,0.82))] px-5 py-12 text-center shadow-[0_12px_30px_rgba(15,23,42,0.04)] sm:px-8 sm:py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -right-12 top-0 h-32 w-32 rounded-full bg-blue-100/40 blur-3xl" />
        <div className="absolute -left-10 bottom-0 h-28 w-28 rounded-full bg-cyan-100/40 blur-3xl" />
      </div>
      <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[22px] bg-white text-3xl text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.08)] ring-1 ring-slate-200">
        {icon}
      </div>
      <div className="relative mb-2 text-base font-semibold tracking-[-0.02em] text-slate-900">{title}</div>
      {description && <div className="relative mb-5 max-w-sm text-sm leading-relaxed text-slate-500">{description}</div>}
      {action && <div className="relative inline-flex">{action}</div>}
    </div>
  );
}

// ── Loading State ─────────────────────────────────────────────────────────
function LoadingState({ title = 'Загрузка данных', rows = 4, compact = false }) {
  return (
    <div className={`overflow-hidden rounded-[22px] border border-slate-200 bg-white ${compact ? 'p-4' : 'p-4 sm:p-6'} shadow-[0_12px_30px_rgba(15,23,42,0.05)]`}>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <div className="mb-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-400">
            {title}
          </div>
          <div className="h-4 w-44 rounded-full bg-slate-200 animate-pulse" />
          <div className="mt-2 h-3 w-72 max-w-full rounded-full bg-slate-100 animate-pulse" />
        </div>
        <div className="h-9 w-24 rounded-full bg-slate-100 animate-pulse" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-[linear-gradient(180deg,rgba(248,250,252,0.9),rgba(255,255,255,0.92))] p-3">
            <div className="h-10 w-10 rounded-full bg-slate-200 animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 w-3/4 rounded-full bg-slate-200 animate-pulse" />
              <div className="h-3 w-1/2 rounded-full bg-slate-100 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 text-xs font-medium text-slate-400">{title}</div>
    </div>
  );
}

// ── Error State ───────────────────────────────────────────────────────────
function ErrorState({ title = 'Не удалось загрузить данные', description = 'Попробуйте обновить страницу или повторить позже.', action }) {
  return (
    <div className="rounded-[22px] border border-red-200 bg-[linear-gradient(180deg,rgba(255,248,248,0.98),rgba(254,242,242,0.88))] p-6 text-center shadow-[0_12px_30px_rgba(127,29,29,0.06)]">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-[18px] bg-white text-red-500 ring-1 ring-red-200 shadow-sm">
        !
      </div>
      <div className="text-sm font-semibold text-red-900">{title}</div>
      <div className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-red-700/80">{description}</div>
      {action && <div className="mt-4 inline-flex">{action}</div>}
    </div>
  );
}

// ── Format salary ──────────────────────────────────────────────────────────
function fmtSalary(n) {
  if (!n) return 'Не указана';
  return n.toLocaleString('ru-RU') + ' ₽';
}

// ── Format date ────────────────────────────────────────────────────────────
function fmtDate(str) {
  if (!str) return '—';
  const d = new Date(str);
  return d.toLocaleDateString('ru-RU', { day:'2-digit', month:'2-digit', year:'numeric' });
}

// ── Experience label ───────────────────────────────────────────────────────
function fmtExp(years) {
  if (years === 0) return 'Без опыта';
  if (years === 1) return '1 год';
  if (years < 5) return `${years} года`;
  return `${years} лет`;
}

Object.assign(window, { Badge, Btn, Input, Select, Modal, Avatar, StarBtn, StatusBadge, Chip, StatCard, EmptyState, LoadingState, ErrorState, fmtSalary, fmtDate, fmtExp });
Object.assign(window, { Surface, SectionHeader, Textarea, Combobox, fuzzyIncludes, normalizeText });
