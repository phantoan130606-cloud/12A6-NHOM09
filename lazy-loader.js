// lazy-loader.js - Tải module khi cần
document.addEventListener('DOMContentLoaded', function() {
    console.log('Lazy Loader đã sẵn sàng');
    
    // Lắng nghe sự kiện chuyển trang
    document.addEventListener('pageChanged', async function(e) {
        const page = e.detail;
        console.log('Chuyển đến trang:', page);
        
        // Tải module tương ứng với trang
        switch(page) {
            case 'booking':
                await loadScript('booking.js');
                if (typeof initBooking === 'function') initBooking();
                break;
                
            case 'map':
                await loadScript('map-main.js');
                setTimeout(() => {
                    if (typeof initMainMap === 'function') initMainMap();
                }, 100);
                break;
                
            case 'education':
                await loadScript('education.js');
                if (typeof loadEducationContent === 'function') loadEducationContent();
                break;
                
            case 'planner':
                await loadScript('planner.js');
                if (typeof initPlanner === 'function') initPlanner();
                break;
                
            case 'bookings':
                // Đã tải booking.js rồi
                break;
        }
    });
});

// Hàm tải script
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // Kiểm tra xem script đã được tải chưa
        if (document.querySelector(`script[src="${src}"]`)) {
            console.log(`Script ${src} đã được tải`);
            resolve();
            return;
        }
        
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => {
            console.log(`Đã tải xong: ${src}`);
            resolve();
        };
        script.onerror = () => {
            console.error(`Lỗi tải: ${src}`);
            reject();
        };
        document.body.appendChild(script);
    });
}

// Tải trước các script quan trọng khi trang load
function preloadScripts() {
    const scripts = [
        'data.js',
        'script.js'
    ];
    
    scripts.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.href = src;
        link.as = 'script';
        document.head.appendChild(link);
    });
}

// Gọi preload
preloadScripts();