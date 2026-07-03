import { useEffect, useState } from 'react';

export function useTheme() {
  // Inicialização preguiçosa: Executa apenas UMA vez no nascimento do componente
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    // Como o Next.js roda no servidor primeiro, checamos se estamos no navegador
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme) return savedTheme;
      
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return systemPrefersDark ? 'dark' : 'light';
    }
    return 'light';
  });

  // O useEffect agora serve APENAS para sincronizar o estado do React com o mundo externo (DOM)
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]); // Roda sempre que o tema mudar

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return { theme, toggleTheme };
}