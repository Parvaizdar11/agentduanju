import { useState } from 'react';
import { Home } from './components/Home';
import { CreationWorkspace } from './components/CreationWorkspace';

export default function App() {
  const [currentPage, setCurrentPage] = useState<'home' | 'workspace'>('home');
  const [projectData, setProjectData] = useState<any>(null);

  const handleStartCreation = (data?: any) => {
    setProjectData(data);
    setCurrentPage('workspace');
  };

  const handleBackToHome = () => {
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-black">
      {currentPage === 'home' ? (
        <Home onStartCreation={handleStartCreation} />
      ) : (
        <CreationWorkspace onBack={handleBackToHome} projectData={projectData} />
      )}
    </div>
  );
}
