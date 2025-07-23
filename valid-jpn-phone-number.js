const MINIMUM_UNIQUE_DIGITS = 3;
const MAXIMUM_SEQUENTIAL_DIGITS = 7;
const MAXIMUM_ZERO_SEQUENTIAL_DIGITS = 7;

/**
 * 連続する数字が多すぎるかどうかをチェックする
 * @param {string} number - チェックする電話番号
 * @param {number} maxSequentialDigits - 連続する数字の最大数
 * @param {number} direction - 連続する数字の方向 (1: 昇順, -1: 降順)
 * @returns {boolean}
 */
function isTooSequential(number, maxSequentialDigits, direction) {
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
function isValidJpnPhoneNumber(number) {
  // 数字のみであること
  if (!number.match(/^[0-9]+$/)) {
    console.log("数字のみであること");
    return false;
  }

  // 先頭に0がない場合は無効
  if (!number.startsWith("0")) {
    console.log("先頭に0がない場合は無効");
    return false;
  }

  // 先頭2桁が00の場合は無効
  if (number.startsWith("00")) {
    console.log("先頭2桁が00の場合は無効");
    return false;
  }

  // 10桁か11桁であること
  if (number.length < 10 || number.length > 11) {
    console.log("10桁か11桁であること");
    return false;
  }

  // 3つ以上の異なる数字が必要
  // 例:
  // 00000000000
  // 0300000000
  // 00011112222
  if ((new Set(number)).size < MINIMUM_UNIQUE_DIGITS) {
    console.log("3つ以上の異なる数字が必要");
    return false;
  }

  // 後ろ7桁以上が0のみの場合は無効
  // 例:
  // 03000000000
  // 031000000000
  if ((new RegExp(`0{${MAXIMUM_ZERO_SEQUENTIAL_DIGITS},}$`)).test(number)) {
    console.log(`${MAXIMUM_ZERO_SEQUENTIAL_DIGITS}つ以上の0が続く場合は無効`);
    return false;
  }

  // 連続する数字が多すぎる場合は無効
  // 例:
  // 0123456789
  // 1234567890
  // 0987654321
  // 09876543210
  if (isTooSequential(number, MAXIMUM_SEQUENTIAL_DIGITS, 1)) {
    console.log("連続する数字が多すぎる場合は無効 - 昇順");
    return false;
  }
  if (isTooSequential(number, MAXIMUM_SEQUENTIAL_DIGITS, -1)) {
    console.log("連続する数字が多すぎる場合は無効 - 降順");
    return false;
  }

  return true;
}