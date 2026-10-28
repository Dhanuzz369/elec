// Every visible string in the quick quote form, per language. Add a language by
// adding a key; anything missing falls back to English.

const en = {
  progress: "Step {n} of {m}",
  back: "Back",
  next: "Next",
  send: "Send request",
  sending: "Sending…",
  steps: {
    contact: "How can we reach you?",
    product: "What do you need?",
    variety: "Which {family}?",
    quantity: "How many?",
    destination: "Where should it ship?",
    terms: "Delivery terms?",
    notes: "Anything else we should know?",
  },
  fields: {
    name: "Your name",
    company: "Company (optional)",
    email: "Email",
    phone: "WhatsApp / phone",
    productOther: "Which product?",
    productOtherPlaceholder: "e.g. cable trays, earthing kits",
    quantityOther: "How many?",
    quantityOtherPlaceholder: "e.g. 40 panels over two phases",
    country: "Country",
    countryPlaceholder: "Start typing a country",
    port: "Port or city (optional)",
    notes: "Notes (optional)",
    notesPlaceholder: "Ratings, standards, deadline, anything that helps",
    honeypot: "Leave this box empty",
  },
  hints: {
    contact: "Email or WhatsApp is enough.",
    privacy: "We use these details only to reply to your request.",
  },
  choices: {
    other: "Something else",
    any: "Any / not sure",
  },
  errors: {
    name: "Please tell us your name.",
    contact: "Add an email address or a phone number with at least 7 digits.",
    email: "That email address doesn't look complete.",
    product: "Pick what you need, or choose Something else.",
    productOther: "Tell us which product you need.",
    variety: "Pick one, or choose Any / not sure.",
    quantity: "Pick a quantity.",
    quantityOther: "Tell us roughly how many.",
    country: "Tell us which country it ships to.",
    terms: "Pick delivery terms, or choose Not sure.",
  },
  success: {
    title: "Thanks, we've got your request",
    text: "We reply within one working day, by email or WhatsApp.",
    link: "Browse products",
  },
  fallback: {
    title: "We couldn't send that just now",
    text: "Your answers are below and nothing is lost. Send them to us in one tap:",
    whatsapp: "Send on WhatsApp",
    email: "Send by email",
  },
  summary: {
    name: "Name",
    company: "Company",
    email: "Email",
    phone: "WhatsApp / phone",
    product: "Product",
    variety: "Type",
    quantity: "Quantity",
    country: "Country",
    port: "Port or city",
    terms: "Delivery terms",
    notes: "Notes",
  },
  emailSubject: "Quote request: {product} for {country}",
  noJsSubmit: "Send request",
};

export type QuoteStrings = typeof en;

const strings: Record<string, QuoteStrings> = { en };

export function getStrings(lang: string): QuoteStrings {
  return strings[lang] ?? strings[lang.split("-")[0]] ?? en;
}

export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) => (k in values ? String(values[k]) : m));
}
