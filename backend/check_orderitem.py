import os

# مسیر فایل مدل orders
models_file = os.path.join(os.path.dirname(__file__), "apps/orders/models.py")

# محتوای کلاس OrderItem که باید اضافه شود
orderitem_class = """
class OrderItem(models.Model):
    order = models.ForeignKey('Order', on_delete=models.CASCADE, related_name='items')
    product = models.ForeignKey('products.Product', on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.product} x {self.quantity}"
"""

# بررسی وجود OrderItem در فایل
with open(models_file, "r", encoding="utf-8") as f:
    content = f.read()

if "class OrderItem" in content:
    print("OrderItem قبلاً وجود دارد ✅")
else:
    with open(models_file, "a", encoding="utf-8") as f:
        f.write("\n" + orderitem_class)
    print("OrderItem به models.py اضافه شد ✅")
