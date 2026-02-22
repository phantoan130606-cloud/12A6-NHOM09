# Website Du Lịch Sinh Thái Miền Tây

## Mô tả dự án
Website giới thiệu các điểm du lịch sinh thái tại vùng Đồng Bằng Sông Cửu Long, với 12 điểm đến đặc trưng được phân loại theo 4 loại hình chính.

## Tính năng chính
1. **Trang chủ**: Giới thiệu tổng quan và 3 điểm đến nổi bật
2. **Giới thiệu**: Thông tin về mục đích website, nhóm thực hiện và địa bàn nghiên cứu
3. **Điểm đến**: Danh sách 12 điểm du lịch với tính năng lọc theo loại hình
4. **Chi tiết**: Trang thông tin đầy đủ cho từng điểm du lịch
5. **Bản đồ**: Bản đồ tương tác hiển thị vị trí các điểm du lịch
6. **Liên hệ**: Form liên hệ và thông tin nhóm

## Cấu trúc file

## Công nghệ sử dụng
- HTML5, CSS3, JavaScript thuần
- Leaflet.js cho bản đồ tương tác
- Font Awesome cho icons
- Hình ảnh từ Unsplash
- Responsive design

## Hướng dẫn sử dụng

### Cách 1: Mở trực tiếp
1. Mở file `index.html` bằng trình duyệt web (Chrome, Firefox, Edge)

### Cách 2: Chạy local server
1. Cài đặt Node.js (nếu chưa có)
2. Mở terminal trong thư mục project
3. Chạy lệnh: `npx serve`
4. Truy cập địa chỉ hiển thị trong terminal

### Cách 3: Upload lên hosting
1. Nén tất cả file thành file zip
2. Upload lên hosting hỗ trợ static website
3. Truy cập website qua domain

## Tính năng kỹ thuật

### 1. Responsive Design
- Tối ưu cho desktop, tablet và mobile
- Navigation mobile-friendly
- Hình ảnh responsive

### 2. Performance
- Lazy loading cho hình ảnh
- Tối ưu hóa CSS và JavaScript
- Sử dụng CDN cho thư viện

### 3. Accessibility
- Semantic HTML
- Alt text cho hình ảnh
- Keyboard navigation
- Contrast màu đạt chuẩn

### 4. SEO
- Meta tags đầy đủ
- Structured data
- Sitemap (có thể thêm)
- URL semantic

## Dữ liệu điểm du lịch
Website bao gồm 12 điểm du lịch chia thành 4 loại hình:

### 1. Cù Lao (3 điểm)
- Cù Lao An Bình (Vĩnh Long)
- Cù Lao Tân Phong (Bến Tre)
- Cù Lao Thanh Trị (Trà Vinh)

### 2. Vườn Quốc Gia (2 điểm)
- Vườn quốc gia Tràm Chim (Đồng Tháp)
- Khu bảo tồn sinh thái Đồng Tháp Mười

### 3. Miệt Vườn (3 điểm)
- Nhà vườn Cai Cường (Vĩnh Long)
- Vườn trái cây Cái Mơn (Bến Tre)
- Miệt vườn sông Hậu (Vĩnh Long)

### 4. Hệ Sinh Thái Đặc Biệt (4 điểm)
- Rừng tràm Trà Sư (An Giang)
- Rừng ngập mặn Bến Tre
- Rừng dừa Bến Tre
- Sân chim Vàm Hồ (Bến Tre)

## Thông tin mỗi điểm du lịch
- Tên điểm du lịch
- Địa chỉ, diện tích
- Loại hình
- Hệ sinh thái đặc trưng
- Mùa đẹp nhất để tham quan
- Hoạt động trải nghiệm
- Dịch vụ đi kèm
- Giá vé, giờ mở cửa
- Lộ trình tham quan gợi ý
- Quy tắc bảo vệ môi trường
- Hình ảnh minh họa
- Đánh giá (rating)

## Hướng dẫn phát triển

### Thêm điểm du lịch mới
1. Mở file `data.js`
2. Thêm object mới vào mảng `destinations`
3. Điền đầy đủ thông tin theo cấu trúc có sẵn
4. Lưu file và refresh trình duyệt

### Thay đổi giao diện
1. Mở file `style.css`
2. Sửa các biến CSS ở phần `:root` để thay đổi màu sắc
3. Sửa các class CSS tương ứng

### Thay đổi thông tin nhóm
1. Mở file `index.html`
2. Tìm phần "Nhóm Thực Hiện" trong trang About
3. Cập nhật thông tin thành viên

## Browser Support
- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+
- Opera 50+

## License
Dự án được phát triển cho mục đích giáo dục và nghiên cứu.

## Tác giả
Nhóm phát triển Website Du Lịch Sinh Thái Miền Tây

## Phiên bản
1.0.0 - Tháng 12, 2023

## Liên hệ
Email: info@dulichsinhthaimientay.vn
Điện thoại: 0292 3 123 456
Địa chỉ: 123 Đường 3/2, TP. Cần Thơ