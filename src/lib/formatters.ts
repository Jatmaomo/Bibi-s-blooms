/**
 * Format number into Nigerian Naira (₦) display string
 * e.g. 45000 -> ₦45,000
 */
export function formatNaira(amount: number): string {
  if (isNaN(amount) || amount === null || amount === undefined) {
    return '₦0';
  }
  return '₦' + Math.round(amount).toLocaleString('en-US');
}

export const WHATSAPP_PHONE = '07054022430';
export const WHATSAPP_INTL = '2347054022430';
export const CONTACT_EMAIL = 'bisolahassan2022@gmail.com';

/**
 * Generate a direct WhatsApp link with pre-filled message
 * As requested: "Hi Bibi, I’d like to shop for some wears."
 */
export function getWhatsAppOrderUrl(
  productName: string,
  price: number,
  size?: string,
  category?: string
): string {
  const formattedPrice = formatNaira(price);
  let message = `Hi Bibi, I’d like to shop for some wears.\n\n`;
  message += `I would like to order this piece from your collection:\n`;
  message += `• Product: ${productName}\n`;
  message += `• Price: ${formattedPrice}\n`;
  if (size) {
    message += `• Size: ${size}\n`;
  }
  if (category) {
    message += `• Category: ${category}\n`;
  }
  message += `\nPlease confirm availability and delivery.`;

  return `https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(message)}`;
}

/**
 * General inquiry WhatsApp link
 */
export function getWhatsAppContactUrl(customMessage?: string): string {
  const message =
    customMessage ||
    `Hi Bibi, I’d like to shop for some wears. Please send me your latest collection and available sizes.`;
  return `https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(message)}`;
}
