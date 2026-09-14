# 🍻 Happy Hour Team — bảng ghi chú cute

Trang web tĩnh (HTML + CSS + JS thuần, không cần cài gì) để cả team ghi chú chuẩn bị cho buổi happy hour.

## Chạy sao

Mở thẳng `index.html` bằng trình duyệt là xong.

## Có gì

- **Đếm ngược** tới giờ quẩy. Địa điểm cố định **Pantry tầng 19** (không nhập tay). Mặc định **16h thứ 4 sắp tới**; quẩy xong quá 6 tiếng thì tự nhảy sang thứ 4 tuần sau (lịch hàng tuần).
- **Ngân sách**: mặc định 800,000đ / bữa cho **38 người** → tự chia đầu người. Ô tiền tự format dấu phẩy hàng nghìn khi gõ.
- **Quán hay đặt**: 5 quán ShopeeFood + 1 mối hoa quả (liên hệ Luyến, không có link), mỗi chỗ kèm dòng "thường đặt món gì". Cố định trong mảng `PLACES` (`app.js`), không nhập trên giao diện.
- Tới giờ quẩy → **mưa confetti** 🎉 (bắn 1 lần).
- Dòng dưới tiêu đề hiện **tên 4 đầu bếp tuần này**, khai báo trong mảng `DUTY` (`app.js`) — không ai sửa được trên giao diện.
- **2 tab** ở khu vực chính:
  - 📋 **Menu tham khảo** — bảng các buổi đã đặt (món + tổng tiền), cố định trong mảng `MENU` (`app.js`), không nhập trên giao diện.
  - 📸 **Khoảnh khắc ăn uống** — lưới ảnh các bữa ăn của team; ảnh khai báo trong mảng `MOMENTS` (`app.js`), file đặt ở folder `images/`. Chưa có ảnh thì hiện ô pastel thay vì vỡ ảnh.

## Lưu ở đâu

Tất cả lưu trong `localStorage` của trình duyệt (key `happy-hour-notes-v2`) — chỉ nằm trên máy người mở, không gửi đi đâu hết. Nghĩa là mỗi người mở sẽ có bảng riêng; muốn cả team dùng chung một bảng thì cần thêm backend/Firebase.

## File

| File | Việc |
|---|---|
| `index.html` | Khung trang |
| `style.css` | Giao diện pastel, tab, confetti |
| `app.js` | State + localStorage, 3 tab, đếm ngược. Sửa `MOMENTS` / `DUTY` / `MENU` / `PLACES` ở đầu file |
| `images/` | Ảnh món ăn (xem `images/README.md`) |
