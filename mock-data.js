
// ПРОкадры — Mock Data
const _firstNames = ['Александр','Михаил','Сергей','Дмитрий','Андрей','Иван','Алексей','Николай','Артём','Владимир','Анна','Мария','Елена','Наталья','Ольга','Татьяна','Екатерина','Ирина','Светлана','Юлия','Евгений','Павел','Роман','Максим','Кирилл','Виктор','Денис','Антон','Станислав','Владислав','Ксения','Дарья','Валерия','Алина','Полина'];
const _lastNames = ['Иванов','Смирнов','Кузнецов','Попов','Васильев','Петров','Соколов','Михайлов','Новиков','Федоров','Морозов','Волков','Алексеев','Лебедев','Семёнов','Егоров','Павлов','Козлов','Степанов','Николаев','Орлова','Зайцева','Борисова','Королёва','Соловьёва','Кириллова','Тихонова','Макарова','Беляева','Захарова'];
const _positions = ['Специалист по закупкам','Контрактный управляющий','Менеджер по закупкам','Руководитель отдела закупок','Тендерный специалист','Экономист','Юрист по контрактной системе','Аналитик закупок','Специалист по контрактной системе','Главный специалист по закупкам','Ведущий специалист по закупкам','Эксперт в сфере закупок','Специалист ЕИС','Бухгалтер-экономист'];
const _companies = ['ООО «ТехноСервис»','АО «ГородСтрой»','ФГУП «РосТех»','МУП «Городской транспорт»','ГБУ «Медцентр»','ООО «ПромСнаб»','АО «Энергосбыт»','ООО «СтройКомплекс»','ФГБУ «НИИ Управления»','ГКУ «Дирекция заказчика»','ООО «ЛогистикПро»','АО «ЦифраТех»','МКУ «Горзеленхоз»','ООО «АвтоТрансСервис»'];
const _activityAreas = ['44-ФЗ','223-ФЗ','Коммерческие закупки'];
const _workModes = ['В офисе','Удалённо','Гибрид'];
const _educations = ['Высшее','Среднее специальное','Среднее'];
const _specialStatuses = ['Участник СВО','Член семьи участника СВО','Лицо с инвалидностью'];
const _tests = ['44-ФЗ','223-ФЗ'];
const REGION_LOCATIONS = {
  'Москва': ['Москва','Химки','Мытищи','Красногорск'],
  'Санкт-Петербург': ['Санкт-Петербург','Пушкин','Колпино'],
  'Свердловская область': ['Екатеринбург','Нижний Тагил','Каменск-Уральский'],
  'Новосибирская область': ['Новосибирск','Бердск','Искитим'],
  'Республика Татарстан': ['Казань','Набережные Челны','Нижнекамск','Альметьевск'],
  'Нижегородская область': ['Нижний Новгород','Дзержинск','Арзамас'],
  'Самарская область': ['Самара','Тольятти','Сызрань'],
  'Республика Башкортостан': ['Уфа','Стерлитамак','Салават'],
  'Краснодарский край': ['Краснодар','Сочи','Новороссийск'],
  'Ростовская область': ['Ростов-на-Дону','Таганрог','Шахты'],
  'Пермский край': ['Пермь','Березники','Соликамск'],
  'Воронежская область': ['Воронеж','Лиски','Борисоглебск'],
  'Челябинская область': ['Челябинск','Магнитогорск','Златоуст'],
  'Красноярский край': ['Красноярск','Норильск','Ачинск'],
  'Саратовская область': ['Саратов','Энгельс','Балаково'],
  'Тюменская область': ['Тюмень','Тобольск','Ишим'],
  'Омская область': ['Омск','Тара','Исилькуль'],
  'Удмуртская Республика': ['Ижевск','Воткинск','Глазов'],
  'Алтайский край': ['Барнаул','Бийск','Новоалтайск'],
  'Томская область': ['Томск','Северск','Стрежевой'],
};
const _regions = Object.keys(REGION_LOCATIONS);
const REGION_OPTIONS = _regions.map(region => ({
  value: region,
  label: region,
  hint: REGION_LOCATIONS[region].join(', '),
}));
const _cities = _regions.flatMap(region => REGION_LOCATIONS[region]);
const _workModesReadable = ['В офисе','Удалённо','Гибрид'];
const _gender = { male: 'male', female: 'female' };

function rnd(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function rndInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }
function pick(arr, n) { return [...arr].sort(() => 0.5 - Math.random()).slice(0, n); }
function rndDate(daysAgo) {
  const d = new Date(); d.setDate(d.getDate() - rndInt(0, daysAgo));
  return d.toISOString().split('T')[0];
}

const seed = 42; // deterministic feel
Math.seedrandom = function(){};

const RESUMES = Array.from({length: 75}, (_, i) => {
  const isFemale = Math.sin(i * 7.3) > 0;
  const femaleFirst = ['Анна','Мария','Елена','Наталья','Ольга','Татьяна','Екатерина','Ирина','Светлана','Юлия','Ксения','Дарья','Валерия','Алина','Полина'];
  const maleFirst = ['Александр','Михаил','Сергей','Дмитрий','Андрей','Иван','Алексей','Николай','Артём','Владимир','Евгений','Павел','Роман','Максим','Кирилл'];
  const firstName = isFemale ? femaleFirst[i % femaleFirst.length] : maleFirst[i % maleFirst.length];
  const lastName = _lastNames[i % _lastNames.length] + (isFemale ? 'а' : '');
  const patronymic = isFemale ? ['Александровна','Сергеевна','Ивановна','Николаевна','Петровна'][i%5] : ['Александрович','Сергеевич','Иванович','Николаевич','Петрович'][i%5];
  const region = _regions[i % _regions.length];
  const cityPool = REGION_LOCATIONS[region];
  const city = cityPool[i % cityPool.length];
  const hasPhoto = Math.cos(i * 3.1) > -0.3;
  const hasSVO = Math.sin(i * 11.7) > 0.15;
  const hasDisability = Math.cos(i * 9.1) > 0.55;
  const specialIdx = i % _specialStatuses.length;
  const testsCount = Math.floor(Math.abs(Math.sin(i * 5.3)) * 3);
  const areaCount = 1 + Math.floor(Math.abs(Math.cos(i * 2.1)) * 2);
  const exp = rndInt(0, 20);
  const salary = [0, 60000, 70000, 80000, 90000, 100000, 120000, 150000, 180000, 200000][i % 10];
  const age = rndInt(22, 58);
  const workExps = Array.from({length: rndInt(1,4)}, (_, j) => ({
    id: j,
    company: _companies[(i + j) % _companies.length],
    role: _positions[(i + j + 1) % _positions.length],
    from: `${2018 - j*3}-01`,
    to: j === 0 ? 'настоящее время' : `${2021 - j*3}-06`,
    description: 'Проведение конкурентных закупок, подготовка контрактной документации, работа в ЕИС, сопровождение контрактов на всех этапах исполнения.'
  }));
  return {
    id: `CV-${String(i+1).padStart(4,'0')}`,
    firstName, lastName, patronymic,
    fullName: `${lastName} ${firstName} ${patronymic}`,
    gender: isFemale ? 'female' : 'male',
    age,
    city,
    locality: city,
    region,
    searchArea: `${city}, ${region}`,
    position: _positions[i % _positions.length],
    salary: salary || null,
    experience: exp,
    education: _educations[i % _educations.length],
    workMode: _workModes[i % _workModes.length],
    activityAreas: pick(_activityAreas, areaCount),
    tests: pick(_tests, testsCount),
    specialStatuses: [
      ...(hasSVO ? [_specialStatuses[0], _specialStatuses[1]] : []),
      ...(hasDisability ? [_specialStatuses[2]] : []),
    ].filter((value, index, self) => self.indexOf(value) === index),
    flags: {
      svo: hasSVO,
      disability: hasDisability,
    },
    hasPhoto,
    photo: hasPhoto ? `https://i.pravatar.cc/120?img=${(i % 70) + 1}` : null,
    publishedAt: rndDate(90),
    about: 'Опытный специалист в сфере государственных и корпоративных закупок. Отлично разбираюсь в законодательстве 44-ФЗ и 223-ФЗ. Умею работать с большими объёмами документации, опыт работы в ЕИС. Ответственный, внимательный к деталям.',
    workExperiences: workExps,
    isFavorite: Math.sin(i * 19.3) > 0.5,
    status: ['active','active','active','pending','draft'][i % 5],
  };
});

const EMPLOYERS = Array.from({length: 15}, (_, i) => ({
  id: `EMP-${String(i+1).padStart(3,'0')}`,
  name: _companies[i % _companies.length],
  inn: `${7700000000 + i * 123456}`,
  region: _regions[i % _regions.length],
  city: _cities[i % _cities.length],
  contactName: `${_firstNames[(i*3)%_firstNames.length]} ${_lastNames[(i*2)%_lastNames.length]}`,
  email: `hr${i+1}@company${i+1}.ru`,
  phone: `+7 (${900+i}) ${300+i*7}-${10+i*3}-${20+i}`,
  status: i < 12 ? 'approved' : 'pending',
  registeredAt: rndDate(180),
  vacancyCount: rndInt(1,8),
}));

const VACANCIES = Array.from({length: 30}, (_, i) => ({
  id: `VAC-${String(i+1).padStart(3,'0')}`,
  employerId: EMPLOYERS[i % EMPLOYERS.length].id,
  employerName: EMPLOYERS[i % EMPLOYERS.length].name,
  title: _positions[i % _positions.length],
  department: ['Отдел закупок','Финансовый отдел','Юридический отдел','Отдел снабжения'][i%4],
  city: _cities[i % _cities.length],
  region: _regions[i % _regions.length],
  workMode: _workModesReadable[i % _workModesReadable.length],
  salaryFrom: [60000,70000,80000,90000,100000][i%5],
  salaryTo: [90000,100000,120000,150000,180000][i%5],
  description: 'Ищем опытного специалиста по закупкам для работы в нашей организации. Требуется знание 44-ФЗ, опыт работы в ЕИС, умение работать с тендерной документацией.',
  skills: pick(['44-ФЗ','223-ФЗ','ЕИС','Тендер','Excel','1С','Контракты','ГИС'],3),
  status: ['active','active','active','archived','draft'][i%5],
  createdAt: rndDate(60),
}));

const INVITATIONS = Array.from({length: 20}, (_, i) => ({
  id: `INV-${String(i+1).padStart(3,'0')}`,
  resumeId: RESUMES[i % RESUMES.length].id,
  vacancyId: VACANCIES[i % VACANCIES.length].id,
  candidateName: RESUMES[i % RESUMES.length].fullName,
  vacancyTitle: VACANCIES[i % VACANCIES.length].title,
  employerName: VACANCIES[i % VACANCIES.length].employerName,
  message: 'Добрый день! Мы рассмотрели ваше резюме и хотели бы пригласить вас на собеседование по вакансии.',
  status: ['sent','viewed','accepted','rejected','sent'][i%5],
  createdAt: rndDate(30),
})).filter(Boolean);

const MESSAGES = Array.from({length: 15}, (_, i) => ({
  id: `MSG-${String(i+1).padStart(3,'0')}`,
  fromRole: i % 2 === 0 ? 'employer' : 'candidate',
  fromName: i % 2 === 0 ? EMPLOYERS[i%EMPLOYERS.length].name : RESUMES[i%RESUMES.length].fullName,
  toName: i % 2 === 0 ? RESUMES[i%RESUMES.length].fullName : EMPLOYERS[i%EMPLOYERS.length].name,
  text: i % 2 === 0 ? 'Добрый день! Мы заинтересованы в вашей кандидатуре. Можем ли мы договориться о звонке?' : 'Здравствуйте! Да, я готов обсудить детали. Удобное время — любой будний день с 10 до 18.',
  createdAt: rndDate(14),
  isRead: i % 3 !== 0,
}));

const SAVED_SEARCHES = [
  {
    id: 'saved-1',
    name: 'Юристы с тестами',
    filters: {
      position: ['Юрист по контрактной системе', 'Контрактный управляющий'],
      tests: ['44-ФЗ', '223-ФЗ'],
      activityAreas: ['44-ФЗ'],
      onlyPhoto: true,
    },
  },
  {
    id: 'saved-2',
    name: 'Закупки в Татарстане',
    filters: {
      region: 'Республика Татарстан',
      workMode: 'В офисе',
      expMin: '3',
    },
  },
  {
    id: 'saved-3',
    name: 'Избранные кандидаты',
    filters: {
      onlyFavorites: true,
    },
  },
];

const USERS = [
  ...EMPLOYERS.map((employer, index) => ({
    id: `USR-EMP-${String(index + 1).padStart(3, '0')}`,
    fullName: employer.contactName,
    email: employer.email,
    role: 'employer',
    status: employer.status,
    organization: employer.name,
    createdAt: employer.registeredAt,
  })),
  ...RESUMES.slice(0, 20).map((resume, index) => ({
    id: `USR-CV-${String(index + 1).padStart(3, '0')}`,
    fullName: resume.fullName,
    email: `candidate${index + 1}@mail.ru`,
    role: 'seeker',
    status: resume.status,
    organization: resume.city,
    createdAt: resume.publishedAt,
  })),
];

const ADMIN_STATS = {
  totalResumes: RESUMES.length,
  activeResumes: RESUMES.filter(r => r.status === 'active').length,
  pendingResumes: RESUMES.filter(r => r.status === 'pending').length,
  totalEmployers: EMPLOYERS.length,
  approvedEmployers: EMPLOYERS.filter(e => e.status === 'approved').length,
  totalVacancies: VACANCIES.length,
  activeVacancies: VACANCIES.filter(v => v.status === 'active').length,
  totalInvitations: INVITATIONS.length,
};

const DICTIONARIES = {
  positions: _positions,
  regions: _regions,
  regionOptions: REGION_OPTIONS,
  educations: _educations,
  workModes: _workModes,
  activityAreas: _activityAreas,
  tests: _tests,
  specialStatuses: _specialStatuses,
};

const AUDIT_LOGS = Array.from({length: 25}, (_, i) => ({
  id: i+1,
  action: ['Резюме добавлено','Резюме одобрено','Работодатель зарегистрирован','Вакансия создана','Приглашение отправлено','Резюме отклонено','Сообщение отправлено'][i%7],
  user: i % 2 === 0 ? EMPLOYERS[i%EMPLOYERS.length].contactName : 'Администратор',
  role: i % 2 === 0 ? 'Работодатель' : 'Администратор',
  timestamp: new Date(Date.now() - i * 3600000).toISOString(),
  details: `ID объекта: ${['CV','EMP','VAC'][i%3]}-${String(rndInt(1,50)).padStart(3,'0')}`,
}));

window.MockData = {
  RESUMES,
  EMPLOYERS,
  VACANCIES,
  INVITATIONS,
  MESSAGES,
  USERS,
  SAVED_SEARCHES,
  ADMIN_STATS,
  DICTIONARIES,
  REGION_LOCATIONS,
  REGION_OPTIONS,
  AUDIT_LOGS,
};
