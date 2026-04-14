import { type FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import toast from "react-hot-toast";
import api from "../configs/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { user, setUser } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const loadProfile = async () => {
        try {
            const { data } = await api.get('/api/user/profile');
            if (data.user) {
                setName(data.user.name || "");
                setEmail(data.user.email || "");
                setUser(data.user);
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to load profile");
        }
    };

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setEmail(user.email || "");
        }
        loadProfile();
    }, []);

    const onSave = async (e: FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast.error('Name is required');
            return;
        }

        try {
            setIsSaving(true);
            const { data } = await api.put('/api/user/profile', { name: name.trim() });
            if (data.user) {
                setUser(data.user);
                setName(data.user.name || "");
                setEmail(data.user.email || "");
            }
            toast.success(data.message || 'Profile updated successfully');
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to update profile");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen px-4 pt-28 pb-16 md:px-8">
            <div className="mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
                <h1 className="text-2xl font-semibold">My Profile</h1>
                <p className="mt-2 text-sm text-white/70">
                    View your account details and update your display name.
                </p>

                <form onSubmit={onSave} className="mt-6 space-y-5">
                    <div>
                        <label className="mb-2 block text-sm text-white/80">Email</label>
                        <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white/80 outline-none"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-white/80">Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:border-pink-500"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-white/80">Password</label>
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={showPassword ? "Password cannot be shown (stored as secure hash)" : "********"}
                                disabled
                                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-white/80 outline-none"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="rounded-lg border border-white/20 bg-white/10 p-2 hover:bg-white/20"
                                aria-label={showPassword ? 'Hide password info' : 'Show password info'}
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                        <p className="mt-2 text-xs text-white/60">
                            For security, your original password is never stored and cannot be viewed.
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 font-medium hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <Save size={16} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
}
