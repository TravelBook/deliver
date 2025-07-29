const MAXIMUM_SEQUENTIAL_DIGITS = 7;
const MAXIMUM_REPEATED_DIGITS_AT_END = 6;

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

  // 全ての数字が同じ場合は無効
  // 例:
  // 00000000000
  // 11111111111
  // 22222222222
  // 33333333333 など
  if ((new Set(number)).size == 1) {
    console.log("全ての数字が同じ場合は無効");
    return false;
  }

  // 後ろ7桁以上が同じ数字のみの場合は無効
  // 例:
  // 03000000000 (7つの0)
  // 0311111111 (8つの1)
  // 0322222222 (8つの2)
  if ((new RegExp(`(\\d)\\1{${MAXIMUM_REPEATED_DIGITS_AT_END},}$`)).test(number)) {
    console.log(`${MAXIMUM_REPEATED_DIGITS_AT_END+1}つ以上の同じ数字が続く場合は無効`);
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

console.log("1070908625",isValidJpnPhoneNumber("1070908625"), "\n");
console.log("0070908625",isValidJpnPhoneNumber("0070908625"), "\n");
console.log("asdfasfsdf",isValidJpnPhoneNumber("asdfasfsdf"), "\n");
console.log("0357242482454620",isValidJpnPhoneNumber("0357242482454620"), "\n");
console.log("032963",isValidJpnPhoneNumber("032963"), "\n");
console.log("00000000000",isValidJpnPhoneNumber("00000000000"), "\n");
console.log("00011111111",isValidJpnPhoneNumber("00011111111"), "\n");
console.log("00011112222",isValidJpnPhoneNumber("00011112222"), "\n");
console.log("1123456789",isValidJpnPhoneNumber("1123456789"), "\n");
console.log("1134567890",isValidJpnPhoneNumber("1134567890"), "\n");
console.log("0987654321",isValidJpnPhoneNumber("0987654321"), "\n");
console.log("09876543210",isValidJpnPhoneNumber("09876543210"), "\n");
console.log("0312345678",isValidJpnPhoneNumber("0312345678"), "\n");
console.log("03300000000",isValidJpnPhoneNumber("03300000000"), "\n");

console.log("07090851770",isValidJpnPhoneNumber("07090851770"), "\n");
console.log("0354635776",isValidJpnPhoneNumber("0354635776"), "\n");

console.log("0311111111",isValidJpnPhoneNumber("0311111111"), "\n");
console.log("0300000000",isValidJpnPhoneNumber("0311111111"), "\n");
console.log("0322222222",isValidJpnPhoneNumber("0311111111"), "\n");
console.log("0300001111",isValidJpnPhoneNumber("0300001111"), "\n");