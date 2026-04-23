// Root app for ПРОкадры

var { useState, useEffect, useMemo } = React;

const DEMO_DEFAULTS = window.MockData.DEMO_DEFAULTS || {};
const DEFAULT_PAGE_BY_ROLE = {
  employer: DEMO_DEFAULTS.defaultPageByRole?.employer || 'dashboard',
  seeker: DEMO_DEFAULTS.defaultPageByRole?.seeker || 'seeker-dashboard',
  admin: DEMO_DEFAULTS.defaultPageByRole?.admin || 'admin-dashboard',
};

function cloneResume(resume) {
  if (!resume) return null;
  return {
    ...resume,
    tests: [...(resume.tests || [])],
    activityAreas: [...(resume.activityAreas || [])],
    specialStatuses: [...(resume.specialStatuses || [])],
    workExperiences: (resume.workExperiences || []).map(item => ({ ...item })),
  };
}

function findResumeById(resumes, resumeId) {
  if (!resumeId) return null;
  return resumes.find(resume => resume.id === resumeId) || null;
}

function App() {
  const [resumes, setResumes] = useState(() => window.MockData.RESUMES.map(cloneResume));
  const [vacancies, setVacancies] = useState(() => window.MockData.VACANCIES.map(vacancy => ({ ...vacancy })));
  const [invitations, setInvitations] = useState(() => window.MockData.INVITATIONS.map(invitation => ({ ...invitation })));
  const [messages, setMessages] = useState(() => window.MockData.MESSAGES.map(message => ({ ...message })));
  const initialRole = DEMO_DEFAULTS.initialRole || 'employer';
  const featuredEmployerResume = findResumeById(window.MockData.RESUMES, DEMO_DEFAULTS.featuredEmployerResumeId) || window.MockData.RESUMES[0];
  const featuredSeekerResume = findResumeById(window.MockData.RESUMES, DEMO_DEFAULTS.featuredSeekerResumeId) || featuredEmployerResume;
  const [role, setRole] = useState(initialRole);
  const [page, setPage] = useState(DEFAULT_PAGE_BY_ROLE[initialRole] || DEFAULT_PAGE_BY_ROLE.employer);
  const [selectedResume, setSelectedResume] = useState(() => cloneResume(featuredEmployerResume));
  const [inviteResume, setInviteResume] = useState(null);
  const [seekerResume, setSeekerResume] = useState(() => cloneResume(featuredSeekerResume));

  useEffect(() => {
    setPage(DEFAULT_PAGE_BY_ROLE[role]);
    setInviteResume(null);
  }, [role]);

  useEffect(() => {
    if (!selectedResume) return;
    const refreshed = resumes.find(resume => resume.id === selectedResume.id);
    if (refreshed) {
      setSelectedResume(cloneResume(refreshed));
    }
  }, [resumes, selectedResume?.id]);

  const seekerMessages = useMemo(() => (
    messages.filter(message => (
      message.toName === seekerResume.fullName || message.fromName === seekerResume.fullName
    ))
  ), [messages, seekerResume.fullName]);

  const seekerInvitations = useMemo(() => (
    invitations.filter(invitation => invitation.candidateName === seekerResume.fullName)
  ), [invitations, seekerResume.fullName]);

  const handleOpenResume = resume => {
    setSelectedResume(cloneResume(resume));
    setPage('resume-detail');
  };

  const handleInvite = resume => {
    setInviteResume(cloneResume(resume));
  };

  const handleInviteSend = ({ resume, vacancy, message }) => {
    if (!resume || !vacancy) return;
    const nextInvitation = {
      id: `INV-${String(invitations.length + 1).padStart(3, '0')}`,
      resumeId: resume.id,
      vacancyId: vacancy.id,
      candidateName: resume.fullName,
      vacancyTitle: vacancy.title,
      employerName: vacancy.employerName,
      message: message || 'Приглашение отправлено через кабинет работодателя.',
      status: 'sent',
      createdAt: new Date().toISOString().split('T')[0],
    };
    setInvitations(prev => [nextInvitation, ...prev]);
    setMessages(prev => [{
      id: `MSG-${String(prev.length + 1).padStart(3, '0')}`,
      fromRole: 'employer',
      fromName: vacancy.employerName,
      toName: resume.fullName,
      text: message || `Приглашаем вас на вакансию "${vacancy.title}".`,
      createdAt: new Date().toISOString().split('T')[0],
      isRead: false,
    }, ...prev]);
  };

  const handleSaveSeekerResume = nextResume => {
    const cloned = cloneResume(nextResume);
    setSeekerResume(cloned);
    setResumes(prev => prev.map(resume => (resume.id === cloned.id ? cloned : resume)));
    if (selectedResume?.id === cloned.id) {
      setSelectedResume(cloned);
    }
  };

  const renderEmployerPage = () => {
    switch (page) {
      case 'dashboard':
        return <EmployerDashboard resumes={resumes} vacancies={vacancies} invitations={invitations} messages={messages} />;
      case 'registry':
        return <ResumeRegistry resumes={resumes} setResumes={setResumes} vacancies={vacancies} onOpenResume={handleOpenResume} onInvite={handleInvite} />;
      case 'resume-detail':
        return <ResumeDetail resume={selectedResume} vacancies={vacancies} onBack={() => setPage('registry')} onInviteSend={handleInviteSend} />;
      case 'vacancies':
        return <EmployerVacancies vacancies={vacancies} setVacancies={setVacancies} />;
      case 'favorites':
        return <EmployerFavorites resumes={resumes} setResumes={setResumes} onOpenResume={handleOpenResume} vacancies={vacancies} onInviteSend={handleInviteSend} />;
      case 'messages':
        return <EmployerMessages messages={messages} />;
      case 'invitations':
        return <EmployerInvitations invitations={invitations} />;
      case 'ux-lab':
        return <EmployerUXLab resumes={resumes} vacancies={vacancies} invitations={invitations} messages={messages} />;
      case 'company':
        return <CompanyProfile />;
      default:
        return <EmployerDashboard resumes={resumes} vacancies={vacancies} invitations={invitations} messages={messages} />;
    }
  };

  const renderSeekerPage = () => {
    switch (page) {
      case 'seeker-dashboard':
        return <SeekerDashboard resume={seekerResume} invitations={seekerInvitations} messages={seekerMessages} />;
      case 'my-resume':
        return <SeekerResumeEditor resume={seekerResume} onSave={handleSaveSeekerResume} />;
      case 'seeker-messages':
        return <SeekerMessages messages={seekerMessages} />;
      case 'seeker-invitations':
        return <SeekerInvitations invitations={seekerInvitations} />;
      case 'seeker-settings':
        return <SeekerSettings />;
      default:
        return <SeekerDashboard resume={seekerResume} invitations={seekerInvitations} messages={seekerMessages} />;
    }
  };

  const renderAdminPage = () => {
    switch (page) {
      case 'admin-dashboard':
        return <AdminDashboard stats={window.MockData.ADMIN_STATS} resumes={resumes} employers={window.MockData.EMPLOYERS} vacancies={vacancies} users={window.MockData.USERS} />;
      case 'admin-resumes':
        return <AdminResumes resumes={resumes} />;
      case 'admin-employers':
        return <AdminEmployers employers={window.MockData.EMPLOYERS} />;
      case 'admin-vacancies':
        return <AdminVacancies vacancies={vacancies} />;
      case 'admin-users':
        return <AdminUsers users={window.MockData.USERS} />;
      case 'admin-dicts':
        return <AdminDictionaries />;
      case 'admin-logs':
        return <AdminLogs logs={window.MockData.AUDIT_LOGS} />;
      default:
        return <AdminDashboard stats={window.MockData.ADMIN_STATS} resumes={resumes} employers={window.MockData.EMPLOYERS} vacancies={vacancies} users={window.MockData.USERS} />;
    }
  };

  const currentPage = role === 'employer' ? renderEmployerPage() : role === 'seeker' ? renderSeekerPage() : renderAdminPage();

  return (
    <AppShell role={role} setRole={setRole} page={page} setPage={setPage}>
      {inviteResume && (
        <InviteModal
          open={Boolean(inviteResume)}
          onClose={() => setInviteResume(null)}
          resume={inviteResume}
          vacancies={vacancies}
          onSend={handleInviteSend}
        />
      )}
      {currentPage}
    </AppShell>
  );
}

Object.assign(window, { App });
