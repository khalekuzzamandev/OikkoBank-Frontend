"use client";

import { useMemo, useState, useSyncExternalStore } from "react";
import {
  AlertCircle,
  Bell,
  Check,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  LockKeyhole,
  Save,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { selectUser, setUser } from "@/Redux/features/UserSlice";
import { useAppDispatch, useAppSelector } from "@/Redux/hooks";
import { editUser } from "@/components/lib/Apis/users/users";
import { authClient } from "@/components/lib/auth-client";

type SettingsTab = "profile" | "security" | "notifications";
type NotificationSettings = {
  transactionAlerts: boolean;
  securityAlerts: boolean;
  weeklyReports: boolean;
};
type Feedback = { type: "success" | "error"; message: string } | null;

const STORAGE_KEY = "oikkobank-admin-notification-settings";
const SETTINGS_EVENT = "oikkobank-admin-settings-updated";
const DEFAULT_NOTIFICATION_SETTINGS: NotificationSettings = {
  transactionAlerts: true,
  securityAlerts: true,
  weeklyReports: false,
};

const subscribeToSettings = (callback: () => void) => {
  window.addEventListener("storage", callback);
  window.addEventListener(SETTINGS_EVENT, callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener(SETTINGS_EVENT, callback);
  };
};

const getSettingsSnapshot = () => {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? "";
  } catch (error) {
    console.error("Unable to read notification preferences:", error);
    return "";
  }
};

const getServerSettingsSnapshot = () => "";

const parseNotificationSettings = (snapshot: string): NotificationSettings => {
  if (!snapshot) return DEFAULT_NOTIFICATION_SETTINGS;

  try {
    const parsed: unknown = JSON.parse(snapshot);
    if (
      parsed &&
      typeof parsed === "object" &&
      "transactionAlerts" in parsed &&
      "securityAlerts" in parsed &&
      "weeklyReports" in parsed &&
      typeof parsed.transactionAlerts === "boolean" &&
      typeof parsed.securityAlerts === "boolean" &&
      typeof parsed.weeklyReports === "boolean"
    ) {
      return {
        transactionAlerts: parsed.transactionAlerts,
        securityAlerts: parsed.securityAlerts,
        weeklyReports: parsed.weeklyReports,
      };
    }
  } catch {
    return DEFAULT_NOTIFICATION_SETTINGS;
  }

  return DEFAULT_NOTIFICATION_SETTINGS;
};

const tabs: Array<{
  id: SettingsTab;
  label: string;
  description: string;
  icon: typeof UserRound;
}> = [
  {
    id: "profile",
    label: "Profile",
    description: "Personal information",
    icon: UserRound,
  },
  {
    id: "security",
    label: "Security",
    description: "Password and account access",
    icon: ShieldCheck,
  },
  {
    id: "notifications",
    label: "Notifications",
    description: "Browser preferences",
    icon: Bell,
  },
];

const inputClassName =
  "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#1762AE] focus:ring-4 focus:ring-[#1762AE]/10 disabled:bg-slate-50";

export default function AdminSetting() {
  const user = useAppSelector(selectUser);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const settingsSnapshot = useSyncExternalStore(
    subscribeToSettings,
    getSettingsSnapshot,
    getServerSettingsSnapshot
  );
  const notificationSettings = useMemo(
    () => parseNotificationSettings(settingsSnapshot),
    [settingsSnapshot]
  );

  const handleProfileSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setFeedback(null);

    if (!user?.id) {
      setFeedback({
        type: "error",
        message: "Your admin profile is not available. Please sign in again.",
      });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const name = String(formData.get("name") ?? "").trim();
    const phone = String(formData.get("phone") ?? "").trim();

    if (!name) {
      setFeedback({ type: "error", message: "Please enter your name." });
      return;
    }

    setSavingProfile(true);
    try {
      const result = await editUser(user.id, { name, phone });
      if (!result.success) {
        throw new Error(result.message || "Unable to update your profile.");
      }

      dispatch(setUser({ ...user, name, phone }));
      setFeedback({
        type: "success",
        message: "Your profile has been updated.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to update your profile.",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    setFeedback(null);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const currentPassword = String(formData.get("currentPassword") ?? "");
    const newPassword = String(formData.get("newPassword") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");

    if (newPassword.length < 8) {
      setFeedback({
        type: "error",
        message: "Your new password must be at least 8 characters.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setFeedback({
        type: "error",
        message: "The new password and confirmation do not match.",
      });
      return;
    }
    if (currentPassword === newPassword) {
      setFeedback({
        type: "error",
        message: "Choose a new password different from your current one.",
      });
      return;
    }

    setChangingPassword(true);
    try {
      const result = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions: true,
      });

      if (result.error) {
        throw new Error(result.error.message || "Unable to change password.");
      }

      form.reset();
      setFeedback({
        type: "success",
        message: "Password changed. Other active sessions were signed out.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : "Unable to change your password.",
      });
    } finally {
      setChangingPassword(false);
    }
  };

  const updateNotificationSetting = (
    setting: keyof NotificationSettings,
    enabled: boolean
  ) => {
    setFeedback(null);
    const updatedSettings = {
      ...notificationSettings,
      [setting]: enabled,
    };

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedSettings)
      );
      window.dispatchEvent(new Event(SETTINGS_EVENT));
      setFeedback({
        type: "success",
        message: "Notification preferences saved in this browser.",
      });
    } catch (error) {
      setFeedback({
        type: "error",
        message:
          error instanceof Error
            ? `Unable to save preferences: ${error.message}`
            : "Unable to save notification preferences in this browser.",
      });
    }
  };

  const activeTabInfo = tabs.find((tab) => tab.id === activeTab);

  return (
    <main className="mx-auto w-full max-w-7xl space-y-6 p-4 pb-8 sm:p-6 lg:p-8">
      <header className="rounded-2xl bg-gradient-to-r from-[#003566] to-[#07549a] p-5 text-white shadow-md sm:p-7">
        <p className="text-sm font-medium text-blue-100">Admin Workspace</p>
        <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
          Settings
        </h1>
        <p className="mt-1 text-sm text-blue-100/80">
          Manage your profile, account security, and notification preferences.
        </p>
      </header>

      <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        <nav
          aria-label="Settings sections"
          className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm"
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setFeedback(null);
                }}
                aria-current={isActive ? "page" : undefined}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${
                  isActive
                    ? "bg-blue-50 text-[#003566]"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                    isActive
                      ? "bg-white text-[#1762AE] shadow-sm"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Icon size={19} />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-semibold">
                    {tab.label}
                  </span>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {tab.description}
                  </span>
                </span>
              </button>
            );
          })}
        </nav>

        <section className="min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 px-5 py-5 sm:px-7">
            <h2 className="text-lg font-bold text-slate-900">
              {activeTabInfo?.label}
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              {activeTabInfo?.description}
            </p>
          </div>

          {feedback && (
            <div
              role={feedback.type === "error" ? "alert" : "status"}
              className={`mx-5 mt-5 flex items-start gap-2 rounded-xl border p-3 text-sm sm:mx-7 ${
                feedback.type === "error"
                  ? "border-red-200 bg-red-50 text-red-700"
                  : "border-emerald-200 bg-emerald-50 text-emerald-700"
              }`}
            >
              {feedback.type === "error" ? (
                <AlertCircle size={17} className="mt-0.5 shrink-0" />
              ) : (
                <Check size={17} className="mt-0.5 shrink-0" />
              )}
              <span>{feedback.message}</span>
            </div>
          )}

          {activeTab === "profile" && (
            <form
              onSubmit={handleProfileSubmit}
              className="space-y-6 px-5 py-6 sm:px-7"
            >
              {!user ? (
                <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
                  <Loader2
                    size={18}
                    className="animate-spin text-[#1762AE]"
                  />
                  Loading your admin profile...
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-4 rounded-xl bg-slate-50 p-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#003566] text-lg font-bold text-white">
                      {(user.name || user.email || "A")
                        .trim()
                        .slice(0, 1)
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {user.name || "Admin"}
                      </p>
                      <p className="truncate text-sm text-slate-500">
                        {user.email}
                      </p>
                      <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium capitalize text-[#1762AE]">
                        <ShieldCheck size={13} />
                        {user.role || "Admin"} account
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Full name
                      <input
                        name="name"
                        type="text"
                        required
                        maxLength={100}
                        defaultValue={user.name}
                        autoComplete="name"
                        className={inputClassName}
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700">
                      Email address
                      <input
                        type="email"
                        value={user.email}
                        readOnly
                        className={`${inputClassName} cursor-not-allowed text-slate-500`}
                      />
                    </label>
                    <label className="block text-sm font-medium text-slate-700 sm:col-span-2">
                      Phone number
                      <input
                        name="phone"
                        type="tel"
                        maxLength={30}
                        defaultValue={user.phone || ""}
                        autoComplete="tel"
                        placeholder="Add a contact phone number"
                        className={inputClassName}
                      />
                    </label>
                  </div>

                  <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                    <button
                      type="reset"
                      disabled={savingProfile}
                      className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      disabled={savingProfile}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#003566] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00264d] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {savingProfile ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      Save profile
                    </button>
                  </div>
                </>
              )}
            </form>
          )}

          {activeTab === "security" && (
            <form
              onSubmit={handlePasswordSubmit}
              className="space-y-5 px-5 py-6 sm:px-7"
            >
              <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-900">
                <LockKeyhole size={19} className="mt-0.5 shrink-0" />
                <p>
                  Choose a strong password with at least 8 characters. Changing
                  it will sign out your other active sessions.
                </p>
              </div>

              <PasswordField
                label="Current password"
                name="currentPassword"
                showPassword={showCurrentPassword}
                onToggle={() => setShowCurrentPassword((shown) => !shown)}
                autoComplete="current-password"
              />
              <PasswordField
                label="New password"
                name="newPassword"
                showPassword={showNewPassword}
                onToggle={() => setShowNewPassword((shown) => !shown)}
                autoComplete="new-password"
                minLength={8}
              />
              <PasswordField
                label="Confirm new password"
                name="confirmPassword"
                showPassword={showConfirmPassword}
                onToggle={() => setShowConfirmPassword((shown) => !shown)}
                autoComplete="new-password"
                minLength={8}
              />

              <div className="flex justify-end border-t border-slate-100 pt-5">
                <button
                  type="submit"
                  disabled={changingPassword}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#003566] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#00264d] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {changingPassword ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <KeyRound size={16} />
                  )}
                  Change password
                </button>
              </div>
            </form>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4 px-5 py-6 sm:px-7">
              <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
                <Bell size={18} className="mt-0.5 shrink-0" />
                <p>
                  These preferences are saved in this browser. They do not
                  enable email or push delivery because no notification
                  delivery service is configured.
                </p>
              </div>

              <NotificationToggle
                title="Transaction activity"
                description="Show your preference for deposit and withdrawal updates."
                checked={notificationSettings.transactionAlerts}
                onChange={(checked) =>
                  updateNotificationSetting("transactionAlerts", checked)
                }
              />
              <NotificationToggle
                title="Security alerts"
                description="Keep security-related alerts enabled in your preferences."
                checked={notificationSettings.securityAlerts}
                onChange={(checked) =>
                  updateNotificationSetting("securityAlerts", checked)
                }
              />
              <NotificationToggle
                title="Weekly reports"
                description="Save whether you want a weekly summary preference."
                checked={notificationSettings.weeklyReports}
                onChange={(checked) =>
                  updateNotificationSetting("weeklyReports", checked)
                }
              />
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function PasswordField({
  label,
  name,
  showPassword,
  onToggle,
  autoComplete,
  minLength,
}: {
  label: string;
  name: string;
  showPassword: boolean;
  onToggle: () => void;
  autoComplete: string;
  minLength?: number;
}) {
  return (
    <label className="block text-sm font-medium text-slate-700">
      {label}
      <span className="relative mt-1.5 block">
        <input
          name={name}
          type={showPassword ? "text" : "password"}
          required
          minLength={minLength}
          autoComplete={autoComplete}
          className={`${inputClassName} pr-12`}
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
          className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 hover:text-slate-800"
        >
          {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
        </button>
      </span>
    </label>
  );
}

function NotificationToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4">
      <div className="min-w-0">
        <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
          checked ? "bg-[#1762AE]" : "bg-slate-300"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? "translate-x-6" : "translate-x-1"
          }`}
        />
      </button>
    </div>
  );
}
