import { Routes, Route, Navigate } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { CatalogPage } from './pages/CatalogPage'
import { FiltersPage } from './pages/FiltersPage'
import { ProductDetailPage } from './pages/ProductDetailPage'
import { CartPage } from './pages/CartPage'
import { CheckoutPage } from './pages/CheckoutPage'
import { SuccessPage } from './pages/SuccessPage'
import { LoginPage } from './pages/LoginPage'
import { SignUpPage } from './pages/SignUpPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { ProfilePage } from './pages/ProfilePage'
import { FavoritesPage } from './pages/FavoritesPage'
import { SettingsPage } from './pages/SettingsPage'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <main className="max-w-lg mx-auto min-h-screen bg-[#f5f5f5] relative">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/success" element={<SuccessPage />} />

      <Route
        path="/"
        element={
          <AppLayout>
            <HomePage />
          </AppLayout>
        }
      />
      <Route
        path="/shop"
        element={
          <AppLayout>
            <ShopPage />
          </AppLayout>
        }
      />
      <Route
        path="/catalog/:gender"
        element={
          <AppLayout>
            <CatalogPage />
          </AppLayout>
        }
      />
      <Route
        path="/catalog/:gender/:subcategory"
        element={
          <AppLayout>
            <CatalogPage />
          </AppLayout>
        }
      />
      <Route
        path="/catalog/:gender/:subcategory/filters"
        element={<FiltersPage />}
      />
      <Route
        path="/product/:id"
        element={<ProductDetailPage />}
      />
      <Route
        path="/bag"
        element={
          <AppLayout>
            <CartPage />
          </AppLayout>
        }
      />
      <Route
        path="/favorites"
        element={
          <AppLayout>
            <FavoritesPage />
          </AppLayout>
        }
      />
      <Route
        path="/profile"
        element={
          <AppLayout>
            <ProfilePage />
          </AppLayout>
        }
      />
      <Route
        path="/settings"
        element={
          <AppLayout>
            <SettingsPage />
          </AppLayout>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
