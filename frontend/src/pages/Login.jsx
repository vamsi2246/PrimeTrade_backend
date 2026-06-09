import React, { useEffect, useRef } from 'react';
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
  const isInitialized = useRef(false);
  const googleCallbackRef = useRef(null);
  
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

  // Keep a ref so the GSI callback always has fresh navigate/redirectPath/googleLogin
  googleCallbackRef.current = async (response) => {
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
    if (isInitialized.current) return;

    const initializeGoogle = () => {
      if (window.google?.accounts?.id) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
          callback: (response) => googleCallbackRef.current(response),
        });

        const btnElement = document.getElementById('google-signin-btn');
        if (btnElement) {
          window.google.accounts.id.renderButton(
            btnElement,
            { theme: 'outline', size: 'large', width: '384', text: 'signin_with' }
          );
          isInitialized.current = true;
        }
      }
    };

    const interval = setInterval(() => {
      if (window.google?.accounts?.id) {
        initializeGoogle();
        clearInterval(interval);
      }
    }, 500);

    return () => clearInterval(interval);
  }, []);

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
