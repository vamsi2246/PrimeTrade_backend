import React from 'react';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import StatCard from '../components/common/StatCard';
import Loader from '../components/common/Loader';
import Button from '../components/common/Button';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import Skeleton from '../components/common/Skeleton';
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
      {/* Welcome Card */}
      <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 shadow-xs relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <span className="inline-flex items-center rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700 uppercase tracking-wider">
            Workspace Hub
          </span>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-sm text-slate-500 leading-relaxed">
            Here is a summary of your workspace activities and task metrics. Keep track of progress and manage your action items.
          </p>
        </div>
        <div className="absolute right-0 bottom-0 top-0 hidden w-1/3 bg-slate-50/50 skew-x-12 transform origin-top-right border-l border-slate-100 lg:block" />
      </div>

      {/* Stats Cards Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs space-y-3">
              <Skeleton variant="text" className="w-1/2 h-3" />
              <Skeleton variant="text" className="w-1/4 h-8" />
              <Skeleton variant="text" className="w-3/4 h-3" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Total Tasks"
              value={stats?.total ?? 0}
              icon={ClipboardList}
              colorClass="text-blue-500 bg-blue-50 border border-blue-100/50"
              description="Active and planned tasks"
            />
            <StatCard
              title="Pending"
              value={stats?.pending ?? 0}
              icon={AlertCircle}
              colorClass="text-amber-500 bg-amber-50 border border-amber-100/50"
              description="Awaiting start"
            />
            <StatCard
              title="In Progress"
              value={stats?.in_progress ?? 0}
              icon={Clock}
              colorClass="text-brand-500 bg-brand-50 border border-brand-100/50"
              description="Currently active"
            />
            <StatCard
              title="Completed"
              value={stats?.completed ?? 0}
              icon={CheckCircle}
              colorClass="text-emerald-500 bg-emerald-50 border border-emerald-100/50"
              description="Finished successfully"
            />
          </>
        )}
      </div>

      {/* Secondary layout sections */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Tasks List */}
        <div className="lg:col-span-2">
          <Card
            title="Recent Tasks"
            subtitle="Your most recently updated task records."
            headerAction={
              <Link
                to="/tasks"
                className="text-xs font-semibold text-brand-500 hover:text-brand-600 transition-colors"
              >
                View Workspace
              </Link>
            }
          >
            {loading ? (
              <div className="space-y-4 py-4">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex justify-between items-center px-2">
                    <div className="space-y-2 w-1/3">
                      <Skeleton variant="text" className="h-4 w-full" />
                      <Skeleton variant="text" className="h-3 w-1/2" />
                    </div>
                    <Skeleton variant="text" className="h-3 w-12" />
                  </div>
                ))}
              </div>
            ) : recentTasks.length > 0 ? (
              <div className="divide-y divide-slate-100">
                {recentTasks.map((task) => (
                  <div
                    key={task._id}
                    className="flex items-center justify-between py-3.5 hover:bg-slate-50/30 px-2 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <span
                        className={`h-2 w-2 rounded-full shrink-0 ${
                          task.status === 'completed'
                            ? 'bg-emerald-500'
                            : task.status === 'in_progress'
                            ? 'bg-blue-500'
                            : 'bg-amber-400'
                        }`}
                      />
                      <div className="truncate">
                        <span className="text-sm font-semibold text-slate-700 block truncate">
                          {task.title}
                        </span>
                        <div className="flex gap-2 items-center mt-0.5">
                          <span className="text-xs text-slate-400 font-medium capitalize">
                            Priority: {task.priority}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span className="text-xs text-slate-400 shrink-0 font-medium">
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
                <ListTodo className="h-12 w-12 text-slate-200" />
                <p className="mt-2 text-sm font-medium text-slate-400">
                  No tasks available yet. Use the Quick Add or Tasks tab.
                </p>
              </div>
            )}
          </Card>
        </div>

        {/* Quick Add Form */}
        <div>
          <Card
            title="Quick Add Task"
            subtitle="Instantly create a task with default parameters."
          >
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
                  className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500 bg-white"
                >
                  <option value="low">Low Priority</option>
                  <option value="medium">Medium Priority</option>
                  <option value="high">High Priority</option>
                </select>
              </div>

              <Button
                type="submit"
                loading={isSubmitting}
                className="w-full flex items-center justify-center gap-2 py-2.5"
              >
                <PlusCircle className="h-4.5 w-4.5" /> Add Task
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
export { Dashboard };
