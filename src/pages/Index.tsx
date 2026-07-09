import { useState } from 'react';
import Sidebar, { type Section } from '@/components/crm/Sidebar';
import Dashboard from '@/components/crm/Dashboard';
import Inbox from '@/components/crm/Inbox';
import Tasks from '@/components/crm/Tasks';
import Students from '@/components/crm/Students';
import Funnel from '@/components/crm/Funnel';
import Courses from '@/components/crm/Courses';
import Schedule from '@/components/crm/Schedule';
import Finance from '@/components/crm/Finance';

const Index = () => {
  const [section, setSection] = useState<Section>('dashboard');

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      <Sidebar active={section} onChange={setSection} />
      <main className="flex-1 min-w-0 p-6 md:p-8 grid-bg">
        {section === 'dashboard' && <Dashboard />}
        {section === 'inbox' && <Inbox />}
        {section === 'tasks' && <Tasks />}
        {section === 'students' && <Students />}
        {section === 'funnel' && <Funnel />}
        {section === 'courses' && <Courses />}
        {section === 'schedule' && <Schedule />}
        {section === 'finance' && <Finance />}
      </main>
    </div>
  );
};

export default Index;