import React, { useState, useRef } from "react";
import { ArrowLeft, ArrowRight, RotateCw, Lock, SquareArrowOutUpRight } from "lucide-react";
import { useI18n } from "@/i18n";

export const BrowserWindow: React.FC = () => {
  const { t } = useI18n();
  // Use Google with igu=1 parameter to allow iframe embedding
  const GOOGLE_HOME = "https://www.google.com/webhp?igu=1";
  
  const [url, setUrl] = useState(GOOGLE_HOME);
  const [inputUrl, setInputUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Initialize input with empty string or placeholder logic
  // We don't want to show the long google url effectively

  const handleNavigate = (e: React.FormEvent) => {
    e.preventDefault();
    let target = inputUrl.trim();
    
    if (!target) return;

    // Smart URL detection
    const hasProtocol = target.startsWith("http://") || target.startsWith("https://");
    const hasDomain = target.includes(".") && !target.includes(" "); // Simple heuristic

    if (hasProtocol || hasDomain) {
      if (!hasProtocol) {
        target = `https://${target}`;
      }
      setUrl(target);
    } else {
      // Treat as search query
      setUrl(`https://www.google.com/search?q=${encodeURIComponent(target)}&igu=1`);
    }
    
    setIsLoading(true);
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      iframeRef.current.src = iframeRef.current.src;
    }
  };

  const handleOpenExternal = () => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-gray-100 text-gray-900 font-sans">
      {/* Browser Toolbar */}
      <div className="flex items-center gap-2 p-2 bg-gray-200 border-b border-gray-300">
        <div className="flex items-center gap-1">
          <button className="p-1.5 rounded-full hover:bg-gray-300 text-gray-600 disabled:opacity-50">
            <ArrowLeft size={16} />
          </button>
          <button className="p-1.5 rounded-full hover:bg-gray-300 text-gray-600 disabled:opacity-50">
            <ArrowRight size={16} />
          </button>
          <button 
            onClick={handleRefresh}
            className={`p-1.5 rounded-full hover:bg-gray-300 text-gray-600 ${isLoading ? 'animate-spin' : ''}`}
            title="Refresh"
          >
            <RotateCw size={16} />
          </button>
          {/* Home Button to reset to Google */}
           <button 
            onClick={() => {
              setUrl("https://www.google.com/webhp?igu=1");
              setInputUrl("");
            }}
            className="p-1.5 rounded-full hover:bg-gray-300 text-gray-600"
            title="Home"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </button>
        </div>

        {/* Address Bar */}
        <form onSubmit={handleNavigate} className="flex-1">
          <div className="relative flex items-center">
            <div className="absolute left-3 text-gray-500">
              <Lock size={12} />
            </div>
            <input
              type="text"
              value={inputUrl}
              onChange={(e) => setInputUrl(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 bg-white border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500 shadow-sm"
              placeholder={t.browserWindow.placeholder}
            />
          </div>
        </form>

        {/* External Link Button */}
        <button 
          onClick={handleOpenExternal}
          className="p-1.5 rounded-full hover:bg-gray-300 text-gray-600"
          title={t.browserWindow.openExternal}
        >
          <SquareArrowOutUpRight size={16} />
        </button>
      </div>
      
      {/* Favorites Bar */}
      <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 border-b border-gray-300 text-xs">
         <button 
           onClick={() => {
             setUrl("https://codedbybrucce.netlify.app/");
             setInputUrl("https://codedbybrucce.netlify.app/");
           }}
           className="flex items-center gap-1 hover:bg-white hover:shadow-sm px-2 py-0.5 rounded border border-transparent hover:border-gray-300 transition-all text-gray-700"
         >
           <span className="text-yellow-500">★</span>
           <span>{t.browserWindow.portfolio}</span>
         </button>
      </div>

      {/* Browser Content */}
      <div className="flex-1 relative bg-white">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10 transition-opacity">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}
        
        <iframe
          ref={iframeRef}
          src={url}
          className="w-full h-full border-none"
          onLoad={handleIframeLoad}
          title="Browser Content"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-presentation"
          referrerPolicy="no-referrer"
        />
        
        {/* Helper message for blocked sites */}
        <div className="absolute bottom-0 left-0 right-0 bg-yellow-50 border-t border-yellow-200 px-4 py-2 flex items-center justify-between text-xs text-yellow-800">
          <div>
            <span className="font-bold mr-1">{t.browserWindow.blockedTitle}:</span>
            {t.browserWindow.blockedMessage}
          </div>
          <button 
            onClick={handleOpenExternal}
            className="ml-2 px-2 py-1 bg-yellow-100 hover:bg-yellow-200 border border-yellow-300 rounded text-yellow-900 whitespace-nowrap"
          >
            {t.browserWindow.openExternal}
          </button>
        </div>
      </div>
    </div>
  );
};
