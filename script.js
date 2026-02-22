// Thêm vào đầu file script.js (sau khi DOM loaded)
document.addEventListener('DOMContentLoaded', function() {
    // Tự động căn chỉnh các phần tử
    fixAlignment();
    
    // Theo dõi thay đổi kích thước cửa sổ để căn chỉnh lại
    window.addEventListener('resize', fixAlignment);
});

function fixAlignment() {
    // Căn giữa các phần tử cần thiết
    const elementsToCenter = document.querySelectorAll('.text-center, .section-title, .hero .container');
    elementsToCenter.forEach(el => {
        el.style.textAlign = 'center';
        el.style.display = 'flex';
        el.style.flexDirection = 'column';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
    });
    
    // Căn đều các card trong grid
    const cards = document.querySelectorAll('.destination-card, .team-member, .education-card');
    cards.forEach(card => {
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
    });
    
    // Căn giữa nội dung trong card
    const cardContents = document.querySelectorAll('.destination-content, .team-member > div, .education-content');
    cardContents.forEach(content => {
        content.style.flexGrow = '1';
        content.style.display = 'flex';
        content.style.flexDirection = 'column';
    });
    
    // Đảm bảo các nút trong card căn đều
    const cardButtons = document.querySelectorAll('.destination-content .cta-button, .team-member p, .education-content .learn-more');
    cardButtons.forEach(button => {
        if (button.parentElement.classList.contains('destination-content') || 
            button.parentElement.classList.contains('education-content')) {
            button.style.marginTop = 'auto';
            button.style.alignSelf = 'flex-start';
        }
    });
}

// script.js - Xử lý chính cho website Du Lịch Sinh Thái Miền Tây

document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo biến toàn cục
    let currentPage = 'home';
    let currentCategory = 'all';
    
    // Khởi tạo các module
    initNavigation();
    initDestinationDisplay();
    initMobileMenu();
    initImageModal();
    initTabs();
    
    // Tải dữ liệu ban đầu
    loadHomePageDestinations();
    
    // Xử lý form liên hệ
    initContactForm();
    
    console.log('Website Du Lịch Sinh Thái Miền Tây đã sẵn sàng!');
    
    // ===== HÀM KHỞI TẠO NAVIGATION =====
    function initNavigation() {
        // Xử lý click vào logo
        document.querySelector('.logo').addEventListener('click', function(e) {
            e.preventDefault();
            showPage('home');
        });
        
        // Xử lý click vào menu
        document.querySelectorAll('nav a, .footer-column a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                const page = this.getAttribute('data-page');
                const detailId = this.getAttribute('data-detail');
                
                if (page) {
                    showPage(page);
                } else if (detailId) {
                    showDestinationDetail(parseInt(detailId));
                }
            });
        });
        
        // Xử lý nút CTA
        document.querySelectorAll('.cta-button').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const page = this.getAttribute('data-page');
                if (page) {
                    showPage(page);
                }
            });
        });
        
        // Xử lý nút quay lại
        document.querySelector('.back-button')?.addEventListener('click', function(e) {
            e.preventDefault();
            const page = this.getAttribute('data-page');
            if (page) {
                showPage(page);
            }
        });
    }
    
    // ===== HIỂN THỊ TRANG =====
    function showPage(pageName) {
        // Ẩn tất cả các trang
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        
        // Xóa active class khỏi tất cả menu items
        document.querySelectorAll('nav a').forEach(link => {
            link.classList.remove('active');
        });
        
        // Thêm active class cho menu item tương ứng
        document.querySelector(`nav a[data-page="${pageName}"]`)?.classList.add('active');
        
        // Hiển thị trang được chọn
        const pageElement = document.getElementById(`${pageName}-page`);
        if (pageElement) {
            pageElement.classList.add('active');
            currentPage = pageName;
            
            // Gửi sự kiện pageChanged - QUAN TRỌNG: cho map-main.js biết
            document.dispatchEvent(new CustomEvent('pageChanged', { detail: pageName }));
            
            // Thực hiện các hành động cụ thể cho từng trang
            switch(pageName) {
                case 'home':
                    loadHomePageDestinations();
                    break;
                case 'categories':
                    filterDestinationsByCategory('all');
                    break;
                case 'map':
                    // Bản đồ chính sẽ được xử lý bởi map-main.js qua sự kiện pageChanged
                    if (typeof initMainMap === 'function') {
                        setTimeout(initMainMap, 300);
                    }
                    break;
            }
            
            // Cuộn lên đầu trang
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    // ===== MENU DI ĐỘNG =====
    function initMobileMenu() {
        const mobileMenuBtn = document.getElementById('mobileMenuBtn');
        const mainMenu = document.getElementById('mainMenu');
        
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', function() {
                mainMenu.classList.toggle('active');
                this.innerHTML = mainMenu.classList.contains('active') 
                    ? '<i class="fas fa-times"></i>' 
                    : '<i class="fas fa-bars"></i>';
            });
            
            // Đóng menu khi click bên ngoài
            document.addEventListener('click', function(e) {
                if (!e.target.closest('nav') && !e.target.closest('#mobileMenuBtn')) {
                    mainMenu.classList.remove('active');
                    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                }
            });
        }
    }
    
    // ===== HIỂN THỊ ĐIỂM ĐẾN TRANG CHỦ =====
    function loadHomePageDestinations() {
        const destinationsGrid = document.querySelector('.destinations-grid');
        if (!destinationsGrid) return;
        
        // Lấy 3 điểm đầu tiên để hiển thị trên trang chủ (như trong index.html cũ)
        const featuredDestinations = destinations.slice(0, 3);
        
        destinationsGrid.innerHTML = '';
        
        featuredDestinations.forEach(destination => {
            const destinationCard = createDestinationCard(destination);
            destinationsGrid.appendChild(destinationCard);
        });
    }
    
    // ===== TẠO CARD ĐIỂM ĐẾN =====
    function createDestinationCard(destination) {
        const card = document.createElement('div');
        card.className = 'destination-card';
        card.dataset.id = destination.id;
        
        // Tạo HTML cho card
        card.innerHTML = `
            <div class="destination-image">
                <img src="${destination.image}" alt="${destination.name}" loading="lazy">
            </div>
            <div class="destination-content">
                <div class="destination-category">${getCategoryName(destination.category)}</div>
                <h3>${destination.name}</h3>
                <p>${destination.description.substring(0, 100)}...</p>
                <div class="destination-rating">
                    ${generateStarRating(destination.rating)}
                    <span>${destination.rating}</span>
                </div>
                <div class="destination-info">
                    <p><i class="fas fa-map-marker-alt"></i> ${destination.province}</p>
                    <p><i class="fas fa-calendar-alt"></i> Thời gian: ${destination.bestTime}</p>
                </div>
                <a href="#" class="cta-button" data-detail="${destination.id}">Xem Chi Tiết</a>
            </div>
        `;
        
        // Thêm sự kiện click
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('cta-button')) {
                showDestinationDetail(destination.id);
            }
        });
        
        // Thêm sự kiện cho nút chi tiết
        const detailButton = card.querySelector('.cta-button');
        detailButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            showDestinationDetail(destination.id);
        });
        
        return card;
    }
    
    // ===== HIỂN THỊ CHI TIẾT ĐIỂM ĐẾN =====
    function showDestinationDetail(id) {
        const destination = destinations.find(d => d.id === id);
        if (!destination) return;
        
        // Hiển thị trang chi tiết
        showPage('detail');
        
        // Cập nhật tiêu đề trang
        document.title = `${destination.name} | Du Lịch Sinh Thái Miền Tây`;
        
        // Hiển thị nội dung chi tiết
        const detailContainer = document.getElementById('detailContainer');
        if (detailContainer) {
            detailContainer.innerHTML = `
                <div class="detail-hero">
                    <img src="${destination.image}" alt="${destination.name}">
                </div>
                <div class="detail-body">
                    <h1>${destination.name}</h1>
                    <div class="destination-meta">
                        <span class="destination-category">${getCategoryName(destination.category)}</span>
                        <span class="destination-rating">
                            ${generateStarRating(destination.rating)}
                            ${destination.rating}
                        </span>
                        <span><i class="fas fa-map-marker-alt"></i> ${destination.province}</span>
                    </div>
                    
                    <div class="detail-info">
                        <div class="info-item">
                            <i class="fas fa-clock"></i>
                            <div>
                                <h4>Thời gian lý tưởng</h4>
                                <p>${destination.bestTime}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-ticket-alt"></i>
                            <div>
                                <h4>Phí vào cổng</h4>
                                <p>${destination.entryFee}</p>
                            </div>
                        </div>
                        <div class="info-item">
                            <i class="fas fa-star"></i>
                            <div>
                                <h4>Hoạt động</h4>
                                <p>${destination.activities.join(', ')}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="detail-description">
                        <h2>Giới Thiệu</h2>
                        ${destination.longDescription}
                    </div>
                    
                    <div class="gallery">
                        <h2>Hình Ảnh</h2>
                        <div class="gallery-grid">
                            ${destination.images.map((img, index) => `
                                <div class="gallery-item" data-index="${index}">
                                    <img src="${img}" alt="${destination.name} - Hình ${index + 1}">
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="tour-packages">
                        <h2>Tour Đề Xuất</h2>
                        <div class="packages-grid">
                            ${destination.tourPackages.map(pkg => `
                                <div class="package-card">
                                    <h3>${pkg.name}</h3>
                                    <p><i class="fas fa-clock"></i> ${pkg.duration}</p>
                                    <p class="price">${formatCurrency(pkg.price)}</p>
                                    <button class="cta-button book-tour" data-destination="${destination.id}" data-package="${pkg.name}">Đặt Tour</button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="map-preview">
                        <h2>Vị Trí</h2>
                        <div id="detailMap" style="height: 300px; border-radius: 8px; margin-top: 20px;"></div>
                    </div>
                </div>
            `;
            
            // Khởi tạo bản đồ cho chi tiết
            initDetailMap(destination.coordinates, destination.name);
            
            // Xử lý click vào gallery
            initGallery(destination.images);
            
            // Xử lý nút đặt tour
            document.querySelectorAll('.book-tour').forEach(button => {
                button.addEventListener('click', function() {
                    const destId = this.getAttribute('data-destination');
                    const packageName = this.getAttribute('data-package');
                    bookTour(destId, packageName);
                });
            });
        }
    }
    
    // ===== BẢN ĐỒ CHI TIẾT =====
    function initDetailMap(coordinates, title) {
        console.log('Khởi tạo bản đồ chi tiết...');
        
        const mapElement = document.getElementById('detailMap');
        if (!mapElement) {
            console.log('Không tìm thấy #detailMap');
            return;
        }
        
        // Dọn dẹp bản đồ cũ nếu có
        if (window.detailMapInstance) {
            window.detailMapInstance.remove();
            window.detailMapInstance = null;
        }
        
        try {
            // Tạo bản đồ chi tiết với biến riêng
            window.detailMapInstance = L.map('detailMap').setView(coordinates, 13);
            
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '© OpenStreetMap contributors'
            }).addTo(window.detailMapInstance);
            
            L.marker(coordinates)
                .addTo(window.detailMapInstance)
                .bindPopup(`<b>${title}</b>`)
                .openPopup();
            
            // Fix kích thước
            setTimeout(() => {
                if (window.detailMapInstance) {
                    window.detailMapInstance.invalidateSize();
                }
            }, 100);
            
            console.log('✅ Bản đồ chi tiết đã tạo');
            
        } catch (error) {
            console.error('❌ Lỗi tạo bản đồ chi tiết:', error);
        }
    }
    
    // ===== GALLERY HÌNH ẢNH =====
    function initGallery(images) {
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.addEventListener('click', function() {
                openImageModal(images[index]);
            });
        });
    }
    
    // ===== MODAL HÌNH ẢNH =====
    function initImageModal() {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        const modalClose = document.getElementById('modalClose');
        
        if (modal && modalImg && modalClose) {
            modalClose.addEventListener('click', function() {
                modal.style.display = 'none';
            });
            
            modal.addEventListener('click', function(e) {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
            
            // Đóng bằng phím ESC
            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && modal.style.display === 'flex') {
                    modal.style.display = 'none';
                }
            });
        }
    }
    
    function openImageModal(imageSrc) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        
        if (modal && modalImg) {
            modal.style.display = 'flex';
            modalImg.src = imageSrc;
        }
    }
    
    // ===== TABS LỌC ĐIỂM ĐẾN =====
    function initTabs() {
        document.querySelectorAll('.tab').forEach(tab => {
            tab.addEventListener('click', function() {
                // Xóa active class khỏi tất cả tabs
                document.querySelectorAll('.tab').forEach(t => {
                    t.classList.remove('active');
                });
                
                // Thêm active class cho tab được chọn
                this.classList.add('active');
                
                // Lọc điểm đến theo category
                const category = this.getAttribute('data-category');
                filterDestinationsByCategory(category);
            });
        });
    }
    
    function filterDestinationsByCategory(category) {
        currentCategory = category;
        const destinationsGrid = document.getElementById('destinationsGrid');
        
        if (!destinationsGrid) return;
        
        // Lọc điểm đến
        let filteredDestinations;
        if (category === 'all') {
            filteredDestinations = destinations;
        } else {
            filteredDestinations = destinations.filter(d => d.category === category);
        }
        
        // Hiển thị điểm đến đã lọc
        destinationsGrid.innerHTML = '';
        
        if (filteredDestinations.length === 0) {
            destinationsGrid.innerHTML = `
                <div class="no-results" style="grid-column: 1 / -1; text-align: center; padding: 60px 0;">
                    <i class="fas fa-search" style="font-size: 60px; color: #ccc; margin-bottom: 20px;"></i>
                    <h3>Không tìm thấy điểm nào thuộc danh mục này</h3>
                    <p>Hãy thử chọn danh mục khác để xem các điểm du lịch sinh thái hấp dẫn.</p>
                </div>
            `;
            return;
        }
        
        filteredDestinations.forEach(destination => {
            const destinationCard = createDestinationCard(destination);
            destinationsGrid.appendChild(destinationCard);
        });
    }
    
    // ===== FORM LIÊN HỆ =====
    function initContactForm() {
        const contactForm = document.getElementById('contactForm');
        if (!contactForm) return;
        
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Lấy dữ liệu form
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                date: new Date().toISOString()
            };
            
            // Kiểm tra dữ liệu
            if (!formData.name || !formData.email || !formData.message) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc (*)');
                return;
            }
            
            // Hiển thị thông báo thành công
            alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
            
            // Reset form
            contactForm.reset();
            
            // Lưu vào localStorage (giả lập gửi đến server)
            saveContactMessage(formData);
        });
    }
    
    function saveContactMessage(formData) {
        // Lấy danh sách tin nhắn từ localStorage
        let messages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
        
        // Thêm tin nhắn mới
        messages.push(formData);
        
        // Lưu lại vào localStorage
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        console.log('Tin nhắn đã được lưu:', formData);
    }
    
    // ===== ĐẶT TOUR =====
    function bookTour(destinationId, packageName) {
        // Lưu thông tin tour vào sessionStorage
        const tourInfo = {
            destinationId: parseInt(destinationId),
            packageName: packageName,
            date: new Date().toISOString()
        };
        
        sessionStorage.setItem('selectedTour', JSON.stringify(tourInfo));
        
        // Chuyển đến trang đặt tour
        showPage('booking');
    }
    
    // ===== HÀM TIỆN ÍCH =====
    function getCategoryName(category) {
        const categories = {
            'cu-lao': 'Cù Lao',
            'vuon-quoc-gia': 'Vườn Quốc Gia',
            'miet-vuon': 'Miệt Vườn',
            'he-sinh-thai': 'Hệ Sinh Thái Đặc Biệt'
        };
        return categories[category] || category;
    }
    
    function generateStarRating(rating) {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 0; i < 5; i++) {
            if (i < fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        
        return stars;
    }
    
    function formatCurrency(amount) {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    }
    
    // Xuất các hàm để sử dụng trong các file khác
    window.showPage = showPage;
    window.showDestinationDetail = showDestinationDetail;
    window.destinations = destinations;
});
// Thêm vào cuối file script.js

// ===== PWA INSTALL PROMPT =====
let deferredPrompt;
const installPrompt = document.getElementById('installPrompt');

window.addEventListener('beforeinstallprompt', (e) => {
    // Ngăn Chrome tự động hiển thị prompt
    e.preventDefault();
    // Lưu event để dùng sau
    deferredPrompt = e;
    
    // Hiển thị nút cài đặt
    if (installPrompt) {
        installPrompt.style.display = 'block';
    }
});

// Xử lý nút cài đặt
document.getElementById('installButton')?.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    
    // Hiển thị prompt cài đặt
    deferredPrompt.prompt();
    
    // Đợi người dùng phản hồi
    const { outcome } = await deferredPrompt.userChoice;
    
    // Xóa prompt
    deferredPrompt = null;
    
    // Ẩn nút cài đặt
    if (installPrompt) {
        installPrompt.style.display = 'none';
    }
    
    console.log(`User ${outcome} the install prompt`);
});

// Ẩn prompt nếu người dùng từ chối
document.getElementById('dismissInstall')?.addEventListener('click', () => {
    if (installPrompt) {
        installPrompt.style.display = 'none';
    }
});

// ===== REGISTER SERVICE WORKER =====
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker registered:', registration);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed:', error);
            });
    });
}

// ===== OFFLINE DETECTION =====
window.addEventListener('online', () => {
    document.body.classList.remove('offline');
    showNotification('Đã kết nối lại internet', 'success');
});

window.addEventListener('offline', () => {
    document.body.classList.add('offline');
    showNotification('Bạn đang offline. Một số tính năng có thể không khả dụng.', 'warning');
});

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 300);
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// ===== SHARE FEATURE =====
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: 'Khám phá Du Lịch Sinh Thái Miền Tây',
            url: window.location.href
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        showNotification('Đã sao chép link vào clipboard!', 'success');
    }
}

// Thêm nút share
document.addEventListener('DOMContentLoaded', () => {
    const shareBtn = document.createElement('button');
    shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
    shareBtn.className = 'share-button';
    shareBtn.title = 'Chia sẻ';
    shareBtn.addEventListener('click', sharePage);
    document.body.appendChild(shareBtn);
});