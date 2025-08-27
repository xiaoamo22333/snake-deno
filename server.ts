// 从 Deno 标准库导入 serve 和 serveDir 函数
// serve 用于创建 HTTP 服务器
// serveDir 用于从文件系统中提供静态文件
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { serveDir } from "https://deno.land/std@0.224.0/http/file_server.ts";

const PORT = 8000;

console.log(`贪吃蛇游戏服务器正在运行...`);
console.log(`在浏览器中打开: http://localhost:${PORT}`);

// 启动服务器
serve((req) => {
  // 使用 serveDir 来处理请求
  // 它会自动查找并返回当前目录下的文件 (如 index.html, style.css 等)
  return serveDir(req, {
    fsRoot: ".", // 将当前文件夹作为文件系统的根目录
    urlRoot: "", // URL 的根路径
    showDirListing: true, // 如果访问一个目录，显示文件列表
    enableCors: true, // 允许跨域请求
  });
}, { port: PORT });
