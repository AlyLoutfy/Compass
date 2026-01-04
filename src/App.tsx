import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { AppLayout } from './components/layout/AppLayout';
import { IdeasBoard } from './pages/IdeasBoard';
import { TicketsBoard } from './pages/TicketsBoard';
import { QAPage } from './pages/QAPage';
import { ReleaseLog } from './pages/ReleaseLog';
import { UsersPage } from './pages/UsersPage';
import { RequirementsPage } from './pages/RequirementsPage';
import { DesignDecisionsPage } from './pages/DesignDecisionsPage';
import { OrganizationsPage } from './pages/OrganizationsPage';
import { TeamBoard } from './pages/TeamBoard';

function App() {
  return (
    <DataProvider>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AppLayout>
          <Routes>
            <Route path="/" element={<TeamBoard />} />
            <Route path="/ideas" element={<IdeasBoard />} />
            <Route path="/tickets" element={<TicketsBoard />} />
            <Route path="/requirements" element={<RequirementsPage />} />
            <Route path="/qa" element={<QAPage />} />
            <Route path="/releases" element={<ReleaseLog />} />
            <Route path="/users" element={<UsersPage />} />
            <Route path="/design" element={<DesignDecisionsPage />} />
            <Route path="/organizations" element={<OrganizationsPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
