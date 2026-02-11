<template>
  <footer class="footer" id="footerStart">
			<div class="hero">
				<div class="container">
					<a href="#!" class="brand"></a>
					<ul class="nav">
						<li class="nav-item">
							<a href="#!" class="nav-link">投資者專區</a>
						</li>
						<li class="nav-item">
							<a href="#!" class="nav-link">關於我們</a>
						</li>
						<li class="nav-item">
							<a href="#!" class="nav-link">刊登廣告</a>
						</li>
						<li class="nav-item">
							<a href="#!" class="nav-link">新聞剪輯</a>
						</li>
						<li class="nav-item">
							<a href="#!" class="nav-link">免責聲明</a>
						</li>
            			<li class="nav-item">
							<a href="#!" class="nav-link">服務條款</a>
						</li>
            			<li class="nav-item">
							<a href="#!" class="nav-link">隱私權聲明</a>
						</li>
					</ul>
          <ul class="nav2">
            <span class="placename">台中市熱門區域 : </span>
						<li class="nav-item">
							<a href="#!" class="nav-link">西屯區</a>
						</li>
						<li class="nav-item">
							<a href="#!" class="nav-link">北屯區</a>
						</li>
						<li class="nav-item">
							<a href="#!" class="nav-link">南屯區</a>
						</li>
						<li class="nav-item">
							<a href="#!" class="nav-link">中區</a>
						</li>
						<li class="nav-item">
							<a href="#!" class="nav-link">北區</a>
						</li>
            <li class="nav-item">
							<a href="#!" class="nav-link">西區</a>
						</li>
            <li class="nav-item">
							<a href="#!" class="nav-link">沙鹿區</a>
						</li>
					</ul>
				</div>
			</div>
			<div class="copyright">
				<p>© Copyright 2020 All rights reserved</p>
			</div>
		</footer>
</template>

<script setup>
defineProps({
// 這是 Vue 3 提供的特殊函式，用來宣告這個元件可以從父元件接收哪些屬性（props）。
  footerLinks: { type: Array, default: () => [] },
  hotAreas: { type: Array, default: () => [] },
})

// footerLinks 和 hotAreas 功能：接收一個陣列
// type: Array 功能：指定資料型別，保證父層傳入的資料是「陣列」
// default: () => [] 功能：預設值，如果父層沒傳資料，就給一個空陣列避免報錯

// default: () => []
// 這裡用「箭頭函式回傳陣列」而不是直接 default: []，
// 是因為在 Vue 中物件或陣列要用函式回傳，避免不同元件共用同一個陣列記憶體。
</script>