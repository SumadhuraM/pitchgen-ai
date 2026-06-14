import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { slugify } from '../utils/validators';
import type { StartupBlueprint } from '../types';

export async function exportDeck(blueprint: StartupBlueprint): Promise<void> {
  const slideContainer = document.getElementById('pdf-slides-container');
  if (!slideContainer) {
    throw new Error('PDF slide container not found in DOM');
  }

  // Make it visible off-screen for capture
  slideContainer.style.left = '-9999px';
  slideContainer.style.visibility = 'visible';

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [1280, 720],
    compress: true,
  });

  const slides = slideContainer.querySelectorAll<HTMLElement>('.pdf-slide');

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const canvas = await html2canvas(slide, {
      scale: 1.5,
      useCORS: true,
      backgroundColor: '#0a0a0f',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/png');
    if (i > 0) pdf.addPage([1280, 720], 'landscape');
    pdf.addImage(imgData, 'PNG', 0, 0, 1280, 720);
  }

  // Hide again
  slideContainer.style.visibility = 'hidden';
  slideContainer.style.left = '-9999px';

  const fileName = `${slugify(blueprint.startupName)}-pitch-deck.pdf`;
  pdf.save(fileName);
}
