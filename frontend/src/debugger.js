export function runDebugger() {
  
  setTimeout(() => {
    
    console.log('🔍 DEBUG START');
    console.log('================');
    
    // 1. Check Root
    const root = document.getElementById('root');
    if (!root) {
      console.log('❌ Root not found');
    } else if (!root.innerHTML.trim()) {
      console.log('❌ Page is EMPTY - React not rendered');
    } else {
      console.log('✅ DOM OK');
    }
    
    // 2. Check ENV
    console.log('📦 API URL:', import.meta.env.VITE_API_URL || '❌ NOT SET');
    
    // 3. Check API
    const api = import.meta.env.VITE_API_URL || 'https://your-backend.onrender.com';
    
    fetch(api + '/api/')
      .then(r => console.log('🌐 API:', r.ok ? '✅ OK' : '❌ ' + r.status))
      .catch(e => {
        console.log('🌐 API: ❌', e.message);
        console.log('💡 Fix: Enable CORS in Django');
      });
    
    console.log('================');
    
    // Show on screen if error
    if (!root || !root.innerHTML.trim()) {
      document.body.innerHTML = `
        <div style="background:#1a1a2e;color:white;padding:50px;font-family:Tahoma;direction:rtl;min-height:100vh">
          <h1 style="color:#ff6b6b">❌ مشکل پیدا شد</h1>
          <p>React رندر نشده است</p>
          <p>F12 را بزنید و Console را ببینید</p>
        </div>
      `;
    }
    
  }, 2000);
}