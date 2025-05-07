'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/context/auth-context';
import { notificationsData } from '@/lib/mock-data';
import {
  Bell,
  Search,
  Menu,
  UserCircle,
  Settings,
  LogOut,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { TenantProjectSelector } from '@/components/tenant-project-selector';

interface TopbarProps {
  toggleSidebar: () => void;
  sidebarOpen: boolean;
}

export function Topbar({ toggleSidebar, sidebarOpen }: TopbarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState(notificationsData);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Add scroll effect
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [scrolled]);

  const unreadNotifications = notifications.filter((n) => !n.read);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true }))
    );
  };

  // Get page title based on pathname
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname.startsWith('/projects')) return 'Projetos';
    if (pathname.startsWith('/documents')) return 'Documentos';
    if (pathname.startsWith('/reports')) return 'Relatórios';
    if (pathname.startsWith('/users')) return 'Usuários';
    if (pathname.startsWith('/settings')) return 'Configurações';
    return 'SGAS';
  };

  const notificationVariantMap: Record<string, string> = {
    info: 'info',
    warning: 'warning',
    success: 'success',
    error: 'error',
  };

  return (
    <header
      className={cn(
        'fixed top-0 right-0 left-0 z-30 bg-white dark:bg-gray-900 transition-all duration-200 ease-in-out border-b',
        sidebarOpen ? 'ml-64' : 'ml-0',
        scrolled
          ? 'border-gray-200 dark:border-gray-800 shadow-sm'
          : 'border-transparent'
      )}
    >
      <div className='h-16 px-4 flex items-center justify-between'>
        {/* Left Section */}
        <div className='flex items-center space-x-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={toggleSidebar}
            className='md:hidden'
            aria-label='Toggle Menu'
          >
            <Menu className='h-5 w-5' />
          </Button>

          <div className='hidden md:block'>
            <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>
              {getPageTitle()}
            </h1>
          </div>
        </div>

        {/* Center Section - Search */}
        <div
          className={cn(
            'hidden md:flex items-center max-w-md w-full mx-4 relative transition-all duration-200',
            searchFocused ? 'flex-1' : ''
          )}
        >
          <div className='relative w-full'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />
            <Input
              type='search'
              placeholder='Pesquisar documentos ou projetos...'
              className='w-full pl-10 h-10 bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500'
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
            />
          </div>
        </div>

        {/* Right Section */}
        <div className='flex items-center space-x-3'>
          {/* Tenant and Project Selector */}
          <div className='hidden lg:block'>
            <TenantProjectSelector />
          </div>

          {/* Mobile Search Button */}
          <Button
            variant='ghost'
            size='icon'
            className='md:hidden'
            aria-label='Search'
          >
            <Search className='h-5 w-5' />
          </Button>

          {/* Notifications Dropdown */}
          <DropdownMenu
            open={notificationsOpen}
            onOpenChange={setNotificationsOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='relative'
                aria-label='Notifications'
              >
                <Bell className='h-5 w-5' />
                {unreadNotifications.length > 0 && (
                  <span className='absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                    {unreadNotifications.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align='end'
              className='w-80 max-h-[70vh] overflow-y-auto'
            >
              <div className='flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700'>
                <DropdownMenuLabel className='text-base font-semibold'>
                  Notificações
                </DropdownMenuLabel>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={markAllAsRead}
                  className='text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                >
                  Marcar todas como lidas
                </Button>
              </div>

              <div className='py-2'>
                {notifications.length === 0 ? (
                  <div className='px-4 py-6 text-center text-gray-500 dark:text-gray-400'>
                    <Bell className='h-10 w-10 mx-auto mb-2 text-gray-400' />
                    <p>Não há notificações</p>
                  </div>
                ) : (
                  notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        'relative px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors',
                        !notification.read && 'bg-blue-50 dark:bg-blue-900/20'
                      )}
                    >
                      <div className='flex items-start gap-3'>
                        <div className='flex-shrink-0 mt-1'>
                          <Badge
                            variant={
                              (notificationVariantMap[
                                notification.type
                              ] as any) || 'default'
                            }
                            className='w-2 h-2 p-0 rounded-full'
                          />
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p className='text-sm font-medium text-gray-900 dark:text-white'>
                            {notification.title}
                          </p>
                          <p className='text-sm text-gray-500 dark:text-gray-400 mt-1'>
                            {notification.message}
                          </p>
                          <p className='text-xs text-gray-400 dark:text-gray-500 mt-1'>
                            {formatDate(notification.date, 'dd/MM/yyyy HH:mm')}
                          </p>
                        </div>
                        <Button
                          variant='ghost'
                          size='icon'
                          className='h-6 w-6 text-gray-400 hover:text-gray-500'
                          onClick={() => markAsRead(notification.id)}
                        >
                          <X className='h-4 w-4' />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
                <Link
                  href='/notifications'
                  className='block text-center text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
                  onClick={() => setNotificationsOpen(false)}
                >
                  Ver todas as notificações
                </Link>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='ghost'
                size='icon'
                className='rounded-full h-9 w-9 border border-gray-200 dark:border-gray-700 overflow-hidden'
              >
                <UserCircle className='h-6 w-6' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              <div className='p-2 border-b border-gray-200 dark:border-gray-700'>
                <div className='flex items-center space-x-2'>
                  <div className='w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800 flex items-center justify-center'>
                    <UserCircle className='h-6 w-6 text-blue-600 dark:text-blue-400' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-900 dark:text-white'>
                      {user?.name || 'Usuário'}
                    </p>
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                      {user?.email || 'usuario@exemplo.com'}
                    </p>
                  </div>
                </div>
              </div>

              <DropdownMenuItem asChild>
                <Link href='/profile' className='cursor-pointer'>
                  <UserCircle className='mr-2 h-4 w-4' />
                  <span>Perfil</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href='/settings' className='cursor-pointer'>
                  <Settings className='mr-2 h-4 w-4' />
                  <span>Configurações</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={logout} className='cursor-pointer'>
                <LogOut className='mr-2 h-4 w-4' />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
