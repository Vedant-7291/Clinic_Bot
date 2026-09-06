const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID =
  process.env.WHATSAPP_PHONE_NUMBER_ID ?? process.env.PHONE_NUMBER_ID;
const API_VERSION = process.env.WHATSAPP_API_VERSION || 'v20.0';

const GRAPH_URL = PHONE_NUMBER_ID
  ? `https://graph.facebook.com/${API_VERSION}/${PHONE_NUMBER_ID}/messages`
  : null;

async function post(body: Record<string, unknown>) {
  if (!WHATSAPP_TOKEN || !GRAPH_URL) {
    throw new Error(
      'WhatsApp is not configured. Set WHATSAPP_TOKEN and PHONE_NUMBER_ID.'
    );
  }

  const res = await fetch(GRAPH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ messaging_product: 'whatsapp', ...body }),
  });
  if (!res.ok) {
    console.error('WhatsApp API error:', await res.text());
  }
  return res;
}

export function sendWhatsAppText(to: string, body: string) {
  return post({ to, type: 'text', text: { body } });
}

export function sendWhatsAppButtons(
  to: string,
  bodyText: string,
  buttons: { id: string; title: string }[]
) {
  // WhatsApp allows a max of 3 quick-reply buttons per message.
  return post({
    to,
    type: 'interactive',
    interactive: {
      type: 'button',
      body: { text: bodyText },
      action: {
        buttons: buttons.slice(0, 3).map((b) => ({
          type: 'reply',
          reply: { id: b.id, title: b.title.slice(0, 20) },
        })),
      },
    },
  });
}

export function sendWhatsAppList(
  to: string,
  bodyText: string,
  buttonLabel: string,
  rows: { id: string; title: string }[]
) {
  // Use a list message when there are more than 3 options (e.g. departments).
  return post({
    to,
    type: 'interactive',
    interactive: {
      type: 'list',
      body: { text: bodyText },
      action: {
        button: buttonLabel.slice(0, 20),
        sections: [
          {
            title: 'Options',
            rows: rows.map((r) => ({ id: r.id, title: r.title.slice(0, 24) })),
          },
        ],
      },
    },
  });
}

// Extracts a normalized {text, buttonId} from either a plain text message
// or an interactive button/list reply, so the webhook handler doesn't need
// to know which message type WhatsApp sent.
export function extractIncomingMessage(message: any): {
  text: string | null;
  replyId: string | null;
} {
  if (message?.type === 'text') {
    return { text: message.text?.body?.trim() ?? null, replyId: null };
  }
  if (message?.type === 'interactive') {
    const interactive = message.interactive;
    if (interactive?.type === 'button_reply') {
      return {
        text: interactive.button_reply?.title ?? null,
        replyId: interactive.button_reply?.id ?? null,
      };
    }
    if (interactive?.type === 'list_reply') {
      return {
        text: interactive.list_reply?.title ?? null,
        replyId: interactive.list_reply?.id ?? null,
      };
    }
  }
  return { text: null, replyId: null };
}
