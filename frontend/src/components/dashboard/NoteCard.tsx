import React from 'react';
import { Trash2, Calendar } from 'lucide-react';
import type { Note } from '../../types';

interface NoteCardProps {
  note: Note;
  onDelete: (noteId: string) => void;
}

const NoteCard: React.FC<NoteCardProps> = ({ note, onDelete }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
      {/* Note Header */}
      <div className="flex items-start justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {note.title}
        </h4>
        <button
          onClick={() => onDelete(note.id)}
          className="text-gray-400 hover:text-red-500 transition-colors p-1"
          title="Delete note"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Note Content */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-4">
        {truncateContent(note.content)}
      </p>

      {/* Note Footer */}
      <div className="flex items-center text-xs text-gray-500">
        <Calendar size={14} className="mr-1" />
        <span>{formatDate(note.createdAt)}</span>
      </div>
    </div>
  );
};

export default NoteCard;