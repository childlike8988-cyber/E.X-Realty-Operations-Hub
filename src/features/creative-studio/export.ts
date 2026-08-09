'use client';

import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

type ExportOptions = {
  element: HTMLElement;
  propertyName: string;
  templateName: string;
  type: 'PNG' | 'PDF';
};

function toFilePart(value: string) {
  return value.trim().replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-').slice(0, 60) || 'property';
}

export function getCreativeExportFileName(propertyName: string, templateName: string, type: 'PNG' | 'PDF') {
  const propertyFileName = toFilePart(propertyName);
  return type === 'PNG' ? `${propertyFileName}_${toFilePart(templateName)}.png` : `${propertyFileName}_marketing.pdf`;
}

export async function exportCreativePreview({ element, propertyName, templateName, type }: ExportOptions) {
  await document.fonts.ready;
  const image = await toPng(element, { backgroundColor: '#091425', pixelRatio: 2, cacheBust: true });
  if (type === 'PNG') {
    const link = document.createElement('a');
    link.download = getCreativeExportFileName(propertyName, templateName, type);
    link.href = image;
    link.click();
    return;
  }
  const width = element.offsetWidth || 1600;
  const height = element.offsetHeight || 900;
  const pdf = new jsPDF({ orientation: width >= height ? 'landscape' : 'portrait', unit: 'px', format: [width, height] });
  pdf.addImage(image, 'PNG', 0, 0, width, height);
  pdf.save(getCreativeExportFileName(propertyName, templateName, type));
}
