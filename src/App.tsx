// App.tsx - Main application entry point with boot animation

import { useState, useCallback } from "react";
import { WindowManagerProvider } from "@/context/WindowManager";
import { I18nProvider, useI18n } from "@/i18n";
import { BootScreen } from "@/components/os/BootScreen";
import { Desktop } from "@/components/os";

// Inner app component that has access to i18n
const AppContent: React.FC<{ isBooting: boolean; onBootComplete: () => void }> = ({
  isBooting,
  onBootComplete,
}) => {
  const { t } = useI18n();

  if (isBooting) {
    return <BootScreen onComplete={onBootComplete} duration={2200} />;
  }

  // Welcome window opens immediately with the correct translated title
  // canClose: false ensures it cannot be closed
  const initialWindow = {
    id: "welcome",
    title: t.windows.welcome,
    position: { x: 100, y: 70 },
    canClose: false,
  };

  return (
    <WindowManagerProvider initialWindow={initialWindow}>
      <Desktop />
    </WindowManagerProvider>
  );
};

function App() {
  const [isBooting, setIsBooting] = useState(true);

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
  }, []);

  return (
    <I18nProvider>
      <AppContent isBooting={isBooting} onBootComplete={handleBootComplete} />
    </I18nProvider>
  );
}

export default App;
