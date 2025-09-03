import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useApi } from "../services/api";
import type { Note } from "../types";
import CreateNoteModal from "../components/dashboard/CreateNoteModal";
import NoteCard from "../components/dashboard/NoteCard";
import Button from "../components/common/Button";
import { PlusCircle, LogOut } from "lucide-react";

const Dashboard: React.FC = () => {
  const { notesAPI } = useApi();
  const { user, logout, loading: authLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        navigate("/signin");
      } else {
        fetchNotes();
      }
    }
    // eslint-disable-next-line
  }, [authLoading, isAuthenticated, navigate]);

  const fetchNotes = async () => {
    setLoadingNotes(true);
    try {
      const response = await notesAPI.getAllNotes();
      setNotes(response.notes);
    } catch (error: any) {
      toast.error("Failed to fetch notes");
    } finally {
      setLoadingNotes(false);
    }
  };

  const handleCreateNote = async (title: string, content: string) => {
    try {
      const response = await notesAPI.createNote({ title, content });
      setNotes([response.note, ...notes]);
      setShowCreateModal(false);
      toast.success("Note created successfully!");
    } catch (error: any) {
      toast.error(error.response?.data?.error || "Failed to create note");
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      await notesAPI.deleteNote(noteId);
      setNotes(notes.filter((note) => note.id !== noteId));
      toast.success("Note deleted successfully!");
    } catch (error: any) {
      toast.error("Failed to delete note");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/signin");
    toast.success("Logged out successfully");
  };

  if (authLoading || loadingNotes) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold text-xl">HD</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>

          {/* Welcome */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Welcome, {user?.name}!
            </h2>
            <p className="text-gray-600 text-sm">Email: {user?.email}</p>
          </div>
        </div>

        {/* Create Note Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center gap-2 max-w-xs"
          >
            <PlusCircle size={20} />
            Create Note
          </Button>
        </div>

        {/* Notes */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes</h3>
          {notes.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm p-8 text-center">
              <div className="text-gray-400 mb-4">
                <PlusCircle size={48} className="mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No notes yet
              </h3>
              <p className="text-gray-600 mb-4">
                Start creating your first note to get organized!
              </p>
              <Button
                onClick={() => setShowCreateModal(true)}
                className="max-w-xs mx-auto"
              >
                Create Your First Note
              </Button>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onDelete={handleDeleteNote}
                />
              ))}
            </div>
          )}
        </div>

        {/* Create Note Modal */}
        {showCreateModal && (
          <CreateNoteModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateNote}
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;