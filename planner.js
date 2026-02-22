// planner.js - Lập kế hoạch lịch trình du lịch

let plannedDestinations = [];
let currentDragItem = null;

document.addEventListener('DOMContentLoaded', function() {
    // Chỉ khởi tạo khi ở trang planner
    if (window.location.hash !== '#planner' && !document.getElementById('planner-page')?.classList.contains('active')) {
        return;
    }
    
    initPlanner();
});

function initPlanner() {
    const plannerContainer = document.getElementById('plannerContainer');
    if (!plannerContainer) return;
    
    // Tải lịch trình đã lưu
    loadSavedItinerary();
    
    plannerContainer.innerHTML = `
        <div class="planner-layout">
            <div class="planner-sidebar">
                <h3>Điểm Đến Có Thể Thêm</h3>
                <div class="destinations-list" id="destinationsList">
                    ${destinations.map(destination => `
                        <div class="planner-item" draggable="true" data-id="${destination.id}">
                            <div class="planner-item-header">
                                <h4>${destination.name}</h4>
                                <span class="planner-item-category">${getCategoryName(destination.category)}</span>
                            </div>
                            <p><i class="fas fa-map-marker-alt"></i> ${destination.province}</p>
                            <p><i class="fas fa-clock"></i> ${getRecommendedDuration(destination.category)}</p>
                            <button class="add-to-itinerary" data-id="${destination.id}">Thêm vào lịch trình</button>
                        </div>
                    `).join('')}
                </div>
                
                <div class="planner-tips">
                    <h4>Mẹo Lập Lịch Trình</h4>
                    <ul>
                        <li>Kéo thả các điểm đến để sắp xếp thứ tự</li>
                        <li>Mỗi ngày nên có 2-3 điểm tham quan</li>
                        <li>Xem xét khoảng cách di chuyển giữa các điểm</li>
                        <li>Thêm thời gian nghỉ ngơi và ăn uống</li>
                    </ul>
                </div>
            </div>
            
            <div class="planner-main">
                <div class="planner-header">
                    <h3>Lịch Trình Của Bạn</h3>
                    <div class="planner-actions">
                        <button id="clearItinerary" class="cta-button">Xóa Tất Cả</button>
                        <button id="saveItinerary" class="cta-button">Lưu Lịch Trình</button>
                        <button id="printItinerary" class="cta-button">
                            <i class="fas fa-print"></i> In
                        </button>
                    </div>
                </div>
                
                <div class="planner-days" id="plannerDays">
                    <!-- Các ngày sẽ được thêm động -->
                </div>
                
                <div class="planner-summary" id="plannerSummary">
                    <!-- Tóm tắt sẽ được thêm động -->
                </div>
            </div>
        </div>
    `;
    
    // Khởi tạo drag and drop
    initDragAndDrop();
    
    // Khởi tạo sự kiện
    initPlannerEvents();
    
    // Hiển thị lịch trình
    renderItinerary();
}

function initDragAndDrop() {
    // Xử lý drag start
    document.querySelectorAll('.planner-item').forEach(item => {
        item.addEventListener('dragstart', function(e) {
            currentDragItem = this;
            this.classList.add('dragging');
            e.dataTransfer.setData('text/plain', this.getAttribute('data-id'));
        });
        
        item.addEventListener('dragend', function() {
            this.classList.remove('dragging');
            currentDragItem = null;
        });
    });
    
    // Xử lý drop zones
    const dropZones = document.querySelectorAll('.day-destinations, .planner-sidebar');
    
    dropZones.forEach(zone => {
        zone.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.classList.add('drag-over');
        });
        
        zone.addEventListener('dragleave', function() {
            this.classList.remove('drag-over');
        });
        
        zone.addEventListener('drop', function(e) {
            e.preventDefault();
            this.classList.remove('drag-over');
            
            const destinationId = parseInt(e.dataTransfer.getData('text/plain'));
            const destination = destinations.find(d => d.id === destinationId);
            
            if (!destination) return;
            
            // Kiểm tra xem đang drop vào đâu
            if (this.classList.contains('day-destinations')) {
                // Thêm vào ngày cụ thể
                const dayIndex = parseInt(this.closest('.planner-day').getAttribute('data-day'));
                addToDay(dayIndex, destinationId);
            } else if (this.classList.contains('planner-sidebar')) {
                // Xóa khỏi lịch trình
                removeFromItinerary(destinationId);
            }
        });
    });
}

function initPlannerEvents() {
    // Nút thêm vào lịch trình
    document.querySelectorAll('.add-to-itinerary').forEach(button => {
        button.addEventListener('click', function() {
            const destinationId = parseInt(this.getAttribute('data-id'));
            addToItinerary(destinationId);
        });
    });
    
    // Nút xóa tất cả
    document.getElementById('clearItinerary').addEventListener('click', clearItinerary);
    
    // Nút lưu lịch trình
    document.getElementById('saveItinerary').addEventListener('click', saveItinerary);
    
    // Nút in lịch trình
    document.getElementById('printItinerary').addEventListener('click', printItinerary);
    
    // Xử lý sắp xếp trong các ngày
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-from-day')) {
            const dayIndex = parseInt(e.target.closest('.planner-day').getAttribute('data-day'));
            const destinationId = parseInt(e.target.getAttribute('data-id'));
            removeFromDay(dayIndex, destinationId);
        }
        
        if (e.target.classList.contains('move-up') || e.target.classList.contains('move-down')) {
            const direction = e.target.classList.contains('move-up') ? -1 : 1;
            const dayIndex = parseInt(e.target.closest('.planner-day').getAttribute('data-day'));
            const destinationId = parseInt(e.target.getAttribute('data-id'));
            moveDestination(dayIndex, destinationId, direction);
        }
        
        if (e.target.classList.contains('add-day')) {
            addDay();
        }
        
        if (e.target.classList.contains('remove-day')) {
            const dayIndex = parseInt(e.target.getAttribute('data-day'));
            removeDay(dayIndex);
        }
    });
}

function loadSavedItinerary() {
    const saved = localStorage.getItem('travelItinerary');
    if (saved) {
        plannedDestinations = JSON.parse(saved);
    } else {
        // Mặc định có 3 ngày trống
        plannedDestinations = [[], [], []];
    }
}

function saveItinerary() {
    localStorage.setItem('travelItinerary', JSON.stringify(plannedDestinations));
    alert('Lịch trình đã được lưu! Bạn có thể tiếp tục chỉnh sửa sau.');
}

function clearItinerary() {
    if (confirm('Bạn có chắc chắn muốn xóa toàn bộ lịch trình?')) {
        plannedDestinations = [[], [], []];
        renderItinerary();
        localStorage.removeItem('travelItinerary');
    }
}

function addToItinerary(destinationId) {
    // Kiểm tra xem đã có trong lịch trình chưa
    for (let day of plannedDestinations) {
        if (day.includes(destinationId)) {
            alert('Điểm này đã có trong lịch trình của bạn!');
            return;
        }
    }
    
    // Thêm vào ngày đầu tiên còn trống
    for (let i = 0; i < plannedDestinations.length; i++) {
        if (plannedDestinations[i].length < 3) { // Tối đa 3 điểm/ngày
            plannedDestinations[i].push(destinationId);
            renderItinerary();
            return;
        }
    }
    
    // Nếu tất cả các ngày đều đầy, thêm ngày mới
    plannedDestinations.push([destinationId]);
    renderItinerary();
}

function addToDay(dayIndex, destinationId) {
    // Kiểm tra xem đã có trong lịch trình chưa
    for (let day of plannedDestinations) {
        if (day.includes(destinationId)) {
            alert('Điểm này đã có trong lịch trình của bạn!');
            return;
        }
    }
    
    // Thêm vào ngày được chỉ định
    if (!plannedDestinations[dayIndex]) {
        plannedDestinations[dayIndex] = [];
    }
    
    plannedDestinations[dayIndex].push(destinationId);
    renderItinerary();
}

function removeFromItinerary(destinationId) {
    for (let day of plannedDestinations) {
        const index = day.indexOf(destinationId);
        if (index !== -1) {
            day.splice(index, 1);
            renderItinerary();
            return;
        }
    }
}

function removeFromDay(dayIndex, destinationId) {
    if (plannedDestinations[dayIndex]) {
        const index = plannedDestinations[dayIndex].indexOf(destinationId);
        if (index !== -1) {
            plannedDestinations[dayIndex].splice(index, 1);
            renderItinerary();
        }
    }
}

function moveDestination(dayIndex, destinationId, direction) {
    const day = plannedDestinations[dayIndex];
    if (!day) return;
    
    const currentIndex = day.indexOf(destinationId);
    if (currentIndex === -1) return;
    
    const newIndex = currentIndex + direction;
    
    // Kiểm tra giới hạn
    if (newIndex >= 0 && newIndex < day.length) {
        // Hoán đổi vị trí
        [day[currentIndex], day[newIndex]] = [day[newIndex], day[currentIndex]];
        renderItinerary();
    }
}

function addDay() {
    plannedDestinations.push([]);
    renderItinerary();
}

function removeDay(dayIndex) {
    if (plannedDestinations.length <= 1) {
        alert('Cần ít nhất 1 ngày trong lịch trình!');
        return;
    }
    
    if (plannedDestinations[dayIndex].length > 0) {
        if (!confirm('Ngày này có điểm đến. Xóa ngày sẽ xóa tất cả điểm đến trong ngày. Tiếp tục?')) {
            return;
        }
    }
    
    plannedDestinations.splice(dayIndex, 1);
    renderItinerary();
}

function renderItinerary() {
    const plannerDays = document.getElementById('plannerDays');
    const plannerSummary = document.getElementById('plannerSummary');
    
    if (!plannerDays || !plannerSummary) return;
    
    // Hiển thị các ngày
    plannerDays.innerHTML = '';
    
    plannedDestinations.forEach((dayDestinations, dayIndex) => {
        const dayElement = document.createElement('div');
        dayElement.className = 'planner-day';
        dayElement.setAttribute('data-day', dayIndex);
        
        dayElement.innerHTML = `
            <div class="day-header">
                <h4>Ngày ${dayIndex + 1}</h4>
                <div class="day-actions">
                    <button class="move-up-day" ${dayIndex === 0 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-up"></i>
                    </button>
                    <button class="move-down-day" ${dayIndex === plannedDestinations.length - 1 ? 'disabled' : ''}>
                        <i class="fas fa-arrow-down"></i>
                    </button>
                    <button class="remove-day" data-day="${dayIndex}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
            
            <div class="day-destinations" id="dayDestinations${dayIndex}">
                ${dayDestinations.length === 0 ? 
                    '<p class="empty-day">Kéo thả điểm đến vào đây hoặc nhấn "Thêm vào lịch trình"</p>' 
                    : dayDestinations.map(destId => {
                        const destination = destinations.find(d => d.id === destId);
                        if (!destination) return '';
                        
                        return `
                            <div class="day-destination" draggable="true" data-id="${destination.id}">
                                <div class="destination-info">
                                    <h5>${destination.name}</h5>
                                    <p><i class="fas fa-map-marker-alt"></i> ${destination.province}</p>
                                    <p><i class="fas fa-clock"></i> ${getRecommendedDuration(destination.category)}</p>
                                </div>
                                <div class="destination-actions">
                                    <button class="move-up" data-id="${destination.id}">
                                        <i class="fas fa-arrow-up"></i>
                                    </button>
                                    <button class="move-down" data-id="${destination.id}">
                                        <i class="fas fa-arrow-down"></i>
                                    </button>
                                    <button class="remove-from-day" data-id="${destination.id}">
                                        <i class="fas fa-times"></i>
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')
                }
            </div>
            
            <div class="day-summary">
                <p><strong>Tổng thời gian ước tính:</strong> ${calculateDayDuration(dayDestinations)}</p>
                <p><strong>Số điểm đến:</strong> ${dayDestinations.length}</p>
            </div>
        `;
        
        plannerDays.appendChild(dayElement);
    });
    
    // Thêm nút thêm ngày
    const addDayElement = document.createElement('div');
    addDayElement.className = 'add-day-container';
    addDayElement.innerHTML = `
        <button class="cta-button add-day">
            <i class="fas fa-plus"></i> Thêm Ngày
        </button>
    `;
    plannerDays.appendChild(addDayElement);
    
    // Hiển thị tóm tắt
    renderSummary();
}

function renderSummary() {
    const plannerSummary = document.getElementById('plannerSummary');
    if (!plannerSummary) return;
    
    const allDestinations = plannedDestinations.flat();
    const totalDays = plannedDestinations.length;
    const totalDestinations = allDestinations.length;
    
    // Tính tổng thời gian ước tính
    let totalDuration = 0;
    allDestinations.forEach(destId => {
        const destination = destinations.find(d => d.id === destId);
        if (destination) {
            totalDuration += getDurationInHours(destination.category);
        }
    });
    
    // Tính khoảng cách di chuyển (ước tính)
    const estimatedDistance = totalDestinations * 50; // Giả sử 50km giữa các điểm
    
    plannerSummary.innerHTML = `
        <h3>Tóm Tắt Lịch Trình</h3>
        <div class="summary-stats">
            <div class="stat-item">
                <i class="fas fa-calendar-alt fa-2x"></i>
                <div>
                    <h4>${totalDays}</h4>
                    <p>Ngày</p>
                </div>
            </div>
            
            <div class="stat-item">
                <i class="fas fa-map-marked-alt fa-2x"></i>
                <div>
                    <h4>${totalDestinations}</h4>
                    <p>Điểm đến</p>
                </div>
            </div>
            
            <div class="stat-item">
                <i class="fas fa-clock fa-2x"></i>
                <div>
                    <h4>${Math.round(totalDuration)}</h4>
                    <p>Giờ tham quan</p>
                </div>
            </div>
            
            <div class="stat-item">
                <i class="fas fa-road fa-2x"></i>
                <div>
                    <h4>${estimatedDistance}</h4>
                    <p>Km di chuyển</p>
                </div>
            </div>
        </div>
        
        <div class="summary-actions">
            <button id="exportItinerary" class="cta-button">
                <i class="fas fa-download"></i> Xuất PDF
            </button>
            <button id="shareItinerary" class="cta-button">
                <i class="fas fa-share-alt"></i> Chia Sẻ
            </button>
            <button id="bookAllTours" class="cta-button">
                <i class="fas fa-shopping-cart"></i> Đặt Tất Cả Tour
            </button>
        </div>
    `;
    
    // Thêm sự kiện cho các nút trong summary
    document.getElementById('exportItinerary')?.addEventListener('click', exportItinerary);
    document.getElementById('shareItinerary')?.addEventListener('click', shareItinerary);
    document.getElementById('bookAllTours')?.addEventListener('click', bookAllTours);
}

// Hàm tiện ích
function getCategoryName(category) {
    const categories = {
        'cu-lao': 'Cù Lao',
        'vuon-quoc-gia': 'Vườn Quốc Gia',
        'miet-vuon': 'Miệt Vườn',
        'he-sinh-thai': 'Hệ Sinh Thái Đặc Biệt'
    };
    return categories[category] || category;
}

function getRecommendedDuration(category) {
    const durations = {
        'cu-lao': '4-6 giờ',
        'vuon-quoc-gia': '6-8 giờ',
        'miet-vuon': '3-4 giờ',
        'he-sinh-thai': '5-7 giờ'
    };
    return durations[category] || '4-5 giờ';
}

function getDurationInHours(category) {
    const durations = {
        'cu-lao': 5,
        'vuon-quoc-gia': 7,
        'miet-vuon': 3.5,
        'he-sinh-thai': 6
    };
    return durations[category] || 4;
}

function calculateDayDuration(dayDestinations) {
    let totalHours = 0;
    dayDestinations.forEach(destId => {
        const destination = destinations.find(d => d.id === destId);
        if (destination) {
            totalHours += getDurationInHours(destination.category);
        }
    });
    
    // Thêm thời gian di chuyển và nghỉ ngơi
    totalHours += dayDestinations.length * 0.5; // 30 phút di chuyển giữa các điểm
    totalHours += 1.5; // Thời gian ăn trưa
    
    return `${Math.round(totalHours)} giờ`;
}

function printItinerary() {
    window.print();
}

function exportItinerary() {
    alert('Tính năng xuất PDF sẽ được cập nhật trong phiên bản tiếp theo!');
}

function shareItinerary() {
    if (navigator.share) {
        navigator.share({
            title: 'Lịch trình du lịch Miền Tây của tôi',
            text: 'Tôi vừa lập một lịch trình du lịch sinh thái Miền Tây thú vị!',
            url: window.location.href
        });
    } else {
        prompt('Sao chép liên kết để chia sẻ:', window.location.href);
    }
}

function bookAllTours() {
    alert('Tính năng đặt tất cả tour sẽ được cập nhật trong phiên bản tiếp theo!');
}

// Xuất hàm để sử dụng trong file khác
window.initPlanner = initPlanner;
