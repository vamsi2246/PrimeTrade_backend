import React, { useState, useEffect } from 'react';
import { useTasks } from '../context/TaskContext';
import { useForm } from 'react-hook-form';
import {
  Plus,
  Edit2,
  Trash2,
  Calendar,
} from 'lucide-react';
import { toast } from 'react-toastify';
import Input from '../components/common/Input';
import Textarea from '../components/common/Textarea';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Table from '../components/common/Table';
import SearchBar from '../components/common/SearchBar';
import Pagination from '../components/common/Pagination';
import FilterDropdown from '../components/common/FilterDropdown';
import Badge from '../components/common/Badge';

const TaskList = () => {
  const {
    tasks,
    loading,
    page,
    setPage,
    totalPages,
    totalItems,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    priorityFilter,
    setPriorityFilter,
    sortField,
    setSortField,
    createTask,
    updateTask,
    deleteTask,
  } = useTasks();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    setLocalSearch(search);
  }, [search]);

  useEffect(() => {
    const searchDebounceTimer = setTimeout(() => {
      setSearch(localSearch);
      setPage(1);
    }, 500);

    return () => clearTimeout(searchDebounceTimer);
  }, [localSearch, setSearch, setPage]);

  const handleStatusChange = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handlePriorityChange = (val) => {
    setPriorityFilter(val);
    setPage(1);
  };

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    reset: resetCreate,
    formState: { errors: createErrors, isSubmitting: createSubmitting },
  } = useForm();

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    reset: resetEdit,
    formState: { errors: editErrors, isSubmitting: editSubmitting },
  } = useForm();

  const onCreateSubmit = async (formData) => {
    try {
      const taskPayload = {
        title: formData.title,
        description: formData.description || '',
        status: formData.status || 'pending',
        priority: formData.priority || 'medium',
      };
      if (formData.dueDate) {
        taskPayload.dueDate = new Date(formData.dueDate).toISOString();
      }
      await createTask(taskPayload);
      toast.success('Task created successfully');
      setIsCreateOpen(false);
      resetCreate();
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const onEditSubmit = async (formData) => {
    if (!editingTask) return;
    try {
      const taskPayload = {
        title: formData.title,
        description: formData.description || '',
        status: formData.status,
        priority: formData.priority,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
      };
      await updateTask(editingTask._id, taskPayload);
      toast.success('Task updated successfully');
      setIsEditOpen(false);
      setEditingTask(null);
      resetEdit();
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    resetEdit({
      title: task.title,
      description: task.description || '',
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
    });
    setIsEditOpen(true);
  };

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        toast.success('Task deleted successfully');
      } catch (error) {
        toast.error('Failed to delete task');
      }
    }
  };

  const tableHeaders = ['Task Title', 'Status', 'Priority', 'Due Date', 'Actions'];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
  ];

  const priorityOptions = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
  ];

  const sortOptions = [
    { value: '-createdAt', label: 'Newest First' },
    { value: 'createdAt', label: 'Oldest First' },
    { value: 'dueDate', label: 'Due Date (Ascending)' },
    { value: '-dueDate', label: 'Due Date (Descending)' },
    { value: '-priority', label: 'Priority (High to Low)' },
  ];

  const renderTaskRow = (task) => (
    <tr key={task._id} className="hover:bg-slate-50/50 transition-colors">
      <td className="p-4 pl-6">
        <div className="space-y-0.5">
          <span className="font-semibold text-slate-800 block">{task.title}</span>
          {task.description && (
            <span className="text-xs text-slate-400 line-clamp-1 max-w-md font-medium">
              {task.description}
            </span>
          )}
        </div>
      </td>
      <td className="p-4">
        <Badge variant={task.status}>
          {task.status.replace('_', ' ')}
        </Badge>
      </td>
      <td className="p-4">
        <Badge variant={task.priority}>
          {task.priority}
        </Badge>
      </td>
      <td className="p-4 text-slate-500 font-medium">
        {task.dueDate ? (
          <div className="flex items-center gap-1.5 text-xs">
            <Calendar className="h-4 w-4 text-slate-400" />
            <span>{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        ) : (
          <span className="text-slate-400 text-xs italic">No due date</span>
        )}
      </td>
      <td className="p-4 pr-6 text-right">
        <div className="flex justify-end gap-2">
          <button
            onClick={() => openEditModal(task)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-slate-100 hover:text-brand-500 transition-colors"
            title="Edit Task"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleDelete(task._id)}
            className="rounded-lg p-1.5 text-slate-500 hover:bg-red-50 hover:text-red-600 transition-colors"
            title="Delete Task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">Tasks Workspace</h1>
          <p className="text-sm text-slate-500">Create, organize, and track your action items.</p>
        </div>
        <Button
          onClick={() => setIsCreateOpen(true)}
          className="flex items-center gap-2 self-start sm:self-auto px-5 py-2.5 shadow-sm"
        >
          <Plus className="h-4.5 w-4.5" /> Create Task
        </Button>
      </div>

      <div className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-2 lg:grid-cols-5">
        <SearchBar
          value={localSearch}
          onChange={setLocalSearch}
          placeholder="Search tasks..."
          className="lg:col-span-2"
        />

        <FilterDropdown
          value={statusFilter}
          onChange={handleStatusChange}
          options={statusOptions}
          placeholder="All Statuses"
        />

        <FilterDropdown
          value={priorityFilter}
          onChange={handlePriorityChange}
          options={priorityOptions}
          placeholder="All Priorities"
        />

        <FilterDropdown
          value={sortField}
          onChange={setSortField}
          options={sortOptions}
          placeholder="Sort By"
        />
      </div>

      <div className="space-y-4">
        <Table
          headers={tableHeaders}
          items={tasks}
          renderRow={renderTaskRow}
          loading={loading}
          emptyMessage="No tasks found matching query constraints."
        />
        
        <Pagination
          page={page}
          totalPages={totalPages}
          totalItems={totalItems}
          setPage={setPage}
        />
      </div>

      {/* CREATE MODAL */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Task">
        <form onSubmit={handleSubmitCreate(onCreateSubmit)} className="space-y-4">
          <Input
            label="Title"
            type="text"
            placeholder="Review server endpoints..."
            error={createErrors.title}
            {...registerCreate('title', { required: 'Task title is required' })}
          />

          <Textarea
            label="Description (Optional)"
            placeholder="Describe details..."
            error={createErrors.description}
            {...registerCreate('description')}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                {...registerCreate('priority')}
                defaultValue="medium"
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500 bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                {...registerCreate('status')}
                defaultValue="pending"
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500 bg-white"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <Input
            label="Due Date (Optional)"
            type="date"
            {...registerCreate('dueDate')}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="secondary"
              onClick={() => setIsCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={createSubmitting}
            >
              Create
            </Button>
          </div>
        </form>
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setEditingTask(null);
        }}
        title="Edit Task"
      >
        <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-4">
          <Input
            label="Title"
            type="text"
            error={editErrors.title}
            {...registerEdit('title', { required: 'Task title is required' })}
          />

          <Textarea
            label="Description"
            error={editErrors.description}
            {...registerEdit('description')}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Priority
              </label>
              <select
                {...registerEdit('priority')}
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500 bg-white"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Status
              </label>
              <select
                {...registerEdit('status')}
                className="block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-800 focus:border-brand-500 focus:outline-hidden focus:ring-1 focus:ring-brand-500 bg-white"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <Input
            label="Due Date"
            type="date"
            {...registerEdit('dueDate')}
          />

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditOpen(false);
                setEditingTask(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              loading={editSubmitting}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TaskList;
export { TaskList };
