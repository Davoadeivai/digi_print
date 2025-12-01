from django.core.management.base import BaseCommand
from decimal import Decimal
from apps.products.models import ProductCategory, Product, PaperType, ProductPaperType, PricingRule


class Command(BaseCommand):
    help = 'ایجاد محصولات لیبل و برچسب'

    def handle(self, *args, **options):
        self.stdout.write('در حال ایجاد دسته‌بندی و محصولات لیبل...')

        # ایجاد دسته‌بندی اصلی لیبل
        label_category, created = ProductCategory.objects.get_or_create(
            slug='label',
            defaults={
                'name': 'لیبل و برچسب',
                'description': 'انواع لیبل، برچسب و استیکر برای مصارف مختلف',
                'is_active': True
            }
        )

        if created:
            self.stdout.write(self.style.SUCCESS(f'دسته‌بندی "{label_category.name}" ایجاد شد'))
        else:
            self.stdout.write(f'دسته‌بندی "{label_category.name}" از قبل وجود داشت')

        # ایجاد زیردسته‌ها
        subcategories = [
            {
                'name': 'لیبل دیجیتال',
                'slug': 'label-digital',
                'description': 'چاپ لیبل دیجیتال فوری با تحویل 2 ساعته'
            },
            {
                'name': 'لیبل افست',
                'slug': 'label-offset',
                'description': 'چاپ لیبل افست برای تیراژ بالا با قیمت ارزان'
            },
            {
                'name': 'استیکر و برچسب',
                'slug': 'stickers',
                'description': 'انواع استیکر و برچسب برای مصارف مختلف'
            },
            {
                'name': 'لیبل‌های خاص',
                'slug': 'special-labels',
                'description': 'لیبل‌های خاص با اشکال و جنس‌های متنوع'
            }
        ]

        created_subcategories = {}
        for subcat_data in subcategories:
            subcat, created = ProductCategory.objects.get_or_create(
                slug=subcat_data['slug'],
                defaults={
                    'name': subcat_data['name'],
                    'description': subcat_data['description'],
                    'parent': label_category,
                    'is_active': True
                }
            )
            created_subcategories[subcat_data['slug']] = subcat
            if created:
                self.stdout.write(self.style.SUCCESS(f'زیردسته‌بندی "{subcat.name}" ایجاد شد'))

        # ایجاد کاغذهای خاص برای لیبل
        papers = [
            {
                'name': 'کاغذ لیلمت معمولی',
                'slug': 'label-paper-normal',
                'description': 'کاغذ لیلمت معمولی برای برچسب‌های اداری',
                'gram_weight': 80,
                'price_per_sheet': Decimal('5000'),
                'is_fancy': False,
                'texture': 'صاف و مات'
            },
            {
                'name': 'کاغذ لیلمت براق',
                'slug': 'label-paper-glossy',
                'description': 'کاغذ لیلمت براق برای برچسب‌های تبلیغاتی',
                'gram_weight': 90,
                'price_per_sheet': Decimal('7000'),
                'is_fancy': False,
                'texture': 'براق و صیقلی'
            },
            {
                'name': 'PVC شیشه‌ای شفاف',
                'slug': 'pvc-glass-clear',
                'description': 'پلیمر PVC شفاف و ضد آب برای استیکرهای شیشه‌ای',
                'gram_weight': 150,
                'price_per_sheet': Decimal('15000'),
                'is_fancy': True,
                'texture': 'شفاف و صیقلی'
            },
            {
                'name': 'PVC سفید مات',
                'slug': 'pvc-white-matte',
                'description': 'پلیمر PVC سفید مات و ضد آب برای استیکرهای مقاوم',
                'gram_weight': 160,
                'price_per_sheet': Decimal('14000'),
                'is_fancy': True,
                'texture': 'مات و مقاوم'
            },
            {
                'name': 'پلیمر ژله‌ای',
                'slug': 'jelly-polymer',
                'description': 'پلیمر نرم و ژله‌ای برای استیکرهای جذاب',
                'gram_weight': 120,
                'price_per_sheet': Decimal('12000'),
                'is_fancy': True,
                'texture': 'نرم و ژله‌ای'
            },
            {
                'name': 'استیکر طلایی',
                'slug': 'golden-sticker',
                'description': 'استیکر با روکش طلایی برای کارهای لوکس',
                'gram_weight': 140,
                'price_per_sheet': Decimal('20000'),
                'is_fancy': True,
                'texture': 'طلایی و براق'
            }
        ]

        created_papers = {}
        for paper_data in papers:
            paper, created = PaperType.objects.get_or_create(
                slug=paper_data['slug'],
                defaults={
                    'name': paper_data['name'],
                    'description': paper_data['description'],
                    'gram_weight': paper_data['gram_weight'],
                    'price_per_sheet': paper_data['price_per_sheet'],
                    'is_fancy': paper_data['is_fancy'],
                    'texture': paper_data['texture'],
                    'is_active': True
                }
            )
            created_papers[paper_data['slug']] = paper
            if created:
                self.stdout.write(self.style.SUCCESS(f'کاغذ "{paper.name}" ایجاد شد'))

        # ایجاد محصولات لیبل
        products = [
            # لیبل دیجیتال
            {
                'name': 'چاپ لیبل دیجیتال معمولی',
                'slug': 'label-digital-normal',
                'category': created_subcategories['label-digital'],
                'description': 'چاپ لیبل دیجیتال با کیفیت بالا و تحویل فوری. مناسب برای تیراژهای کم تا متوسط. امکان چاپ در هر ابعاد و طرحی.',
                'short_description': 'چاپ لیبل دیجیتال فوری با تحویل 2 ساعته',
                'print_type': 'digital',
                'min_quantity': 10,
                'max_quantity': 5000,
                'delivery_time_hours': 2,
                'base_price': Decimal('15000'),
                'price_per_extra': Decimal('1200'),
                'has_design_service': True,
                'has_online_calculator': True,
                'has_file_upload': True,
                'papers': ['label-paper-normal', 'label-paper-glossy']
            },
            {
                'name': 'چاپ لیبل دیجیتال PVC',
                'slug': 'label-digital-pvc',
                'category': created_subcategories['label-digital'],
                'description': 'چاپ لیبل روی کاغذ PVC مقاوم و ضد آب. مناسب برای محصولاتی که نیاز به دوام بالا دارند. قابل شستشو و تمیز کردن.',
                'short_description': 'لیبل دیجیتال ضد آب و مقاوم',
                'print_type': 'digital',
                'min_quantity': 10,
                'max_quantity': 3000,
                'delivery_time_hours': 3,
                'base_price': Decimal('25000'),
                'price_per_extra': Decimal('2000'),
                'has_design_service': True,
                'has_online_calculator': True,
                'has_file_upload': True,
                'papers': ['pvc-glass-clear', 'pvc-white-matte']
            },
            {
                'name': 'استیکر لپتاپ',
                'slug': 'laptop-sticker',
                'category': created_subcategories['stickers'],
                'description': 'استیکر ویژه لپتاپ با کیفیت چاپ عالی و مقاومت بالا. ضد آب و قابل تمیز کردن. برش دقیق و طراحی جذاب.',
                'short_description': 'استیکر مخصوص لپتاپ با مقاومت بالا',
                'print_type': 'digital',
                'min_quantity': 1,
                'max_quantity': 100,
                'delivery_time_hours': 2,
                'base_price': Decimal('20000'),
                'price_per_extra': Decimal('5000'),
                'has_design_service': True,
                'has_online_calculator': True,
                'has_file_upload': True,
                'papers': ['pvc-glass-clear', 'pvc-white-matte', 'jelly-polymer']
            },
            {
                'name': 'استیکر طلایی',
                'slug': 'golden-sticker',
                'category': created_subcategories['stickers'],
                'description': 'استیکر با روکش طلایی و کیفیت بالا. مناسب برای برندها و کارهای لوکس. چاپ با رنگ‌های زنده و ماندگاری بالا.',
                'short_description': 'استیکر لوکس با روکش طلایی',
                'print_type': 'digital',
                'min_quantity': 5,
                'max_quantity': 500,
                'delivery_time_hours': 4,
                'base_price': Decimal('35000'),
                'price_per_extra': Decimal('6000'),
                'has_design_service': True,
                'has_online_calculator': True,
                'has_file_upload': True,
                'papers': ['golden-sticker']
            },
            # لیبل افست
            {
                'name': 'چاپ لیبل افست تیراژ بالا',
                'slug': 'label-offset-bulk',
                'category': created_subcategories['label-offset'],
                'description': 'چاپ لیبل افست برای تیراژهای بالا با قیمت بسیار ارزان. کیفیت چاپ عالی و رنگ‌های زنده. مناسب برای تولیدکنندگان.',
                'short_description': 'چاپ لیبل افست برای تیراژ بالا با قیمت ارزان',
                'print_type': 'offset',
                'min_quantity': 1000,
                'max_quantity': 50000,
                'delivery_time_hours': 48,
                'base_price': Decimal('800000'),
                'price_per_extra': Decimal('700'),
                'has_design_service': True,
                'has_online_calculator': True,
                'has_file_upload': True,
                'papers': ['label-paper-normal', 'label-paper-glossy']
            },
            {
                'name': 'چاپ لیبل صنعتی',
                'slug': 'industrial-label',
                'category': created_subcategories['label-offset'],
                'description': 'چاپ لیبل صنعتی با مقاومت بالا برای کارخانه‌ها و تولیدکنندگان. مقاوم در برابر حرارت، رطوبت و مواد شیمیایی.',
                'short_description': 'لیبل صنعتی مقاوم برای تولیدکنندگان',
                'print_type': 'offset',
                'min_quantity': 500,
                'max_quantity': 30000,
                'delivery_time_hours': 72,
                'base_price': Decimal('500000'),
                'price_per_extra': Decimal('800'),
                'has_design_service': True,
                'has_online_calculator': True,
                'has_file_upload': True,
                'papers': ['pvc-white-matte', 'pvc-glass-clear']
            },
            # لیبل‌های خاص
            {
                'name': 'لیبل ژله‌ای',
                'slug': 'jelly-label',
                'category': created_subcategories['special-labels'],
                'description': 'لیبل با بافت ژله‌ای نرم و جذاب. مناسب برای محصولات آرایشی، خوراکی و هدایا. حس لمسی عالی و ظاهری جذاب.',
                'short_description': 'لیبل بافت ژله‌ای نرم و جذاب',
                'print_type': 'digital',
                'min_quantity': 20,
                'max_quantity': 2000,
                'delivery_time_hours': 6,
                'base_price': Decimal('22000'),
                'price_per_extra': Decimal('1800'),
                'has_design_service': True,
                'has_online_calculator': True,
                'has_file_upload': True,
                'papers': ['jelly-polymer']
            },
            {
                'name': 'لیبل دایره‌ای',
                'slug': 'circle-label',
                'category': created_subcategories['special-labels'],
                'description': 'چاپ لیبل دایره‌ای با برش دقیق و کیفیت بالا. مناسب برای درب بطری‌ها، ظروف و محصولات دایره‌ای شکل.',
                'short_description': 'لیبل دایره‌ای با برش دقیق',
                'print_type': 'digital',
                'min_quantity': 10,
                'max_quantity': 3000,
                'delivery_time_hours': 3,
                'base_price': Decimal('18000'),
                'price_per_extra': Decimal('1500'),
                'has_design_service': True,
                'has_online_calculator': True,
                'has_file_upload': True,
                'papers': ['label-paper-normal', 'label-paper-glossy', 'pvc-white-matte']
            },
            {
                'name': 'برچسب اموال',
                'slug': 'asset-label',
                'category': created_subcategories['special-labels'],
                'description': 'برچسب اموال با چسبندگی قوی و ماندگاری بالا. مناسب برای اموال اداری و صنعتی. امکان چاپ شماره سریال و بارکد.',
                'short_description': 'برچسب اموال مقاوم و ماندگار',
                'print_type': 'digital',
                'min_quantity': 50,
                'max_quantity': 5000,
                'delivery_time_hours': 4,
                'base_price': Decimal('12000'),
                'price_per_extra': Decimal('800'),
                'has_design_service': True,
                'has_online_calculator': True,
                'has_file_upload': True,
                'papers': ['label-paper-normal', 'pvc-white-matte']
            },
            {
                'name': 'لیبل سی‌دی',
                'slug': 'cd-label',
                'category': created_subcategories['special-labels'],
                'description': 'لیبل مخصوص سی‌دی و دی‌وی‌دی با ابعاد استاندارد. چاپ با کیفیت بالا و چسبندگی مناسب روی سطح دیسک.',
                'short_description': 'لیبل مخصوص سی‌دی و دی‌وی‌دی',
                'print_type': 'digital',
                'min_quantity': 10,
                'max_quantity': 1000,
                'delivery_time_hours': 3,
                'base_price': Decimal('8000'),
                'price_per_extra': Decimal('600'),
                'has_design_service': True,
                'has_online_calculator': True,
                'has_file_upload': True,
                'papers': ['label-paper-glossy', 'pvc-white-matte']
            }
        ]

        for product_data in products:
            product, created = Product.objects.get_or_create(
                slug=product_data['slug'],
                defaults={
                    'name': product_data['name'],
                    'category': product_data['category'],
                    'description': product_data['description'],
                    'short_description': product_data['short_description'],
                    'print_type': product_data['print_type'],
                    'min_quantity': product_data['min_quantity'],
                    'max_quantity': product_data['max_quantity'],
                    'delivery_time_hours': product_data['delivery_time_hours'],
                    'base_price': product_data['base_price'],
                    'price_per_extra': product_data['price_per_extra'],
                    'has_design_service': product_data['has_design_service'],
                    'has_online_calculator': product_data['has_online_calculator'],
                    'has_file_upload': product_data['has_file_upload'],
                    'is_active': True,
                    'is_featured': product_data['slug'] in ['label-digital-normal', 'laptop-sticker', 'golden-sticker']
                }
            )

            if created:
                self.stdout.write(self.style.SUCCESS(f'محصول "{product.name}" ایجاد شد'))

                # اضافه کردن کاغذهای قابل استفاده
                for paper_slug in product_data['papers']:
                    if paper_slug in created_papers:
                        ProductPaperType.objects.get_or_create(
                            product=product,
                            paper_type=created_papers[paper_slug],
                            defaults={'is_default': paper_slug == product_data['papers'][0]}
                        )

                # ایجاد قوانین قیمت‌گذاری
                self._create_pricing_rules(product)

        self.stdout.write(self.style.SUCCESS('✅ تمام محصولات لیبل با موفقیت ایجاد شد!'))

    def _create_pricing_rules(self, product):
        """ایجاد قوانین قیمت‌گذاری برای محصول"""
        
        if product.print_type == 'digital':
            # قوانین قیمت‌گذاری برای چاپ دیجیتال
            rules = [
                (product.min_quantity, 50, product.base_price),
                (51, 200, product.base_price * Decimal('0.9')),
                (201, 1000, product.base_price * Decimal('0.85')),
                (1001, product.max_quantity, product.base_price * Decimal('0.8')),
            ]
        else:
            # قوانین قیمت‌گذاری برای چاپ افست
            rules = [
                (product.min_quantity, 2000, product.base_price * Decimal('0.95')),
                (2001, 5000, product.base_price * Decimal('0.9')),
                (5001, 10000, product.base_price * Decimal('0.85')),
                (10001, product.max_quantity, product.base_price * Decimal('0.8')),
            ]

        for min_qty, max_qty, price in rules:
            PricingRule.objects.get_or_create(
                product=product,
                min_quantity=min_qty,
                max_quantity=max_qty,
                defaults={
                    'price_per_unit': price,
                    'is_active': True
                }
            )
