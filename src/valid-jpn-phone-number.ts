const MAXIMUM_SEQUENTIAL_DIGITS = 7;
const MAXIMUM_REPEATED_DIGITS_AT_END = 6;

/**
 * 連続する数字が多すぎるかどうかをチェックする
 * @param {string} number - チェックする電話番号
 * @param {number} maxSequentialDigits - 連続する数字の最大数
 * @param {number} direction - 連続する数字の方向 (1: 昇順, -1: 降順)
 * @returns {boolean}
 */
function isTooSequential(number: string, maxSequentialDigits: number, direction: number): boolean {
  let isTooSequential = false;
  let sequentialCounter = 0;
  for (let i = 1; i < number.length; i++) {
    const current = parseInt(number[i]);
    const previous = parseInt(number[i - 1]);
    if (current == (previous + direction)) {
      sequentialCounter++;
    } else {
      sequentialCounter = 0;
    }

    if (sequentialCounter > maxSequentialDigits) {
      isTooSequential = true;
      break;
    }
  }

  return isTooSequential;
}

/**
 * 日本の電話番号をバリデーションする
 * @param {string} number - バリデーションする電話番号
 * @returns {boolean} - バリデーション結果
 */
function isValidJpnPhoneNumber(number: string): boolean {
  // 数字のみであること
  if (!number.match(/^[0-9]+$/)) {
    return false;
  }

  // 10桁か11桁であること
  if (number.length < 10 || number.length > 11) {
    return false;
  }

  // 先頭に0がない場合は無効
  if (!number.startsWith("0")) {
    return false;
  }

  // 先頭2桁が00の場合は無効
  if (number.startsWith("00")) {
    return false;
  }

  // 全ての数字が同じ場合は無効
  // 例:
  // 00000000000
  // 11111111111
  // 22222222222
  // 33333333333 など
  if ((new Set(number)).size == 1) {
    return false;
  }

  // 後ろ7桁以上が同じ数字のみの場合は無効
  // 例:
  // 03000000000 (7つの0)
  // 0311111111 (8つの1)
  // 0322222222 (8つの2)
  if ((new RegExp(`(\\d)\\1{${MAXIMUM_REPEATED_DIGITS_AT_END},}$`)).test(number)) {
    return false;
  }

  // 連続する数字が多すぎる場合は無効
  // 例:
  // 0123456789
  // 1234567890
  // 0987654321
  // 09876543210
  if (isTooSequential(number, MAXIMUM_SEQUENTIAL_DIGITS, 1)) {
    return false;
  }
  if (isTooSequential(number, MAXIMUM_SEQUENTIAL_DIGITS, -1)) {
    return false;
  }

  return true;
}

export { isValidJpnPhoneNumber, isTooSequential };