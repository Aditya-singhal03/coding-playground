import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Playground from './pages/Playground';


function App() {
  return (
  <>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/playground' element={<Playground/>}/>
      </Routes>
  </>
  );
}

export default App
