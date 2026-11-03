/**
 * Pure binary ICO file container generator.
 * Encapsulates multiple PNG streams into standard Windows .ico container format.
 */

export interface IcoImageEntry {
  width: number;
  height: number;
  bytes: Uint8Array;
}

function writeIcoHeader(view: DataView, count: number): void {
  view.setUint16(0, 0, true); // Reserved
  view.setUint16(2, 1, true); // Type 1 = Icon
  view.setUint16(4, count, true); // Number of images
}

function writeDirectoryEntry(
  view: DataView,
  offset: number,
  entry: { img: IcoImageEntry; imgOffset: number }
): void {
  const { img, imgOffset } = entry;
  view.setUint8(offset, img.width >= 256 ? 0 : img.width);
  view.setUint8(offset + 1, img.height >= 256 ? 0 : img.height);
  view.setUint8(offset + 2, 0); // Palette
  view.setUint8(offset + 3, 0); // Reserved
  view.setUint16(offset + 4, 1, true); // Color planes
  view.setUint16(offset + 6, 32, true); // Bits per pixel
  view.setUint32(offset + 8, img.bytes.length, true); // Image data size
  view.setUint32(offset + 12, imgOffset, true); // Offset of image data
}

export function buildIcoBinary(images: IcoImageEntry[]): Uint8Array {
  const headerSize = 6;
  const dirEntrySize = 16;
  const totalDirSize = headerSize + images.length * dirEntrySize;
  const totalDataSize = images.reduce((acc, img) => acc + img.bytes.length, 0);

  const buffer = new ArrayBuffer(totalDirSize + totalDataSize);
  const view = new DataView(buffer);
  const outBytes = new Uint8Array(buffer);

  writeIcoHeader(view, images.length);

  let currentImgOffset = totalDirSize;
  images.forEach((img, index) => {
    const entryOffset = headerSize + index * dirEntrySize;
    writeDirectoryEntry(view, entryOffset, { img, imgOffset: currentImgOffset });
    outBytes.set(img.bytes, currentImgOffset);
    currentImgOffset += img.bytes.length;
  });

  return outBytes;
}
