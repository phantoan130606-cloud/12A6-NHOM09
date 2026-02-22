/// HIỆU ỨNG THIÊN NHIÊN - VỪA PHẢI

(function() {
    // Đợi trang load
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🌿 Đang khởi tạo hiệu ứng thiên nhiên...');
        
        // Tạo container
        const container = document.createElement('div');
        container.className = 'nature-container';
        document.body.appendChild(container);
        
        // ===== 1. TẠO 8 CON CHIM =====
        for (let i = 0; i < 8; i++) {
            setTimeout(() => {
                const bird = document.createElement('div');
                bird.className = 'nature-bird';
                bird.innerHTML = `
                    <div class="eye"></div>
                    <div class="beak"></div>
                    <div class="wing"></div>
                `;
                
                bird.style.left = Math.random() * 80 + 'vw';
                bird.style.top = (Math.random() * 50 + 10) + 'vh';
                bird.style.animationDelay = (Math.random() * 8) + 's';
                
                container.appendChild(bird);
            }, i * 100);
        }
        
        // ===== 2. TẠO 15 BÔNG HOA =====
        for (let i = 0; i < 15; i++) {
            setTimeout(() => {
                const flower = document.createElement('div');
                flower.className = 'nature-flower';
                
                for (let j = 1; j <= 4; j++) {
                    const petal = document.createElement('div');
                    petal.className = 'petal petal' + j;
                    flower.appendChild(petal);
                }
                
                const center = document.createElement('div');
                center.className = 'center';
                flower.appendChild(center);
                
                flower.style.left = Math.random() * 90 + 'vw';
                flower.style.animationDelay = (Math.random() * 10) + 's';
                flower.style.animationDuration = (8 + Math.random() * 6) + 's';
                
                container.appendChild(flower);
            }, i * 70);
        }
        
        // ===== 3. TẠO 20 CHIẾC LÁ =====
        for (let i = 0; i < 20; i++) {
            setTimeout(() => {
                const leaf = document.createElement('div');
                leaf.className = 'nature-leaf leaf-type' + (Math.floor(Math.random() * 3) + 1);
                
                leaf.style.left = Math.random() * 100 + 'vw';
                leaf.style.animationDelay = (Math.random() * 12) + 's';
                leaf.style.animationDuration = (10 + Math.random() * 8) + 's';
                
                const size = 15 + Math.random() * 12;
                leaf.style.width = size + 'px';
                leaf.style.height = (size * 0.7) + 'px';
                
                container.appendChild(leaf);
            }, i * 50);
        }
        
        // ===== 4. TẠO HOA THEO CHUỘT =====
        const mouseFlower = document.createElement('div');
        mouseFlower.id = 'mouse-flower';
        
        for (let i = 1; i <= 4; i++) {
            const petal = document.createElement('div');
            petal.className = 'mouse-petal mouse-petal' + i;
            mouseFlower.appendChild(petal);
        }
        
        const center = document.createElement('div');
        center.className = 'mouse-center';
        mouseFlower.appendChild(center);
        
        const leaf1 = document.createElement('div');
        leaf1.className = 'mouse-leaf';
        mouseFlower.appendChild(leaf1);
        
        const leaf2 = document.createElement('div');
        leaf2.className = 'mouse-leaf mouse-leaf2';
        mouseFlower.appendChild(leaf2);
        
        const stem = document.createElement('div');
        stem.className = 'mouse-stem';
        mouseFlower.appendChild(stem);
        
        document.body.appendChild(mouseFlower);
        
        // Di chuyển hoa theo chuột
        document.addEventListener('mousemove', function(e) {
            mouseFlower.style.left = (e.clientX - 22) + 'px';
            mouseFlower.style.top = (e.clientY - 30) + 'px';
            mouseFlower.classList.add('active');
        });
        
        document.addEventListener('mouseleave', function() {
            mouseFlower.classList.remove('active');
        });
        
        document.addEventListener('mouseenter', function() {
            mouseFlower.classList.add('active');
        });
        
        console.log('✅ Khởi tạo hoàn tất!');
        console.log('📊 8 chim, 15 hoa, 20 lá đang bay');
    });
})();