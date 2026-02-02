// App.tsx - Main application entry point

import { WindowManagerProvider } from "@/context/WindowManager";
import { Desktop } from "@/components/os";

function App() {
  return (
    <WindowManagerProvider>
      <Desktop />
    </WindowManagerProvider>
  );
}

export default App;
