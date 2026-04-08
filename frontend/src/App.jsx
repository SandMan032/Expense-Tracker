import { Navigate, Route, Routes } from 'react-router-dom';
import AppShell from './components/AppShell.jsx';
import AddExpensePage from './pages/AddExpensePage.jsx';
import CreateGroupPage from './pages/CreateGroupPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';

function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<CreateGroupPage />} />
        <Route path="/expenses" element={<AddExpensePage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
