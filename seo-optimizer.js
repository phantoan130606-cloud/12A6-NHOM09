// seo-optimizer.js - Tối ưu SEO
class SEOOptimizer {
    constructor() {
        this.init();
    }

    init() {
        console.log('SEO Optimizer: Ready');
        
        // Update meta tags based on current page
        this.updateMetaTags();
        
        // Add structured data
        this.addStructuredData();
        
        // Handle dynamic title updates
        this.setupDynamicTitles();
        
        // Optimize images
        this.optimizeImages();
        
        // Add breadcrumbs
        this.addBreadcrumbs();
    }

    updateMetaTags() {
        const currentPage = this.getCurrentPage();
        const pageMeta = this.getPageMeta(currentPage);
        
        // Update title
        document.title = pageMeta.title;
        
        // Update meta description
        this.updateMetaTag('description', pageMeta.description);
        
        // Update Open Graph tags
        this.updateOGTags(pageMeta);
        
        // Update Twitter Cards
        this.updateTwitterCards(pageMeta);
    }

    getCurrentPage() {
        const activePage = document.querySelector('.page.active');
        return activePage ? activePage.id.replace('-page', '') : 'home';
    }

    getPageMeta(page) {
        const metaMap = {
            'home': {
                title: 'Du Lịch Sinh Thái Miền Tây | Khám phá Đồng Bằng Sông Cửu Long',
                description: 'Khám phá hệ sinh thái độc đáo, miệt vườn trái cây, rừng tràm và những cù lao xanh mát tại Đồng Bằng Sông Cửu Long. Đặt tour du lịch sinh thái với giá tốt nhất.',
                image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            },
            'categories': {
                title: 'Điểm Du Lịch Sinh Thái Miền Tây | Danh sách địa điểm du lịch',
                description: 'Danh sách các điểm du lịch sinh thái hấp dẫn tại Miền Tây. Tìm hiểu thông tin chi tiết, giá vé, đánh giá và đặt tour trực tuyến.',
                image: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            },
            'detail': {
                title: this.getDetailPageTitle(),
                description: this.getDetailPageDescription(),
                image: this.getDetailPageImage()
            },
            'booking': {
                title: 'Đặt Tour Du Lịch Sinh Thái Miền Tây | Thanh toán online',
                description: 'Đặt tour du lịch sinh thái Miền Tây trực tuyến. Nhiều phương thức thanh toán, giá cả hợp lý, dịch vụ chuyên nghiệp.',
                image: 'https://images.unsplash.com/photo-1570696053732-b1d34ff4b4f7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            },
            'map': {
                title: 'Bản đồ Du Lịch Sinh Thái Miền Tây | Vị trí các điểm đến',
                description: 'Bản đồ tương tác các điểm du lịch sinh thái Miền Tây. Xem vị trí, tìm đường đi và lên lịch trình du lịch thuận tiện.',
                image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80'
            }
        };

        return metaMap[page] || metaMap.home;
    }

    getDetailPageTitle() {
        const detailContainer = document.getElementById('detailContainer');
        if (!detailContainer) return 'Chi tiết điểm du lịch | Du Lịch Sinh Thái Miền Tây';
        
        const title = detailContainer.querySelector('h1');
        return title ? `${title.textContent} | Du Lịch Sinh Thái Miền Tây` : 'Chi tiết điểm du lịch';
    }

    getDetailPageDescription() {
        const detailContainer = document.getElementById('detailContainer');
        if (!detailContainer) return 'Khám phá điểm du lịch sinh thái Miền Tây';
        
        const desc = detailContainer.querySelector('.detail-description');
        if (desc) {
            const text = desc.textContent.substring(0, 160);
            return text + (text.length === 160 ? '...' : '');
        }
        
        return 'Khám phá điểm du lịch sinh thái Miền Tây với nhiều hoạt động thú vị';
    }

    getDetailPageImage() {
        const detailContainer = document.getElementById('detailContainer');
        if (!detailContainer) return 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
        
        const heroImg = detailContainer.querySelector('.detail-hero img');
        return heroImg ? heroImg.src : 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
    }

    updateMetaTag(name, content) {
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.name = name;
            document.head.appendChild(meta);
        }
        meta.content = content;
    }

    updateOGTags(meta) {
        this.updateMetaTag('og:title', meta.title);
        this.updateMetaTag('og:description', meta.description);
        this.updateMetaTag('og:image', meta.image);
        this.updateMetaTag('og:url', window.location.href);
        this.updateMetaTag('og:type', 'website');
        this.updateMetaTag('og:locale', 'vi_VN');
    }

    updateTwitterCards(meta) {
        this.updateMetaTag('twitter:card', 'summary_large_image');
        this.updateMetaTag('twitter:title', meta.title);
        this.updateMetaTag('twitter:description', meta.description);
        this.updateMetaTag('twitter:image', meta.image);
    }

    addStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Du Lịch Sinh Thái Miền Tây",
            "description": "Website đặt tour du lịch sinh thái Miền Tây",
            "url": window.location.origin,
            "potentialAction": {
                "@type": "SearchAction",
                "target": `${window.location.origin}/#categories?q={search_term_string}`,
                "query-input": "required name=search_term_string"
            }
        };

        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(structuredData);
        document.head.appendChild(script);
    }

    setupDynamicTitles() {
        // Update title khi chuyển trang
        document.addEventListener('pageChanged', (e) => {
            setTimeout(() => {
                this.updateMetaTags();
            }, 100);
        });

        // Update title khi xem chi tiết
        if (window.showDestinationDetail) {
            const originalShowDetail = window.showDestinationDetail;
            window.showDestinationDetail = function(id) {
                originalShowDetail(id);
                setTimeout(() => {
                    window.seoOptimizer.updateMetaTags();
                }, 300);
            };
        }
    }

    optimizeImages() {
        // Lazy load images
        const images = document.querySelectorAll('img[data-src]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });

        // Add loading="lazy" attribute
        document.querySelectorAll('img').forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
        });
    }

    addBreadcrumbs() {
        const breadcrumbData = {
            'home': [],
            'categories': ['Trang chủ', 'Điểm đến'],
            'detail': ['Trang chủ', 'Điểm đến', 'Chi tiết'],
            'booking': ['Trang chủ', 'Điểm đến', 'Đặt tour'],
            'map': ['Trang chủ', 'Bản đồ'],
            'education': ['Trang chủ', 'Giáo dục'],
            'planner': ['Trang chủ', 'Lịch trình'],
            'bookings': ['Trang chủ', 'Booking của tôi'],
            'contact': ['Trang chủ', 'Liên hệ']
        };

        const currentPage = this.getCurrentPage();
        const breadcrumbs = breadcrumbData[currentPage];

        if (breadcrumbs && breadcrumbs.length > 0) {
            const breadcrumbContainer = document.createElement('div');
            breadcrumbContainer.className = 'breadcrumbs';
            
            const breadcrumbHTML = breadcrumbs.map((crumb, index) => {
                const isLast = index === breadcrumbs.length - 1;
                return isLast ? 
                    `<span class="breadcrumb-current">${crumb}</span>` :
                    `<a href="#" class="breadcrumb-link">${crumb}</a> <span class="breadcrumb-separator">›</span>`;
            }).join('');

            breadcrumbContainer.innerHTML = breadcrumbHTML;
            
            // Chèn breadcrumbs vào sau header
            const header = document.querySelector('header');
            if (header) {
                header.after(breadcrumbContainer);
            }
        }
    }

    generateSitemap() {
        const pages = [
            { url: '/', priority: 1.0 },
            { url: '/#categories', priority: 0.9 },
            { url: '/#map', priority: 0.8 },
            { url: '/#education', priority: 0.7 },
            { url: '/#booking', priority: 0.9 },
            { url: '/#contact', priority: 0.6 }
        ];

        // Thêm các trang chi tiết
        if (window.destinations) {
            window.destinations.forEach(dest => {
                pages.push({
                    url: `/#detail?${dest.id}`,
                    priority: 0.8,
                    lastmod: new Date().toISOString().split('T')[0]
                });
            });
        }

        return pages;
    }
}

// Khởi tạo SEO Optimizer
document.addEventListener('DOMContentLoaded', () => {
    window.seoOptimizer = new SEOOptimizer();
});