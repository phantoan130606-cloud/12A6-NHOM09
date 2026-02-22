// data.js - Dữ liệu các điểm du lịch sinh thái Miền Tây

const destinations = [
    {
        id: 1,
        name: "Cù Lao An Bình",
        province: "Vĩnh Long",
        category: "cu-lao",
        rating: 4.7,
        description: "Một cù lao xanh mát nằm giữa sông Tiền, nổi tiếng với vườn trái cây trĩu quả và các homestay sinh thái. Du khách có thể trải nghiệm cuộc sống miền sông nước, chèo xuồng ba lá và thưởng thức trái cây tại vườn.",
        longDescription: `
            <p>Cù Lao An Bình là một trong những điểm du lịch sinh thái nổi tiếng nhất tại Vĩnh Long. Với diện tích khoảng 60km², cù lao này được bao bọc bởi sông Tiền, tạo nên một hệ sinh thái đặc biệt với nhiều loài động thực vật phong phú.</p>
            <p>Đến đây, du khách có thể:</p>
            <ul>
                <li>Tham quan các vườn trái cây đặc sản: chôm chôm, sầu riêng, măng cụt</li>
                <li>Trải nghiệm đời sống người dân địa phương tại các homestay</li>
                <li>Tham gia các hoạt động như chèo xuồng, câu cá, thu hoạch trái cây</li>
                <li>Thưởng thức ẩm thực đặc trưng: cá lóc nướng trui, lẩu cá linh bông điên điển</li>
            </ul>
            <p>Thời gian lý tưởng để tham quan là từ tháng 11 đến tháng 5, khi trái cây vào mùa và thời tiết mát mẻ.</p>
        `,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS6IHCOTmgDjsgTZa9GfPvNNYGLBPyADfxulQ&shttps://r2.nucuoimekong.com/wp-content/uploads/cu-lao-an-binh.jpg",
        images: [
            "https://mia.vn/media/uploads/blog-du-lich/kham-pha-cu-lao-an-binh-voi-khong-gian-miet-vuon-dam-chat-mien-tay-1662980957.jpg",
            "https://cdn.nhandan.vn/images/78d92bfef5333421c1cfa9f19aa2572af2f6454a381555b801846adcfda20221d2703ac32e0b55d0568773904a1cf11e380f8adc3c6507640ba7be77b714fc2173bacb55bd6d045e307cfb612b1a1fbd/f5831c757b1a52d4411758930db85772.jpg",
            "https://mia.vn/media/uploads/blog-du-lich/cu-lao-an-binh-mua-trai-chin-voi-nhung-kinh-nghiem-checkin-sieu-xinh-1663000611.jpg"
        ],
        coordinates: [10.1234, 105.9876],
        activities: ["Tham quan vườn trái cây", "Chèo xuồng", "Homestay", "Ẩm thực địa phương"],
        bestTime: "Tháng 11 - Tháng 5",
        entryFee: "Miễn phí (Chi phí dịch vụ riêng)",
        tourPackages: [
            { name: "Tour 1 ngày", price: 500000, duration: "1 ngày" },
            { name: "Tour 2 ngày 1 đêm", price: 1500000, duration: "2 ngày" }
        ]
    },
    {
        id: 5,
        name: "Vườn Trái Cây Cái Mơn",
        province: "Bến Tre",
        category: "miet-vuon",
        rating: 4.6,
        description: "Nơi được mệnh danh là 'vương quốc trái cây' của Bến Tre với hàng trăm loại trái cây nhiệt đới, đặc biệt nổi tiếng với sầu riêng, chôm chôm, măng cụt và các giống cây ăn trái đặc sản.",
        longDescription: `
            <p>Vườn trái cây Cái Mơn thuộc huyện Chợ Lách, tỉnh Bến Tre, là một trong những vùng chuyên canh cây ăn trái lớn nhất Đồng bằng sông Cửu Long. Nơi đây không chỉ nổi tiếng với sản lượng trái cây dồi dào mà còn là điểm đến du lịch sinh thái hấp dẫn.</p>
            <p>Đặc điểm nổi bật:</p>
            <ul>
                <li>Diện tích vườn trái cây lên đến hàng nghìn hecta</li>
                <li>Hơn 50 loại trái cây nhiệt đới được trồng tại đây</li>
                <li>Nhiều giống cây đặc sản quý hiếm được bảo tồn và phát triển</li>
                <li>Kết hợp du lịch sinh thái với nghiên cứu nông nghiệp</li>
            </ul>
            <p>Trải nghiệm độc đáo:</p>
            <ul>
                <li>Tham quan vườn trái cây theo mùa</li>
                <li>Tự tay hái và thưởng thức trái cây tại vườn</li>
                <li>Tìm hiểu quy trình trồng và chăm sóc cây ăn trái</li>
                <li>Tham quan các cơ sở ươm giống cây trái nổi tiếng</li>
                <li>Mua sắm trái cây tươi và đặc sản địa phương</li>
            </ul>
        `,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRU3kQgKXk9ecwcUneJnONGdo6sqADpmcWoVg&s",
        images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTOdvHFTt5qaQAZUcSJu4nJD2dvv7-EMEW7Cg&s",
            "https://letstours.com/wp-content/uploads/2019/09/vuon-trai-cay-cai-mon-1200x900.jpg",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcScLP-sV5gIQVCkwpXBjrtWr3h99hve48D7Jw&s"
        ],
        coordinates: [10.2000, 106.2000],
        activities: ["Tham quan vườn trái cây", "Hái trái cây", "Tìm hiểu nông nghiệp", "Mua sắm đặc sản"],
        bestTime: "Tháng 3 - Tháng 8 ",
        entryFee: "50.000 VND/người",
        tourPackages: [
            { name: "Tour nửa ngày", price: 250000, duration: "4 giờ" },
            { name: "Tour kết hợp sông nước", price: 600000, duration: "8 giờ" }
        ]
  
    },
    {
        id: 3,
        name: "Khu du lịch sinh thái Lan Vương",
        province: "Bến Tre",
        category: "miet-vuon",
        rating: 4.7,
        description: "Khu du lịch sinh thái Lan Vương là điểm đến nổi bật tại Bến Tre, mang đậm nét văn hóa miền Tây sông nước. Đến với Lan Vương, du khách được hòa mình vào không gian thiên nhiên trong lành, những hàng dừa xanh mát và khung cảnh yên bình của vùng quê Nam Bộ.",
        longDescription: `
            <p>Tại đây, du khách có thể tham gia nhiều hoạt động dân dã như chèo xuồng, đi cầu khỉ, tát mương bắt cá, chơi các trò chơi tập thể và thưởng thức ẩm thực đặc sản miền Tây. Lan Vương là địa điểm lý tưởng cho các chuyến tham quan, dã ngoại, team building và nghỉ dưỡng cuối tuần.</p>
            <p>Đặc điểm nổi bật:</p>
            <ul>
                <li>Không gian sinh thái xanh mát, đậm chất miền Tây sông nước</li>
                <li>Diện tích rộng, nhiều kênh rạch và vườn cây ăn trái</li>
                <li>Trải nghiệm chèo xuồng ba lá, đi cầu khỉ, đu dây qua sông</li>
                <li>Hoạt động dân gian: tát mương bắt cá, bắt cua, bắt ốc</li>
                <li>Tổ chức team building, trò chơi tập thể ngoài trời</li>
                <li>Ẩm thực đặc sản Nam Bộ (cá nướng trui, bánh xèo, gỏi củ hũ dừa…)</li>
                <li>Phù hợp dã ngoại, picnic, cắm trại cuối tuần</li>
                <li>Có nhà hàng, khu tổ chức sự kiện và họp mặt</li>
            </ul>
        `,
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcToFhkTMo3kLZlUHksPHCee-yd0K1OJ4ZO8Nw&s",
        images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRuFNKOMkhT7BtgPN0MXstL3X9mAFFB-GSIfw&s",
            "data:image/jpeg;base64,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",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSE7x0UlHULz9eOMLVaa9w-zKHPaRr_4dqPpQ&s"
        ],
        coordinates: [10.2099697, 106.3717368,599],
        activities: ["tác ao bắt cá", "ngồi ghê tham quan", "Mua sắm đồ lưu niệm"],
        bestTime: "Tháng 6 - Tháng 8 (mùa trái cây)",
        entryFee: "30.000 VND/người",
        tourPackages: [
            { name: "Tour đoàn nhỏ", price: 750000, duration: "8 giờ" },
            { name: "Tour đoàn lớn ", price: 580000, duration: "8 giờ" }
        ]
    },
    {
        id: 6,
        name: "Cồn Phụng",
        province: "Bến Tre",
        category: "miet-vuon",
        rating: 4.7,
        description: "Cồn Phụng là khu du lịch sinh thái – văn hóa nổi tiếng nằm trên sông Tiền, gắn liền với nét đặc trưng của xứ dừa Bến Tre. Nơi đây thu hút du khách bởi cảnh quan sông nước hữu tình và các hoạt động trải nghiệm mang đậm bản sắc địa phương.",
        longDescription: `
            <p>Khi đến Cồn Phụng, du khách có thể tham quan cơ sở sản xuất kẹo dừa, mật ong, thưởng thức trái cây miệt vườn, nghe đờn ca tài tử và tìm hiểu về đời sống sinh hoạt của người dân miền Tây. Cồn Phụng mang đến cảm giác thư giãn, gần gũi thiên nhiên và giàu giá trị văn hóa truyền thống.</p>
            <p>Đặc điểm nổi bật:</p>
            <ul>
                <li>Khung cảnh thiên nhiên sông nước hữu tình</li>
                <li>Trải nghiệm đi tàu, xuồng hoặc bơi xuồng ba lá</li>
                <li>Tham quan xưởng làm kẹo dừa truyền thống</li>
                <li>Tham quan trại nuôi ong và uống trà mật ong</li>
                <li>Nghe đờn ca tài tử Nam Bộ</li>
                <li>Khám phá làng quê bằng xe đạp hoặc xe ngựa</li>
                <li>Thưởng thức trái cây theo mù</li>
                <li>Một số hoạt động vui chơi giải trí như câu cá, thăm trại cá sấu… (tùy theo tour)</li>
            </ul>
        `,
        image: "https://dulichcanhviet.com.vn/uploads/noidung/images/dulichcanhviet-com-vn-trainghiedulicconphung3.jpg",
        images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT3Lnx-ShHzWavdsLVco_2RwFz5YOQfsuRENw&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWGwdiWCswqCgqQtJ4uk1Kk-303fqZRGBoOw&s",
            "https://thamhiemmekong.com/wp-content/uploads/2019/04/tour-my-tho-ben-tre-4.jpg"
        ],
        coordinates: [10.3358,106.3650],
        activities: ["Tàu du lịch ", "DI CHUYỂN BẰNG XUỒNG CHÈO", "Mua sắm đồ lưu niệm" ,"HAM QUAN CƠ SỞ SẢN XUẤT KẸO DỪA"],
        bestTime: "Tháng 12 - Tháng 4",
        entryFee: "30.000 VND/người",
        tourPackages: [
            { name: "Tour 5-10 người", price: 450000, duration: "1 ngày" },
            { name: "Tour trên 20 người ", price: 300000, duration: "1 ngày" }
        ]
    }
];

// Xuất dữ liệu để sử dụng trong các file khác
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { destinations };
}