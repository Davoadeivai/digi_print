import type { Page } from '../contexts/NavigationContext';

type AuthPage = 'register' | 'login' | 'dashboard';
type AppPage = Exclude<Page, AuthPage>;

export const isAuthPage = (page: Page): page is AuthPage => {
  return ['register', 'login', 'dashboard'].includes(page as AuthPage);
};

export const isAppPage = (page: Page): page is AppPage => {
  return !isAuthPage(page);
};
