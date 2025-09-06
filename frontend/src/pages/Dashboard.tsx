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
  const { user, logout, loading: authLoading } = useAuth(); // REMOVED: isAuthenticated
  const navigate = useNavigate();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loadingNotes, setLoadingNotes] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    // CHANGED: Removed authentication check - ProtectedRoute handles this now
    fetchNotes();
    // eslint-disable-next-line
  }, []); // REMOVED: authLoading, isAuthenticated, navigate dependencies

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
      setNotes(notes.filter((note) => note._id !== noteId));
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
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-b-2 border-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl p-4 mx-auto lg:p-8">
        {/* Header */}
        <div className="p-6 mb-8 bg-white shadow-sm rounded-xl">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-10 h-10 mr-3 bg-blue-600 rounded-lg">
                <span className="text-xl font-bold text-white">HD</span>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 font-medium text-blue-600 hover:text-blue-700"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>

          {/* Welcome */}
          <div className="p-4 rounded-lg bg-gray-50">
            <h2 className="mb-2 text-lg font-semibold text-gray-900">
              Welcome, {user?.name}!
            </h2>
            <p className="text-sm text-gray-600">Email: {user?.email}</p>
          </div>
        </div>

        {/* Create Note Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center justify-center max-w-xs gap-2"
          >
            <PlusCircle size={20} />
            Create Note
          </Button>
        </div>

        {/* Notes */}
        <div>
          <h3 className="mb-4 text-lg font-semibold text-gray-900">Notes</h3>
          {notes.length === 0 ? (
            <div className="p-8 text-center bg-white shadow-sm rounded-xl">
              <div className="mb-4 text-gray-400">
                <PlusCircle size={48} className="mx-auto" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                No notes yet
              </h3>
              <p className="mb-4 text-gray-600">
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
                  key={note._id}
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