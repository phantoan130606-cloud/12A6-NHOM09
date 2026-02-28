// education.js - Nội dung giáo dục môi trường

document.addEventListener('DOMContentLoaded', function() {
    // Chỉ khởi tạo khi ở trang education
    if (window.location.hash !== '#education' && !document.getElementById('education-page')?.classList.contains('active')) {
        return;
    }
    
    loadEducationContent();
});

function loadEducationContent() {
    const educationContainer = document.getElementById('educationContainer');
    if (!educationContainer) return;
    
    educationContainer.innerHTML = `
        <div class="education-intro">
            <h3>Bảo Vệ Hệ Sinh Thái Vĩnh Long</h3>
            <p>Tỉnh Vĩnh Long thuộc đồng bằng sông Cửu Long là một trong những khu vực có đa dạng sinh học cao nhất Việt Nam. Tuy nhiên, hệ sinh thái nơi đây đang đối mặt với nhiều thách thức do biến đổi khí hậu và hoạt động của con người. Hãy cùng tìm hiểu và hành động để bảo vệ môi trường sống này.</p>
        </div>
        
        <div class="education-cards">
            ${educationTopics.map(topic => createEducationCard(topic)).join('')}
        </div>
        
        <div class="quiz-section">
            <h3>Kiểm Tra Kiến Thức</h3>
            <p>Làm bài quiz nhỏ để kiểm tra hiểu biết của bạn về hệ sinh thái Vĩnh Long:</p>
            <div id="quizContainer"></div>
            <button id="startQuiz" class="cta-button">Bắt Đầu Quiz</button>
            <div id="quizResult" style="display: none;"></div>
        </div>
    `;
    
    // Xử lý nút bắt đầu quiz
    document.getElementById('startQuiz').addEventListener('click', startQuiz);
}

// Dữ liệu các chủ đề giáo dục
const educationTopics = [
    {
        id: 1,
        title: "Hệ Sinh Thái Rừng Tràm",
        image: "https://cdn.tgdd.vn/Files/2022/03/30/1422964/kham-pha-du-lich-rung-tram-tra-su-o-an-giang-xanh-muot-mat-202203300104042991.jpg",
        content: `
            <p>Rừng tràm là hệ sinh thái đặc trưng của Vĩnh Long, có vai trò quan trọng trong:</p>
            <ul>
                <li>Điều hòa khí hậu và nguồn nước</li>
                <li>Bảo vệ đất và chống xói mòn</li>
                <li>Cung cấp môi trường sống cho nhiều loài động thực vật</li>
                <li>Hấp thụ CO2 và cung cấp O2</li>
            </ul>
            <p><strong>Mối đe dọa:</strong> Khai thác quá mức, cháy rừng, biến đổi khí hậu</p>
            <p><strong>Giải pháp:</strong> Trồng rừng, quản lý bền vững, phát triển du lịch sinh thái</p>
        `
    },
    {
        id: 2,
        title: "Đa Dạng Sinh Học",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUKSqOSsmSlWaM32T2rGgKzsoNt3FHKW4M1g&s",
        content: `
            <p>Vĩnh Long là nơi sinh sống của hàng nghìn loài động thực vật, trong đó có nhiều loài quý hiếm:</p>
            <ul>
                <li><strong>Thực vật:</strong> Hơn 1.000 loài, trong đó có nhiều loài đặc hữu</li>
                <li><strong>Chim:</strong> Hơn 300 loài, bao gồm sếu đầu đỏ, giang sen</li>
                <li><strong>Cá:</strong> Hơn 400 loài cá nước ngọt và cá biển</li>
                <li><strong>Động vật có vú:</strong> Cầy vòi hương, rái cá, khỉ đuôi dài</li>
            </ul>
            <p><strong>Bảo tồn:</strong> Thiết lập các khu bảo tồn, nghiêm cấm săn bắt trái phép</p>
        `
    },
    {
        id: 3,
        title: "Biến Đổi Khí Hậu",
        image: "https://pantrading.vn/Data/Sites/1/media/bien-doi-khi-hau-la-gi-1.jpg",
        content: `
            <p>Tỉnh Vĩnh Long là một trong những khu vực đồng bằng sông Cửu Long  chịu ảnh hưởng nặng nề nhất của biến đổi khí hậu:</p>
            <ul>
                <li><strong>Nước biển dâng:</strong> Đe dọa xâm nhập mặn vào sâu trong đất liền</li>
                <li><strong>Thời tiết cực đoan:</strong> Hạn hán và lũ lụt nghiêm trọng hơn</li>
                <li><strong>Mất đất:</strong> Xói lở bờ sông, bờ biển gia tăng</li>
                <li><strong>Ảnh hưởng nông nghiệp:</strong> Giảm năng suất cây trồng</li>
            </ul>
            <p><strong>Thích ứng:</strong> Xây dựng hệ thống đê điều, chuyển đổi cơ cấu cây trồng, nâng cao nhận thức cộng đồng</p>
        `
    },
    {
        id: 4,
        title: "Du Lịch Bền Vững",
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTiFCXE4Kej0MaDt1jsdlS-z10dOa-oOxZMbg&s",
        content: `
            <p>Du lịch sinh thái bền vững là giải pháp quan trọng để bảo vệ môi trường và phát triển kinh tế:</p>
            <ul>
                <li><strong>Nguyên tắc:</strong> Tôn trọng môi trường, văn hóa địa phương</li>
                <li><strong>Lợi ích:</strong> Tạo thu nhập cho cộng đồng, gây quỹ bảo tồn</li>
                <li><strong>Hướng dẫn du khách:</strong>
                    <ul>
                        <li>Không xả rác bừa bãi</li>
                        <li>Không săn bắt, mua bán động vật hoang dã</li>
                        <li>Tôn trọng văn hóa và tập quán địa phương</li>
                        <li>Ưu tiên sử dụng dịch vụ địa phương</li>
                    </ul>
                </li>
            </ul>
            <p><strong>Mô hình tốt:</strong> Homestay cộng đồng, tour sinh thái có trách nhiệm</p>
        `
    }
];

// Tạo thẻ giáo dục
function createEducationCard(topic) {
    return `
        <div class="education-card">
            <img src="${topic.image}" alt="${topic.title}">
            <div class="education-content">
                <h3>${topic.title}</h3>
                ${topic.content}
            </div>
        </div>
    `;
}

// Dữ liệu quiz
const quizQuestions = [
    {
        question: "Hệ sinh thái rừng tràm có vai trò quan trọng nhất trong việc gì?",
        options: [
            "Cung cấp gỗ cho công nghiệp",
            "Điều hòa khí hậu và bảo vệ môi trường nước",
            "Tạo cảnh quan du lịch",
            "Cung cấp thức ăn cho con người"
        ],
        correct: 1,
        explanation: "Rừng tràm giúp điều hòa khí hậu, bảo vệ nguồn nước và là nơi sinh sống của nhiều loài động thực vật."
    },
    {
        question: "Loài chim nào là biểu tượng của Vườn Quốc Gia Tràm Chim?",
        options: [
            "Cò trắng",
            "Sếu đầu đỏ",
            "Vịt trời",
            "Diệc xám"
        ],
        correct: 1,
        explanation: "Sếu đầu đỏ là loài chim quý hiếm và là biểu tượng của Vườn Quốc Gia Tràm Chim."
    },
    {
        question: "Tác động nghiêm trọng nhất của biến đổi khí hậu đến Đồng bằng sông Cửu Long là gì?",
        options: [
            "Giảm lượng khách du lịch",
            "Xâm nhập mặn do nước biển dâng",
            "Thay đổi thời tiết theo mùa",
            "Ô nhiễm không khí"
        ],
        correct: 1,
        explanation: "Nước biển dâng gây xâm nhập mặn, ảnh hưởng nghiêm trọng đến nông nghiệp và đời sống người dân."
    },
    {
        question: "Nguyên tắc nào KHÔNG phải là du lịch bền vững?",
        options: [
            "Tôn trọng văn hóa địa phương",
            "Bảo vệ môi trường tự nhiên",
            "Mua đồ lưu niệm làm từ động vật hoang dã",
            "Sử dụng dịch vụ địa phương"
        ],
        correct: 2,
        explanation: "Mua đồ lưu niệm làm từ động vật hoang dã khuyến khích săn bắt trái phép và không bền vững."
    },
    {
        question: "Biện pháp nào hiệu quả nhất để bảo vệ hệ sinh thái Vĩnh Long?",
        options: [
            "Xây dựng nhiều khách sạn",
            "Phát triển công nghiệp nặng",
            "Thiết lập và quản lý các khu bảo tồn",
            "Khai thác tài nguyên triệt để"
        ],
        correct: 2,
        explanation: "Thiết lập và quản lý hiệu quả các khu bảo tồn là cách tốt nhất để bảo vệ đa dạng sinh học."
    }
];

// Bắt đầu quiz
function startQuiz() {
    const quizContainer = document.getElementById('quizContainer');
    const startButton = document.getElementById('startQuiz');
    const quizResult = document.getElementById('quizResult');
    
    startButton.style.display = 'none';
    quizResult.style.display = 'none';
    
    let currentQuestion = 0;
    let score = 0;
    let userAnswers = [];
    
    function showQuestion() {
        if (currentQuestion >= quizQuestions.length) {
            showResults();
            return;
        }
        
        const question = quizQuestions[currentQuestion];
        
        quizContainer.innerHTML = `
            <div class="quiz-question">
                <h4>Câu ${currentQuestion + 1}: ${question.question}</h4>
                <div class="quiz-options">
                    ${question.options.map((option, index) => `
                        <div class="quiz-option">
                            <input type="radio" name="q${currentQuestion}" id="q${currentQuestion}o${index}" value="${index}">
                            <label for="q${currentQuestion}o${index}">${option}</label>
                        </div>
                    `).join('')}
                </div>
                <div class="quiz-navigation">
                    ${currentQuestion > 0 ? 
                        `<button class="cta-button prev-question">Câu Trước</button>` : ''}
                    <button class="cta-button next-question">
                        ${currentQuestion === quizQuestions.length - 1 ? 'Kết Thúc' : 'Câu Tiếp'}
                    </button>
                </div>
            </div>
        `;
        
        // Khôi phục câu trả lời trước đó nếu có
        if (userAnswers[currentQuestion] !== undefined) {
            const previousAnswer = document.querySelector(`input[name="q${currentQuestion}"][value="${userAnswers[currentQuestion]}"]`);
            if (previousAnswer) {
                previousAnswer.checked = true;
            }
        }
        
        // Xử lý nút điều hướng
        document.querySelector('.next-question').addEventListener('click', nextQuestion);
        if (currentQuestion > 0) {
            document.querySelector('.prev-question').addEventListener('click', prevQuestion);
        }
    }
    
    function nextQuestion() {
        const selectedOption = document.querySelector(`input[name="q${currentQuestion}"]:checked`);
        
        if (!selectedOption) {
            alert('Vui lòng chọn một đáp án!');
            return;
        }
        
        // Lưu câu trả lời
        userAnswers[currentQuestion] = parseInt(selectedOption.value);
        
        // Kiểm tra đáp án
        if (parseInt(selectedOption.value) === quizQuestions[currentQuestion].correct) {
            score++;
        }
        
        currentQuestion++;
        showQuestion();
    }
    
    function prevQuestion() {
        currentQuestion--;
        showQuestion();
    }
    
    function showResults() {
        const percentage = Math.round((score / quizQuestions.length) * 100);
        
        let message = '';
        let emoji = '';
        
        if (percentage >= 80) {
            message = 'Xuất sắc! Bạn hiểu rất rõ về hệ sinh thái Vĩnh Long.';
            emoji = '🎉';
        } else if (percentage >= 60) {
            message = 'Tốt! Bạn có kiến thức khá về hệ sinh thái Vĩnh Long.';
            emoji = '👍';
        } else if (percentage >= 40) {
            message = 'Khá! Bạn cần tìm hiểu thêm về hệ sinh thái Vĩnh Long.';
            emoji = '💡';
        } else {
            message = 'Hãy tìm hiểu thêm về hệ sinh thái Vĩnh Long nhé!';
            emoji = '📚';
        }
        
        quizResult.innerHTML = `
            <div class="quiz-results">
                <h4>${emoji} Kết Quả Quiz ${emoji}</h4>
                <p>Bạn đã trả lời đúng <strong>${score}/${quizQuestions.length}</strong> câu (${percentage}%)</p>
                <p>${message}</p>
                
                <h5>Xem lại các câu hỏi:</h5>
                <div class="question-review">
                    ${quizQuestions.map((question, index) => {
                        const userAnswer = userAnswers[index];
                        const isCorrect = userAnswer === question.correct;
                        
                        return `
                            <div class="review-item ${isCorrect ? 'correct' : 'incorrect'}">
                                <p><strong>Câu ${index + 1}:</strong> ${question.question}</p>
                                <p><strong>Đáp án của bạn:</strong> ${question.options[userAnswer]}</p>
                                ${!isCorrect ? `<p><strong>Đáp án đúng:</strong> ${question.options[question.correct]}</p>` : ''}
                                <p><em>${question.explanation}</em></p>
                            </div>
                        `;
                    }).join('')}
                </div>
                
                <button id="retryQuiz" class="cta-button">Làm Lại Quiz</button>
            </div>
        `;
        
        quizResult.style.display = 'block';
        
        // Xử lý nút làm lại
        document.getElementById('retryQuiz').addEventListener('click', function() {
            startQuiz();
        });
    }
    
    showQuestion();
}

// Xuất hàm để sử dụng trong file khác
window.loadEducationContent = loadEducationContent;
