// analytics.js - Đơn giản, không cần cấu hình phức tạp
class SimpleAnalytics {
    constructor() {
        this.events = [];
        this.init();
    }
    
    init() {
        console.log('Analytics đã sẵn sàng');
        
        // Lưu sự kiện vào localStorage mỗi phút
        setInterval(() => this.saveEvents(), 60000);
        
        // Lưu khi đóng trang
        window.addEventListener('beforeunload', () => this.saveEvents());
    }
    
    track(eventName, data = {}) {
        const event = {
            name: eventName,
            data: data,
            timestamp: new Date().toISOString(),
            page: window.location.hash || 'home',
            userAgent: navigator.userAgent
        };
        
        this.events.push(event);
        console.log(`[Analytics] ${eventName}:`, data);
        
        // Lưu ngay nếu là sự kiện quan trọng
        if (['booking_completed', 'payment_started'].includes(eventName)) {
            this.saveEvents();
        }
    }
    
    saveEvents() {
        if (this.events.length === 0) return;
        
        try {
            const saved = JSON.parse(localStorage.getItem('website_analytics') || '[]');
            const allEvents = [...saved, ...this.events];
            
            // Giữ tối đa 1000 sự kiện
            if (allEvents.length > 1000) {
                allEvents.splice(0, allEvents.length - 1000);
            }
            
            localStorage.setItem('website_analytics', JSON.stringify(allEvents));
            this.events = []; // Xóa sự kiện đã lưu
        } catch (e) {
            console.error('Lỗi lưu analytics:', e);
        }
    }
    
    // Hàm tiện ích
    trackPageView(pageName) {
        this.track('page_view', { page: pageName });
    }
    
    trackButtonClick(buttonText, page) {
        this.track('button_click', { 
            button: buttonText, 
            page: page 
        });
    }
    
    trackBooking(step, data) {
        this.track('booking_step', { 
            step: step, 
            ...data 
        });
    }
    
    getStats() {
        const events = JSON.parse(localStorage.getItem('website_analytics') || '[]');
        return {
            totalEvents: events.length,
            pageViews: events.filter(e => e.name === 'page_view').length,
            buttonClicks: events.filter(e => e.name === 'button_click').length,
            recentEvents: events.slice(-20) // 20 sự kiện gần nhất
        };
    }
}

// Tạo instance toàn cục
window.analytics = new SimpleAnalytics();

// Tự động track page changes
document.addEventListener('pageChanged', function(e) {
    if (window.analytics) {
        window.analytics.trackPageView(e.detail);
    }
});

// Track các nút CTA
document.addEventListener('DOMContentLoaded', function() {
    document.addEventListener('click', function(e) {
        if (e.target.matches('.cta-button, .book-tour, .confirm-booking')) {
            const buttonText = e.target.textContent.trim();
            const currentPage = document.querySelector('.page.active')?.id.replace('-page', '') || 'home';
            
            if (window.analytics) {
                window.analytics.trackButtonClick(buttonText, currentPage);
            }
        }
    });
});

console.log('Analytics loaded successfully');