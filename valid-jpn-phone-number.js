const MINIMUM_UNIQUE_DIGITS = 3;
const MAXIMUM_SEQUENTIAL_DIGITS = 5;

/**
 * 日本の電話番号をバリデーションする
 * @param {string} number - バリデーションする電話番号
 * @returns {boolean} - バリデーション結果
 */
function isValidJpnPhoneNumber(number) {
  // 数字のみであること
  if (!number.match(/^[0-9]+$/)) { return false; }

  // 先頭に0がない場合は無効
  if (!number.startsWith("0")) { return false; }

  // 先頭2桁が00の場合は無効
  if (number.slice(0, 2) == "00") { return false; }

  // 10桁か11桁であること
  if (number.length < 10 || number.length > 11) { return false; }

  // 連続する数字が3つ以上ある場合は無効
  // 例:
  // 00000000000
  // 00011111111
  // 00011112222
  if ((new Set(number)).size < MINIMUM_UNIQUE_DIGITS) { return false; }

  // 番号の連続が多すぎる場合は無効
  // 例: 0123486736
  let isTooSequential = false;
  let sequentialCounter = 0;
  for (let i = 1; i < number.length; i++) {
    const current = parseInt(number[i]);
    const previous = parseInt(number[i - 1]);
    if (current !== previous + 1) {
      sequentialCounter = 0;
    } else {
      sequentialCounter++;
    }

    if (sequentialCounter > MAXIMUM_SEQUENTIAL_DIGITS) {
      isTooSequential = true;
      break;
    }
  }
  if (isTooSequential) { return false; }

  return true;
}