export const emailValidatoin = {
  required: "請輸入 Email",
  pattern: {
    value: /^\S+@\S+$/i,
    message: "Email 格式不正確",
  },
};

export const passwordValidation = {
  required: "請輸入密碼",
  minLength: {
    value: 6,
    message: "密碼最少需 6 碼",
  },
};

const phonePattern = /^09\d{8}$/;
export const taiwanPhoneValidation = {
  required: "請輸入手機號碼",
  pattern: {
    value: phonePattern,
    message: "請輸入正確的台灣手機號碼格式 (09xxxxxxxx)",
  },
};
