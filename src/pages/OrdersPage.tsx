import { useNavigate, useParams } from 'react-router-dom'
import { Package, Truck, MapPin, CheckCircle2 } from 'lucide-react'
import { PageHeader } from '../components/PageHeader'
import { useOrders, useUserData } from '../context/UserDataContext'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import type { OrderStatus } from '../types'

const statusLabels: Record<OrderStatus, string> = {
  pending_payment: 'Awaiting Payment',
  processing: 'Processing',
  shipped: 'Shipped',
  in_transit: 'In Transit',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
}

const statusColors: Record<OrderStatus, string> = {
  pending_payment: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
  processing: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  shipped: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  in_transit: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  cancelled: 'bg-gray-100 text-gray-600 dark:bg-dark-elevated dark:text-muted',
}

const trackingSteps: { status: OrderStatus; label: string; icon: typeof Package }[] = [
  { status: 'processing', label: 'Order Placed', icon: Package },
  { status: 'shipped', label: 'Shipped', icon: Truck },
  { status: 'in_transit', label: 'In Transit', icon: MapPin },
  { status: 'delivered', label: 'Delivered', icon: CheckCircle2 },
]

const statusOrder: OrderStatus[] = ['processing', 'shipped', 'in_transit', 'delivered']

export function OrdersPage() {
  const navigate = useNavigate()
  const { orders } = useOrders()
  const { loading } = useUserData()

  if (loading) {
    return (
      <div className="pb-24 min-h-screen surface-page">
        <PageHeader title="My Orders" />
        <LoadingSpinner fullScreen label="Loading orders..." />
      </div>
    )
  }

  return (
    <div className="pb-24 min-h-screen surface-page">
      <PageHeader title="My Orders" />

      <div className="max-w-lg mx-auto px-4 py-4 space-y-3">
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <Package size={48} className="mx-auto text-muted mb-4" />
            <p className="font-bold">No orders yet</p>
            <p className="text-sm text-muted mt-1">Your order history will appear here</p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="mt-6 px-8 h-12 bg-primary text-white font-bold text-sm uppercase rounded-full"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <button
              key={order.id}
              type="button"
              onClick={() => navigate(`/orders/${order.mongoId || order.id}`)}
              className="w-full surface rounded-xl p-4 shadow-sm text-left border border-default"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold">{order.id}</p>
                  <p className="text-xs text-muted">{order.date}</p>
                </div>
                <span
                  className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${statusColors[order.status]}`}
                >
                  {statusLabels[order.status]}
                </span>
              </div>

              <div className="flex gap-2 mb-3">
                {order.items.slice(0, 3).map((item) => (
                  <img
                    key={item.productId}
                    src={item.image}
                    alt={item.title}
                    className="w-14 h-16 object-cover rounded-lg"
                  />
                ))}
                {order.items.length > 3 && (
                  <div className="w-14 h-16 rounded-lg bg-gray-100 dark:bg-dark-elevated flex items-center justify-center text-xs text-muted">
                    +{order.items.length - 3}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xs text-muted">
                  {order.items.length} item{order.items.length > 1 ? 's' : ''}
                </p>
                <p className="text-sm font-bold">${order.total.toFixed(2)}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  )
}

export function OrderTrackingPage() {
  const { orderId } = useParams()
  const { orders } = useOrders()
  const order = orders.find((o) => o.mongoId === orderId || o.id === orderId)

  if (!order) {
    return (
      <div className="min-h-screen surface-page flex items-center justify-center">
        <p className="text-muted">Order not found</p>
      </div>
    )
  }

  const currentIndex = statusOrder.indexOf(order.status)

  return (
    <div className="pb-24 min-h-screen surface-page">
      <PageHeader title="Track Order" />

      <div className="max-w-lg mx-auto px-4 py-6 space-y-6">
        <div className="surface rounded-xl p-4 border border-default">
          <p className="text-xs text-muted uppercase">Order ID</p>
          <p className="text-lg font-bold">{order.id}</p>
          <p className="text-xs text-muted mt-2">
            Tracking: <span className="font-mono font-semibold text-body">{order.trackingNumber}</span>
          </p>
        </div>

        {/* Tracking timeline */}
        <div className="surface rounded-xl p-4 border border-default">
          <h3 className="text-sm font-bold uppercase mb-6">Delivery Status</h3>
          <div className="space-y-0">
            {trackingSteps.map((step, i) => {
              const stepIndex = statusOrder.indexOf(step.status)
              const isComplete = stepIndex <= currentIndex
              const isCurrent = stepIndex === currentIndex
              const Icon = step.icon

              return (
                <div key={step.status} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        isComplete
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-dark-elevated text-muted'
                      } ${isCurrent ? 'ring-4 ring-primary/20' : ''}`}
                    >
                      <Icon size={18} />
                    </div>
                    {i < trackingSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-12 ${
                          stepIndex < currentIndex ? 'bg-primary' : 'bg-gray-200 dark:bg-dark-elevated'
                        }`}
                      />
                    )}
                  </div>
                  <div className="pb-8">
                    <p className={`text-sm font-semibold ${isComplete ? 'text-body' : 'text-muted'}`}>
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-primary font-medium mt-0.5">Current status</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order items */}
        <div className="surface rounded-xl p-4 border border-default">
          <h3 className="text-sm font-bold uppercase mb-4">Items</h3>
          <div className="space-y-3">
            {order.items.map((item) => (
              <div key={`${item.productId}-${item.size}`} className="flex gap-3">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-14 h-16 object-cover rounded-lg"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-muted uppercase">{item.brand}</p>
                  <p className="text-sm font-semibold truncate">{item.title}</p>
                  <p className="text-xs text-muted">Size: {item.size} · Qty: {item.quantity}</p>
                </div>
                <span className="text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-default mt-4 pt-4 space-y-1">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Total</span>
              <span className="font-bold">${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Shipping address */}
        <div className="surface rounded-xl p-4 border border-default">
          <h3 className="text-sm font-bold uppercase mb-3">Shipping To</h3>
          <p className="text-sm font-semibold">{order.address.name}</p>
          <p className="text-sm text-muted">{order.address.address}</p>
          <p className="text-sm text-muted">
            {order.address.city}, {order.address.zip}
          </p>
        </div>
      </div>
    </div>
  )
}
