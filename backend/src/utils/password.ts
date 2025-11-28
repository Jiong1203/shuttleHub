import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10

/**
 * 將密碼進行雜湊加密
 * @param password 原始密碼
 * @returns 加密後的密碼雜湊
 */
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS)
}

/**
 * 驗證密碼是否正確
 * @param password 原始密碼
 * @param hash 加密後的密碼雜湊
 * @returns 是否匹配
 */
export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash)
}
