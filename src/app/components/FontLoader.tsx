import Script from 'next/script';

export function FontLoader() {
  return (
    <>
      <Script 
        id="google-fonts-loader"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              const loadFonts = () => {
                // Noto Sans Lao (variable weight) and Phetsarath fonts
                const fontLink = document.createElement('link');
                fontLink.href = 'https://fonts.googleapis.com/css2?family=Noto+Sans+Lao:wght@100..900&family=Phetsarath:wght@400;700&display=swap';
                fontLink.rel = 'stylesheet';
                document.head.appendChild(fontLink);
              };
              
              // Load fonts
              loadFonts();
            })();
          `
        }}
      />
    </>
  );
} 