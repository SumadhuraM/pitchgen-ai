import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { BlueprintProvider } from './context/BlueprintContext';
import { AppShell } from './components/layout/AppShell';
import { IdeaInputForm } from './components/form/IdeaInputForm';
import { GeneratePage } from './pages/GeneratePage';
import { HistoryPage } from './pages/HistoryPage';

export default function App() {
  return (
    <BlueprintProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<IdeaInputForm />} />
            <Route path="generate" element={<GeneratePage />} />
            <Route path="history" element={<HistoryPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </BlueprintProvider>
  );
}
