"use client";

import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchWithAuth } from '../../services/api';
import { Button, Card, Checkbox, Label, Spinner, TextInput } from 'flowbite-react';
import { HiMail, HiLockClosed, HiUser } from 'react-icons/hi';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const clearInputs = () => {
    setEmail('');
    setPassword('');
    setName('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const data = await fetchWithAuth('/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
        });
        login(data.token, data.user);
      } else {
        await fetchWithAuth('/auth/register', {
          method: 'POST',
          body: JSON.stringify({ name, email, password }),
        });
        setIsLogin(true);
        clearInputs();
        setError('¡Registro exitoso! Por favor inicia sesión.');
      }
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-80px)] px-4">
      <Card className="w-full max-w-md shadow-lg border-0 bg-white dark:bg-gray-800">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isLogin ? 'Inicia Sesión en tu Cuenta' : 'Crear una Cuenta'}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {isLogin ? '¡Bienvenido de nuevo! Por favor ingresa tus datos.' : '¡Únete a nosotros para empezar a comprar!'}
          </p>
        </div>
        
        {error && (
          <div className={`p-4 mb-4 text-sm rounded-lg ${error.includes('exitoso') ? 'bg-green-50 text-green-800 dark:bg-gray-800 dark:text-green-400' : 'bg-red-50 text-red-800 dark:bg-gray-800 dark:text-red-400'}`}>
            <span className="font-medium">{error.includes('exitoso') ? '¡Éxito!' : '¡Error!'}</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isLogin && (
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value="Nombre Completo" />
              </div>
              <TextInput
                id="name"
                type="text"
                icon={HiUser}
                placeholder="Juan Pérez"
                required
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </div>
          )}
          
          <div>
            <div className="mb-2 block">
              <Label htmlFor="email" value="Correo Electrónico" />
            </div>
            <TextInput
              id="email"
              type="email"
              icon={HiMail}
              placeholder="nombre@empresa.com"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          
          <div>
            <div className="mb-2 block">
              <Label htmlFor="password" value="Contraseña" />
            </div>
            <TextInput
              id="password"
              type="password"
              icon={HiLockClosed}
              placeholder="••••••••"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {isLogin && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Checkbox id="remember" />
                <Label htmlFor="remember">Recordarme</Label>
              </div>
              <a href="#" className="text-sm text-blue-700 hover:underline dark:text-blue-500">
                ¿Olvidaste tu contraseña?
              </a>
            </div>
          )}

          <Button type="submit" disabled={loading} color="blue" className="w-full font-semibold mt-2">
            {loading ? <Spinner size="sm" light={true} /> : (isLogin ? 'Iniciar Sesión' : 'Registrarse')}
          </Button>
        </form>

        <div className="text-sm font-medium text-gray-500 dark:text-gray-300 mt-4 text-center">
          {isLogin ? "¿No tienes cuenta? " : "¿Ya tienes una cuenta? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); clearInputs(); }} 
            className="text-blue-700 hover:underline dark:text-blue-500 font-bold"
            type="button"
          >
            {isLogin ? 'Crear cuenta' : 'Inicia sesión aquí'}
          </button>
        </div>
      </Card>
    </div>
  );
}
