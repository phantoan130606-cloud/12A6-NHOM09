// bookings-manager.js - Quản lý booking
class BookingsManager {
    constructor() {
        this.bookings = this.loadBookings();
        this.init();
    }

    init() {
        console.log('Bookings Manager: Ready');
        this.renderBookings();
        this.setupFilters();
    }

    loadBookings() {
        try {
            return JSON.parse(localStorage.getItem('confirmedBookings')) || [];
        } catch (error) {
            console.error('Error loading bookings:', error);
            return [];
        }
    }

    renderBookings() {
        const container = document.getElementById('bookingsContainer');
        const noBookings = document.getElementById('noBookings');
        
        if (!container) return;

        if (this.bookings.length === 0) {
            if (noBookings) noBookings.style.display = 'block';
            container.innerHTML = '';
            return;
        }

        if (noBookings) noBookings.style.display = 'none';

        // Sắp xếp theo ngày mới nhất
        const sortedBookings = [...this.bookings].sort((a, b) => 
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        container.innerHTML = `
            <div class="bookings-header">
                <h3>Danh sách Booking (${this.bookings.length})</h3>
                <div class="booking-filters">
                    <select id="statusFilter">
                        <option value="">Tất cả trạng thái</option>
                        <option value="confirmed">Đã xác nhận</option>
                        <option value="pending">Chờ xác nhận</option>
                        <option value="cancelled">Đã hủy</option>
                    </select>
                    <input type="date" id="dateFilter">
                    <button id="exportBookings" class="cta-button">
                        <i class="fas fa-download"></i> Xuất
                    </button>
                </div>
            </div>
            
            <div class="bookings-list">
                ${sortedBookings.map(booking => this.createBookingCard(booking)).join('')}
            </div>
            
            <div class="bookings-summary">
                <h4>Tổng quan</h4>
                <div class="summary-stats">
                    <div class="stat">
                        <span class="stat-value">${this.bookings.length}</span>
                        <span class="stat-label">Tổng booking</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${this.getConfirmedCount()}</span>
                        <span class="stat-label">Đã xác nhận</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${formatCurrency(this.getTotalRevenue())}</span>
                        <span class="stat-label">Tổng doanh thu</span>
                    </div>
                </div>
            </div>
        `;

        // Thêm event listeners
        this.addBookingEventListeners();
    }

    createBookingCard(booking) {
        const destination = this.getDestinationInfo(booking.destinationId);
        const totalPrice = this.calculateBookingTotal(booking);
        const statusClass = `booking-status-${booking.status || 'pending'}`;
        
        return `
            <div class="booking-card ${statusClass}" data-id="${booking.bookingId}">
                <div class="booking-header">
                    <div class="booking-id">
                        <h4>${booking.bookingId}</h4>
                        <span class="booking-date">
                            ${new Date(booking.createdAt).toLocaleDateString('vi-VN')}
                        </span>
                    </div>
                    <div class="booking-actions">
                        <button class="action-btn view-booking" title="Xem chi tiết">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn print-booking" title="In hóa đơn">
                            <i class="fas fa-print"></i>
                        </button>
                        ${booking.status !== 'cancelled' ? `
                            <button class="action-btn cancel-booking" title="Hủy booking">
                                <i class="fas fa-times"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="booking-content">
                    <div class="booking-info">
                        <p><strong>Tour:</strong> ${destination?.name || 'Unknown'}</p>
                        <p><strong>Gói:</strong> ${booking.packageName}</p>
                        <p><strong>Số người:</strong> ${booking.participants}</p>
                        <p><strong>Khách hàng:</strong> ${booking.contact?.name || 'N/A'}</p>
                        <p><strong>Số điện thoại:</strong> ${booking.contact?.phone || 'N/A'}</p>
                    </div>
                    
                    <div class="booking-details">
                        <div class="booking-payment">
                            <p><strong>Tổng tiền:</strong> ${formatCurrency(totalPrice)}</p>
                            <p><strong>Thanh toán:</strong> ${this.getPaymentMethodName(booking.payment?.method)}</p>
                            <p><strong>Trạng thái:</strong> <span class="status-badge">${this.getStatusText(booking.status)}</span></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    getDestinationInfo(destinationId) {
        return destinations?.find(d => d.id === destinationId);
    }

    calculateBookingTotal(booking) {
        const destination = this.getDestinationInfo(booking.destinationId);
        const packageInfo = destination?.tourPackages?.find(p => p.name === booking.packageName);
        return packageInfo ? packageInfo.price * (booking.participants || 1) : 0;
    }

    getPaymentMethodName(method) {
        const methods = {
            'momo': 'MoMo',
            'vnpay': 'VNPay',
            'bank': 'Chuyển khoản',
            'cash': 'Tiền mặt'
        };
        return methods[method] || method || 'Chưa thanh toán';
    }

    getStatusText(status) {
        const statusMap = {
            'confirmed': 'Đã xác nhận',
            'pending': 'Chờ xác nhận',
            'cancelled': 'Đã hủy'
        };
        return statusMap[status] || status || 'Chờ xác nhận';
    }

    getConfirmedCount() {
        return this.bookings.filter(b => b.status === 'confirmed').length;
    }

    getTotalRevenue() {
        return this.bookings
            .filter(b => b.status === 'confirmed')
            .reduce((total, booking) => total + this.calculateBookingTotal(booking), 0);
    }

    addBookingEventListeners() {
        // View booking details
        document.querySelectorAll('.view-booking').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookingCard = e.target.closest('.booking-card');
                const bookingId = bookingCard.dataset.id;
                this.showBookingDetails(bookingId);
            });
        });

        // Print booking
        document.querySelectorAll('.print-booking').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const bookingCard = e.target.closest('.booking-card');
                const bookingId = bookingCard.dataset.id;
                if (window.printReceipt) {
                    window.printReceipt(bookingId);
                }
            });
        });

        // Cancel booking
        document.querySelectorAll('.cancel-booking').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const bookingCard = e.target.closest('.booking-card');
                const bookingId = bookingCard.dataset.id;
                
                if (confirm('Bạn có chắc chắn muốn hủy booking này?')) {
                    await this.cancelBooking(bookingId);
                }
            });
        });

        // Export bookings
        document.getElementById('exportBookings')?.addEventListener('click', () => {
            this.exportBookings();
        });

        // Filters
        document.getElementById('statusFilter')?.addEventListener('change', (e) => {
            this.filterBookings({ status: e.target.value });
        });

        document.getElementById('dateFilter')?.addEventListener('change', (e) => {
            this.filterBookings({ date: e.target.value });
        });
    }

    showBookingDetails(bookingId) {
        const booking = this.bookings.find(b => b.bookingId === bookingId);
        if (!booking) return;

        const destination = this.getDestinationInfo(booking.destinationId);
        const totalPrice = this.calculateBookingTotal(booking);

        const modal = document.getElementById('bookingConfirmation');
        const modalContent = document.querySelector('.booking-modal');
        
        if (modal && modalContent) {
            modalContent.innerHTML = `
                <div class="booking-details-modal">
                    <h2>Chi tiết Booking</h2>
                    
                    <div class="details-section">
                        <h4>Thông tin booking</h4>
                        <p><strong>Mã booking:</strong> ${booking.bookingId}</p>
                        <p><strong>Ngày đặt:</strong> ${new Date(booking.createdAt).toLocaleString('vi-VN')}</p>
                        <p><strong>Trạng thái:</strong> <span class="status-badge">${this.getStatusText(booking.status)}</span></p>
                    </div>
                    
                    <div class="details-section">
                        <h4>Thông tin tour</h4>
                        <p><strong>Điểm đến:</strong> ${destination?.name || 'Unknown'}</p>
                        <p><strong>Gói tour:</strong> ${booking.packageName}</p>
                        <p><strong>Số người:</strong> ${booking.participants}</p>
                        <p><strong>Tổng giá:</strong> ${formatCurrency(totalPrice)}</p>
                    </div>
                    
                    <div class="details-section">
                        <h4>Thông tin khách hàng</h4>
                        <p><strong>Họ tên:</strong> ${booking.contact?.name || 'N/A'}</p>
                        <p><strong>Số điện thoại:</strong> ${booking.contact?.phone || 'N/A'}</p>
                        <p><strong>Email:</strong> ${booking.contact?.email || 'N/A'}</p>
                        <p><strong>Địa chỉ:</strong> ${booking.contact?.address || 'N/A'}</p>
                    </div>
                    
                    <div class="details-section">
                        <h4>Thông tin thanh toán</h4>
                        <p><strong>Phương thức:</strong> ${this.getPaymentMethodName(booking.payment?.method)}</p>
                        <p><strong>Trạng thái:</strong> ${booking.payment?.status || 'Chưa thanh toán'}</p>
                        <p><strong>Thời gian:</strong> ${booking.payment?.timestamp ? 
                            new Date(booking.payment.timestamp).toLocaleString('vi-VN') : 'N/A'}</p>
                    </div>
                    
                    <div class="modal-actions">
                        <button class="cta-button" onclick="printReceipt('${booking.bookingId}')">
                            <i class="fas fa-print"></i> In hóa đơn
                        </button>
                        ${booking.status !== 'cancelled' ? `
                            <button class="cta-button secondary" onclick="bookingsManager.cancelBooking('${booking.bookingId}')">
                                <i class="fas fa-times"></i> Hủy booking
                            </button>
                        ` : ''}
                        <button class="cta-button" onclick="closeModal('bookingConfirmation')">
                            Đóng
                        </button>
                    </div>
                </div>
            `;
            
            modal.style.display = 'flex';
        }
    }

    async cancelBooking(bookingId) {
        const bookingIndex = this.bookings.findIndex(b => b.bookingId === bookingId);
        if (bookingIndex === -1) return;

        this.bookings[bookingIndex].status = 'cancelled';
        this.bookings[bookingIndex].cancelledAt = new Date().toISOString();
        
        // Update localStorage
        localStorage.setItem('confirmedBookings', JSON.stringify(this.bookings));
        
        // Re-render bookings
        this.renderBookings();
        
        // Track analytics
        if (window.analytics) {
            window.analytics.trackEvent('booking_cancelled', {
                bookingId: bookingId
            });
        }
        
        alert('Đã hủy booking thành công!');
    }

    filterBookings(filters) {
        let filtered = [...this.bookings];
        
        if (filters.status) {
            filtered = filtered.filter(b => b.status === filters.status);
        }
        
        if (filters.date) {
            const filterDate = new Date(filters.date);
            filtered = filtered.filter(b => {
                const bookingDate = new Date(b.createdAt);
                return bookingDate.toDateString() === filterDate.toDateString();
            });
        }
        
        this.renderFilteredBookings(filtered);
    }

    renderFilteredBookings(filteredBookings) {
        const container = document.querySelector('.bookings-list');
        if (!container) return;
        
        if (filteredBookings.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <p>Không tìm thấy booking nào phù hợp</p>
                </div>
            `;
            return;
        }
        
        container.innerHTML = filteredBookings
            .map(booking => this.createBookingCard(booking))
            .join('');
        
        this.addBookingEventListeners();
    }

    setupFilters() {
        // Filter by status
        const statusFilter = document.getElementById('statusFilter');
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.filterBookings({ status: e.target.value });
            });
        }
    }

    exportBookings() {
        const data = this.bookings.map(booking => ({
            'Mã booking': booking.bookingId,
            'Ngày đặt': new Date(booking.createdAt).toLocaleDateString('vi-VN'),
            'Tour': this.getDestinationInfo(booking.destinationId)?.name || 'Unknown',
            'Gói': booking.packageName,
            'Số người': booking.participants,
            'Khách hàng': booking.contact?.name || '',
            'Số điện thoại': booking.contact?.phone || '',
            'Tổng tiền': this.calculateBookingTotal(booking),
            'Trạng thái': this.getStatusText(booking.status),
            'Phương thức TT': this.getPaymentMethodName(booking.payment?.method)
        }));

        const csv = this.convertToCSV(data);
        this.downloadCSV(csv, 'bookings.csv');
    }

    convertToCSV(data) {
        const headers = Object.keys(data[0]);
        const rows = data.map(row => 
            headers.map(header => JSON.stringify(row[header])).join(',')
        );
        return [headers.join(','), ...rows].join('\n');
    }

    downloadCSV(csv, filename) {
        const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
    }
}

// Khởi tạo Bookings Manager
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('bookings-page')) {
        window.bookingsManager = new BookingsManager();
    }
});