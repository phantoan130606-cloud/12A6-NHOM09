// reviews.js - Xử lý đánh giá điểm du lịch

// Dữ liệu đánh giá mẫu
const sampleReviews = [
    {
        id: 1,
        destinationId: 1,
        userName: "Nguyễn Thị Mai",
        userAvatar: "https://randomuser.me/api/portraits/women/32.jpg",
        rating: 5,
        date: "2023-10-15",
        comment: "Trải nghiệm tuyệt vời! Cù Lao An Bình thật sự là một thiên đường xanh mát. Homestay rất sạch sẽ, đồ ăn ngon. Sẽ quay lại vào mùa trái cây!"
    },
    {
        id: 2,
        destinationId: 1,
        userName: "Trần Văn Hùng",
        userAvatar: "https://randomuser.me/api/portraits/men/54.jpg",
        rating: 4,
        date: "2023-09-22",
        comment: "Rất thích không khí trong lành và người dân thân thiện. Tuy nhiên, một số dịch vụ cần được cải thiện hơn."
    },
    {
        id: 3,
        destinationId: 2,
        userName: "Lê Minh Anh",
        userAvatar: "https://randomuser.me/api/portraits/women/67.jpg",
        rating: 5,
        date: "2023-11-05",
        comment: "Được ngắm sếu đầu đỏ là trải nghiệm không thể quên. Hướng dẫn viên rất nhiệt tình và am hiểu về hệ sinh thái."
    },
    {
        id: 4,
        destinationId: 2,
        userName: "Phạm Quốc Bảo",
        userAvatar: "https://randomuser.me/api/portraits/men/23.jpg",
        rating: 4,
        date: "2023-10-30",
        comment: "Vườn quốc gia rất rộng và đẹp. Nên đi vào mùa khô để dễ di chuyển và ngắm được nhiều loài chim hơn."
    },
    {
        id: 5,
        destinationId: 3,
        userName: "Hoàng Thị Lan",
        userAvatar: "https://randomuser.me/api/portraits/women/45.jpg",
        rating: 5,
        date: "2023-08-18",
        comment: "Rừng Tràm Trà Sư đẹp như tranh vẽ! Đi xuồng xuyên rừng vào buổi sáng sớm là trải nghiệm nhất định phải thử."
    },
    {
        id: 6,
        destinationId: 4,
        userName: "Đặng Văn Tâm",
        userAvatar: "https://randomuser.me/api/portraits/men/78.jpg",
        rating: 4,
        date: "2023-07-12",
        comment: "Cù lao rất đẹp, trái cây tươi ngon. Thích nhất là được tự tay hái và thưởng thức trái cây ngay tại vườn."
    },
    {
        id: 7,
        destinationId: 5,
        userName: "Vũ Thị Hương",
        userAvatar: "https://randomuser.me/api/portraits/women/89.jpg",
        rating: 5,
        date: "2023-06-25",
        comment: "Thiên đường của trái cây! Đến đúng mùa sầu riêng nên được thưởng thức những trái sầu riêng thơm ngon nhất."
    },
    {
        id: 8,
        destinationId: 6,
        userName: "Bùi Xuân Trường",
        userAvatar: "https://randomuser.me/api/portraits/men/12.jpg",
        rating: 4,
        date: "2023-05-14",
        comment: "Rừng U Minh Hạ hoang sơ và hùng vĩ. Cần chuẩn bị thuốc chống muỗi và mặc quần áo dài tay khi đi tham quan."
    }
];

// Lấy đánh giá từ localStorage hoặc sử dụng mẫu
function getReviews() {
    const savedReviews = localStorage.getItem('destinationReviews');
    if (savedReviews) {
        return JSON.parse(savedReviews);
    }
    return sampleReviews;
}

// Lưu đánh giá
function saveReviews(reviews) {
    localStorage.setItem('destinationReviews', JSON.stringify(reviews));
}

// Tải đánh giá cho một điểm đến
function loadReviews(destinationId) {
    const reviewSection = document.getElementById('reviewSection');
    if (!reviewSection) return;
    
    const allReviews = getReviews();
    const destinationReviews = allReviews.filter(review => review.destinationId === destinationId);
    const destination = destinations.find(d => d.id === destinationId);
    
    if (!destination) return;
    
    // Tính rating trung bình
    const averageRating = destinationReviews.length > 0 
        ? (destinationReviews.reduce((sum, review) => sum + review.rating, 0) / destinationReviews.length).toFixed(1)
        : 0;
    
    reviewSection.innerHTML = `
        <div class="review-section-header">
            <h2>Đánh Giá</h2>
            <div class="rating-summary">
                <div class="average-rating">
                    <span class="rating-number">${averageRating}</span>
                    <div class="rating-stars">
                        ${generateStarRating(averageRating)}
                    </div>
                    <p>${destinationReviews.length} đánh giá</p>
                </div>
                
                <div class="rating-breakdown">
                    ${[5, 4, 3, 2, 1].map(star => {
                        const count = destinationReviews.filter(r => r.rating === star).length;
                        const percentage = destinationReviews.length > 0 ? (count / destinationReviews.length * 100) : 0;
                        return `
                            <div class="rating-bar">
                                <span>${star} sao</span>
                                <div class="bar-container">
                                    <div class="bar" style="width: ${percentage}%"></div>
                                </div>
                                <span>${count}</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        </div>
        
        <div class="reviews-container">
            ${destinationReviews.length > 0 ? 
                destinationReviews.map(review => createReviewHTML(review)).join('') 
                : '<p class="no-reviews">Chưa có đánh giá nào cho điểm đến này. Hãy là người đầu tiên đánh giá!</p>'
            }
        </div>
        
        <div class="review-form">
            <h3>Thêm Đánh Giá Của Bạn</h3>
            <form id="addReviewForm" data-destination="${destinationId}">
                <div class="form-group">
                    <label for="reviewerName">Họ tên *</label>
                    <input type="text" id="reviewerName" required>
                </div>
                
                <div class="form-group">
                    <label for="reviewRating">Đánh giá *</label>
                    <div class="star-rating">
                        ${[1, 2, 3, 4, 5].map(star => `
                            <i class="far fa-star" data-rating="${star}"></i>
                        `).join('')}
                        <input type="hidden" id="reviewRating" value="5" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="reviewComment">Nhận xét *</label>
                    <textarea id="reviewComment" rows="4" required placeholder="Chia sẻ trải nghiệm của bạn về điểm đến này..."></textarea>
                </div>
                
                <button type="submit" class="cta-button">Gửi Đánh Giá</button>
            </form>
        </div>
    `;
    
    // Xử lý rating bằng sao
    initStarRating();
    
    // Xử lý form thêm đánh giá
    document.getElementById('addReviewForm').addEventListener('submit', function(e) {
        e.preventDefault();
        submitReview(destinationId);
    });
}

// Tạo HTML cho một đánh giá
function createReviewHTML(review) {
    const formattedDate = new Date(review.date).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    
    return `
        <div class="review-card">
            <div class="review-header">
                <div class="reviewer-info">
                    <img src="${review.userAvatar}" alt="${review.userName}">
                    <div>
                        <h4>${review.userName}</h4>
                        <div class="review-rating">
                            ${generateStarRating(review.rating)}
                        </div>
                    </div>
                </div>
                <span class="review-date">${formattedDate}</span>
            </div>
            <div class="review-content">
                <p>${review.comment}</p>
            </div>
            <div class="review-actions">
                <button class="helpful-btn" data-review="${review.id}">
                    <i class="fas fa-thumbs-up"></i> Hữu ích (0)
                </button>
            </div>
        </div>
    `;
}

// Xử lý rating bằng sao
function initStarRating() {
    const stars = document.querySelectorAll('.star-rating .fa-star');
    const ratingInput = document.getElementById('reviewRating');
    
    stars.forEach(star => {
        star.addEventListener('mouseover', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            highlightStars(rating);
        });
        
        star.addEventListener('click', function() {
            const rating = parseInt(this.getAttribute('data-rating'));
            ratingInput.value = rating;
            highlightStars(rating);
        });
    });
    
    // Reset khi rời khỏi vùng rating
    document.querySelector('.star-rating').addEventListener('mouseleave', function() {
        const currentRating = parseInt(ratingInput.value);
        highlightStars(currentRating);
    });
}

// Highlight các sao
function highlightStars(rating) {
    const stars = document.querySelectorAll('.star-rating .fa-star');
    stars.forEach(star => {
        const starRating = parseInt(star.getAttribute('data-rating'));
        if (starRating <= rating) {
            star.classList.remove('far');
            star.classList.add('fas');
        } else {
            star.classList.remove('fas');
            star.classList.add('far');
        }
    });
}

// Gửi đánh giá mới
function submitReview(destinationId) {
    const nameInput = document.getElementById('reviewerName');
    const ratingInput = document.getElementById('reviewRating');
    const commentInput = document.getElementById('reviewComment');
    
    if (!nameInput.value.trim() || !commentInput.value.trim()) {
        alert('Vui lòng điền đầy đủ thông tin');
        return;
    }
    
    const newReview = {
        id: Date.now(),
        destinationId: destinationId,
        userName: nameInput.value.trim(),
        userAvatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 100)}.jpg`,
        rating: parseInt(ratingInput.value),
        date: new Date().toISOString().split('T')[0],
        comment: commentInput.value.trim()
    };
    
    // Lấy danh sách reviews hiện tại
    const allReviews = getReviews();
    allReviews.push(newReview);
    saveReviews(allReviews);
    
    // Thông báo thành công
    alert('Cảm ơn bạn đã gửi đánh giá!');
    
    // Reset form
    nameInput.value = '';
    commentInput.value = '';
    ratingInput.value = '5';
    highlightStars(5);
    
    // Tải lại reviews
    loadReviews(destinationId);
}

// Tạo HTML cho star rating
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
window.loadReviews = loadReviews;
