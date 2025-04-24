import { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import { useAuth } from '../../lib/use-auth';
import { Spinner } from '../ui/spinner';

export default function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const { register, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password && email) {
      await register(username, password, email);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-4'
    >
      <div className='space-y-2'>
        <Label htmlFor='username'>Username</Label>
        <Input
          id='username'
          type='text'
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder='Choose a username'
          required
          minLength={3}
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <Input
          id='email'
          type='email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder='Enter your email'
          required
        />
      </div>
      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <Input
          id='password'
          type='password'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder='Create a password'
          required
          minLength={6}
        />
        <p className='text-xs text-gray-500'>
          Password must be at least 6 characters
        </p>
      </div>
      {error && <p className='text-sm text-red-500'>{error}</p>}
      <Button
        type='submit'
        className='w-full'
        disabled={isLoading}
      >
        {isLoading ? <Spinner size='sm' /> : 'Register'}
      </Button>
    </form>
  );
}
