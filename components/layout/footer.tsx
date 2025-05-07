import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="mt-auto p-4 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between text-sm">
        <div className="text-gray-500 dark:text-gray-400 mb-2 md:mb-0">
          &copy; {currentYear} SGAS - Sistema de Gestão Ambiental e Social. Todos os direitos reservados.
        </div>
        
        <div className="flex space-x-6">
          <Link 
            href="/terms" 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Termos de Uso
          </Link>
          <Link 
            href="/privacy" 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Política de Privacidade
          </Link>
          <Link 
            href="/support" 
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            Suporte
          </Link>
        </div>
      </div>
    </footer>
  );
}