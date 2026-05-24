import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import { AuthProvider } from './hooks/useAuth';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/app/Dashboard';
import Clients from './pages/app/Clients';
import ClientDetail from './pages/app/ClientDetail';
import Invoices from './pages/app/Invoices';
import CreateInvoice from './pages/app/CreateInvoice';
import InvoiceDetail from './pages/app/InvoiceDetail';
import Receipts from './pages/app/Receipts';
import ReceiptDetail from './pages/app/ReceiptDetail';
import Settings from './pages/app/Settings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/app"
            element={
              <ProtectedRoute>
                <Navigate to="/app/dashboard" replace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/dashboard"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Dashboard />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/invoices"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Invoices />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/invoices/new"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <CreateInvoice />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/invoices/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <InvoiceDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/clients"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Clients />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/clients/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ClientDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/receipts"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Receipts />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/receipts/:id"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <ReceiptDetail />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/app/settings"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Settings />
                </AppLayout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid var(--paymint-surface-border)',
              color: 'var(--paymint-text-primary)',
              fontSize: '14px',
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
