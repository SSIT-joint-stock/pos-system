#!/usr/bin/env bash
set -euo pipefail

# Thư mục lưu file
SECRET_DIR="./secrets"
KEYFILE_NAME="mongo-keyfile"
KEYFILE_PATH="$SECRET_DIR/$KEYFILE_NAME"

# Tạo thư mục nếu chưa tồn tại
mkdir -p "$SECRET_DIR"

# Tạo keyfile với độ dài 756 bytes (theo khuyến nghị MongoDB)
openssl rand -base64 756 > "$KEYFILE_PATH"

# Set quyền file đúng chuẩn (chỉ owner đọc/ghi)
chmod 600 "$KEYFILE_PATH"

# In ra thông tin
echo "✅ MongoDB keyFile đã được tạo:"
echo "   Đường dẫn: $KEYFILE_PATH"
echo "   Quyền: $(stat -c '%A' "$KEYFILE_PATH")"
echo "   Kích thước: $(wc -c < "$KEYFILE_PATH") bytes"
