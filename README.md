# costtiemtranguoiitnoi

PWA tĩnh, mobile-first để tra 27 công thức trà trái cây và tính cost theo giá nguyên liệu mùa vụ. Ứng dụng không có backend, database hay đăng nhập; giá và lịch sử người dùng lưu chỉ nằm trong `localStorage` của thiết bị.

## Chạy tại máy

```bash
npm install
npm run dev
```

Các cổng chất lượng:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run test:e2e
```

## Hai màn hình tính cost

- **Mẻ nguyên liệu**: chọn công thức ủ/ướp, nhập quy cách và giá mua hiện tại, sau đó nhập lượng thành phẩm dùng được. Riêng sinh tố đóng chai, nhập giá chai 1 lít và số ml dùng cho mẻ; ứng dụng tự tính phần cost tương ứng. Phép tính này loại trà, đá, ly, nắp, ống hút và chi phí phục vụ theo ly.
- **Một ly**: chọn món, tự dùng đơn giá mẻ đã đủ dữ liệu khi đơn vị khớp, nhập giá còn thiếu và bật/tắt đá, bao bì hoặc thành phần theo cách bán thực tế.
- **Lịch sử cost**: khi một món đã đủ giá, bấm **Lưu cost hiện tại** để chốt tổng cost, ngày giờ và chi tiết từng thành phần. Tab **Lịch sử** cho phép xem tất cả lần lưu, lọc theo món và tự hiển thị mức tăng/giảm so với lần liền trước của đúng món đó.

Giá hoặc sản lượng còn thiếu luôn tạo trạng thái “chưa đủ”, không được ngầm xem là 0. Các đơn vị `g/kg` và `ml/l` được quy đổi trong cùng nhóm; `trái`, `miếng`, `vá`, `hạt`, `phần` giữ nguyên như tài liệu.

Lịch sử chỉ lưu trên trình duyệt hiện tại, dùng được khi offline nhưng không đồng bộ giữa các thiết bị. Xóa dữ liệu trình duyệt hoặc dùng nút đặt lại trong **Cài đặt** sẽ xóa cả giá đã nhập và lịch sử.

## Cài trên iPhone

Mở trang bằng Safari, chọn **Chia sẻ** → **Thêm vào Màn hình chính**. Sau lần tải thành công đầu tiên, app shell và công thức cốt lõi có thể mở lại khi offline.

## Deploy GitHub Pages

Workflow [deploy.yml](.github/workflows/deploy.yml) build và publish thư mục `dist` khi push lên nhánh `main`. Trong repository GitHub, bật **Settings → Pages → Source: GitHub Actions**. Vite dùng asset path tương đối nên chạy được ở project subpath như `https://<user>.github.io/<repo>/`.

## Nguồn dữ liệu

Các tài liệu gốc dưới đây được giữ cục bộ, không publish trong repository công khai. Dữ liệu công
thức đã đối chiếu nằm trong `src/data`; logo PWA đã được xuất thành các icon trong `public`.

- `docs/CACH PHA CHE TRA (1).docx`: menu và công thức cho một ly.
- `docs/U UOP NGUYEN LIEU TRA TRAI CAY - THANH VIET (1).docx`: công thức mẻ nguyên liệu.
- `docs/43fb4af4-fdd1-4c77-b4da-5c4edccccb83.jpeg`: tham khảo cách chia hai form; giá trong ảnh không được dùng làm dữ liệu mặc định.
