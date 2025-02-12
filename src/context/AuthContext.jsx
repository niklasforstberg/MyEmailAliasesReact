import { createContext, useContext, useState } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext(null);

// Create the hook inside the same file
function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// AuthProvider component
function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = async (credentials) => {
    try {
      const response = await axios.post('http://localhost:5267/api/auth/login', {
        email: credentials.email,
        password: credentials.password
      });
      
      if (response.data && response.data.token) {
        setUser({ token: response.data.token });
        localStorage.setItem('token', response.data.token);
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Export both the Provider and the hook
export { AuthProvider, useAuth }; 