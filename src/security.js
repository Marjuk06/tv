export function initSecurity() {
  // Disable Right Click
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
  });

  // Disable DevTools Keyboard Shortcuts
  document.addEventListener('keydown', (e) => {
    // F12
    if (e.key === 'F12') {
      e.preventDefault();
    }
    // Ctrl+Shift+I (Windows) or Cmd+Option+I (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'I' || e.key === 'i')) {
      e.preventDefault();
    }
    // Ctrl+Shift+J (Windows) or Cmd+Option+J (Mac)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'J' || e.key === 'j')) {
      e.preventDefault();
    }
    // Ctrl+U (Windows) or Cmd+Option+U (Mac) - View Source
    if ((e.ctrlKey || e.metaKey) && (e.key === 'U' || e.key === 'u')) {
      e.preventDefault();
    }
    // Ctrl+S (Windows) or Cmd+S (Mac) - Save Page
    if ((e.ctrlKey || e.metaKey) && (e.key === 'S' || e.key === 's')) {
      e.preventDefault();
    }
  });

  // DevTools detection loop (Only runs in Production)
  if (import.meta.env.PROD) {
    setInterval(() => {
      const before = new Date().getTime();
      debugger;
      const after = new Date().getTime();
      if (after - before > 100) {
        // DevTools is open and paused the execution
        document.body.innerHTML = "<div style='display:flex;height:100vh;width:100vw;background:black;color:red;align-items:center;justify-content:center;font-family:sans-serif;'><h1>Unauthorized Access Detected</h1></div>";
      }
    }, 1000);
  }
}
