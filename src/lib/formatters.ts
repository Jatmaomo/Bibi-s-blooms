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
export const SNAPCHAT_URL =
  'https://www.snapchat.com/add/bibisblooms26?share_id=XC6SWF85RQyb9OcqUSYLjw&locale=en_NG';
export const SNAPCHAT_USERNAME = 'bibisblooms26';
export const CONTACT_EMAIL = 'bisolahassan2022@gmail.com';

export type OrderChannel = 'whatsapp' | 'snapchat';

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
 * Build clean, formatted order text
 */
export function buildProductOrderMessage(
  productOrName: string | WhatsAppOrderProduct,
  price?: number,
  size?: string,
  category?: string,
  description?: string,
  availableSizes?: string[]
): string {
  let name = '';
  let itemPrice = 0;
  let itemSize = size;
  let itemCategory = category;
  let itemDescription = description;
  let itemSizes = availableSizes;

  if (typeof productOrName === 'object' && productOrName !== null) {
    name = productOrName.name;
    itemPrice = productOrName.price;
    itemSize = productOrName.size;
    itemCategory = productOrName.category;
    itemDescription = productOrName.description;
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
  return message;
}

/**
 * Generate a direct WhatsApp link with pre-filled message
 * When customers come into Bibi's DM through the website, all product information
 * (Product name, Description / Details, Price, Category, Size) is included.
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
  const message = buildProductOrderMessage(
    productOrName,
    price,
    size,
    category,
    description,
    availableSizes
  );
  return `https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(message)}`;
}

/**
 * Dispatch an order to either WhatsApp or Snapchat based on customer selection.
 * - WhatsApp: Opens direct chat with prefilled order text.
 * - Snapchat: Copies order text to clipboard and opens Bibi's Snapchat profile.
 */
export async function dispatchOrder(
  channel: OrderChannel,
  orderMessage: string,
  onNotice?: (msg: string) => void
): Promise<void> {
  if (channel === 'whatsapp') {
    window.open(`https://wa.me/${WHATSAPP_INTL}?text=${encodeURIComponent(orderMessage)}`, '_blank');
  } else {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(orderMessage);
      }
    } catch {
      // Ignore clipboard fallback
    }
    if (onNotice) {
      onNotice("Order details copied to clipboard! Paste directly in Bibi's Snapchat chat.");
    }
    window.open(SNAPCHAT_URL, '_blank');
  }
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
