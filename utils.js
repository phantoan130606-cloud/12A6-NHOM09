// utils.js - Các hàm tiện ích cho website

// ===== FORMATTING FUNCTIONS =====

/**
 * Định dạng số tiền thành chuỗi VND
 * @param {number} amount - Số tiền cần định dạng
 * @returns {string} Chuỗi đã định dạng
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

/**
 * Định dạng ngày tháng
 * @param {string|Date} date - Ngày cần định dạng
 * @returns {string} Chuỗi ngày tháng đã định dạng
 */
function formatDate(date) {
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

/**
 * Định dạng thời gian
 * @param {string|Date} date - Thời gian cần định dạng
 * @returns {string} Chuỗi thời gian đã định dạng
 */
function formatDateTime(date) {
    const d = new Date(date);
    return d.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// ===== STRING FUNCTIONS =====

/**
 * Rút gọn chuỗi với độ dài tối đa
 * @param {string} str - Chuỗi cần rút gọn
 * @param {number} maxLength - Độ dài tối đa
 * @returns {string} Chuỗi đã rút gọn
 */
function truncateString(str, maxLength = 100) {
    if (str.length <= maxLength) return str;
    return str.substring(0, maxLength) + '...';
}

/**
 * Tạo slug từ chuỗi
 * @param {string} str - Chuỗi cần tạo slug
 * @returns {string} Slug
 */
function createSlug(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9 ]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim();
}

// ===== VALIDATION FUNCTIONS =====

/**
 * Kiểm tra email hợp lệ
 * @param {string} email - Email cần kiểm tra
 * @returns {boolean} True nếu email hợp lệ
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Kiểm tra số điện thoại hợp lệ
 * @param {string} phone - Số điện thoại cần kiểm tra
 * @returns {boolean} True nếu số điện thoại hợp lệ
 */
function isValidPhone(phone) {
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    return phoneRegex.test(phone);
}

/**
 * Kiểm tra ngày hợp lệ
 * @param {string} dateString - Chuỗi ngày cần kiểm tra
 * @returns {boolean} True nếu ngày hợp lệ
 */
function isValidDate(dateString) {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
}

// ===== STORAGE FUNCTIONS =====

/**
 * Lưu dữ liệu vào localStorage với thời gian hết hạn
 * @param {string} key - Khóa
 * @param {any} value - Giá trị
 * @param {number} ttl - Thời gian sống (giây)
 */
function setWithExpiry(key, value, ttl) {
    const now = new Date();
    const item = {
        value: value,
        expiry: now.getTime() + (ttl * 1000)
    };
    localStorage.setItem(key, JSON.stringify(item));
}

/**
 * Lấy dữ liệu từ localStorage với thời gian hết hạn
 * @param {string} key - Khóa
 * @returns {any|null} Giá trị nếu còn hạn, null nếu hết hạn
 */
function getWithExpiry(key) {
    const itemStr = localStorage.getItem(key);
    
    if (!itemStr) {
        return null;
    }
    
    const item = JSON.parse(itemStr);
    const now = new Date();
    
    if (now.getTime() > item.expiry) {
        localStorage.removeItem(key);
        return null;
    }
    
    return item.value;
}

/**
 * Xóa tất cả dữ liệu localStorage liên quan đến website
 */
function clearAppData() {
    const keysToKeep = []; // Các key muốn giữ lại
    const keysToRemove = [];
    
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!keysToKeep.includes(key)) {
            keysToRemove.push(key);
        }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
}

// ===== UI HELPER FUNCTIONS =====

/**
 * Hiển thị thông báo
 * @param {string} message - Nội dung thông báo
 * @param {string} type - Loại thông báo: 'success', 'error', 'warning', 'info'
 * @param {number} duration - Thời gian hiển thị (ms)
 */
function showNotification(message, type = 'info', duration = 3000) {
    // Tạo container nếu chưa có
    let container = document.getElementById('notification-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'notification-container';
        container.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(container);
    }
    
    // Tạo thông báo
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // CSS cho notification
    notification.style.cssText = `
        background: ${getNotificationColor(type)};
        color: white;
        padding: 15px 20px;
        border-radius: 4px;
        margin-bottom: 10px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-width: 300px;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        animation: slideIn 0.3s ease;
    `;
    
    // Thêm CSS animation nếu chưa có
    if (!document.getElementById('notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 20px;
                cursor: pointer;
                margin-left: 10px;
            }
        `;
        document.head.appendChild(style);
    }
    
    container.appendChild(notification);
    
    // Xử lý nút đóng
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Tự động xóa sau duration
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, duration);
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fa-check-circle',
        'error': 'fa-exclamation-circle',
        'warning': 'fa-exclamation-triangle',
        'info': 'fa-info-circle'
    };
    return icons[type] || 'fa-info-circle';
}

function getNotificationColor(type) {
    const colors = {
        'success': '#4CAF50',
        'error': '#F44336',
        'warning': '#FF9800',
        'info': '#2196F3'
    };
    return colors[type] || '#2196F3';
}

/**
 * Hiển thị loading spinner
 * @param {boolean} show - Hiển thị hoặc ẩn
 * @param {string} message - Thông điệp loading
 */
function showLoading(show = true, message = 'Đang tải...') {
    let spinner = document.getElementById('loading-spinner');
    
    if (show) {
        if (!spinner) {
            spinner = document.createElement('div');
            spinner.id = 'loading-spinner';
            spinner.innerHTML = `
                <div class="spinner-overlay">
                    <div class="spinner">
                        <div class="double-bounce1"></div>
                        <div class="double-bounce2"></div>
                    </div>
                    <div class="spinner-message">${message}</div>
                </div>
            `;
            
            // CSS cho spinner
            const style = document.createElement('style');
            style.textContent = `
                .spinner-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(255, 255, 255, 0.9);
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    z-index: 9999;
                }
                .spinner {
                    width: 80px;
                    height: 80px;
                    position: relative;
                }
                .double-bounce1, .double-bounce2 {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: #4CAF50;
                    opacity: 0.6;
                    position: absolute;
                    top: 0;
                    left: 0;
                    animation: sk-bounce 2.0s infinite ease-in-out;
                }
                .double-bounce2 {
                    animation-delay: -1.0s;
                }
                @keyframes sk-bounce {
                    0%, 100% { transform: scale(0.0); }
                    50% { transform: scale(1.0); }
                }
                .spinner-message {
                    margin-top: 20px;
                    font-size: 16px;
                    color: #333;
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(spinner);
        }
    } else {
        if (spinner) {
            spinner.remove();
        }
    }
}

// ===== NETWORK FUNCTIONS =====

/**
 * Thực hiện HTTP GET request
 * @param {string} url - URL
 * @returns {Promise} Promise với dữ liệu
 */
async function fetchData(url) {
    try {
        showLoading(true, 'Đang tải dữ liệu...');
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        showLoading(false);
        return data;
    } catch (error) {
        showLoading(false);
        showNotification('Không thể tải dữ liệu: ' + error.message, 'error');
        throw error;
    }
}

/**
 * Gửi dữ liệu form
 * @param {string} url - URL
 * @param {FormData} formData - Dữ liệu form
 * @returns {Promise} Promise với kết quả
 */
async function submitForm(url, formData) {
    try {
        showLoading(true, 'Đang xử lý...');
        const response = await fetch(url, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        showLoading(false);
        showNotification('Gửi thành công!', 'success');
        return result;
    } catch (error) {
        showLoading(false);
        showNotification('Gửi thất bại: ' + error.message, 'error');
        throw error;
    }
}

// ===== MATH FUNCTIONS =====

/**
 * Tạo số ngẫu nhiên trong khoảng
 * @param {number} min - Giá trị nhỏ nhất
 * @param {number} max - Giá trị lớn nhất
 * @returns {number} Số ngẫu nhiên
 */
function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Làm tròn số đến chữ số thập phân
 * @param {number} num - Số cần làm tròn
 * @param {number} decimals - Số chữ số thập phân
 * @returns {number} Số đã làm tròn
 */
function roundTo(num, decimals = 2) {
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
}

// ===== EXPORT FUNCTIONS =====

// Xuất tất cả hàm để sử dụng trong các file khác
window.utils = {
    formatCurrency,
    formatDate,
    formatDateTime,
    truncateString,
    createSlug,
    isValidEmail,
    isValidPhone,
    isValidDate,
    setWithExpiry,
    getWithExpiry,
    clearAppData,
    showNotification,
    showLoading,
    fetchData,
    submitForm,
    randomInt,
    roundTo
};

console.log('Utils module đã được tải');