/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Landing from "./pages/Landing";
import Onboarding from "./pages/Onboarding";
import Plan from "./pages/Plan";
import ShoppingList from "./pages/ShoppingList";
import PaymentVerify from "./pages/PaymentVerify";
import Settings from "./pages/Settings";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import MealDetail from "./pages/MealDetail";
import Login from "./pages/Login";
import { storage, migrateStorage } from "./lib/storage";
import { auth } from "./lib/auth";

migrateStorage();

function RequireAuth({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!auth.isLoggedIn()) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);
  
  if (!auth.isLoggedIn()) return null;
  return <>{children}</>;
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const profile = storage.getProfile();
  if (!profile) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-white font-vazirmatn">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<RequireAuth><Onboarding /></RequireAuth>} />
          <Route path="/plan" element={<RequireAuth><ProtectedRoute><Plan /></ProtectedRoute></RequireAuth>} />
          <Route path="/shoppingList" element={<RequireAuth><ProtectedRoute><ShoppingList /></ProtectedRoute></RequireAuth>} />
          <Route path="/settings" element={<RequireAuth><ProtectedRoute><Settings /></ProtectedRoute></RequireAuth>} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/meal" element={<RequireAuth><ProtectedRoute><MealDetail /></ProtectedRoute></RequireAuth>} />
          <Route path="/payment/verify" element={<PaymentVerify />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
