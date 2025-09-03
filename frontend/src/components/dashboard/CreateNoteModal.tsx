import React, { useState } from 'react';
import { X } from 'lucide-react';
import Button from '../common/Button';

interface CreateNoteModalProps {
  onClose: () => void;
  onSubmit: (title: string, content: string) => Promise<void>;
}

const CreateNoteModal: React.FC<CreateNoteModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; content?: string }>({});

  const validateForm = () => {
    const newErrors: { title?: string; content?: string } = {};

    if (!title.trim()) {
      newErrors.title = 'Title is required';
    } else if (title.length > 100) {
      newErrors.title = 'Title cannot exceed 100 characters';
    }

    if (!content.trim()) {
      newErrors.content = 'Content is required';
    } else if (content.length > 10000) {
      newErrors.content = 'Content cannot exceed 10000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      await onSubmit(title.trim(), content.trim());
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Create New Note</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {/* Title Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter note title..."
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={100}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.title && (
                  <p className="text-sm text-red-600">{errors.title}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {title.length}/100
                </p>
              </div>
            </div>

            {/* Content Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Content <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your note content here..."
                rows={8}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical ${
                  errors.content ? 'border-red-500' : 'border-gray-300'
                }`}
                maxLength={10000}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.content && (
                  <p className="text-sm text-red-600">{errors.content}</p>
                )}
                <p className="text-xs text-gray-500 ml-auto">
                  {content.length}/10000
                </p>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <Button
              type="submit"
              loading={loading}
              disabled={loading || !title.trim() || !content.trim()}
              className="px-6 py-2"
            >
              Create Note
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNoteModal;