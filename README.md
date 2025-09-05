<!-- @format -->

# create-daoquang-next-app

[![npm version](https://img.shields.io/npm/v/create-daoquang-next-app?color=blue&label=npm%20version)](https://www.npmjs.com/package/create-daoquang-next-app)
[![npm downloads](https://img.shields.io/npm/dm/create-daoquang-next-app.svg?color=green&label=downloads)](https://www.npmjs.com/package/create-daoquang-next-app)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

🚀 Scaffold **Next.js App Router** project với cấu hình sẵn: đa ngôn ngữ (i18n), TailwindCSS, TypeScript, ESLint.  
Chỉ cần 1 lệnh để khởi tạo dự án Next.js chuẩn hóa cho team hoặc cá nhân.

---

## ✨ Tính năng nổi bật

- ⚡ **Next.js App Router** (>= 14)
- 🌍 **Đa ngôn ngữ (i18n)** mặc định `vi`, `en`
- 🎨 **TailwindCSS** (tùy chọn khi tạo dự án)
- 🔒 **TypeScript + ESLint** cấu hình sẵn
- 📦 Cấu trúc thư mục chuẩn `src/app`, `src/lib`, `src/components`
- 🛠 Dễ dàng mở rộng với **shadcn/ui**, **Prisma**, **Auth**, ...

---

## 📦 Cài đặt

Dùng `npm create` (hoặc `npx`):

```bash
npm create daoquang-next-app@latest my-app
# hoặc
npx create-daoquang-next-app my-app
CLI sẽ hỏi bạn:

📂 Tên thư mục dự án

📦 Tên package.json

🎨 Có bật TailwindCSS không

🌍 Danh sách locales (mặc định vi,en)

🚀 Chạy thử
bash
Sao chép mã
cd my-app
npm run dev
Mở http://localhost:3000 để xem ứng dụng.

📂 Cấu trúc template
perl
Sao chép mã
my-app/
├─ src/
│  ├─ app/          # App Router
│  ├─ components/   # React components
│  ├─ lib/          # tiện ích, hooks
│  └─ styles/       # CSS / Tailwind
├─ next.config.mjs
├─ tailwind.config.ts
├─ tsconfig.json
├─ package.json
└─ ...
🛠 Phát triển
Dự án này chỉ là scaffolder.
Toàn bộ code template nằm trong thư mục templates/default.

Bạn có thể tuỳ chỉnh cấu hình (ví dụ: thêm Prisma, shadcn/ui, Auth, …) rồi publish bản mới.

☕ Ủng hộ tác giả
Nếu bạn thấy thư viện hữu ích, hãy ủng hộ tôi để có thêm động lực phát triển ❤️

📜 License
MIT © 2025 Đào Văn Quang
```
