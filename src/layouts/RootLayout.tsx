import Header from '../components/Header';
import Footer from '../components/Footer';

interface Props {
    children: React.ReactNode;
}

const RootLayout = ({ children }: Props) => {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex flex-col items-center py-8">{children}</main>

            <Footer />
        </div>
    );
};

export default RootLayout;
