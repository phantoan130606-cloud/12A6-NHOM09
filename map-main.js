// map-main.js - Bản đồ chính trang "Bản Đồ"
document.addEventListener('DOMContentLoaded', function() {
    console.log('map-main.js loaded');
    
    // Kiểm tra xem có trang bản đồ không
    if (document.getElementById('map-page')) {
        console.log('Trang bản đồ được tìm thấy');
        
        // Lắng nghe sự kiện chuyển trang
        document.addEventListener('pageChanged', function(e) {
            if (e.detail === 'map') {
                console.log('Đã chuyển đến trang bản đồ');
                // Đợi một chút để DOM cập nhật
                setTimeout(initMainMap, 100);
            }
        });
        
        // Nếu đang ở trang bản đồ khi tải trang
        if (document.getElementById('map-page').classList.contains('active')) {
            setTimeout(initMainMap, 300);
        }
    }
});

let mainMap = null;
let mainMarkers = [];
let currentMainLayer = 'all';
let focusMarker = null;

function initMainMap() {
    console.log('Khởi tạo bản đồ chính...');
    
    const mapElement = document.getElementById('map');
    if (!mapElement) {
        console.error('Không tìm thấy phần tử #map');
        return;
    }
    
    // Nếu bản đồ đã tồn tại, xóa đi để tạo mới
    if (mainMap) {
        mainMap.remove();
        mainMap = null;
        mainMarkers = [];
    }
    
    try {
        // Tạo bản đồ mới
        mainMap = L.map('map').setView([10.0, 105.5], 8);
        
        // Thêm tile layer
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 18
        }).addTo(mainMap);
        
        console.log('Bản đồ đã được tạo');
        
        // Thêm markers
        addMarkersToMainMap();
        
        // Khởi tạo controls
        initMainMapControls();
        
        // Hiển thị danh sách
        updateMainMapDestinationsList();
        
        // Fix kích thước
        setTimeout(() => {
            if (mainMap) {
                mainMap.invalidateSize();
            }
        }, 200);
        
        console.log(`Đã thêm ${mainMarkers.length} markers`);
        
    } catch (error) {
        console.error('Lỗi khi tạo bản đồ:', error);
    }
}

function addMarkersToMainMap() {
    if (!mainMap || !window.destinations) {
        console.error('Bản đồ hoặc dữ liệu không sẵn sàng');
        return;
    }
    
    // Xóa markers cũ
    mainMarkers.forEach(marker => {
        if (mainMap.hasLayer(marker)) {
            mainMap.removeLayer(marker);
        }
    });
    mainMarkers = [];
    
    // Thêm markers mới
    destinations.forEach(destination => {
        if (!destination.coordinates || !Array.isArray(destination.coordinates)) {
            console.warn(`Điểm ${destination.name} thiếu tọa độ`);
            return;
        }
        
        try {
            const marker = L.marker(destination.coordinates)
                .addTo(mainMap)
                .bindPopup(createMainMapPopup(destination));
            
            marker.on('click', function() {
                this.openPopup();
                highlightDestinationInMainList(destination.id);
            });
            
            mainMarkers.push(marker);
        } catch (error) {
            console.error(`Lỗi tạo marker cho ${destination.name}:`, error);
        }
    });
    
    // Điều chỉnh view
    if (mainMarkers.length > 0) {
        const group = L.featureGroup(mainMarkers);
        mainMap.fitBounds(group.getBounds().pad(0.1));
    }
}

function createMainMapPopup(destination) {
    return `
        <div style="min-width: 250px; max-width: 300px;">
            <img src="${destination.image}" alt="${destination.name}" 
                 style="width:100%; height:120px; object-fit:cover; border-radius:4px; margin-bottom:10px;">
            <h4 style="margin:0 0 5px 0; color:#1b5e20; font-size:16px;">${destination.name}</h4>
            <p style="margin:0 0 5px 0; color:#666; font-size:14px;">
                <i class="fas fa-map-marker-alt"></i> ${destination.province}
            </p>
            <p style="margin:0 0 8px 0; font-size:14px; color:#333;">
                ${destination.description.substring(0, 80)}...
            </p>
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span style="color:#ff9800; font-size:14px;">
                    <i class="fas fa-star"></i> ${destination.rating}
                </span>
                
            </div>
        </div>
    `;
}

function initMainMapControls() {
    const container = document.getElementById('map-page');
    if (!container) return;
    
    const layerButtons = container.querySelectorAll('.map-layer');
    
    layerButtons.forEach(button => {
        // Xóa event cũ
        const newButton = button.cloneNode(true);
        button.parentNode.replaceChild(newButton, button);
        
        // Thêm event mới
        newButton.addEventListener('click', function() {
            // Cập nhật active
            layerButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Lọc markers
            currentMainLayer = this.getAttribute('data-layer');
            filterMainMapMarkers();
            updateMainMapDestinationsList();
        });
    });
}

function filterMainMapMarkers() {
    if (!mainMap) return;
    
    mainMarkers.forEach((marker, index) => {
        const destination = destinations[index];
        if (!destination) return;
        
        const shouldShow = currentMainLayer === 'all' || 
                          destination.category === currentMainLayer;
        
        if (shouldShow && !mainMap.hasLayer(marker)) {
            marker.addTo(mainMap);
        } else if (!shouldShow && mainMap.hasLayer(marker)) {
            mainMap.removeLayer(marker);
        }
    });
}

function updateMainMapDestinationsList() {
    const container = document.getElementById('mapDestinations');
    if (!container) return;
    
    // Lọc destinations
    let filteredDestinations;
    if (currentMainLayer === 'all') {
        filteredDestinations = destinations;
    } else {
        filteredDestinations = destinations.filter(d => d.category === currentMainLayer);
    }
    
    if (filteredDestinations.length === 0) {
        container.innerHTML = `
            <div style="grid-column:1/-1; text-align:center; padding:40px; color:#666;">
                <i class="fas fa-map-marked-alt" style="font-size:60px; color:#ccc; margin-bottom:20px;"></i>
                <h3 style="color:#666; margin-bottom:10px;">Không có điểm nào</h3>
                <p style="color:#999;">Hãy thử chọn danh mục khác</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = filteredDestinations.map(dest => `
        <div class="map-destination-card" data-id="${dest.id}">
            <div class="map-destination-image">
                <img src="${dest.image}" alt="${dest.name}" loading="lazy">
            </div>
            <div class="map-destination-content">
                <h4>${dest.name}</h4>
                <p><i class="fas fa-map-marker-alt"></i> ${dest.province}</p>
                <p><i class="fas fa-star"></i> ${dest.rating}</p>
                <p class="map-destination-desc">${dest.description.substring(0, 80)}...</p>
                <button class="cta-button view-on-map-main" data-id="${dest.id}">
                    <i class="fas fa-map-marker-alt"></i> Xem trên bản đồ
                </button>
            </div>
        </div>
    `).join('');
    
    // Thêm event listeners
    container.querySelectorAll('.view-on-map-main').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const id = parseInt(this.dataset.id);
            focusOnMainMapDestination(id);
        });
    });
    
    container.querySelectorAll('.map-destination-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            if (window.showDestinationDetail) {
                window.showDestinationDetail(id);
            }
        });
    });
}

function focusOnMainMapDestination(id) {
    if (!mainMap) return;

    const destination = destinations.find(d => d.id === id);
    if (!destination || !destination.coordinates) return;

    // Zoom mượt tới vị trí
    mainMap.flyTo(destination.coordinates, 14, {
        duration: 1.2
    });

    // Xóa marker focus cũ nếu có
    if (focusMarker) {
        mainMap.removeLayer(focusMarker);
    }

    // Tạo icon đỏ nổi bật
    const redIcon = L.icon({
        iconUrl: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
        iconSize: [32, 32]
    });

    // Tạo marker mới nổi bật
    focusMarker = L.marker(destination.coordinates, { icon: redIcon })
        .addTo(mainMap)
        .bindPopup(createMainMapPopup(destination))
        .openPopup();

    highlightDestinationInMainList(id);
}

function highlightDestinationInMainList(id) {
    const cards = document.querySelectorAll('#mapDestinations .map-destination-card');
    cards.forEach(card => {
        card.classList.remove('highlighted');
    });
    
    const targetCard = document.querySelector(`#mapDestinations .map-destination-card[data-id="${id}"]`);
    if (targetCard) {
        targetCard.classList.add('highlighted');
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Xuất hàm
window.initMainMap = initMainMap;
window.focusOnMainMapDestination = focusOnMainMapDestination;