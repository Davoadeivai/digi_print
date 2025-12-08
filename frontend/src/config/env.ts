/**
 * تنظیمات Environment Variables
 * این فایل متغیرهای محیطی را به صورت امن مدیریت می‌کند
 */

// Helper function برای دسترسی امن به environment variables
function getEnvVar(key: string, defaultValue: string): string {
  try {
    // بررسی امن import.meta و import.meta.env
    if (
      typeof import.meta !== 'undefined' &&
      import.meta !== null &&
      typeof (import.meta as any).env !== 'undefined' &&
      (import.meta as any).env !== null
    ) {
      const value = (import.meta as any).env[key];
      if (value !== undefined && value !== null && value !== '') {
        return String(value);
      }
    }
  } catch (error) {
    // اگر خطایی رخ داد، از مقدار پیش‌فرض استفاده می‌کنیم
    console.warn(`⚠️ Unable to read env var "${key}", using default:`, defaultValue);
  }
  
  return defaultValue;
}

// تنظیمات اصلی
export const ENV_CONFIG = {
  // API Base URL
  API_URL: getEnvVar('VITE_API_BASE_URL', 'http://127.0.0.1:8000/api/v1'),
  
  // App Settings
  APP_NAME: 'دیجی چاپوگراف',
  APP_VERSION: '1.0.0',
  
  // Development Mode
  IS_DEVELOPMENT: getEnvVar('MODE', 'development') === 'development',
  IS_PRODUCTION: getEnvVar('MODE', 'production') === 'production',
} as const;

// Export individual values for convenience
export const API_URL = ENV_CONFIG.API_URL;
export const APP_NAME = ENV_CONFIG.APP_NAME;
export const APP_VERSION = ENV_CONFIG.APP_VERSION;
export const IS_DEVELOPMENT = ENV_CONFIG.IS_DEVELOPMENT;
export const IS_PRODUCTION = ENV_CONFIG.IS_PRODUCTION;

// Log configuration
console.log('🔧 Environment Configuration:', {
  API_URL,
  APP_NAME,
  MODE: IS_DEVELOPMENT ? 'development' : IS_PRODUCTION ? 'production' : 'unknown',
});

export default ENV_CONFIG;
