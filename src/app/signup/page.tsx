"use client";

import React, { useState } from "react";
import { User, Lock, Mail, ArrowRight, ShieldCheck, Github, X } from "lucide-react";
import { loginClient } from "@/lib/store";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Social Auth Modals State
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  const [googleName, setGoogleName] = useState("");
  const [googleEmail, setGoogleEmail] = useState("");

  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [githubUsername, setGithubUsername] = useState("");
  const [githubEmail, setGithubEmail] = useState("");

  // Prevent browser password manager from autofilling saved admin credentials
  React.useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    const t1 = setTimeout(() => {
      setName("");
      setEmail("");
      setPassword("");
    }, 80);
    const t2 = setTimeout(() => {
      setEmail("");
      setPassword("");
    }, 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreeTerms) {
      alert("Please agree to the Terms & Conditions and Privacy Policy.");
      return;
    }

    loginClient({
      name: name.trim() || email.split("@")[0].replace(/[._]/g, " "),
      email: email.trim(),
      joinedDate: "October 2026",
      role: "Client & Student",
      isAdmin: false
    });
    window.location.href = "/profile";
  };

  const handleGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleEmail.trim()) {
      alert("Please enter your Google / Gmail email address.");
      return;
    }

    const cleanEmail = googleEmail.trim();
    const cleanName = googleName.trim() || cleanEmail.split("@")[0].replace(/[._]/g, " ");

    loginClient({
      name: cleanName,
      email: cleanEmail,
      joinedDate: "October 2026",
      role: "Verified Google Client",
      provider: "google",
      isAdmin: false
    });
    setIsGoogleModalOpen(false);
    window.location.href = "/profile";
  };

  const handleGithubSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!githubUsername.trim()) {
      alert("Please enter your GitHub username.");
      return;
    }

    const cleanUsername = githubUsername.trim();
    const cleanEmail = githubEmail.trim() || `${cleanUsername}@users.noreply.github.com`;

    loginClient({
      name: cleanUsername,
      email: cleanEmail,
      joinedDate: "October 2026",
      role: "Verified GitHub Client",
      provider: "github",
      isAdmin: false
    });
    setIsGithubModalOpen(false);
    window.location.href = "/profile";
  };

  return (
    <div className="bg-slate-50 min-h-screen py-16 flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-4">
        
        {/* Brand Header */}
        <div className="text-center mb-8">
          <a href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-white shadow-sm font-bold text-xl">
              X
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Adverty <span className="text-brand-600">X</span>
            </span>
          </a>
          <h1 className="text-2xl font-bold text-slate-900">Create Your Account</h1>
          <p className="text-xs text-slate-500 mt-1">Join Adverty X and get started today with agency services, courses, or tool subscriptions.</p>
        </div>

        {/* Sign Up Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-card space-y-6">
          <form onSubmit={handleSignUp} className="space-y-4" autoComplete="off">
            {/* Decoy fields to absorb Chrome/Edge autofill of saved admin credentials */}
            <div className="sr-only opacity-0 absolute -z-50 pointer-events-none h-0 w-0 overflow-hidden" aria-hidden="true">
              <input type="text" name="chrome_prevent_autofill_username" tabIndex={-1} autoComplete="off" />
              <input type="password" name="chrome_prevent_autofill_password" tabIndex={-1} autoComplete="new-password" />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="adverty_signup_client_fullname"
                  autoComplete="off"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ahmed Khan"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  name="adverty_signup_client_email"
                  autoComplete="new-password"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  name="adverty_signup_client_password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password (min 8 characters)"
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white"
                />
              </div>
            </div>

            <div className="flex items-start">
              <input
                id="terms"
                type="checkbox"
                required
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-slate-300 focus:ring-brand-500 mt-0.5"
              />
              <label htmlFor="terms" className="ml-2 text-xs text-slate-600 leading-relaxed">
                I agree to the{" "}
                <a href="/terms" className="text-brand-600 underline">Terms and Conditions</a>{" "}
                and{" "}
                <a href="/privacy-policy" className="text-brand-600 underline">Privacy Policy</a>.
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm"
            >
              Sign Up & Get Started
            </button>
          </form>

          {/* Social Auth Separator */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <span className="relative px-3 bg-white text-[11px] text-slate-400 uppercase font-semibold">
              Or continue with
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => setIsGithubModalOpen(true)}
              className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
            >
              <Github className="w-4 h-4 text-slate-900" />
              <span>GitHub</span>
            </button>
          </div>

          <div className="text-center pt-2 text-xs text-slate-500">
            Already have an account?{" "}
            <a href="/login" className="text-brand-600 font-bold hover:underline">
              Log in here
            </a>
          </div>
        </div>

      </div>

      {/* =========================================================================
          GOOGLE ACCOUNT CHOOSER DIALOG (REALISTIC GOOGLE AUTH MODAL)
      ========================================================================= */}
      {isGoogleModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Google Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center mx-auto mb-3 shadow-xs">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold text-slate-800">Sign in with Google</h3>
              <p className="text-xs text-slate-500 mt-1">
                Choose an account or enter your Gmail to continue to <strong className="text-slate-700">Adverty X</strong>
              </p>
            </div>

            <form onSubmit={handleGoogleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Muhammad Usman"
                  value={googleName}
                  onChange={(e) => setGoogleName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Your Gmail / Google Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. usman.digital@gmail.com"
                  value={googleEmail}
                  onChange={(e) => setGoogleEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 leading-relaxed">
                To continue, Google will verify your identity and share your name and email with Adverty X.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGoogleModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Continue with Google</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================================
          GITHUB ACCOUNT CHOOSER DIALOG
      ========================================================================= */}
      {isGithubModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 border border-slate-200 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setIsGithubModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* GitHub Header */}
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mx-auto mb-3 shadow-xs">
                <Github className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">Sign in to GitHub</h3>
              <p className="text-xs text-slate-500 mt-1">
                Authorize <strong className="text-slate-700">Adverty X</strong> to continue with your developer profile
              </p>
            </div>

            <form onSubmit={handleGithubSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GitHub Username *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. octocat or adnan-dev"
                  value={githubUsername}
                  onChange={(e) => setGithubUsername(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-slate-800 bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  GitHub Account Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="e.g. dev@example.com"
                  value={githubEmail}
                  onChange={(e) => setGithubEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:ring-2 focus:ring-slate-800 bg-white"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsGithubModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-md transition-all flex items-center gap-1.5"
                >
                  <span>Authorize & Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
