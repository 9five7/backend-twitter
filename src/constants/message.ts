export const USER_MESSAGE = {
  VALIDATION_ERROR: 'Lỗi xác thực',
  NAME_IS_REQUIRED: 'Tên không được để trống',
  NAME_MUST_BE_STRING: 'Tên phải là chuỗi',
  NAME_LENGTH: 'Tên phải từ 1 đến 100 ký tự',
  EMAIL_IS_REQUIRED: 'Email không được để trống',
  EMAIL_IS_INVALID: 'Email không hợp lệ',
  EMAIL_IS_EXIST: 'Email đã tồn tại',
  PASSWORD_IS_REQUIRED: 'Mật khẩu không được để trống',
  PASSWORD_LENGTH: 'Mật khẩu phải từ 6 đến 50 ký tự',
  PASSWORD_MUST_BE_STRING: 'Mật khẩu phải là chuỗi',
  PASSWORD_STRONG: 'Mật khẩu phải chứa ít nhất 6 ký tự, 1 chữ thường, 1 chữ hoa, 1 số và 1 ký tự đặc biệt',
  CONFIRM_PASSWORD_IS_REQUIRED: 'Xác nhận mật khẩu không được để trống',
  CONFIRM_PASSWORD_IS_NOT_MATCH: 'Xác nhận mật khẩu không khớp',
  CONFIRM_PASSWORD_MUST_BE_STRING: 'Xác nhận mật khẩu phải là chuỗi',
  LOGIN_FAILED: 'Đăng nhập thất bại',
  USER_NOT_FOUND: 'Người dùng không tồn tại',
  USER_EXIST: 'Người dùng đã tồn tại',
  USER_NOT_AUTHORIZED: 'Người dùng không được ủy quyền',
  USER_NOT_PERMISSION: 'Người dùng không được phép',
  USER_NOT_VERIFIED: 'Người dùng chưa xác thực',
  USER_VERIFIED: 'Người dùng đã xác thực',
  USER_BLOCKED: 'Người dùng bị chặn',
  USER_UNBLOCKED: 'Người dùng đã bỏ chặn',
  USER_DELETED: 'Người dùng đã xóa',
  USER_UPDATED: 'Người dùng đã cập nhật',
  USER_CREATED: 'Người dùng đã tạo',
  USER_LOGGED_IN: 'Người dùng đã đăng nhập',
  USER_LOGGED_OUT: 'Người dùng đã đăng xuất',
  USER_LOGGED_OUT_ALL: 'Người dùng đã đăng xuất khỏi tất cả thiết bị',
  USER_PASSWORD_RESET: 'Mật khẩu đã được đặt lại',
  USER_PASSWORD_CHANGED: 'Mật khẩu đã được thay đổi',
  DATE_OF_BIRTH_IS_INVALID: 'Ngày sinh không hợp lệ',
  LOGIN_SUCCESS: 'Đăng nhập thành công',
  REGISTER_SUCCESS: 'Đăng ký thành công',
  ACCESS_TOKEN_IS_REQUIRED: 'Access token không được để trống',
  REFRESH_TOKEN_IS_REQUIRED: 'Refresh token không được để trống',
  REFRESH_TOKEN_OR_NOT_EXIST: 'Refresh token không tồn tại',
  REFRESH_TOKEN_IS_INVALID: 'Refresh token không hợp lệ',
  LOGOUT_SUCCESS: 'Đăng xuất thành công',
  EMAIL_VERIFY_TOKEN_IS_REQUIRED: 'Email verify token không được để trống',
  EMAIL_VERIFY_BEFORE: 'Email đã được xác thực trước đó',
  EMAIL_VERIFY_SUCCESS: 'Xác thực email thành công',
  REFRESH_TOKEN_NOT_FOUND: 'Refresh token không tìm thấy',
  REFRESH_TOKEN_SUCCESS: 'Refresh token thành công',
  RESEND_EMAIL_VERIFY_TOKEN_SUCCESS: 'Gửi lại email xác thực thành công',
  FORGOT_PASSWORD_SUCCESS: 'Đặt lại mật khẩu thành công',
  CHECK_EMAIL_TO_RESET_PASSWORD: 'Vui lòng kiểm tra email để đặt lại mật khẩu',
  FORGOT_PASSWORD_INVALID: 'Đặt lại mật khẩu không hợp lệ',
  VERIFY_FORGOT_PASSWORD_TOKEN_SUCCESS: 'Xác thực đặt lại mật khẩu thành công',
  USER_PASSWORD_RESET_SUCCESS: 'Đặt lại mật khẩu thành công',
  GET_ME_SUCCESS: 'Lấy thông tin người dùng thành công',
  BIO_MUST_BE_STRING: 'Giới thiệu phải là chuỗi',
  BIO_LENGTH: 'Giới thiệu phải từ 1 đến 200 ký tự',
  LOCATION_MUST_BE_STRING: 'Vị trí phải là chuỗi',
  LOCATION_LENGTH: 'Vị trí phải từ 1 đến 100 ký tự',
  WEBSITE_MUST_BE_STRING: 'Website phải là chuỗi',
  WEBSITE_LENGTH: 'Website phải từ 1 đến 100 ký tự',
  USERNAME_MUST_BE_STRING: 'Tên người dùng phải là chuỗi',
  USERNAME_LENGTH: 'Tên người dùng phải từ 1 đến 50 ký tự',
  AVATAR_MUST_BE_STRING: 'Avatar phải là chuỗi',
  AVATAR_LENGTH: 'Avatar phải từ 1 đến 200 ký tự',
  COVER_PHOTO_MUST_BE_STRING: 'Ảnh bìa phải là chuỗi',
  COVER_PHOTO_LENGTH: 'Ảnh bìa phải từ 1 đến 200 ký tự',
  UPDATE_ME_SUCCESS: 'Cập nhật thông tin người dùng thành công',
  GET_PROFILE_SUCCESS: 'Lấy thông tin người dùng thành công',
  FOLLOW_SUCCESS: 'theo dõi thành công',
  INVALID_FOLLOW_USER_ID:'ID người dùng không hợp lệ',
  FOLLOWED: 'người dùng đã được theo dõi'
} as const
