/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  // اضافه کردن سایر متغیرهای environment در صورت نیاز
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
