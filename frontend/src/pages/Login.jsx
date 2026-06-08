import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Lock, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const onLoginSubmit = async (credentials) => {
    try {
      await login(credentials.email, credentials.password);
      toast.success('Welcome back to SecureTask Pro!');
      navigate(redirectPath, { replace: true });
    } catch (loginError) {
      const errorMsg = loginError.response?.data?.message || 'Login failed. Please verify credentials.';
      toast.error(errorMsg);
    }
  };

  const handleGoogleCredentialResponse = async (response) => {
    try {
      await googleLogin(response.credential);
      toast.success('Sign in successful via Google!');
      navigate(redirectPath, { replace: true });
    } catch (googleError) {
      const errorMsg = googleError.response?.data?.message || 'Google Sign-In failed.';
      toast.error(errorMsg);
    }
  };

  useEffect(() => {
    // Initialize Google Identity Services if loaded
    if (window.google) {
      window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1048590392945-example.apps.googleusercontent.com',
        callback: handleGoogleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById('google-signin-btn'),
        { theme: 'outline', size: 'large', width: '384', text: 'signin_with' }
      );
    }
  }, [googleLogin, navigate, redirectPath]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <CheckSquare className="h-10 w-10 text-brand-500" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Sign In
          </h2>
          <p className="text-sm text-slate-500">
            Welcome back. Please enter your credentials.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onLoginSubmit)}>
          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="you@example.com"
            error={errors.email}
            {...register('email', {
              required: 'Email address is required',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: 'Invalid email address format',
              },
            })}
          />

          <Input
            label="Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            error={errors.password}
            {...register('password', {
              required: 'Password is required',
            })}
          />

          <Button
            type="submit"
            loading={isSubmitting}
            className="w-full py-2.5"
          >
            Sign In
          </Button>

          {/* Separator */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-slate-400 text-xs font-semibold uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          {/* Google Sign-in Button container */}
          <div className="flex justify-center">
            <div id="google-signin-btn" className="w-full max-w-sm"></div>
          </div>
        </form>

        <div className="text-center text-sm text-slate-500">
          New to SecureTask Pro?{' '}
          <Link
            to="/register"
            className="font-semibold text-brand-500 hover:text-brand-600 transition-colors"
          >
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
