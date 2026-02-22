// booking.js - Xử lý đặt tour du lịch

document.addEventListener('DOMContentLoaded', function() {
    // Chỉ khởi tạo khi ở trang booking
    if (window.location.hash !== '#booking' && !document.getElementById('booking-page')?.classList.contains('active')) {
        return;
    }
    
    initBooking();
});

function initBooking() {
    const bookingProcess = document.getElementById('bookingProcess');
    if (!bookingProcess) return;
    
    // Kiểm tra xem có tour được chọn không
    const selectedTour = JSON.parse(sessionStorage.getItem('selectedTour'));
    
    if (selectedTour) {
        // Tìm thông tin điểm đến
        const destination = destinations.find(d => d.id === selectedTour.destinationId);
        const packageInfo = destination?.tourPackages.find(p => p.name === selectedTour.packageName);
        
        if (destination && packageInfo) {
            renderBookingForm(destination, packageInfo);
        } else {
            renderDestinationSelection();
        }
    } else {
        renderDestinationSelection();
    }
    
    // Xử lý bước tiếp theo
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('next-step')) {
            const currentStep = parseInt(e.target.getAttribute('data-current-step'));
            const nextStep = currentStep + 1;
            
            if (validateStep(currentStep)) {
                goToStep(nextStep);
            }
        }
        
        if (e.target.classList.contains('prev-step')) {
            const currentStep = parseInt(e.target.getAttribute('data-current-step'));
            const prevStep = currentStep - 1;
            goToStep(prevStep);
        }
        
        if (e.target.classList.contains('confirm-booking')) {
            confirmBooking();
        }
        
        if (e.target.classList.contains('select-tour')) {
            const destinationId = parseInt(e.target.getAttribute('data-destination'));
            const packageName = e.target.getAttribute('data-package');
            
            // Lưu tour được chọn
            sessionStorage.setItem('selectedTour', JSON.stringify({
                destinationId: destinationId,
                packageName: packageName
            }));
            
            // Reload booking process
            initBooking();
        }
    });
}

function renderDestinationSelection() {
    const bookingProcess = document.getElementById('bookingProcess');
    
    bookingProcess.innerHTML = `
        <div class="booking-steps">
            <div class="booking-step active">
                <div class="step-number">1</div>
                <div class="step-label">Chọn Tour</div>
            </div>
            <div class="booking-step">
                <div class="step-number">2</div>
                <div class="step-label">Thông Tin</div>
            </div>
            <div class="booking-step">
                <div class="step-number">3</div>
                <div class="step-label">Xác Nhận</div>
            </div>
        </div>
        
        <div class="step-content active" data-step="1">
            <h3>Chọn Tour Du Lịch</h3>
            <p>Vui lòng chọn một trong các tour du lịch sinh thái dưới đây:</p>
            
            <div class="tour-selection-grid">
                ${destinations.map(destination => `
                    <div class="tour-selection-card">
                        <img src="${destination.image}" alt="${destination.name}">
                        <div class="tour-selection-content">
                            <h4>${destination.name}</h4>
                            <p><i class="fas fa-map-marker-alt"></i> ${destination.province}</p>
                            <p><i class="fas fa-star"></i> ${destination.rating}</p>
                            
                            <div class="tour-packages">
                                ${destination.tourPackages.map(pkg => `
                                    <div class="package-option">
                                        <div>
                                            <h5>${pkg.name}</h5>
                                            <p><i class="fas fa-clock"></i> ${pkg.duration}</p>
                                        </div>
                                        <div>
                                            <p class="price">${formatCurrency(pkg.price)}</p>
                                            <button class="cta-button select-tour" 
                                                    data-destination="${destination.id}" 
                                                    data-package="${pkg.name}">
                                                Chọn
                                            </button>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div style="text-align: center; margin-top: 40px;">
                <p>Hoặc bạn có thể <a href="#" data-page="categories">xem tất cả điểm đến</a> trước khi chọn tour.</p>
            </div>
        </div>
    `;
}

function renderBookingForm(destination, packageInfo) {
    const today = new Date().toISOString().split('T')[0];
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    const maxDateStr = maxDate.toISOString().split('T')[0];
    
    const bookingProcess = document.getElementById('bookingProcess');
    
    bookingProcess.innerHTML = `
        <div class="booking-steps">
            <div class="booking-step active">
                <div class="step-number">1</div>
                <div class="step-label">Chọn Tour</div>
            </div>
            <div class="booking-step active">
                <div class="step-number">2</div>
                <div class="step-label">Thông Tin</div>
            </div>
            <div class="booking-step">
                <div class="step-number">3</div>
                <div class="step-label">Xác Nhận</div>
            </div>
        </div>
        
        <div class="selected-tour-summary">
            <h3>Tour Đã Chọn</h3>
            <div class="tour-summary-card">
                <img src="${destination.image}" alt="${destination.name}">
                <div class="tour-summary-content">
                    <h4>${destination.name}</h4>
                    <p><strong>Gói tour:</strong> ${packageInfo.name}</p>
                    <p><strong>Thời lượng:</strong> ${packageInfo.duration}</p>
                    <p><strong>Giá:</strong> ${formatCurrency(packageInfo.price)}/người</p>
                </div>
            </div>
        </div>
        
        <div class="step-content active" data-step="2">
            <h3>Thông Tin Đặt Tour</h3>
            <p>Vui lòng điền đầy đủ thông tin để đặt tour:</p>
            
            <form id="bookingForm">
                <div class="form-row">
                    <div class="form-group">
                        <label for="bookingDate">Ngày đi *</label>
                        <input type="date" id="bookingDate" required min="${today}" max="${maxDateStr}">
                    </div>
                    
                    <div class="form-group">
                        <label for="participants">Số người *</label>
                        <select id="participants" required>
                            <option value="">Chọn số người</option>
                            ${Array.from({length: 10}, (_, i) => i + 1).map(num => `
                                <option value="${num}">${num} người</option>
                            `).join('')}
                            <option value="11">Trên 10 người</option>
                        </select>
                    </div>
                </div>
                
                <h4>Thông Tin Liên Hệ</h4>
                <div class="form-row">
                    <div class="form-group">
                        <label for="fullName">Họ và tên *</label>
                        <input type="text" id="fullName" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="phone">Số điện thoại *</label>
                        <input type="tel" id="phone" required pattern="[0-9]{10,11}">
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="email">Email *</label>
                        <input type="email" id="email" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="address">Địa chỉ</label>
                        <input type="text" id="address">
                    </div>
                </div>
                
                <h4>Yêu Cầu Đặc Biệt</h4>
                <div class="form-group">
                    <label for="specialRequests">Ghi chú thêm (dịch vụ đặc biệt, yêu cầu ăn uống, v.v.)</label>
                    <textarea id="specialRequests" rows="3"></textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="cta-button prev-step" data-current-step="2">Quay Lại</button>
                    <button type="button" class="cta-button next-step" data-current-step="2">Tiếp Theo</button>
                </div>
            </form>
        </div>
        
        <div class="step-content" data-step="3">
            <h3>Xác Nhận Đặt Tour</h3>
            <div id="bookingConfirmationContent">
                <!-- Nội dung xác nhận sẽ được điền bằng JavaScript -->
            </div>
            
            <div class="form-actions">
                <button type="button" class="cta-button prev-step" data-current-step="3">Quay Lại</button>
                <button type="button" class="cta-button confirm-booking">Xác Nhận Đặt Tour</button>
            </div>
        </div>
    `;
    
    // Khởi tạo ngày mặc định (3 ngày sau)
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 3);
    document.getElementById('bookingDate').value = defaultDate.toISOString().split('T')[0];
    
    // Xử lý thay đổi số người
    document.getElementById('participants').addEventListener('change', updatePriceSummary);
    
    // Cập nhật giá ban đầu
    updatePriceSummary();
}

function updatePriceSummary() {
    const participants = parseInt(document.getElementById('participants')?.value) || 1;
    const selectedTour = JSON.parse(sessionStorage.getItem('selectedTour'));
    
    if (!selectedTour) return;
    
    const destination = destinations.find(d => d.id === selectedTour.destinationId);
    const packageInfo = destination?.tourPackages.find(p => p.name === selectedTour.packageName);
    
    if (!packageInfo) return;
    
    const totalPrice = packageInfo.price * participants;
    
    // Cập nhật nội dung xác nhận
    const confirmationContent = `
        <div class="confirmation-summary">
            <h4>Thông Tin Tour</h4>
            <p><strong>Điểm đến:</strong> ${destination.name}</p>
            <p><strong>Gói tour:</strong> ${packageInfo.name}</p>
            <p><strong>Thời lượng:</strong> ${packageInfo.duration}</p>
            <p><strong>Ngày đi:</strong> ${document.getElementById('bookingDate')?.value || 'Chưa chọn'}</p>
            <p><strong>Số người:</strong> ${participants}</p>
            
            <h4>Thông Tin Thanh Toán</h4>
            <p><strong>Giá tour/người:</strong> ${formatCurrency(packageInfo.price)}</p>
            <p><strong>Tổng cộng:</strong> <span class="total-price">${formatCurrency(totalPrice)}</span></p>
            <p><em>Lưu ý: Giá chưa bao gồm VAT và các chi phí phát sinh khác</em></p>
        </div>
    `;
    
    document.getElementById('bookingConfirmationContent').innerHTML = confirmationContent;
}

function goToStep(step) {
    // Ẩn tất cả các bước
    document.querySelectorAll('.step-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Hiển thị bước được chọn
    const stepContent = document.querySelector(`.step-content[data-step="${step}"]`);
    if (stepContent) {
        stepContent.classList.add('active');
    }
    
    // Cập nhật trạng thái các bước
    document.querySelectorAll('.booking-step').forEach((stepEl, index) => {
        if (index + 1 <= step) {
            stepEl.classList.add('active');
        } else {
            stepEl.classList.remove('active');
        }
    });
    
    // Cuộn lên đầu phần booking
    document.getElementById('bookingProcess').scrollIntoView({ behavior: 'smooth' });
}

function validateStep(step) {
    switch(step) {
        case 2:
            const form = document.getElementById('bookingForm');
            if (!form.checkValidity()) {
                alert('Vui lòng điền đầy đủ thông tin bắt buộc (*)');
                return false;
            }
            
            const participants = parseInt(document.getElementById('participants').value);
            if (participants > 10) {
                const confirmed = confirm('Số người trên 10 cần đặt trước ít nhất 3 ngày. Bạn có chắc chắn?');
                if (!confirmed) return false;
            }
            
            return true;
            
        default:
            return true;
    }
}

function confirmBooking() {
    // Lấy thông tin từ form
    const bookingInfo = {
        tour: JSON.parse(sessionStorage.getItem('selectedTour')),
        date: document.getElementById('bookingDate').value,
        participants: document.getElementById('participants').value,
        contact: {
            name: document.getElementById('fullName').value,
            phone: document.getElementById('phone').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value
        },
        specialRequests: document.getElementById('specialRequests').value,
        bookingDate: new Date().toISOString(),
        bookingId: 'DL' + Date.now() + Math.floor(Math.random() * 1000)
    };
    
    // Tính tổng giá
    const destination = destinations.find(d => d.id === bookingInfo.tour.destinationId);
    const packageInfo = destination?.tourPackages.find(p => p.name === bookingInfo.tour.packageName);
    const totalPrice = packageInfo.price * parseInt(bookingInfo.participants);
    
    // Lưu booking vào localStorage
    saveBooking(bookingInfo);
    
    // Hiển thị xác nhận
    showBookingConfirmation(bookingInfo, destination, packageInfo, totalPrice);
}

function saveBooking(bookingInfo) {
    // Lấy danh sách booking từ localStorage
    let bookings = JSON.parse(localStorage.getItem('tourBookings') || '[]');
    
    // Thêm booking mới
    bookings.push(bookingInfo);
    
    // Lưu lại vào localStorage
    localStorage.setItem('tourBookings', JSON.stringify(bookings));
    
    console.log('Booking đã được lưu:', bookingInfo);
}

function showBookingConfirmation(bookingInfo, destination, packageInfo, totalPrice) {
    const modal = document.getElementById('bookingConfirmation');
    const modalContent = document.querySelector('.booking-modal');
    
    if (!modal || !modalContent) return;
    
    modalContent.innerHTML = `
        <div class="confirmation-modal">
            <h2><i class="fas fa-check-circle" style="color: #4CAF50;"></i> Đặt Tour Thành Công!</h2>
            <p>Cảm ơn bạn đã đặt tour với chúng tôi. Thông tin chi tiết đã được gửi đến email của bạn.</p>
            
            <div class="booking-details">
                <h3>Thông Tin Booking</h3>
                <p><strong>Mã booking:</strong> ${bookingInfo.bookingId}</p>
                <p><strong>Tour:</strong> ${destination.name} - ${packageInfo.name}</p>
                <p><strong>Ngày đi:</strong> ${formatDate(bookingInfo.date)}</p>
                <p><strong>Số người:</strong> ${bookingInfo.participants}</p>
                <p><strong>Tổng giá:</strong> ${formatCurrency(totalPrice)}</p>
                <p><strong>Họ tên:</strong> ${bookingInfo.contact.name}</p>
                <p><strong>Số điện thoại:</strong> ${bookingInfo.contact.phone}</p>
            </div>
            
            <div class="next-steps">
                <h3>Bước Tiếp Theo</h3>
                <ol>
                    <li>Nhân viên của chúng tôi sẽ liên hệ xác nhận trong vòng 24 giờ</li>
                    <li>Thanh toán 50% giá trị tour để giữ chỗ</li>
                    <li>Thanh toán phần còn lại trước ngày đi 3 ngày</li>
                </ol>
            </div>
            
            <div class="modal-actions">
                <button class="cta-button" onclick="window.print()">In Hóa Đơn</button>
                <button class="cta-button" onclick="closeBookingModal()">Đóng</button>
            </div>
        </div>
    `;
    
    modal.style.display = 'flex';
    
    // Xóa tour đã chọn khỏi sessionStorage
    sessionStorage.removeItem('selectedTour');
    
    // Reset form booking
    setTimeout(() => {
        renderDestinationSelection();
    }, 100);
}

function closeBookingModal() {
    const modal = document.getElementById('bookingConfirmation');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Hàm tiện ích
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
}

// Xuất hàm để sử dụng trong HTML
window.closeBookingModal = closeBookingModal;
// Thêm vào cuối file booking.js

// ===== PAYMENT INTEGRATION =====
function initPaymentSystem() {
    const paymentModal = document.getElementById('paymentModal');
    const paymentOptions = document.querySelectorAll('.payment-option');
    const confirmPaymentBtn = document.getElementById('confirmPayment');
    let selectedPaymentMethod = null;

    // Payment option selection
    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');
            selectedPaymentMethod = this.getAttribute('data-method');
            updatePaymentDetails(selectedPaymentMethod);
        });
    });

    // Confirm payment
    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', async function() {
            if (!selectedPaymentMethod) {
                alert('Vui lòng chọn phương thức thanh toán');
                return;
            }

            const bookingInfo = JSON.parse(sessionStorage.getItem('selectedTour'));
            const participants = parseInt(document.getElementById('participants')?.value) || 1;
            const totalPrice = calculateTotalPrice(bookingInfo, participants);

            showLoading(true);

            try {
                const paymentResult = await processPayment(selectedPaymentMethod, totalPrice);
                
                if (paymentResult.success) {
                    // Complete booking
                    const bookingId = 'DL' + Date.now();
                    completeBooking(bookingId, selectedPaymentMethod);
                    
                    // Show success message
                    showPaymentSuccess(bookingId, totalPrice, selectedPaymentMethod);
                    
                    // Close modal
                    closeModal('paymentModal');
                } else {
                    alert('Thanh toán thất bại: ' + paymentResult.message);
                }
            } catch (error) {
                alert('Đã xảy ra lỗi trong quá trình thanh toán');
                console.error('Payment error:', error);
            } finally {
                showLoading(false);
            }
        });
    }
}

function calculateTotalPrice(bookingInfo, participants) {
    const destination = destinations.find(d => d.id === bookingInfo.destinationId);
    const packageInfo = destination?.tourPackages.find(p => p.name === bookingInfo.packageName);
    return packageInfo ? packageInfo.price * participants : 0;
}

async function processPayment(method, amount) {
    // Mock payment processing
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                transactionId: 'TXN' + Date.now(),
                method: method,
                amount: amount,
                timestamp: new Date().toISOString()
            });
        }, 1500);
    });
}

function updatePaymentDetails(method) {
    const detailsDiv = document.getElementById('paymentDetails');
    const bookingInfo = JSON.parse(sessionStorage.getItem('selectedTour'));
    const participants = parseInt(document.getElementById('participants')?.value) || 1;
    const totalPrice = calculateTotalPrice(bookingInfo, participants);

    const methodInfo = {
        'momo': 'Quét mã QR MoMo để thanh toán',
        'vnpay': 'Chuyển hướng đến cổng VNPay',
        'bank': 'Chuyển khoản qua ngân hàng',
        'cash': 'Thanh toán tiền mặt khi nhận tour'
    };

    detailsDiv.innerHTML = `
        <div class="payment-info">
            <h4>Thông tin thanh toán</h4>
            <p><strong>Phương thức:</strong> ${getPaymentMethodName(method)}</p>
            <p><strong>Số tiền:</strong> ${formatCurrency(totalPrice)}</p>
            <p><strong>Hướng dẫn:</strong> ${methodInfo[method]}</p>
            ${method === 'bank' ? `
                <div class="bank-info">
                    <p><strong>Ngân hàng:</strong> Vietcombank</p>
                    <p><strong>Số tài khoản:</strong> 0123456789</p>
                    <p><strong>Chủ tài khoản:</strong> DU LICH SINH THAI MIEN TAY</p>
                    <p><strong>Nội dung:</strong> DL${Date.now()}</p>
                </div>
            ` : ''}
        </div>
    `;
}

function getPaymentMethodName(method) {
    const names = {
        'momo': 'Ví MoMo',
        'vnpay': 'VNPay',
        'bank': 'Chuyển khoản ngân hàng',
        'cash': 'Tiền mặt'
    };
    return names[method] || method;
}

function completeBooking(bookingId, paymentMethod) {
    const bookingData = {
        bookingId: bookingId,
        ...JSON.parse(sessionStorage.getItem('selectedTour')),
        participants: parseInt(document.getElementById('participants')?.value) || 1,
        contact: {
            name: document.getElementById('fullName')?.value || '',
            phone: document.getElementById('phone')?.value || '',
            email: document.getElementById('email')?.value || '',
            address: document.getElementById('address')?.value || ''
        },
        payment: {
            method: paymentMethod,
            status: 'completed',
            timestamp: new Date().toISOString()
        },
        status: 'confirmed',
        createdAt: new Date().toISOString()
    };

    // Save to localStorage
    saveBookingToStorage(bookingData);
    
    // Track analytics
    if (window.analytics) {
        window.analytics.trackBooking('completed', {
            bookingId: bookingId,
            amount: calculateTotalPrice(bookingData, bookingData.participants),
            method: paymentMethod
        });
    }
}

function saveBookingToStorage(bookingData) {
    let bookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
    bookings.push(bookingData);
    localStorage.setItem('confirmedBookings', JSON.stringify(bookings));
}

function showPaymentSuccess(bookingId, amount, method) {
    const modalContent = document.querySelector('.booking-modal');
    
    modalContent.innerHTML = `
        <div class="payment-success">
            <i class="fas fa-check-circle"></i>
            <h2>Thanh Toán Thành Công!</h2>
            <div class="success-details">
                <p><strong>Mã đặt tour:</strong> ${bookingId}</p>
                <p><strong>Số tiền:</strong> ${formatCurrency(amount)}</p>
                <p><strong>Phương thức:</strong> ${getPaymentMethodName(method)}</p>
                <p><strong>Thời gian:</strong> ${new Date().toLocaleString('vi-VN')}</p>
            </div>
            <div class="success-actions">
                <button class="cta-button" onclick="printReceipt('${bookingId}')">
                    <i class="fas fa-print"></i> In hóa đơn
                </button>
                <button class="cta-button secondary" onclick="closeModal('bookingConfirmation')">
                    <i class="fas fa-home"></i> Về trang chủ
                </button>
            </div>
        </div>
    `;
}

function printReceipt(bookingId) {
    const printWindow = window.open('', '_blank');
    const bookings = JSON.parse(localStorage.getItem('confirmedBookings') || '[]');
    const booking = bookings.find(b => b.bookingId === bookingId);
    
    if (booking) {
        printWindow.document.write(`
            <html>
                <head>
                    <title>Hóa đơn ${bookingId}</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        .receipt { max-width: 600px; margin: 0 auto; }
                        .header { text-align: center; margin-bottom: 30px; }
                        .details { margin: 20px 0; }
                        .footer { margin-top: 30px; text-align: center; }
                        table { width: 100%; border-collapse: collapse; }
                        td, th { padding: 8px; border-bottom: 1px solid #ddd; }
                    </style>
                </head>
                <body>
                    <div class="receipt">
                        <div class="header">
                            <h2>HÓA ĐƠN THANH TOÁN</h2>
                            <p>Du Lịch Sinh Thái Miền Tây</p>
                            <p>Mã hóa đơn: ${bookingId}</p>
                        </div>
                        <div class="details">
                            <table>
                                <tr><td>Khách hàng:</td><td>${booking.contact.name}</td></tr>
                                <tr><td>Số điện thoại:</td><td>${booking.contact.phone}</td></tr>
                                <tr><td>Email:</td><td>${booking.contact.email}</td></tr>
                                <tr><td>Tour:</td><td>${getDestinationName(booking.destinationId)}</td></tr>
                                <tr><td>Gói:</td><td>${booking.packageName}</td></tr>
                                <tr><td>Số người:</td><td>${booking.participants}</td></tr>
                                <tr><td>Phương thức TT:</td><td>${getPaymentMethodName(booking.payment.method)}</td></tr>
                                <tr><td>Tổng tiền:</td><td>${formatCurrency(calculateTotalPrice(booking, booking.participants))}</td></tr>
                            </table>
                        </div>
                        <div class="footer">
                            <p>Cảm ơn quý khách đã sử dụng dịch vụ!</p>
                            <p>Hotline: 0292 3 123 456</p>
                            <p>${new Date().toLocaleString('vi-VN')}</p>
                        </div>
                    </div>
                </body>
            </html>
        `);
        printWindow.document.close();
        printWindow.print();
    }
}

function getDestinationName(id) {
    const dest = destinations.find(d => d.id === id);
    return dest ? dest.name : 'Unknown';
}

// ===== LOADING OVERLAY =====
function showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    if (overlay) {
        overlay.style.display = show ? 'flex' : 'none';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Khởi tạo payment system
document.addEventListener('DOMContentLoaded', () => {
    initPaymentSystem();
});

// Xuất thêm các hàm mới
window.printReceipt = printReceipt;
window.closeModal = closeModal;
