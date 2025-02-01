import React from 'react';
import { Menu } from 'lucide-react';
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerTitle,
} from '@/components/ui/drawer';
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { logout } from '@/store/auth/authSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

interface MenuItem {
    title: string;
    href: string;
    action?: () => void;
}

interface MenuCategory {
    title: string;
    items: MenuItem[];
}

const BurgerMenu: React.FC = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const menuItems: MenuCategory[] = [
        {
            title: 'Courses',
            items: [
                { title: 'Voir toutes', href: '/journeys' },
                { title: 'Ajouter', href: '/journeys/new' },
            ],
        },
        {
            title: 'Profil',
            items: [
                {
                    title: 'Déconnexion',
                    href: '#',
                    action: logout,
                },
            ],
        },
    ];

    const handleMenuItemClick = (item: MenuItem, event: React.MouseEvent) => {
        if (item.action) {
            event.preventDefault();
            dispatch(logout());
            navigate('/login');
        }
    };

    const DesktopMenu: React.FC = () => (
        <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
                {menuItems.map((category) => (
                    <NavigationMenuItem key={category.title}>
                        <NavigationMenuTrigger>
                            {category.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-48 gap-3 p-4">
                                {category.items.map((item) => (
                                    <li key={item.title}>
                                        <NavigationMenuLink asChild>
                                            <a
                                                href={item.href}
                                                onClick={(e) =>
                                                    handleMenuItemClick(item, e)
                                                }
                                                className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                                            >
                                                {item.title}
                                            </a>
                                        </NavigationMenuLink>
                                    </li>
                                ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                ))}
            </NavigationMenuList>
        </NavigationMenu>
    );

    const MobileMenu: React.FC = () => (
        <Drawer>
            <DrawerTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                    <Menu className="h-12 " />
                    <span className="sr-only">Toggle menu</span>
                </Button>
            </DrawerTrigger>
            <DrawerContent className="px-6">
                <DrawerTitle className="text-lg font-semibold pt-4 sr-only">
                    Menu
                </DrawerTitle>
                <nav className="flex flex-col space-y-4 mt-4">
                    {menuItems.map((category) => (
                        <div key={category.title} className="space-y-2">
                            <h2 className="text-lg font-semibold">
                                {category.title}
                            </h2>
                            <ul className="space-y-2">
                                {category.items.map((item) => (
                                    <li key={item.title}>
                                        <a
                                            href={item.href}
                                            onClick={(e) =>
                                                handleMenuItemClick(item, e)
                                            }
                                            className="block rounded-md p-2 text-foreground/70 transition-colors hover:text-foreground hover:bg-accent"
                                        >
                                            {item.title}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </nav>
            </DrawerContent>
        </Drawer>
    );

    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <MobileMenu />
            </div>
            <DesktopMenu />
        </div>
    );
};

export default BurgerMenu;
