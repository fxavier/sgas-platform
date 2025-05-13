'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { INSTITUTIONS, NAV_ITEMS } from '@/lib/constants';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  FileText,
  FileStack,
  Landmark,
  UserCircle,
  LogOut,
  LayoutDashboard,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

// Simple fallback user
const defaultUser = {
  name: 'Usuário',
  email: 'usuario@exemplo.com',
};

interface SidebarProps {
  isOpen: boolean;
  tenant?: string;
}

interface MenuItem {
  title: string;
  href: string;
  icon?: string;
  submenu?: MenuItem[];
}

export function Sidebar({ isOpen, tenant }: SidebarProps) {
  // Use a simple fallback user
  const user = defaultUser;
  const logout = () => console.log('Logout functionality unavailable');

  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);
  const [localIsOpen, setLocalIsOpen] = useState(isOpen);

  const toggleMenu = (href: string) => {
    setOpenMenus((prev) =>
      prev.includes(href)
        ? prev.filter((item) => item !== href)
        : [...prev, href]
    );
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  const getIcon = (iconName: string | undefined) => {
    if (!iconName) return FileText;

    const icons: Record<string, any> = {
      LayoutDashboard,
      FileText,
      FileStack,
      Landmark,
      UserCircle,
      LogOut,
      ChevronDown,
      ChevronLeft,
      ChevronRight,
    };
    return icons[iconName] || FileText;
  };

  const toggleSidebar = () => {
    setLocalIsOpen(!localIsOpen);
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const Icon = getIcon(item.icon);
    const hasSubmenu = item.submenu && item.submenu.length > 0;
    const isMenuOpen = openMenus.includes(item.href);

    return (
      <div key={item.href} className='w-full'>
        {hasSubmenu ? (
          <button
            onClick={() => toggleMenu(item.href)}
            className={cn(
              'w-full flex items-center justify-between px-3 py-2 text-sm rounded-md transition-colors',
              isActive(item.href)
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            )}
            style={{ paddingLeft: `${level * 1 + 0.75}rem` }}
          >
            <span className='flex items-center min-w-[32px]'>
              {Icon && level === 0 && <Icon className='h-5 w-5' />}
              {localIsOpen && <span className='ml-3'>{item.title}</span>}
            </span>
            {localIsOpen && hasSubmenu && (
              <ChevronDown
                className={cn(
                  'h-4 w-4 text-gray-500 transition-transform',
                  isMenuOpen ? 'transform rotate-180' : ''
                )}
              />
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            className={cn(
              'flex items-center px-3 py-2 text-sm rounded-md transition-colors',
              isActive(item.href)
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
            )}
            style={{ paddingLeft: `${level * 1 + 0.75}rem` }}
            title={!localIsOpen ? item.title : undefined}
          >
            {Icon && level === 0 && <Icon className='h-5 w-5 min-w-[20px]' />}
            {localIsOpen && (
              <span className={Icon ? 'ml-3' : ''}>{item.title}</span>
            )}
          </Link>
        )}

        {hasSubmenu && isMenuOpen && localIsOpen && (
          <div className='ml-4 mt-1 space-y-1'>
            {item.submenu!.map((subItem) => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={cn(
        'fixed top-0 left-0 h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 z-40 transition-all duration-300 ease-in-out',
        localIsOpen ? 'w-64' : 'w-20'
      )}
    >
      <div className='flex flex-col h-full'>
        {/* Logo and header */}
        <div className='p-4 border-b border-gray-200 dark:border-gray-800'>
          <Link href='/dashboard' className='flex items-center space-x-2'>
            <Landmark className='h-8 w-8 text-blue-600 dark:text-blue-400' />
            {localIsOpen && (
              <div>
                <h1 className='font-bold text-xl text-gray-900 dark:text-white'>
                  SGAS
                </h1>
                <p className='text-xs text-gray-500 dark:text-gray-400'>
                  Sistema de Gestão Ambiental e Social
                </p>
              </div>
            )}
          </Link>
        </div>

        {/* Toggle Button */}
        <Button
          variant='ghost'
          size='icon'
          className='absolute -right-3 top-16 h-6 w-6 rounded-full border bg-white dark:bg-gray-900 shadow-md'
          onClick={toggleSidebar}
        >
          {localIsOpen ? (
            <ChevronLeft className='h-4 w-4' />
          ) : (
            <ChevronRight className='h-4 w-4' />
          )}
        </Button>

        {/* User Profile Quick Access */}
        <div className='p-4 border-b border-gray-200 dark:border-gray-800'>
          <div className='flex items-center space-x-3'>
            <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center'>
              <UserCircle className='h-6 w-6 text-blue-600 dark:text-blue-400' />
            </div>
            {localIsOpen && (
              <div className='flex-1 min-w-0'>
                <p className='text-sm font-medium text-gray-900 dark:text-white truncate'>
                  {user?.name || 'Usuário'}
                </p>
                <p className='text-xs text-gray-500 dark:text-gray-400 truncate'>
                  {user?.email || 'usuario@exemplo.com'}
                </p>
              </div>
            )}
            {localIsOpen && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon' className='h-8 w-8'>
                    <ChevronDown className='h-4 w-4' />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end' className='w-56'>
                  <DropdownMenuItem>
                    <UserCircle className='mr-2 h-4 w-4' />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className='mr-2 h-4 w-4' />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Main Navigation */}
        <div className='p-4 flex-1 overflow-y-auto'>
          <nav className='space-y-1'>
            {NAV_ITEMS.map((item) => renderMenuItem(item))}
          </nav>
        </div>

        {/* Footer */}
        <div className='p-4 border-t border-gray-200 dark:border-gray-800'>
          <div className='flex items-center justify-between'>
            {localIsOpen && (
              <span className='text-xs text-gray-500 dark:text-gray-400'>
                SGAS v1.0.0
              </span>
            )}
            <Button
              variant='ghost'
              size='sm'
              onClick={logout}
              className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              title={!localIsOpen ? 'Sair' : undefined}
            >
              <LogOut className='h-4 w-4' />
              {localIsOpen && <span className='ml-1'>Sair</span>}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
