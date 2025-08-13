// Vercel Analytics Custom Events for Latvian Interactive Map
// This script tracks user interactions with the map for demo analytics

// Track page view
window.va && window.va('pageview');

// Track map interactions
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Vercel Analytics initialized for Latvian Interactive Map Demo');
    
    // Track when demo is loaded
    window.va && window.va('track', 'Demo Loaded', {
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent.substring(0, 100)
    });
    
    // Track region clicks (if SVG map exists)
    const mapContainer = document.querySelector('#root');
    if (mapContainer) {
        mapContainer.addEventListener('click', function(e) {
            // Track clicks on map regions
            if (e.target.tagName === 'path' || e.target.classList.contains('region')) {
                const regionName = e.target.getAttribute('data-region') || 
                                  e.target.getAttribute('title') || 
                                  e.target.id || 
                                  'Unknown Region';
                
                window.va && window.va('track', 'Region Clicked', {
                    region: regionName,
                    timestamp: new Date().toISOString()
                });
                
                console.log('📍 Region clicked:', regionName);
            }
        });
    }
    
    // Track theme changes (if theme buttons exist)
    const themeButtons = document.querySelectorAll('[data-theme], .theme-selector button');
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme') || 
                         this.textContent || 
                         'Unknown Theme';
            
            window.va && window.va('track', 'Theme Changed', {
                theme: theme,
                timestamp: new Date().toISOString()
            });
            
            console.log('🎨 Theme changed:', theme);
        });
    });
    
    // Track language changes
    const languageButtons = document.querySelectorAll('[data-language], .language-selector button');
    languageButtons.forEach(button => {
        button.addEventListener('click', function() {
            const language = this.getAttribute('data-language') || 
                           this.textContent || 
                           'Unknown Language';
            
            window.va && window.va('track', 'Language Changed', {
                language: language,
                timestamp: new Date().toISOString()
            });
            
            console.log('🌐 Language changed:', language);
        });
    });
    
    // Track time spent on demo
    let startTime = Date.now();
    let isActive = true;
    
    // Track when user becomes inactive
    let inactivityTimer;
    function resetInactivityTimer() {
        clearTimeout(inactivityTimer);
        isActive = true;
        inactivityTimer = setTimeout(() => {
            isActive = false;
        }, 30000); // 30 seconds of inactivity
    }
    
    document.addEventListener('mousemove', resetInactivityTimer);
    document.addEventListener('keypress', resetInactivityTimer);
    document.addEventListener('click', resetInactivityTimer);
    document.addEventListener('scroll', resetInactivityTimer);
    
    // Track session end
    window.addEventListener('beforeunload', function() {
        if (isActive) {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            window.va && window.va('track', 'Session End', {
                timeSpentSeconds: timeSpent,
                timeSpentMinutes: Math.round(timeSpent / 60),
                timestamp: new Date().toISOString()
            });
            
            console.log('⏱️ Session ended. Time spent:', timeSpent, 'seconds');
        }
    });
    
    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = Math.round((scrollTop / docHeight) * 100);
        
        if (scrollPercent > maxScrollDepth) {
            maxScrollDepth = scrollPercent;
            
            // Track milestone scroll depths
            if (scrollPercent >= 25 && scrollPercent < 50 && maxScrollDepth >= 25) {
                window.va && window.va('track', 'Scroll Depth', { depth: '25%' });
            } else if (scrollPercent >= 50 && scrollPercent < 75 && maxScrollDepth >= 50) {
                window.va && window.va('track', 'Scroll Depth', { depth: '50%' });
            } else if (scrollPercent >= 75 && scrollPercent < 100 && maxScrollDepth >= 75) {
                window.va && window.va('track', 'Scroll Depth', { depth: '75%' });
            } else if (scrollPercent >= 100 && maxScrollDepth >= 100) {
                window.va && window.va('track', 'Scroll Depth', { depth: '100%' });
            }
        }
    });
    
    // Track viewport size for responsive analytics
    function trackViewport() {
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
            deviceType: window.innerWidth <= 768 ? 'mobile' : 
                       window.innerWidth <= 1024 ? 'tablet' : 'desktop'
        };
        
        window.va && window.va('track', 'Viewport Info', viewport);
        console.log('📱 Viewport:', viewport);
    }
    
    trackViewport();
    window.addEventListener('resize', trackViewport);
});

// Track any JavaScript errors
window.addEventListener('error', function(e) {
    window.va && window.va('track', 'JavaScript Error', {
        message: e.message.substring(0, 100),
        filename: e.filename,
        lineno: e.lineno,
        timestamp: new Date().toISOString()
    });
});

console.log('✅ Latvian Interactive Map - Vercel Analytics tracking initialized');
