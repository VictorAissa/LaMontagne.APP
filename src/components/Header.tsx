import BurgerMenu from './BurgerMenu';

const Header = () => {
    return (
        <header className="top-0 flex justify-between items-center p-6">
            <p className="text-4xl text font-light">La Montagne</p>
            <BurgerMenu />
        </header>
    );
};

export default Header;
