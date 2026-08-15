import { Routes, Route, Navigate } from 'react-router-dom'
import { BottomNav } from './components/BottomNav'
import { ProtectedRoute } from './components/ProtectedRoute'
import { HomePage } from './pages/HomePage'
import { ShopPage } from './pages/ShopPage'
import { CatalogPage } from './pages/CatalogPage'
import { FiltersPage } from './pages/FiltersPage'
import { SearchPage } from './pages/SearchPage'
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
import { OrdersPage, OrderTrackingPage } from './pages/OrdersPage'
import { AddressesPage } from './pages/AddressesPage'
import { PaymentMethodsPage } from './pages/PaymentMethodsPage'
import { PromocodesPage } from './pages/PromocodesPage'
import { AdminPage } from './pages/AdminPage'
import { ReviewsPage } from './pages/ReviewsPage'

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen surface-page page-mesh">
      <main className="max-w-lg mx-auto min-h-screen relative">
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
      <Route path="/success" element={<SuccessPage />} />
      <Route path="/admin" element={<AdminPage />} />

      <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
      <Route path="/search" element={<AppLayout><SearchPage /></AppLayout>} />
      <Route path="/shop" element={<AppLayout><ShopPage /></AppLayout>} />
      <Route path="/catalog/:gender" element={<AppLayout><CatalogPage /></AppLayout>} />
      <Route path="/catalog/:gender/:subcategory" element={<AppLayout><CatalogPage /></AppLayout>} />
      <Route path="/catalog/:gender/:subcategory/filters" element={<FiltersPage />} />
      <Route path="/product/:id" element={<ProductDetailPage />} />
      <Route path="/bag" element={<AppLayout><CartPage /></AppLayout>} />
      <Route path="/favorites" element={<AppLayout><FavoritesPage /></AppLayout>} />
      <Route path="/profile" element={<AppLayout><ProfilePage /></AppLayout>} />

      <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute><AppLayout><OrdersPage /></AppLayout></ProtectedRoute>} />
      <Route path="/orders/:orderId" element={<ProtectedRoute><AppLayout><OrderTrackingPage /></AppLayout></ProtectedRoute>} />
      <Route path="/addresses" element={<ProtectedRoute><AppLayout><AddressesPage /></AppLayout></ProtectedRoute>} />
      <Route path="/payment-methods" element={<ProtectedRoute><AppLayout><PaymentMethodsPage /></AppLayout></ProtectedRoute>} />
      <Route path="/promocodes" element={<ProtectedRoute><AppLayout><PromocodesPage /></AppLayout></ProtectedRoute>} />
      <Route path="/reviews" element={<ProtectedRoute><AppLayout><ReviewsPage /></AppLayout></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
