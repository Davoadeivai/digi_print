import { Hero } from '../Hero';
import { Services } from '../Services';
import { Portfolio } from '../Portfolio';
import { About } from '../About';
import { Contact } from '../Contact';

export default function HomePage() {
    return (
        <div className="space-y-20">
            <Hero />
            <Services />
            <Portfolio />
            <About />
            <Contact />
        </div>
    );
}
