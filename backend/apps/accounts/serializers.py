# apps/accounts/serializers.py

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from .models import CustomUser, UserProfile, UserAddress, UserActivity

# -----------------------------
# User Registration
# -----------------------------
class UserRegistrationSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        label='آدرس ایمیل',
        help_text='لطفا یک ایمیل معتبر وارد کنید'
    )
    full_name = serializers.CharField(
        required=True,
        allow_blank=False,
        label='نام و نام خانوادگی',
        help_text='لطفا نام و نام خانوادگی خود را وارد کنید',
        error_messages={
            'blank': 'لطفا نام و نام خانوادگی را وارد کنید',
            'required': 'وارد کردن نام و نام خانوادگی الزامی است'
        }
    )
    phone = serializers.CharField(
        required=True,
        allow_blank=False,
        label='شماره تلفن همراه',
        help_text='مثال: 09123456789',
        max_length=20,
        error_messages={
            'blank': 'لطفا شماره تلفن همراه را وارد کنید',
            'required': 'وارد کردن شماره تلفن همراه الزامی است',
            'max_length': 'شماره تلفن نباید بیشتر از ۲۰ کاراکتر باشد'
        }
    )
    password = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label='رمز عبور',
        help_text='رمز عبور باید حداقل ۸ کاراکتر و شامل حروف و اعداد باشد',
        min_length=8,
        error_messages={
            'min_length': 'رمز عبور باید حداقل ۸ کاراکتر باشد',
            'blank': 'لطفا رمز عبور را وارد کنید',
            'required': 'وارد کردن رمز عبور الزامی است'
        }
    )
    password_confirm = serializers.CharField(
        write_only=True,
        required=True,
        style={'input_type': 'password'},
        label='تکرار رمز عبور',
        help_text='لطفا رمز عبور را مجددا وارد کنید'
    )

    class Meta:
        model = CustomUser
        fields = ['email', 'full_name', 'phone', 'password', 'password_confirm']
        extra_kwargs = {
            'email': {
                'error_messages': {
                    'invalid': 'لطفا یک ایمیل معتبر وارد کنید',
                    'required': 'وارد کردن ایمیل الزامی است',
                    'blank': 'لطفا ایمیل را وارد کنید'
                }
            }
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({'password_confirm': 'رمزهای عبور یکسان نیستند.'})
        try:
            validate_password(attrs['password'])
        except ValidationError as e:
            raise serializers.ValidationError({'password': list(e.messages)})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        password = validated_data.pop('password')
        # Set default role to customer for security
        validated_data['role'] = 'customer'
        user = CustomUser.objects.create_user(password=password, **validated_data)
        UserProfile.objects.get_or_create(user=user)
        return user

# -----------------------------
# User Login
# -----------------------------
class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(style={'input_type': 'password'}, trim_whitespace=False)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        if not email or not password:
            raise serializers.ValidationError('لطفا ایمیل و رمز عبور را وارد کنید.', code='authorization')

        try:
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError('ایمیل یا رمز عبور اشتباه است.', code='authorization')

        if not user.check_password(password):
            raise serializers.ValidationError('ایمیل یا رمز عبور اشتباه است.', code='authorization')

        if not user.is_active:
            raise serializers.ValidationError('حساب کاربری غیرفعال است.', code='authorization')

        UserProfile.objects.get_or_create(user=user)
        attrs['user'] = user
        return attrs

# -----------------------------
# User Profile
# -----------------------------
class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = [
            'id', 'user', 'bio', 'avatar', 'job_title', 'department', 'linkedin', 'instagram', 
            'telegram', 'discount_percentage', 'total_orders', 'total_spent', 
            'notes', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at', 'total_orders', 'total_spent']

# -----------------------------
# Change Password
# -----------------------------
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(required=True, write_only=True)
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({'new_password_confirm': 'رمزهای عبور یکسان نیستند.'})
        try:
            validate_password(attrs['new_password'])
        except ValidationError as e:
            raise serializers.ValidationError({'new_password': list(e.messages)})
        return attrs

# -----------------------------
# User Address
# -----------------------------
class UserAddressSerializer(serializers.ModelSerializer):
    user_profile = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = UserAddress
        fields = [
            'id', 'user_profile', 'title', 'full_name', 'phone', 'province', 
            'city', 'address', 'postal_code', 'is_default', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user_profile', 'created_at', 'updated_at']

# -----------------------------
# User Activity
# -----------------------------
class UserActivitySerializer(serializers.ModelSerializer):
    activity_type_display = serializers.CharField(source='get_activity_type_display', read_only=True)
    
    class Meta:
        model = UserActivity
        fields = ['id', 'activity_type', 'activity_type_display', 'description', 'created_at']
        read_only_fields = ['id', 'created_at']

# -----------------------------
# Admin User
# -----------------------------
class AdminUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'email', 'full_name', 'phone', 'company', 'is_active', 'is_staff']


# =============================
# NXTBN-STYLE SERIALIZERS
# =============================

class UserSerializer(serializers.ModelSerializer):
    """
    سریالایزر اصلی کاربر با آمار (nxtbn-style)
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    total_orders = serializers.IntegerField(source='total_order_count', read_only=True)
    pending_orders = serializers.IntegerField(source='total_pending_order_count', read_only=True)
    cancelled_orders = serializers.IntegerField(source='total_cancelled_order_count', read_only=True)
    completed_orders = serializers.IntegerField(source='total_completed_order_count', read_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'role', 'role_display', 'avatar',
            'is_store_admin', 'is_store_staff', 'is_staff', 'is_active',
            'email_verified', 'date_joined', 'updated_at',
            'total_orders', 'pending_orders', 'cancelled_orders', 'completed_orders'
        ]
        read_only_fields = [
            'id', 'date_joined', 'updated_at', 'email_verified',
            'total_orders', 'pending_orders', 'cancelled_orders', 'completed_orders'
        ]


class UserStatsSerializer(serializers.Serializer):
    """
    سریالایزر برای آمار کاربر (nxtbn-style)
    """
    total_orders = serializers.IntegerField()
    pending_orders = serializers.IntegerField()
    cancelled_orders = serializers.IntegerField()
    completed_orders = serializers.IntegerField()
    total_spent = serializers.IntegerField()
    discount_percentage = serializers.IntegerField()
    addresses_count = serializers.IntegerField()


class UserUpdateSerializer(serializers.ModelSerializer):
    """
    سریالایزر برای ویرایش پروفایل کاربر (nxtbn-style)
    """
    class Meta:
        model = CustomUser
        fields = ['first_name', 'last_name', 'phone', 'avatar']


class UserAdminSerializer(serializers.ModelSerializer):
    """
    سریالایزر برای مدیریت کاربران توسط ادمین (nxtbn-style)
    """
    full_name = serializers.CharField(source='get_full_name', read_only=True)
    role_display = serializers.CharField(source='get_role_display', read_only=True)
    total_orders = serializers.IntegerField(source='total_order_count', read_only=True)
    
    class Meta:
        model = CustomUser
        fields = [
            'id', 'email', 'first_name', 'last_name', 'full_name',
            'phone', 'role', 'role_display', 'avatar',
            'is_store_admin', 'is_store_staff', 'is_staff', 'is_active',
            'is_superuser', 'email_verified', 'date_joined', 'total_orders'
        ]
        read_only_fields = ['id', 'date_joined', 'total_orders']


# -----------------------------
# Wallet Serializers
# -----------------------------
from .models import Wallet, WalletTransaction

class WalletTransactionSerializer(serializers.ModelSerializer):
    transaction_type_display = serializers.CharField(source='get_transaction_type_display', read_only=True)
    
    class Meta:
        model = WalletTransaction
        fields = ['id', 'amount', 'transaction_type', 'transaction_type_display', 'description', 'created_at']
        read_only_fields = ['id', 'created_at', 'transaction_type_display']

class WalletSerializer(serializers.ModelSerializer):
    transactions = WalletTransactionSerializer(many=True, read_only=True)
    
    class Meta:
        model = Wallet
        fields = ['id', 'balance', 'updated_at', 'transactions']
        read_only_fields = ['id', 'balance', 'updated_at', 'transactions']


# -----------------------------
# Security Serializers
# -----------------------------
from .models import UserSession, SecurityLog

class UserSessionSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    
    class Meta:
        model = UserSession
        fields = [
            'id', 'user', 'user_email', 'session_key', 'ip_address',
            'device_type', 'location', 'is_active', 'last_activity', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'last_activity', 'created_at']


class SecurityLogSerializer(serializers.ModelSerializer):
    user_email = serializers.EmailField(source='user.email', read_only=True)
    action_display = serializers.CharField(source='get_action_display', read_only=True)
    
    class Meta:
        model = SecurityLog
        fields = [
            'id', 'user', 'user_email', 'action', 'action_display',
            'ip_address', 'user_agent', 'details', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']
