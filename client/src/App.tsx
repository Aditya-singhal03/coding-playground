import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Playground from './pages/Playground';
import AuthPage from './pages/AuthPage';
import SuccessPage from './pages/SuccessPage';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path='/auth' element={<AuthPage />} />
      <Route path='/' element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path='/playground' element={<ProtectedRoute><Playground /></ProtectedRoute>} />
      <Route path='/success' element={<ProtectedRoute><SuccessPage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
