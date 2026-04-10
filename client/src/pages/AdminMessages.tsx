import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import SoftBackdrop from "../components/SoftBackdrop";
import api from "../configs/api";
import { useAuth } from "../context/AuthContext";

type ContactMessage = {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt?: string;
};

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong. Please try again.";
};

const AdminMessages = () => {
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  const fetchMessages = async () => {
    try {
      const { data } = await api.get("/api/admin/messages");
      setMessages(data.messages || []);
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn) {
      setLoading(false);
      return;
    }
    fetchMessages();
  }, [isLoggedIn]);

  if (!isLoggedIn) {
    return (
      <>
        <SoftBackdrop />
        <div className="pt-24 min-h-screen">
          <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <section className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl">
              <h1 className="text-2xl font-bold text-zinc-100">Admin Messages</h1>
              <p className="text-zinc-400 mt-2">Please login with admin account to view contact messages.</p>
            </section>
          </main>
        </div>
      </>
    );
  }

  return (
    <>
      <SoftBackdrop />
      <div className="pt-24 min-h-screen">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
          <section className="p-6 sm:p-8 rounded-2xl bg-white/8 border border-white/12 shadow-xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100">Admin Message Panel</h1>
            <p className="text-zinc-400 mt-2">
              Logged in as <span className="text-zinc-200">{user?.email}</span>
            </p>
          </section>

          <section className="mt-6 space-y-4">
            {loading ? (
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl text-zinc-300">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl text-zinc-300">No messages found.</div>
            ) : (
              messages.map((item) => (
                <article key={item._id} className="p-5 rounded-2xl bg-white/8 border border-white/12 shadow-xl">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h2 className="text-lg font-semibold text-zinc-100">{item.subject}</h2>
                    <span className="text-xs text-zinc-400">
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : "-"}
                    </span>
                  </div>
                  <p className="text-sm text-zinc-300 mt-2">
                    From: <span className="text-zinc-100">{item.name}</span> ({item.email})
                  </p>
                  <p className="text-zinc-200 mt-3 whitespace-pre-wrap leading-relaxed">{item.message}</p>
                </article>
              ))
            )}
          </section>
        </main>
      </div>
    </>
  );
};

export default AdminMessages;
