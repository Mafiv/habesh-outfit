from django.test import SimpleTestCase

from orders.services import validate_promocode, PROMO_CODES


class PromocodeViewLogicTests(SimpleTestCase):
    def test_all_promocodes_valid(self):
        for code in PROMO_CODES:
            result = validate_promocode(code)
            self.assertTrue(result['valid'])
            self.assertEqual(result['discount'], PROMO_CODES[code])
