import { toast } from '../services/toastService';

export async function copyWithToast(
  text: string,
  successMessage = 'Copied to clipboard.'
): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    toast.success(successMessage);
    return true;
  } catch {
    toast.error(
      'Clipboard access was blocked by your browser. Please copy manually.'
    );
    return false;
  }
}
