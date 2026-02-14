import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import Layout from './components/Layout';
import PublicLayout from './components/PublicLayout';
import AxiosInterceptor from './components/AxiosInterceptor';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminVerify from './pages/admin/AdminVerify';
import BusinessList from './pages/businesses/BusinessList';
import BusinessForm from './pages/businesses/BusinessForm';
import RecipientList from './pages/recipients/RecipientList';
import DraftList from './pages/drafts/DraftList';
import DraftEditor from './pages/drafts/DraftEditor';
import DraftPreview from './pages/drafts/DraftPreview';
import LandingPage from './pages/LandingPage';
import Contact from './pages/Contact';
import AboutUs from './pages/AboutUs';
import Pricing from './pages/Pricing';
import Features from './pages/Features';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <AxiosInterceptor />
        <Routes>
          {/* Public Routes with Layout */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/features" element={<Features />} />
          </Route>

          {/* Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route element={<Layout />}>
            <Route path="/admin/verify" element={<AdminVerify />} />
          </Route>

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/letter-draft" element={<DraftList />} />
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
