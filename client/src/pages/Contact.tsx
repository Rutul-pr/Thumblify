import { FormEvent, useMemo, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Mail, MessageSquare, User } from "lucide-react";
import SoftBackdrop from "../components/SoftBackdrop";
import api from "../configs/api";
import { useAuth } from "../context/AuthContext";

type ContactFormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
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

const Contact = () => {
  const { isLoggedIn, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<ContactFormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const formTitle = useMemo(
    () => (isLoggedIn ? "Contact Support" : "Contact Us"),
    [isLoggedIn]
  );

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.subject.trim() || !form.message.trim()) {
      return toast.error("Subject and message are required");
    }
    if (!isLoggedIn && (!form.name.trim() || !form.email.trim())) {
      return toast.error("Name and email are required");
    }

    setLoading(true);
    try {
      if (isLoggedIn) {
        const { data } = await api.post("/api/contact/user", {
          subject: form.subject,
          message: form.message,
        });
        toast.success(data.message);
      } else {
        const { data } = await api.post("/api/contact/guest", form);
        toast.success(data.message);
      }

      setForm((prev) => ({
        ...prev,
        subject: "",
        message: "",
        ...(isLoggedIn ? {} : { name: "", email: "" }),
      }));
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SoftBackdrop />
      <div className="pt-24 min-h-screen">
        <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28 lg:pb-8">
          <section className="p-6 sm:p-8 rounded-2xl bg-white/8 border border-white/12 shadow-xl">
            <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100">{formTitle}</h1>
            <p className="text-zinc-400 mt-2">
              {isLoggedIn
                ? "Tell us your issue or feedback. We may contact you through your registered email."
                : "Have questions or feedback? Fill out the form. We may contact you through email."}
            </p>
          </section>

          <section className="mt-6 p-6 sm:p-8 rounded-2xl bg-white/8 border border-white/12 shadow-xl">
            <form onSubmit={onSubmit} className="space-y-4">
              {isLoggedIn ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-xl border border-white/12 bg-black/20 px-4 py-3">
                    <p className="text-xs text-zinc-400 mb-1">Name</p>
                    <p className="text-zinc-100">{user?.name || "-"}</p>
                  </div>
                  <div className="rounded-xl border border-white/12 bg-black/20 px-4 py-3">
                    <p className="text-xs text-zinc-400 mb-1">Email</p>
                    <p className="text-zinc-100">{user?.email || "-"}</p>
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  <label className="space-y-2">
                    <span className="text-sm text-zinc-300">Your name</span>
                    <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-black/20 px-3">
                      <User className="size-4 text-zinc-400" />
                      <input
                        value={form.name}
                        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                        type="text"
                        placeholder="Enter your name"
                        className="w-full bg-transparent py-3 outline-none text-zinc-100 placeholder:text-zinc-500"
                      />
                    </div>
                  </label>
                  <label className="space-y-2">
                    <span className="text-sm text-zinc-300">Email</span>
                    <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-black/20 px-3">
                      <Mail className="size-4 text-zinc-400" />
                      <input
                        value={form.email}
                        onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                        type="email"
                        placeholder="Enter your email"
                        className="w-full bg-transparent py-3 outline-none text-zinc-100 placeholder:text-zinc-500"
                      />
                    </div>
                  </label>
                </div>
              )}

              <label className="space-y-2 block">
                <span className="text-sm text-zinc-300">Subject</span>
                <div className="flex items-center gap-2 rounded-xl border border-white/12 bg-black/20 px-3">
                  <MessageSquare className="size-4 text-zinc-400" />
                  <input
                    value={form.subject}
                    onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
                    type="text"
                    placeholder="What do you need help with?"
                    className="w-full bg-transparent py-3 outline-none text-zinc-100 placeholder:text-zinc-500"
                  />
                </div>
              </label>

              <label className="space-y-2 block">
                <span className="text-sm text-zinc-300">Message</span>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
                  rows={7}
                  placeholder="Write your message here..."
                  className="w-full rounded-xl border border-white/12 bg-black/20 px-4 py-3 outline-none text-zinc-100 placeholder:text-zinc-500 focus:ring-2 focus:ring-pink-500 resize-none"
                />
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto px-8 py-3 rounded-xl font-medium bg-linear-to-b from-pink-500 to-pink-600 hover:from-pink-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </section>
        </main>
      </div>
    </>
  );
};

export default Contact;