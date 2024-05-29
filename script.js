document.addEventListener('DOMContentLoaded', function() {
    const userUUID = '03ef44e5b4e146d6a8affe50e2088025';
    const gallery = document.querySelector('.gallery');
    let isLoading = false; // 用于控制加载状态
    let pageNo = 1;
    const loadMoreImages = async () => {
        if (isLoading) return; // 如果正在加载，则不执行
        isLoading = true;
        // 假设这是从localStorage或输入框获取的UUID


        try {
            const response = await fetch('https://liblib-api.vibrou.com/api/www/img/list', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    pageNo: pageNo, // 这里需要根据当前已加载的图片数量来递增pageNo
                    pageSize: 10,
                    uuid: userUUID,
                    status: -1,
                    type: 0
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const r = await response.json();
	    const data = r.data;
            if (data && data.images) {
                data.images.forEach(image => {
                    const photoDiv = document.createElement('div');
                    photoDiv.className = 'photo';
                    const img = document.createElement('img');
                    img.src = image.imageUrl;
                    img.alt = image.title;
                    photoDiv.appendChild(img);
                    gallery.appendChild(photoDiv);
                });
                // 更新pageNo以准备下一次加载
                pageNo += 1;
            }
        } catch (error) {
            console.error('Fetching images failed:', error);
        } finally {
            isLoading = false;
        }
    };

    // 初始加载
    loadMoreImages();

    // 监听滚动事件
    window.addEventListener('scroll', () => {
        // 检查是否滚动到页面底部
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            loadMoreImages();
        }
    });
});