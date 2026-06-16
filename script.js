/* ============================================================
   共享 JavaScript — Supabase 客户端 & 工具函数
   使用方式：在每个 HTML 页面底部引入此文件 + Supabase CDN
   ============================================================ */

// ---------- 1. Supabase 配置 ----------
// ⚠️ 请在 Supabase 后台 → Settings → API 中复制你的项目 URL 和 anon key
// ⚠️ URL 格式：https://xxxxx.supabase.co（不要带 /rest/v1/ 等路径！）
// ⚠️ Key 格式：sb_publishable_... 或 eyJhbGciOiJIUzI1NiIs...
const SUPABASE_URL = "https://yuddzsootgwekddcnqrk.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_YavXwHOKoXnduk7af4cgVQ_M9xVOb28";

// 注意：下面这个 supabaseClient 是我们的客户端实例（初始化后才赋值）
// 不要和 CDN 加载的 window.supabase（模块对象）混淆
let supabaseClient = null;

/**
 * 初始化 Supabase 客户端
 * 如果 URL/key 还是占位符，初始化会跳过（页面仍可浏览，但数据库功能不可用）
 */
function initSupabase() {
  console.log("🔍 开始初始化 Supabase...");
  console.log("  URL:", SUPABASE_URL);
  console.log("  Key 前缀:", SUPABASE_ANON_KEY.substring(0, 20) + "...");

  // 检查 Supabase JS 库是否已通过 CDN 加载
  if (typeof window.supabase === "undefined") {
    console.warn("❌ window.supabase 不存在！CDN 脚本可能未加载。");
    return;
  }
  if (!window.supabase.createClient) {
    console.warn("❌ window.supabase.createClient 不是一个函数！");
    return;
  }
  console.log("✅ Supabase CDN 库已加载");

  // 检查是否已填入真实的 URL 和 Key
  if (
    SUPABASE_URL === "YOUR_SUPABASE_URL" ||
    SUPABASE_ANON_KEY === "YOUR_SUPABASE_ANON_KEY"
  ) {
    console.warn("⚠️ 请先在 script.js 中填入你的 Supabase URL 和 Anon Key！");
    return;
  }
  console.log("✅ URL 和 Key 已配置");

  // 创建 Supabase 客户端实例
  try {
    // window.supabase = CDN 加载的 Supabase 模块（包含 createClient 方法）
    // supabaseClient = 我们创建的项目客户端实例（用于调用 .from() 等方法）
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    console.log("✅ Supabase 客户端已初始化");
    console.log("  客户端对象:", supabaseClient);
  } catch (err) {
    console.error("❌ 创建 Supabase 客户端失败：", err);
  }
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
  if (!supabaseClient) {
    showError("数据库未连接。请先在 script.js 中填入你的 Supabase URL 和 Anon Key！");
    return false;
  }
  return true;
}
