// src/views/LoginView.tsx
import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { LogIn, User, Lock, AlertCircle } from 'lucide-react';

const LoginView: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // const navigate = useNavigate();

  const testUsers = [
    { username: 'admin', password: 'admin123', rol: 'ADMIN' },
    { username: 'carlos.admin', password: 'Admin123!', rol: 'ADMIN' },
    { username: 'juan.conductor', password: 'Conductor123!', rol: 'CONDUCTOR' },
    { username: 'maria.conductora', password: 'Conductora123!', rol: 'CONDUCTOR' },
    { username: 'roberto.supervisor', password: 'Supervisor123!', rol: 'SUPERVISOR' },
  ];

  // En handleSubmit de LoginView.tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');
  setLoading(true);

  try {
    const response = await login(username, password);
    
    if (response.success) {
      console.log('✅ Login exitoso, guardando datos...');
      
      // 🔥 Asegurar que se guarda TODO
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.usuario));
      
      console.log('💾 Datos guardados en localStorage');
      console.log('📍 Redirigiendo a /dashboard');
      
      // 🔥 Forzar redirección
      window.location.href = '/dashboard';
      
    } else {
      throw new Error('Login falló');
    }
  } catch (err: any) {
    setError(err.message || 'Credenciales incorrectas');
  } finally {
    setLoading(false);
  }
};


  const fillTestUser = (testUser: typeof testUsers[0]) => {
    setUsername(testUser.username);
    setPassword(testUser.password);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
            <LogIn className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Rastreo GPS</h1>
          <p className="text-gray-600 mt-2">Inicia sesión en tu cuenta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Usuario
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="admin"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                Iniciando...
              </span>
            ) : (
              'Iniciar Sesión'
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-medium text-gray-700 mb-4">
            Usuarios de prueba
          </h3>
          <div className="space-y-2">
            {testUsers.map((testUser) => (
              <button
                key={testUser.username}
                type="button"
                onClick={() => fillTestUser(testUser)}
                className="w-full text-left p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">{testUser.username}</p>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        testUser.rol === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                        testUser.rol === 'SUPERVISOR' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {testUser.rol}
                      </span>
                    </div>
                  </div>
                  <span className="text-sm text-indigo-600">Usar</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Backend: http://localhost:3000/api
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginView;