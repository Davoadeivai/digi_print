from django.db import models


class UserRole(models.TextChoices):
    """
    نقش‌های کاربری در سیستم
    """
    CUSTOMER = 'customer', 'مشتری'
    ADMIN = 'admin', 'مدیر کل'
    STAFF = 'staff', 'کارمند'
    MANAGER = 'manager', 'مدیر'


class PermissionsEnum(models.TextChoices):
    """
    مجوزهای سفارشی سیستم
    """
    # Order Permissions
    CAN_APPROVE_ORDER = "can_approve_order", "تایید سفارش"
    CAN_CANCEL_ORDER = "can_cancel_order", "لغو سفارش"
    CAN_SHIP_ORDER = "can_ship_order", "ارسال سفارش"
    CAN_PACK_ORDER = "can_pack_order", "بسته‌بندی سفارش"
    CAN_DELIVER_ORDER = "can_deliver_order", "تحویل سفارش"
    CAN_UPDATE_ORDER_PAYMENT_TERM = "can_update_order_payment_term", "تغییر شرایط پرداخت"
    CAN_UPDATE_ORDER_PAYMENT_METHOD = "can_update_order_payment_method", "تغییر روش پرداخت"
    CAN_FULFILL_ORDER = "can_fulfill_order", "تکمیل مستقیم سفارش"
    
    # Payment Permissions
    CAN_INITIATE_PAYMENT_REFUND = "can_initiate_payment_refund", "بازپرداخت"
    
    # Product Permissions
    CAN_BULK_PRODUCT_STATUS_UPDATE = "can_bulk_product_status_update", "تغییر وضعیت دسته‌جمعی محصولات"
    CAN_BULK_PRODUCT_DELETE = "can_bulk_product_delete", "حذف دسته‌جمعی محصولات"
    
    # Stock Permissions
    CAN_RECEIVE_TRANSFERRED_STOCK = "can_receive_transferred_stock", "دریافت انبار منتقل شده"
    CAN_MARK_STOCK_TRANSFER_AS_COMPLETED = "can_mark_stock_transfer_as_completed", "تکمیل انتقال انبار"
    
    # Customer Permissions
    CAN_READ_CUSTOMER = "can_read_customer", "مشاهده مشتریان"
    CAN_UPDATE_CUSTOMER = "can_update_customer", "ویرایش مشتریان"
    CAN_DELETE_CUSTOMER = "can_delete_customer", "حذف مشتریان"
    
    # Service Permissions (برای Daidi_print)
    CAN_MANAGE_SERVICES = "can_manage_services", "مدیریت خدمات"
    CAN_MANAGE_PORTFOLIO = "can_manage_portfolio", "مدیریت نمونه کارها"
    CAN_VIEW_ANALYTICS = "can_view_analytics", "مشاهده آمار"


# نقش‌ها و مجوزهای مرتبط
ROLE_PERMISSIONS = {
    UserRole.CUSTOMER: [
        # مشتری فقط می‌تواند سفارشات خود را مشاهده کند
    ],
    UserRole.STAFF: [
        PermissionsEnum.CAN_APPROVE_ORDER,
        PermissionsEnum.CAN_SHIP_ORDER,
        PermissionsEnum.CAN_PACK_ORDER,
        PermissionsEnum.CAN_DELIVER_ORDER,
        PermissionsEnum.CAN_FULFILL_ORDER,
        PermissionsEnum.CAN_READ_CUSTOMER,
    ],
    UserRole.MANAGER: [
        PermissionsEnum.CAN_APPROVE_ORDER,
        PermissionsEnum.CAN_CANCEL_ORDER,
        PermissionsEnum.CAN_SHIP_ORDER,
        PermissionsEnum.CAN_PACK_ORDER,
        PermissionsEnum.CAN_DELIVER_ORDER,
        PermissionsEnum.CAN_UPDATE_ORDER_PAYMENT_TERM,
        PermissionsEnum.CAN_UPDATE_ORDER_PAYMENT_METHOD,
        PermissionsEnum.CAN_FULFILL_ORDER,
        PermissionsEnum.CAN_READ_CUSTOMER,
        PermissionsEnum.CAN_UPDATE_CUSTOMER,
        PermissionsEnum.CAN_MANAGE_SERVICES,
        PermissionsEnum.CAN_MANAGE_PORTFOLIO,
        PermissionsEnum.CAN_VIEW_ANALYTICS,
    ],
    UserRole.ADMIN: [
        # Admin has all permissions
        PermissionsEnum.CAN_APPROVE_ORDER,
        PermissionsEnum.CAN_CANCEL_ORDER,
        PermissionsEnum.CAN_SHIP_ORDER,
        PermissionsEnum.CAN_PACK_ORDER,
        PermissionsEnum.CAN_DELIVER_ORDER,
        PermissionsEnum.CAN_UPDATE_ORDER_PAYMENT_TERM,
        PermissionsEnum.CAN_UPDATE_ORDER_PAYMENT_METHOD,
        PermissionsEnum.CAN_FULFILL_ORDER,
        PermissionsEnum.CAN_INITIATE_PAYMENT_REFUND,
        PermissionsEnum.CAN_BULK_PRODUCT_STATUS_UPDATE,
        PermissionsEnum.CAN_BULK_PRODUCT_DELETE,
        PermissionsEnum.CAN_RECEIVE_TRANSFERRED_STOCK,
        PermissionsEnum.CAN_MARK_STOCK_TRANSFER_AS_COMPLETED,
        PermissionsEnum.CAN_READ_CUSTOMER,
        PermissionsEnum.CAN_UPDATE_CUSTOMER,
        PermissionsEnum.CAN_DELETE_CUSTOMER,
        PermissionsEnum.CAN_MANAGE_SERVICES,
        PermissionsEnum.CAN_MANAGE_PORTFOLIO,
        PermissionsEnum.CAN_VIEW_ANALYTICS,
    ],
}
