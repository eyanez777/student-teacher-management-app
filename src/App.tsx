
import './App.css';


import AppRouter from './routes/AppRouter';
import AuthProvider from './app/AuthProvider';
import { BrowserRouter } from 'react-router-dom';


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App
