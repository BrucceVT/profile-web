// App.tsx - Main application entry point

import { WindowManagerProvider } from "@/context/WindowManager";
import { I18nProvider } from "@/i18n";
import { Desktop } from "@/components/os";

function App() {
  return (
    <I18nProvider>
      <WindowManagerProvider>
        <Desktop />
      </WindowManagerProvider>
    </I18nProvider>
  );
}

export default App;
