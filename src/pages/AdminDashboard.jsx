import React, { useEffect, useState } from "react";
import {
  getSuggestions,
  addSuggestion,
  updateSuggestion,
  deleteSuggestion
} from "../services/suggestionService";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isEdit, setIsEdit] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [form, setForm] = useState({ id: null, title: "", desc: "" });

  // 🛡 Check if admin is logged in
  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) navigate("/admin/login");
  }, [navigate]);

  const username = localStorage.getItem('admin_user') || null;

  function handleLogout() {
    import('../services/api').then(({ clearAuthToken }) => {
      clearAuthToken();
      navigate('/admin/login');
    });
  }

  async function loadData() {
    const data = await getSuggestions();
    setSuggestions(data);
    setLoading(false);
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!mounted) return;
      await loadData();
    })();
    return () => { mounted = false; };
  }, []);

  function openAddModal() {
    setIsEdit(false);
    setForm({ id: null, title: "", desc: "" });
    setModalOpen(true);
  }

  function openEditModal(item) {
    setIsEdit(true);
    setForm(item);
    setModalOpen(true);
  }

  async function handleSubmit() {
    if (!form.title.trim() || !form.desc.trim()) return;

    if (isEdit) {
      await updateSuggestion(form.id, {
        title: form.title,
        desc: form.desc
      });
    } else {
      await addSuggestion({
        title: form.title,
        desc: form.desc
      });
    }

    setModalOpen(false);
    loadData();
  }

  async function handleDelete(id) {
    if (confirm("Delete this suggestion?")) {
      await deleteSuggestion(id);
      loadData();
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 px-4">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-2">
              🛡️ Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage fashion suggestions
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-700 mb-2">
              Signed in as <span className="font-bold text-purple-600">{username}</span>
            </p>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Stats & Add Button */}
        <div className="flex items-center justify-between mb-8">
          <div className="bg-white rounded-xl shadow p-4 flex items-center gap-3">
            <span className="text-3xl">📋</span>
            <div>
              <p className="text-sm text-gray-600">Total Suggestions</p>
              <p className="text-2xl font-bold text-purple-600">{suggestions.length}</p>
            </div>
          </div>

          <button
            onClick={openAddModal}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all transform"
          >
            ✨ Add New Suggestion
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-bounce text-6xl mb-4">⏳</div>
            <p className="text-lg font-semibold text-gray-700">Loading suggestions...</p>
          </div>
        )}

        {/* Suggestions List */}
        {!loading && suggestions.length === 0 && (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-lg font-semibold text-gray-700 mb-4">No suggestions yet</p>
            <button
              onClick={openAddModal}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:scale-105 transition-transform"
            >
              Create the first one →
            </button>
          </div>
        )}

        {!loading && suggestions.length > 0 && (
          <div className="grid gap-4">
            {suggestions.map((item, idx) => (
              <Motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow p-6 border-l-4 border-purple-600">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-3xl">👗</span>
                        <h3 className="text-2xl font-bold text-gray-800">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 ml-12 mb-4">{item.desc}</p>
                      <p className="text-xs text-gray-400 ml-12">ID: {item.id}</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditModal(item)}
                        className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-md hover:scale-105 transition-all transform"
                      >
                        ✏️ Edit
                      </button>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-lg font-semibold hover:shadow-md hover:scale-105 transition-all transform"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </Motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <Motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
              {isEdit ? "✏️ Edit Suggestion" : "✨ Add New Suggestion"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="e.g., Summer Beach Look"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:shadow-md transition-all"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-2">
                  Description
                </label>
                <textarea
                  placeholder="Describe this fashion suggestion..."
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-purple-400 focus:shadow-md transition-all resize-none"
                  rows="4"
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setModalOpen(false)}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all transform"
              >
                {isEdit ? "Update" : "Add"}
              </button>
            </div>
          </Motion.div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
