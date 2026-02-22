// map-enhanced.js - Bản đồ điểm du lịch nâng cao

let map = null;
let markers = [];
let currentLayer = 'all';

document.addEventListener('DOMContentLoaded', function() {
    // Chỉ khởi tạo khi ở trang map
    if (window.location.hash !== '#map' && !document.getElementById('map-page')?.classList.contains('active')) {
        return;
    }
    
    initMap();
});

function initMap() {
    // Khởi tạo bản đồ với tâm là Miền Tây
    map = L.map('map').setView([10.0, 105.5], 8);
    
    // Thêm tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(map);
    
    // Thêm markers cho các điểm đến
    addDestinationMarkers();
    
    // Xử lý layer controls
    initLayerControls();
    
    // Hiển thị danh sách điểm đến bên dưới bản đồ
    updateMapDestinationsList();
}

function addDestinationMarkers() {
    // Xóa markers cũ
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    // Lọc điểm đến theo layer hiện tại
    let filteredDestinations;
    if (currentLayer === 'all') {
        filteredDestinations = destinations;
    } else {
        filteredDestinations = destinations.filter(d => d.category === currentLayer);
    }
    
    // Thêm markers mới
    filteredDestinations.forEach(destination => {
        const marker = L.marker(destination.coordinates)
            .addTo(map)
            .bindPopup(`
                <div class="map-popup">
                    <img src="${destination.image}" alt="${destination.name}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 4px; margin-bottom: 10px;">
                    <h3 style="margin: 0 0 5px 0;">${destination.name}</h3>
                    <p style="margin: 0 0 5px 0; color: #666;"><i class="fas fa-map-marker-alt"></i> ${destination.province}</p>
                    <p style="margin: 0 0 10px 0;">${destination.description.substring(0, 100)}...</p>
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <span style="color: #ff9800;">
                            ${generateStarRating(destination.rating)}
                            ${destination.rating}
                        </span>
                        <button onclick="showDestinationDetail(${destination.id})" style="background: #2e7d32; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">
                            Xem chi tiết
                        </button>
                    </div>
                </div>
            `);
        
        // Thêm sự kiện click để xem chi tiết
        marker.on('click', function() {
            // Mở popup
            marker.openPopup();
            
            // Cuộn đến điểm đến trong danh sách
            highlightDestinationInList(destination.id);
        });
        
        markers.push(marker);
    });
    
    // Fit bounds nếu có markers
    if (filteredDestinations.length > 0) {
        const markerGroup = L.featureGroup(markers);
        map.fitBounds(markerGroup.getBounds().pad(0.1));
    }
}

function initLayerControls() {
    const layerButtons = document.querySelectorAll('.map-layer');
    
    layerButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Xóa active class khỏi tất cả buttons
            layerButtons.forEach(btn => btn.classList.remove('active'));
            
            // Thêm active class cho button được click
            this.classList.add('active');
            
            // Cập nhật layer hiện tại
            currentLayer = this.getAttribute('data-layer');
            
            // Cập nhật markers
            addDestinationMarkers();
            
            // Cập nhật danh sách điểm đến
            updateMapDestinationsList();
        });
    });
}

function updateMapDestinationsList() {
    const mapDestinations = document.getElementById('mapDestinations');
    if (!mapDestinations) return;
    
    // Lọc điểm đến theo layer hiện tại
    let filteredDestinations;
    if (currentLayer === 'all') {
        filteredDestinations = destinations;
    } else {
        filteredDestinations = destinations.filter(d => d.category === currentLayer);
    }
    
    mapDestinations.innerHTML = '';
    
    if (filteredDestinations.length === 0) {
        mapDestinations.innerHTML = `
            <div class="no-destinations" style="text-align: center; padding: 40px; grid-column: 1 / -1;">
                <i class="fas fa-map-marked-alt" style="font-size: 60px; color: #ccc; margin-bottom: 20px;"></i>
                <h3>Không có điểm nào trong danh mục này</h3>
                <p>Hãy thử chọn danh mục khác để xem các điểm du lịch sinh thái hấp dẫn.</p>
            </div>
        `;
        return;
    }
    
    // Tạo danh sách điểm đến
    filteredDestinations.forEach(destination => {
        const destinationElement = document.createElement('div');
        destinationElement.className = 'map-destination-card';
        destinationElement.dataset.id = destination.id;
        
        destinationElement.innerHTML = `
            <div class="map-destination-image">
                <img src="${destination.image}" alt="${destination.name}" loading="lazy">
            </div>
            <div class="map-destination-content">
                <h4>${destination.name}</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${destination.province}</p>
                <p><i class="fas fa-star"></i> ${destination.rating}</p>
                <p class="map-destination-desc">${destination.description.substring(0, 80)}...</p>
                <button class="cta-button view-on-map" data-id="${destination.id}">
                    <i class="fas fa-map-marker-alt"></i> Xem trên bản đồ
                </button>
                <button class="cta-button view-details" data-id="${destination.id}">
                    Xem chi tiết
                </button>
            </div>
        `;
        
        mapDestinations.appendChild(destinationElement);
    });
    
    // Xử lý sự kiện cho các nút
    document.querySelectorAll('.view-on-map').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            focusOnDestination(id);
        });
    });
    
    document.querySelectorAll('.view-details').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.getAttribute('data-id'));
            showDestinationDetail(id);
        });
    });
    
    // Xử lý click vào card
    document.querySelectorAll('.map-destination-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            showDestinationDetail(id);
        });
    });
}

function focusOnDestination(id) {
    const destination = destinations.find(d => d.id === id);
    if (!destination || !map) return;
    
    // Di chuyển bản đồ đến điểm đến
    map.setView(destination.coordinates, 13);
    
    // Mở popup của marker tương ứng
    const marker = markers.find(m => {
        const latlng = m.getLatLng();
        return latlng.lat === destination.coordinates[0] && latlng.lng === destination.coordinates[1];
    });
    
    if (marker) {
        marker.openPopup();
    }
    
    // Highlight trong danh sách
    highlightDestinationInList(id);
}

function highlightDestinationInList(id) {
    // Xóa highlight cũ
    document.querySelectorAll('.map-destination-card').forEach(card => {
        card.classList.remove('highlighted');
    });
    
    // Thêm highlight mới
    const targetCard = document.querySelector(`.map-destination-card[data-id="${id}"]`);
    if (targetCard) {
        targetCard.classList.add('highlighted');
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Hàm tiện ích
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

// Xuất hàm để sử dụng trong file khác
window.initMap = initMap;
window.focusOnDestination = focusOnDestination;
