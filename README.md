# Deno 本地部署：贪吃蛇小游戏

下面是一个用 **Deno + 标准库静态文件服务器**
搭建的本地可运行的贪吃蛇项目。复制这些文件到同一目录，即可在本地跑起来。

---

## 📁 项目结构

```markdown
snake-deno/ ├─ server.ts ├─ deno.json └─ public/ ├─ index.html ├─ styles.css └─
game.js
```

---

## ▶️ 运行步骤

```markdown
1. 安装 Deno（已安装可跳过）：https://deno.com
2. 在终端进入项目根目录：`cd snake-deno`
3. 启动本地服务器： deno run -A server.ts
4. 浏览器打开：`http://localhost:8000`

也可使用任务： deno task dev
```

---

## 🧪 可选改动

- **穿墙模式**：将撞墙判定改为环绕（把超界的 head.x/head.y 改到另一侧）。
- **移动端支持**：在 `game.js` 里添加触摸滑动手势识别。
- **难度调节**：调整 `stepMs` 初始值或每 50 分的提速幅度。

---

## ❓常见问题

- **端口冲突**：若 8000 被占用，改用 `DENO_DEPLOYMENT_ID` 环境变量或在
  `serveDir` 外自定义 `Deno.serve({ port: 5173 }, ...)`。
- **白屏/404**：确认目录结构是否与上方一致，以及 `server.ts` 是否在项目根目录。

祝你玩得开心！🐍
