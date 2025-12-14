import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import MobileNavbar from './components/MobileNavbar';
import Dashboard from './components/Dashboard';
import KnowledgeBase from './components/KnowledgeBase';
import Requirements from './components/Requirements';
import Projects from './components/Projects';
import UserManagement from './components/UserManagement';
import { Module, Doc, Requirement, ProjectTask, User } from './types';
import { INITIAL_DOCS, INITIAL_REQUIREMENTS, INITIAL_TASKS, INITIAL_USERS } from './constants';

const App: React.FC = () => {
  const [currentModule, setCurrentModule] = useState<Module>(Module.DASHBOARD);
  
  // App State - In a real app, this would be Redux or Context + API
  const [docs, setDocs] = useState<Doc[]>(INITIAL_DOCS);
  const [requirements, setRequirements] = useState<Requirement[]>(INITIAL_REQUIREMENTS);
  const [tasks, setTasks] = useState<ProjectTask[]>(INITIAL_TASKS);
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);

  const renderContent = () => {
    switch (currentModule) {
      case Module.DASHBOARD:
        return <Dashboard requirements={requirements} />;
      case Module.KNOWLEDGE:
        return <KnowledgeBase docs={docs} setDocs={setDocs} />;
      case Module.REQUIREMENTS:
        return <Requirements requirements={requirements} setRequirements={setRequirements} />;
      case Module.PROJECTS:
        return <Projects tasks={tasks} setTasks={setTasks} />;
      case Module.USERS:
        return <UserManagement users={users} setUsers={setUsers} />;
      case Module.SETTINGS:
        return (
            <div className="p-10 flex flex-col items-center justify-center h-full text-slate-400">
                <i className="fas fa-cogs text-6xl mb-6"></i>
                <h2 className="text-2xl font-bold text-slate-600">系统设置</h2>
                <p>配置面板占位符。</p>
            </div>
        );
      default:
        return <Dashboard requirements={requirements} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar currentModule={currentModule} setModule={setCurrentModule} />
      
      {/* Mobile Top Bar (Optional, if needed for branding, currently using module headers) */}
      
      <main className="flex-1 md:ml-64 h-[calc(100vh-64px)] md:h-screen overflow-hidden pb-safe">
        {renderContent()}
      </main>

      <MobileNavbar currentModule={currentModule} setModule={setCurrentModule} />
      
      {/* Mobile Safe Area Shim for iPhone X+ */}
      <style>{`
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
            .pb-safe {
                padding-bottom: env(safe-area-inset-bottom);
            }
        }
      `}</style>
    </div>
  );
};

export default App;
