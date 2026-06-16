/* ============================================================
   共享 JavaScript — Supabase 客户端 & 工具函数
   使用方式：在每个 HTML 页面底部引入此文件 + Supabase CDN
   ============================================================ */

// ---------- 1. Supabase 配置 ----------
// ⚠️ 请在 Supabase 后台 → Settings → API 中复制你的项目 URL 和 anon key
// ⚠️ 替换下面两个占位符，然后保存文件即可
const SUPABASE_URL = "https://yuddzsootgwekddcnqrk.supabase.co";       // 例如：https://xxxxx.supabase.co
const SUPABASE_ANON_KEY = "sb_publishable_YavXwHOKoXnduk7af4cgVQ_M9xVOb28"; // 例如：eyJhbGciOiJIUzI1NiIs...

let supabase = null;

/**
 * 初始化 Supabase 客户端
 * 如果 URL/key 还是占位符，初始化会跳过（页面仍可浏览，但数据库功能不可用）
 */
function initSupabase() {
  // 确保 Supabase JS 库已通过 CDN 加载
  if (typeof supabase !== "undefined" && window.supabase && window.supabase.createClient) {
    // supabase-js v2 UMD 导出在 window.supabase 上
  } else if (typeof window.supabase === "undefined" || !window.supabase.createClient) {
    console.warn("Supabase JS 库未加载。请检查 CDN 引入。");
    return;
  }

  if (
    SUPABASE_URL === "YOUR_SUPABASE_URL" ||
    SUPABASE_ANON_KEY === "YOUR_SUPABASE_ANON_KEY"
  ) {
    console.warn(
      "⚠️ 请先在 script.js 中填入你的 Supabase URL 和 Anon Key！" +
      "（在 Supabase 后台 → Settings → API 中可以找到）"
    );
    return;
  }

  supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  console.log("✅ Supabase 客户端已初始化");
}

// 页面加载时自动初始化
document.addEventListener("DOMContentLoaded", initSupabase);

// ---------- 2. Toast 通知函数 ----------

/**
 * 在页面顶部显示错误通知（红色），5秒后自动消失
 * @param {string} message - 错误信息
 */
function showError(message) {
  showToast(message, "error");
}

/**
 * 在页面顶部显示成功通知（绿色），3秒后自动消失
 * @param {string} message - 成功信息
 */
function showSuccess(message) {
  showToast(message, "success");
}

/**
 * 通用 Toast 通知
 * @param {string} message - 消息内容
 * @param {string} type - "error" 或 "success"
 */
function showToast(message, type) {
  // 移除已有的 toast
  const existing = document.querySelector(".toast");
  if (existing) existing.remove();

  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  // 自动消失
  const duration = type === "error" ? 5000 : 3000;
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transition = "opacity 0.3s ease";
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// ---------- 3. 导航栏高亮当前页面 ----------

/**
 * 自动根据当前页面 URL 高亮导航栏中对应的链接
 * 用法：在每个页面的 <nav> 中使用 class="nav-link" 的链接
 */
function highlightNav() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-links a");
  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (href === currentPage) {
      link.classList.add("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", highlightNav);

// ---------- 4. 汉堡菜单（移动端导航） ----------

function setupMobileMenu() {
  const hamburger = document.querySelector(".hamburger");
  const navLinks = document.querySelector(".nav-links");
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("open");
  });

  // 点击页面任意位置关闭菜单
  document.addEventListener("click", (e) => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove("open");
    }
  });
}

document.addEventListener("DOMContentLoaded", setupMobileMenu);

// ---------- 5. 工具函数 ----------

/**
 * 获取今天的日期字符串（YYYY-MM-DD 格式）
 */
function getToday() {
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * 格式化日期为友好显示格式（例如：2026年6月16日）
 * @param {string} dateStr - YYYY-MM-DD 格式的日期字符串
 */
function formatDate(dateStr) {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  return `${y}年${parseInt(m)}月${parseInt(d)}日`;
}

/**
 * 检查 Supabase 是否已就绪，如果未就绪则显示提示并返回 false
 */
function requireSupabase() {
  if (!supabase) {
    showError("数据库未连接。请先在 script.js 中填入你的 Supabase URL 和 Anon Key！");
    return false;
  }
  return true;
}
