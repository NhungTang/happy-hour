# Ảnh khoảnh khắc ăn uống

Bỏ ảnh các bữa ăn của team vào folder này (jpg/png), rồi khai báo trong `app.js` ở mảng `MOMENTS`:

```js
const MOMENTS = [
  { caption: 'Happy hour 10/09', img: 'images/hh-1009.jpg' },
  { caption: 'Bàn tiệc pantry tầng 19', img: 'images/pantry.jpg' },
];
```

- `img` để rỗng (`''`) thì hiện ô mẫu pastel 📸, không bị vỡ ảnh.
- `img` cũng nhận link ảnh ngoài (`https://...`).
- Nên resize ảnh xuống ~1000px cho nhẹ.
