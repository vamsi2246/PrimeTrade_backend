import React from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Calendar } from 'lucide-react';
import { toast } from 'react-toastify';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const Profile = () => {
  const { user, updateProfile } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
    },
  });

  const onProfileSubmit = async (formData) => {
    try {
      await updateProfile(formData);
      toast.success('Profile updated successfully!');
    } catch (profileError) {
      const errorMsg = profileError.response?.data?.message || 'Failed to update profile. Email might be in use.';
      toast.error(errorMsg);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">Profile Settings</h1>
        <p className="text-sm text-slate-500">Manage your personal information and account settings.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col items-center justify-center text-center space-y-4 md:col-span-1">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-brand-100 text-brand-700 font-extrabold text-2xl shadow-inner">
            {user?.name ? user.name.charAt(0).toUpperCase() : <User />}
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-lg">{user?.name}</h3>
            <span className="inline-block rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600 uppercase tracking-wider mt-1">
              {user?.role}
            </span>
          </div>

          <div className="w-full text-left space-y-2 border-t border-slate-100 pt-4 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-slate-400" />
              <span className="truncate">{user?.email}</span>
            </div>
            {user?.createdAt && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-slate-400" />
                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm md:col-span-2">
          <h2 className="text-lg font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4">
            Update Personal Details
          </h2>

          <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
            <Input
              label="Full Name"
              type="text"
              error={errors.name}
              {...register('name', { required: 'Name is required' })}
            />

            <Input
              label="Email Address"
              type="email"
              error={errors.email}
              {...register('email', {
                required: 'Email address is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email format',
                },
              })}
            />

            <Button
              type="submit"
              loading={isSubmitting}
              className="px-5"
            >
              Update Settings
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;
