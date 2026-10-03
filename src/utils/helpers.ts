import { PhotographyStyle, ImageResolution, AspectRatio } from '../types';

export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function formatResolutionBadge(res: ImageResolution): string {
  switch (res) {
    case '4K':
      return '4K Ultra (3840×3840)';
    case '2K':
      return '2K Print (2048×2048)';
    case '1K':
    default:
      return '1K Standard (1024×1024)';
  }
}

export function getStyleLabel(style: PhotographyStyle): string {
  switch (style) {
    case 'rustic':
      return 'Rustic / Dark';
    case 'bright':
      return 'Bright / Modern';
    case 'social':
      return 'Social Media (Flat-Lay)';
  }
}

export function getStyleDescription(style: PhotographyStyle): string {
  switch (style) {
    case 'rustic':
      return 'Moody chiaroscuro, charcoal slate, warm tungsten side-light, artisanal ceramic pottery.';
    case 'bright':
      return 'Sun-drenched natural morning window light, white Carrara marble, minimalist clean Scandinavian.';
    case 'social':
      return 'Top-down 90° bird’s-eye overhead flat lay, balanced lifestyle props, vibrant punchy colors.';
  }
}
