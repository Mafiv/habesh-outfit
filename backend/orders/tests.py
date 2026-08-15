from django.test import SimpleTestCase

from orders.services import (
    calculate_totals,
    validate_promocode,
    get_promo_rate,
    merge_cart_items,
    validate_stock,
)
from orders.models import CartItem


class PromoServiceTests(SimpleTestCase):
    def test_valid_promocode(self):
        result = validate_promocode('SAVE10')
        self.assertTrue(result['valid'])
        self.assertEqual(result['discount'], 0.10)

    def test_invalid_promocode(self):
        result = validate_promocode('INVALID')
        self.assertFalse(result['valid'])

    def test_promo_case_insensitive(self):
        self.assertEqual(get_promo_rate('save10'), 0.10)


class TotalsServiceTests(SimpleTestCase):
    def test_free_shipping_over_threshold(self):
        items = [{'price': 60, 'quantity': 1}]
        totals = calculate_totals(items)
        self.assertEqual(totals['shipping'], 0)
        self.assertEqual(totals['total'], 60)

    def test_shipping_under_threshold(self):
        items = [{'price': 30, 'quantity': 1}]
        totals = calculate_totals(items)
        self.assertEqual(totals['shipping'], 9.99)
        self.assertEqual(totals['total'], 39.99)

    def test_discount_applied(self):
        items = [{'price': 100, 'quantity': 1}]
        totals = calculate_totals(items, 'SAVE10')
        self.assertEqual(totals['discount'], 10.0)
        self.assertEqual(totals['total'], 90.0)


class CartMergeTests(SimpleTestCase):
    def test_merge_same_item_increments_quantity(self):
        existing = [
            CartItem(
                product_id='abc',
                title='Shirt',
                size='M',
                color='Red',
                quantity=1,
                price=50,
            )
        ]
        incoming = [
            CartItem(
                product_id='abc',
                title='Shirt',
                size='M',
                color='Red',
                quantity=2,
                price=50,
            )
        ]
        merged = merge_cart_items(existing, incoming)
        self.assertEqual(len(merged), 1)
        self.assertEqual(merged[0].quantity, 3)


class ValidateStockTests(SimpleTestCase):
    def test_empty_items_no_errors(self):
        self.assertEqual(validate_stock([]), [])
