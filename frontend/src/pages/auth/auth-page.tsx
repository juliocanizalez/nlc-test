import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import LoginForm from '../../components/auth/login-form';
import RegisterForm from '../../components/auth/register-form';
import { useAuth } from '../../lib/use-auth';
import { Navigate } from 'react-router-dom';

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to='/dashboard' />;
  }

  return (
    <div className='flex items-center justify-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-6'>
        <Card>
          <CardHeader>
            <div className='flex space-x-2 mb-2'>
              <Button
                variant={activeTab === 'login' ? 'default' : 'outline'}
                onClick={() => setActiveTab('login')}
                className='flex-1'
              >
                Login
              </Button>
              <Button
                variant={activeTab === 'register' ? 'default' : 'outline'}
                onClick={() => setActiveTab('register')}
                className='flex-1'
              >
                Register
              </Button>
            </div>
            <CardTitle className='text-xl font-bold text-center'>
              {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeTab === 'login' ? <LoginForm /> : <RegisterForm />}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
