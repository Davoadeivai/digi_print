import { Hero } from '../Hero';
import { About } from '../About';
import { Services } from '../Services';
import { Portfolio } from '../Portfolio';
import { Contact } from '../Contact';

export default function HomePage() {
    return (
        <>
            <Hero />
            <About />
            <Services />
            <Portfolio />
            <Contact />
        </>
    );
}
