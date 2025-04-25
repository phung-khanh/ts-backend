app.ts: cấu hình express app (middlewares, routes, error handler).

server.ts: nơi chạy app.listen() để khởi động server.

config/: chứa cấu hình môi trường, database...

controllers/: nhận request từ route và gọi service để xử lý.

services/: viết logic nghiệp vụ, thường gọi models.

models/: Mongoose schema hoặc class models nếu không dùng MongoDB.

routes/: nơi khai báo các endpoints và kết nối với controller.

interfaces/: khai báo interface cho dữ liệu, giúp tận dụng TypeScript.

middlewares/: ví dụ như kiểm tra JWT, validate request, xử lý lỗi...
