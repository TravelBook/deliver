/**
 * 画像をバリデーションする
 * 以下の条件を満たす必要がある
 * - 画像のみにする
 * - 画像の枚数は指定された枚数、あるいはデフォルトで10枚までにする
 * - 画像のサイズは指定されたサイズ、あるいはデフォルトで50MB以下にする
 * @param {Event} event - イベント
 */
function verifyImages(event: Event) {
  const target = event.target as HTMLInputElement;

  if (!target || !target.files) {
    return;
  }

  const imageCountLimit = Number(target.dataset?.imageCountLimit) || 10;
  const megabyteLimit = Number(target.dataset?.megabyteLimit) || 50;
  const BYTES_PER_MEGABYTE = 1_000_000;

  let anyFileNotImage = Array.from(target.files).some((f: File) => {
    return !f.type.match('image.*');
  })

  if (anyFileNotImage) {
    alert("画像のみにしてください。");
    target.value = "";
    return;
  }

  if (target.files.length > imageCountLimit) {
    alert(`画像の枚数は${imageCountLimit}枚までにしてください。`);
    target.value = "";
    return;
  }

  let invalidImageCount = 0
  for (const img of target.files) {
    if (img.size > (BYTES_PER_MEGABYTE * megabyteLimit)) {
      invalidImageCount++;
    }
  }

  if (invalidImageCount > 0) {
    alert(`選択された${target.files.length}枚中、${megabyteLimit}MBを超える画像${invalidImageCount}枚がありました。\\n画像サイズは${megabyteLimit}MB以下にしてください。`);
    target.value = "";
    return;
  }
}

export { verifyImages };