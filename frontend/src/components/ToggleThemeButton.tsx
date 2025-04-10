import { useTheme } from '../hooks/useTheme';

function ToggleThemeButton() {
  const { toggleTheme } = useTheme();

  return <button onClick={toggleTheme}>Toggle Theme</button>;
}

export default ToggleThemeButton;