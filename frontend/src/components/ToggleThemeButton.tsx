import { useTheme } from '../context/ThemeContext';

const ToggleThemeButton = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button onClick={toggleTheme} className="profileButton">
      Switch to {theme === 'dark' ? 'light' : 'dark'} mode
    </button>
  );
};

export default ToggleThemeButton;