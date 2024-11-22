import React from 'react';
import { BrowserRouter as Router, Routes, Route,Navigate} from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import PrivateRoute from './Components/PrivateRoute';
import { AuthProvider } from './context/authContext';
import LeadsListPage from './Components/page';


function App() {
  return (
    <GoogleOAuthProvider 
      clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}
    >
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route 
              path="/page" 
              element={
                <PrivateRoute>
                  <LeadsListPage/>
                </PrivateRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;