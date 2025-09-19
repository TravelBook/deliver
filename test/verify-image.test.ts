import { verifyImages } from '../src/verify-image';

// Helper function to make input options
type MakeInputOptions = {
  imageCountLimit?: number;
  megabyteLimit?: number;
  files?: File[];
}

function makeInputOptions({
  imageCountLimit = 10,
  megabyteLimit = 4,
  files = [],
}: MakeInputOptions = {}): HTMLInputElement {
  const input = document.createElement('input');
  input.type = 'file';
  input.multiple = true;
  input.dataset.imageCountLimit = imageCountLimit.toString();
  input.dataset.megabyteLimit = megabyteLimit.toString();

  let currentFiles = files;

  Object.defineProperty(input, 'files', {
    get: () => currentFiles,
    configurable: true
  });

  // Mock the value setter to clear files when value is set to empty string
  Object.defineProperty(input, 'value', {
    get: () => currentFiles.length > 0 ? '/home/user/fakepath/' + currentFiles[0].name : '',
    set: (val: string) => {
      if (val === '') {
        currentFiles = [];
      }
    },
    configurable: true
  });

  return input;
}

function createMockImageFile(
  size: number,
  type: string = 'image/jpeg',
  name: string = 'sample_kyuutouki.jpg',
): File {
  return new File([new ArrayBuffer(size)], name, { type });
}

describe('verifyImages()', () => {
  let alertSpy: jest.SpyInstance<void, [message?: string]>;

  beforeEach(() => {
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  describe("cases that are valid", () => {
    it("does not alert when files are valid", () => {
      const input = makeInputOptions({
        files: [createMockImageFile(3_100_000, 'image/jpeg')],
        megabyteLimit: 50,
        imageCountLimit: 1,
      });

      verifyImages({ target: input } as unknown as Event);

      expect(alertSpy).not.toHaveBeenCalled();
      expect(input.files).toEqual([createMockImageFile(3_100_000, 'image/jpeg')]);
    });
  });

  describe("cases that are not valid", () => {
    it('alerts and clears on too many images', () => {
      const input = makeInputOptions({
        imageCountLimit: 1,
        files: [createMockImageFile(1000), createMockImageFile(1000)],
      });

      verifyImages({ target: input } as unknown as Event);

      expect(alertSpy).toHaveBeenCalledWith('画像の枚数は1枚までにしてください。');
      expect(input.files).toEqual([]);
    });

    it("alerts and clears when files are not images", () => {
      const input = makeInputOptions({
        files: [createMockImageFile(1000, 'application/pdf', 'sample.pdf')],
      });

      input.value = "asfsdf";

      verifyImages({ target: input } as unknown as Event);

      expect(alertSpy).toHaveBeenCalledWith('画像のみにしてください。');
      expect(input.files).toEqual([]);
    });

    it("alerts and clears when files are too large", () => {
      const input = makeInputOptions({
        files: [createMockImageFile(5_000_000, 'image/jpeg'), createMockImageFile(2_700_000, 'image/jpeg')],
        megabyteLimit: 4,
      });

      input.value = "keep";

      verifyImages({ target: input } as unknown as Event);

      expect(alertSpy).toHaveBeenCalledWith('選択された2枚中、4MBを超える画像1枚がありました。\\n画像サイズは4MB以下にしてください。');
      expect(input.value).toEqual("");
    });
  });
});