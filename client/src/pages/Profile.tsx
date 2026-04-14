import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { Eye, EyeOff, Save } from "lucide-react";
import toast from "react-hot-toast";
import api from "../configs/api";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { user, setUser } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setPasswordForm((prev) => ({ ...prev, [name]: value }));
    };

    const onChangePassword = async (e: FormEvent) => {
        e.preventDefault();

        if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
            toast.error('All password fields are required');
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters');
            return;
        }

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('New password and confirm password do not match');
            return;
        }

        try {
            setIsChangingPassword(true);
            const { data } = await api.put('/api/user/change-password', passwordForm);
            toast.success(data.message || 'Password changed successfully');
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Failed to change password");
        } finally {
            setIsChangingPassword(false);
        }
    };

    return (
        <div className="min-h-screen px-4 pt-28 pb-16 md:px-8">
            <div className="mx-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-white/5 p-6 md:p-8">
                <h1 className="text-2xl font-semibold">My Profile</h1>
                <p className="mt-2 text-sm text-white/70">
                    View your account details, update your name, and change your password.
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

                    <button
                        type="submit"
                        disabled={isSaving}
                        className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 font-medium hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <Save size={16} />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>

                <form onSubmit={onChangePassword} className="mt-8 space-y-4 border-t border-white/10 pt-6">
                    <h2 className="text-lg font-medium">Change Password</h2>
                    <p className="text-xs text-white/60">
                        Enter your current password, then set a new one.
                    </p>

                    <div>
                        <label className="mb-2 block text-sm text-white/80">Current Password</label>
                        <div className="flex items-center gap-2">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                name="currentPassword"
                                value={passwordForm.currentPassword}
                                onChange={onPasswordChange}
                                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:border-pink-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrentPassword((prev) => !prev)}
                                className="rounded-lg border border-white/20 bg-white/10 p-2 hover:bg-white/20"
                                aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                            >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-white/80">New Password</label>
                        <div className="flex items-center gap-2">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={passwordForm.newPassword}
                                onChange={onPasswordChange}
                                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:border-pink-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowNewPassword((prev) => !prev)}
                                className="rounded-lg border border-white/20 bg-white/10 p-2 hover:bg-white/20"
                                aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="mb-2 block text-sm text-white/80">Confirm New Password</label>
                        <div className="flex items-center gap-2">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                name="confirmPassword"
                                value={passwordForm.confirmPassword}
                                onChange={onPasswordChange}
                                className="w-full rounded-lg border border-white/15 bg-white/5 px-3 py-2 outline-none focus:border-pink-500"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword((prev) => !prev)}
                                className="rounded-lg border border-white/20 bg-white/10 p-2 hover:bg-white/20"
                                aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isChangingPassword}
                        className="inline-flex items-center gap-2 rounded-lg bg-pink-600 px-4 py-2 font-medium hover:bg-pink-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <Save size={16} />
                        {isChangingPassword ? 'Changing...' : 'Change Password'}
                    </button>
                </form>
            </div>
        </div>
    );
}
