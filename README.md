# AI 智能家庭伴侣 · 桌面端 Web Demo（原型）

对应《AI 智能家庭伴侣产品概念 Spec V1.0》Phase 1 交付物：**桌面端 Web Demo**。
本页面为**概念原型**，用于演示交互与价值主张；对话回复由前端「人格模板引擎」生成（部分后台逻辑简化模拟），符合 Spec 中「MVP 阶段部分后台逻辑可简化」原则。

## 语言 / Language
页面右上角提供 **中文 / English 切换**：界面文案与角色对话内容均为双语，选择持久化到浏览器。可直接用作英文版作品集演示，无需外部翻译工具、离线可用。

## 演示覆盖的 5 个流（对应 demo资料 要求）
1. **角色创建**：上传照片 + 姓名/背景/性格/关系/说话方式/行为边界 → 进入角色库（已预置 3 个角色）。
2. **语音唤醒 & 对话**：切换角色、文字/语音输入（Web Speech API）、角色独立声音风格（TTS）、记住交流。
3. **多角色协作**：一句话触发 3 个预设角色分别/整合回答。
4. **记忆与权限**：对某角色说私事 → 存为私有记忆 → 主动授权其他角色 → 被授权角色可召回（核心差异化）。
5. **图像模式**：上传照片 → 按角色人格生成「人格条件化」文案（呼应 mood_pipeline 图像→情感→文案）。

## 预置 3 个角色（对标 demo资料）
- 知心朋友（原子型）：活泼、治愈、会陪聊会吐槽。
- 人生导师（阿笠博士型）：理性、博学、擅拆解。
- 家庭伙伴（小兰姐姐型）：亲切、细心、主动关怀。

## 本地运行
直接双击 `index.html` 即可（语音功能需 `localhost` 或 https，建议用本地服务）：
```bash
python3 -m http.server 8137
# 浏览器打开 http://localhost:8137
```

## 部署为公开网址（作品集链接）
- **GitHub Pages**：把 `web_demo/` 推到仓库，Settings → Pages → 选分支根目录，获得 `https://<user>.github.io/<repo>/`。
- 或任意静态托管（Vercel / Netlify / 腾讯云静态网站）。

## 接真实模型（升级为可上线 MVP）
- 对话：调用 LLM（DeepSeek / 通义 / GPT），用角色设定 + 可访问记忆拼 system prompt。
- 语音：TTS（Azure / ElevenLabs）+ ASR（Whisper / 云端识别）替换 Web Speech API。
- 记忆：用户长期记忆存入向量库（如 Chroma / pgvector），按权限检索注入。
- 图像：CLIP / 视觉大模型替换图像模式的「示意生成」。

数据说明：演示中角色与记忆仅存浏览器 `localStorage`，不上传任何服务器。

## Demo Video (hands-free, for supervisors)

`AI_Companion_Demo.mp4` (~49s, 1280x800, English) is a screen-recorded walkthrough of this demo.
No interaction is required from the viewer - it uses the 3 preloaded roles and an auto-playing tour with English narration captions:

1. Role library (3 preset roles, no sign-up needed)
2. Voice Chat - the Confidant (Ayumi-type) replies with empathy
3. A private memory is saved with one role (only that role can access it)
4. Multi-role collaboration - three roles answer from their own perspectives
5. Memory access control - the user grants the Mentor access to the Confidant's private memory
6. The Mentor recalls the shared memory across roles (the key differentiator)
7. Image mode - persona-conditioned copy (image -> affect -> persona text)

### How it works / how to re-record

- `tour.js` adds an auto-tour mode: open `index.html?tour=1` and the page walks through all flows by itself (bottom caption bar narrates each step).
- Recording was made with headless Chromium (Playwright) + ffmpeg transcode. Re-record anytime:
  `cd /Users/lilianchen/.workbuddy/binaries/node/workspace && NODE_PATH=$PWD/node_modules node record_demo.js`
- The interactive demo is unchanged for normal visitors (English is now the default; Chinese toggle top-right).
