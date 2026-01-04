import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../providers/AuthProvider";
import Swal from "sweetalert2";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Loader2,
  UserPlus,
  Image as ImageIcon,
} from "lucide-react";
import axios from "axios";
import { uploadImageCurrent } from "../utils/imageUpload";

export default function Register() {
  const { register, googleLogin } = useAuth();
  const nav = useNavigate();

  const [busy, setBusy] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [form, set] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    setPasswordError("");

    // Password Validation
    const password = form.password;
    if (password.length < 6) {
      setPasswordError("Length must be at least 6 characters");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setPasswordError("Must have an Uppercase letter in the password");
      return;
    }
    if (!/[a-z]/.test(password)) {
      setPasswordError("Must have a Lowercase letter in the password");
      return;
    }

    try {
      setBusy(true);

      let photoURL = "";
      if (selectedImage) {
        photoURL = await uploadImageCurrent(selectedImage);
        if (!photoURL) {
          throw new Error("Image upload failed");
        }
      }

      await register({ ...form, photoURL });

      // Save user to backend
      const userInfo = {
        name: form.name,
        email: form.email,
        photoURL: photoURL || "",
      };
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/users`,
        userInfo
      );

      await Swal.fire({
        title: "Account Created!",
        text: "Welcome to Artify 🎨",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      nav("/", { replace: true });
    } catch (err) {
      console.error(err);
      Swal.fire({
        title: "Signup Failed",
        text: err?.message || "Something went wrong",
        icon: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    try {
      setBusy(true);
      const res = await googleLogin();

      // Save user to backend
      const userInfo = {
        name: res.user?.displayName || res.user?.email?.split("@")[0],
        email: res.user?.email,
        photoURL: res.user?.photoURL || "",
      };
      await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:3000"}/users`,
        userInfo
      );

      await Swal.fire({
        title: "Signed up with Google!",
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      });
      nav("/", { replace: true });
    } catch (err) {
      Swal.fire({
        title: "Google Sign-in Failed",
        text: err?.message || "Please try again",
        icon: "error",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-120px)] pt-32 grid place-items-center px-4 py-16 bg-base-200">
      {/* Card (same as Login) */}
      <div
        className="
          w-full max-w-md rounded-2xl border
          bg-base-100 text-base-content
          shadow-lg
          border-primary/20
          dark:border-primary
        "
      >
        <div className="p-6 sm:p-8">
          <h1 className="text-3xl font-extrabold mb-2">Create Account</h1>
          <p className="opacity-70 mb-6">
            Join Artify and start sharing your creativity.
          </p>

          <form onSubmit={submit} className="grid gap-4">
            {/* Name */}
            <label className="block text-sm font-semibold">Name</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
                <User size={18} />
              </span>
              <input
                type="text"
                placeholder="Your name"
                className="input input-bordered w-full pl-10"
                value={form.name}
                onChange={(e) => set({ ...form, name: e.target.value })}
                disabled={busy}
                required
              />
            </div>

            {/* Email */}
            <label className="block text-sm font-semibold mt-2">Email</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
                <Mail size={18} />
              </span>
              <input
                type="email"
                placeholder="you@example.com"
                className="input input-bordered w-full pl-10"
                value={form.email}
                onChange={(e) => set({ ...form, email: e.target.value })}
                disabled={busy}
                autoComplete="email"
                required
              />
            </div>

            {/* Password */}
            <label className="block text-sm font-semibold mt-2">Password</label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
                <Lock size={18} />
              </span>
              <input
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                className={`input input-bordered w-full pl-10 pr-10 ${
                  passwordError ? "input-error" : ""
                }`}
                value={form.password}
                onChange={(e) => {
                  set({ ...form, password: e.target.value });
                  if (passwordError) setPasswordError("");
                }}
                disabled={busy}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 opacity-80 hover:opacity-100"
                aria-label={showPass ? "Hide password" : "Show password"}
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {passwordError && (
              <span className="text-error text-xs">{passwordError}</span>
            )}

            {/* Photo Upload */}
            <label className="block text-sm font-semibold mt-2">
              Profile Photo (Optional)
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 opacity-70">
                <ImageIcon size={18} />
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input file-input-bordered w-full pl-10"
                disabled={busy}
              />
            </div>

            {/* Submit */}
            <button className="btn btn-primary w-full mt-2" disabled={busy}>
              {busy ? (
                <>
                  <Loader2 className="animate-spin" size={18} />
                  Creating…
                </>
              ) : (
                <>
                  <UserPlus size={18} />
                  Create Account
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-base-content/20" />
            <span className="text-sm opacity-70">Or with</span>
            <div className="h-px flex-1 bg-base-content/20" />
          </div>

          {/* Google (outline) */}
          <button
            type="button"
            onClick={handleGoogle}
            className="
              btn w-full
              btn-outline
              border-primary text-primary
              hover:bg-transparent
            "
            disabled={busy}
          >
            {busy ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Connecting…
              </>
            ) : (
              <>
                {/* Simple Google G */}
                <svg
                  viewBox="0 0 533.5 544.3"
                  width="18"
                  height="18"
                  aria-hidden
                >
                  <path
                    fill="#4285f4"
                    d="M533.5 278.4c0-18.6-1.7-36.5-4.9-53.8H272v101.7h147.2c-6.3 34.2-25 63.1-53.1 82.5v68h85.9c50.3-46.4 81.5-114.8 81.5-198.4z"
                  />
                  <path
                    fill="#34a853"
                    d="M272 544.3c72.9 0 134.2-24.2 178.9-65.5l-85.9-68c-23.8 16-54.2 25.6-93 25.6-71.5 0-132.1-48.2-153.8-113.1H28.7v70.9c44.4 88 136 150.1 243.3 150.1z"
                  />
                  <path
                    fill="#fbbc04"
                    d="M118.2 323.2c-10.8-32.3-10.8-67.1 0-99.4V152.9H28.7C10.4 190.5 0 232.4 0 278.4s10.4 87.9 28.7 125.5l89.5-70.7z"
                  />
                  <path
                    fill="#ea4335"
                    d="M272 108.2c39.6-.6 77.3 14.9 105.9 42.8l79.1-79.1C406.1 26.3 343.6 0 272 0 164.7 0 73 62.1 28.7 150.2l89.5 70.7C139.9 156 200.5 108.2 272 108.2z"
                  />
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* Footer */}
          <p className="mt-6 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-primary">
              Login
            </Link>
          </p>
        </div>
      </div>

      {/* fullscreen overlay while busy */}
      {busy && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 backdrop-blur-sm">
          <span className="loading loading-ring loading-lg text-primary" />
          <p className="mt-3 text-white">Please wait…</p>
        </div>
      )}
    </div>
  );
}
