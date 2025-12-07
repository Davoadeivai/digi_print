import { ReactNode } from 'react';
import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
    children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
    return (
        <>
            <Header />
            <main className="flex-grow min-h-screen">
                {children}
            </main>
            <Footer />
        </>
    );
};
