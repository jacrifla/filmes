import AppRoutes from './routes/AppRoutes';
import { AuthProvider } from './provider/AuthProvider';
import Navbar from './components/Navbar';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <AuthProvider>
      <Navbar />
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </AuthProvider>
  );
}

export default App;
