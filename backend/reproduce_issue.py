
import os
import django
from decimal import Decimal

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from apps.products.models import Product, ProductCategory

def test_price_calculation():
    print("Testing price calculation...")
    
    # Create dummy category
    category, _ = ProductCategory.objects.get_or_create(
        name="Test Category", 
        slug="test-category",
        defaults={'description': 'Test'}
    )
    
    # Create dummy product
    product, _ = Product.objects.get_or_create(
        name="Test Label",
        slug="test-label",
        defaults={
            'category': category,
            'base_price': Decimal('1000'),
            'min_quantity': 100,
            'max_quantity': 1000,
            'price_per_extra': None,  # Force discount logic
            'description': 'Test',
            'short_description': 'Test'
        }
    )
    
    # Test calculation with quantity > min_quantity to trigger discount logic
    try:
        price = product.get_calculated_price(200)
        print(f"Price calculated successfully: {price}")
        print("✅ SUCCESS: Type error fixed.")
    except TypeError as e:
        print(f"❌ FAILED: TypeError occurred: {e}")
    except Exception as e:
        print(f"❌ FAILED: Unexpected error: {e}")

if __name__ == '__main__':
    test_price_calculation()
