import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/common/StatCard';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import {
  CheckCircle,
  Clock,
  ClipboardList,
  AlertCircle,
  PlusCircle,
  ListTodo,
} from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { stats, tasks, createTask, loading } = useTasks();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      title: '',
      priority: 'medium',
    },
  });

  const onQuickAdd = async (formData) => {
    if (!formData.title.trim()) return;
    try {
      await createTask({ title: formData.title, priority: formData.priority });
      toast.success('Task added successfully!');
      reset();
    } catch (err) {
      toast.error('Failed to create task');
    }
  };

  const recentTasks = tasks.slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
          Welcome back, {user?.name}!
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Here is a summary of your workspace activities and task metrics.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={stats?.total ?? 0}
          icon={ClipboardList}
          colorClass="text-blue-500 bg-blue-50"
          description="Active and planned tasks"
        />
        <StatCard
          title="Pending"
          value={stats?.pending ?? 0}
          icon={AlertCircle}
          colorClass="text-amber-500 bg-amber-50"
          description="Awaiting start"
        />
        <StatCard
          title="In Progress"
          value={stats?.in_progress ?? 0}
          icon={Clock}
          colorClass="text-brand-500 bg-brand-50"
          description="Currently active"
        />
        <StatCard
          title="Completed"
          value={stats?.completed ?? 0}
          icon={CheckCircle}
          colorClass="text-emerald-500 bg-emerald-50"
          description="Finished successfully"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h2 className="text-lg font-bold text-slate-800">Recent Tasks</h2>
            <Link
              to="/tasks"
              className="text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
            >
              View All Tasks
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <Loader size="medium" />
            </div>
          ) : recentTasks.length > 0 ? (
            <div className="divide-y divide-slate-100">
              {recentTasks.map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between py-3 hover:bg-slate-50/50 px-2 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`h-2.5 w-2.5 rounded-full ${
                        task.status === 'completed'
                          ? 'bg-emerald-500'
                          : task.status === 'in_progress'
                          ? 'bg-brand-500'
                          : 'bg-amber-400'
                      }`}
                    />
                    <div>
                      <span className="text-sm font-semibold text-slate-700 block max-w-xs md:max-w-md truncate">
                        {task.title}
                      </span>
                      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>

                  <span className="text-xs text-slate-400">
                    {new Date(task.createdAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <ListTodo className="h-12 w-12 text-slate-300" />
              <p className="mt-2 text-sm font-medium text-slate-400">
                No tasks available yet. Use the Quick Add or Tasks tab.
              </p>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm flex flex-col justify-between h-fit">
          <div className="border-b border-slate-100 pb-4 mb-4">
            <h2 className="text-lg font-bold text-slate-800">Quick Add Task</h2>
            <p className="text-xs text-slate-400">Instantly create a task with basic settings.</p>
          </div>

          <form onSubmit={handleSubmit(onQuickAdd)} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Task Title
              </label>
              <input
                type="text"
                {...register('title', { required: true })}
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500"
                placeholder="What needs to be done?"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
                Priority
              </label>
              <select
                {...register('priority')}
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500"
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </div>

            <Button
              type="submit"
              loading={isSubmitting}
              className="w-full flex items-center justify-center gap-2"
            >
              <PlusCircle className="h-4.5 w-4.5" /> Add Task
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
