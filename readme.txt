#cài đặt mysql, tạo tài khoản và database
#lệnh tạo bảng:
npx sequelize-cli migration:create --name create-table-users
# lệnh migrate để đẩy bảng lên
npx sequelize-cli db:migrate
# sử dụng thư viện sequelize-cli để tương tác với database chứ không dùng các câu query thông thường
npm install
#tạo file env, thay đổi các thông tin
npm install
