/**
 * Copy text to the clipboard, working outside a secure context too.
 *
 * `navigator.clipboard` only exists on HTTPS or localhost, so it is missing
 * whenever the site is opened over a plain http:// LAN address — which is
 * exactly how the invitation gets tested on a phone. The selection-based
 * fallback is deprecated but still works everywhere that matters.
 */
export async function copyText(text: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  if (window.isSecureContext && navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission denied or otherwise refused — try the fallback below.
    }
  }

  try {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    // Kept on screen but invisible: iOS refuses to select a display:none node.
    field.style.cssText = "position:fixed;top:0;left:0;opacity:0;pointer-events:none;";
    document.body.appendChild(field);
    field.select();
    field.setSelectionRange(0, text.length);
    const ok = document.execCommand("copy");
    field.remove();
    return ok;
  } catch {
    return false;
  }
}
