// hooks/useTheme.tsx
export function useTheme() {
   const getCookie = (name:string) => {
     const cookies = document.cookie.split(';');
     for (const cookie of cookies) {
       const [key, value] = cookie.trim().split('=');
       if (key === name) return value;
     }
     return null;
   };
 
   const toggleTheme = () => {
     const currentTheme = getCookie('theme') || 'light';
     const newTheme = currentTheme === 'light' ? 'dark' : 'light';
     document.cookie = `theme=${newTheme}; path=/; max-age=31536000`;
     document.documentElement.setAttribute('data-theme', newTheme);
   };
   
   return { toggleTheme };
 }