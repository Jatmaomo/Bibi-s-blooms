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

export interface WhatsAppOrderProduct {
  name: string;
  price: number;
  description?: string;
  size?: string;
  category?: string;
  sizes?: string[];
  imageUrl?: string;
}

/**
 * Generate a direct WhatsApp link with pre-filled message
 * When customers come into Bibi's DM through the website, all product information
 * (Product name, Description / Details, Price, Category, Size, Photo) is included.
 */
export function getWhatsAppOrderUrl(
  productOrName: string | WhatsAppOrderProduct,
  price?: number,
  size?: string,
  category?: string,
  description?: string,
  imageUrl?: string,
  availableSizes?: string[]
): string {
  let name = '';
  let itemPrice = 0;
  let itemSize = size;
  let itemCategory = category;
  let itemDescription = description;
  let itemImageUrl = imageUrl;
  let itemSizes = availableSizes;

  if (typeof productOrName === 'object' && productOrName !== null) {
    name = productOrName.name;
    itemPrice = productOrName.price;
    itemSize = productOrName.size;
    itemCategory = productOrName.category;
    itemDescription = productOrName.description;
    itemImageUrl = productOrName.imageUrl;
    itemSizes = productOrName.sizes;
  } else if (typeof productOrName === 'string') {
    name = productOrName;
    itemPrice = price ?? 0;
  }

  const formattedPrice = formatNaira(itemPrice);
  let message = `Hi Bibi, I’d like to shop for some wears.\n\n`;
  message += `I would like to order this piece from your collection:\n`;
  message += `• Product: ${name}\n`;
  if (itemDescription && itemDescription.trim()) {
    message += `• Details: ${itemDescription.trim()}\n`;
  }
  message += `• Price: ${formattedPrice}\n`;
  if (itemCategory) {
    message += `• Category: ${itemCategory}\n`;
  }
  if (itemSize) {
    message += `• Size: ${itemSize}\n`;
  } else if (itemSizes && itemSizes.length > 0) {
    message += `• Available Sizes: ${itemSizes.join(', ')}\n`;
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
