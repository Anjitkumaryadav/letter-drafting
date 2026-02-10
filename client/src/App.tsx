import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import AxiosInterceptor from './components/AxiosInterceptor';
import Login from './pages/auth/Login';

import Register from './pages/auth/Register';
import BusinessList from './pages/businesses/BusinessList';
import BusinessForm from './pages/businesses/BusinessForm';
import RecipientList from './pages/recipients/RecipientList';
import DraftList from './pages/drafts/DraftList';
import DraftEditor from './pages/drafts/DraftEditor';
import DraftPreview from './pages/drafts/DraftPreview';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AxiosInterceptor />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/" element={<DraftList />} />
              <Route path="/businesses" element={<BusinessList />} />
              <Route path="/businesses/new" element={<BusinessForm />} />
              <Route path="/businesses/edit/:id" element={<BusinessForm />} />
              <Route path="/recipients" element={<RecipientList />} />
              <Route path="/drafts/new" element={<DraftEditor />} />
              <Route path="/drafts/:id" element={<DraftEditor />} />
              <Route path="/drafts/:id/preview" element={<DraftPreview />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
