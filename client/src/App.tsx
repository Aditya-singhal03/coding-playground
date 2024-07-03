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
      <Route element={<ProtectedRoute/>}>
        <Route path='/' element={<Home />} />
        <Route path='/playground' element={<Playground />} />
        <Route path='/success' element={<SuccessPage />} />
      </Route>
    </Routes>
  );
}

export default App;
