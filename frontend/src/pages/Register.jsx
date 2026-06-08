import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckSquare, Lock, Mail, User } from 'lucide-react';
import { toast } from 'react-toastify';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const passwordValue = watch('password');

  const onRegisterSubmit = async (formData) => {
    try {
      await registerUser(formData.name, formData.email, formData.password);
      toast.success('Account created successfully! Welcome.');
      navigate('/dashboard');
    } catch (regError) {
      const errorMsg = regError.response?.data?.message || 'Registration failed. Email might already be registered.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <CheckSquare className="h-10 w-10 text-brand-500" />
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-800">
            Create Account
          </h2>
          <p className="text-sm text-slate-500">
            Sign up to start organizing tasks securely.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onRegisterSubmit)}>
          <Input
            label="Full Name"
            type="text"
            icon={User}
            placeholder="Jane Doe"
            error={errors.name}
            {...register('name', {
              required: 'Full name is required',
              maxLength: {
                value: 50,
                message: 'Name cannot exceed 50 characters',
              },
            })}
          />

          <Input
            label="Email Address"
            type="email"
            icon={Mail}
            placeholder="jane@example.com"
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
              minLength: {
                value: 6,
                message: 'Password must be at least 6 characters long',
              },
            })}
          />

          <Input
            label="Confirm Password"
            type="password"
            icon={Lock}
            placeholder="••••••••"
            error={errors.confirmPassword}
            {...register('confirmPassword', {
              required: 'Please confirm your password',
              validate: (value) =>
                value === passwordValue || 'Passwords do not match',
            })}
          />

          <Button
            type="submit"
            loading={isSubmitting}
            className="w-full py-2.5"
          >
            Create Account
          </Button>
        </form>

        <div className="text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link
            to="/login"
            className="font-semibold text-brand-500 hover:text-brand-600 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
