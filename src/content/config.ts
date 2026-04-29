import { defineCollection, z } from "astro:content";

/* ===== ABBONAMENTI ===== */
const abbonamenti = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    /** "01", "02", "03" — ordinamento e numero piano */
    num: z.string(),
    isPro: z.boolean().default(false),
    /** prezzo principale visualizzato grande */
    price12: z.number(),
    price4: z.number(),
    priceFlex: z.number(),
    activationFee: z.number().default(60),
    suspensionFee: z.number().default(15),
    /** ID Perfect Gym per iscrizione */
    paymentPlanId12: z.string(),
    paymentPlanId4: z.string().optional(),
    paymentPlanIdFlex: z.string().optional(),
    included: z.array(z.string()),
    badge: z.string().optional(),
    order: z.number().default(0)
  })
});

/* ===== ORARI — un file per giorno ===== */
const orari = defineCollection({
  type: "content",
  schema: z.object({
    day: z.enum(["lun", "mar", "mer", "gio", "ven", "sab", "dom"]),
    dayLabel: z.string(),
    fullName: z.string(),
    classes: z.array(z.object({
      time: z.string(),
      name: z.string(),
      room: z.string(),
      duration: z.string(),
      discipline: z.enum(["rebalance", "energy", "reformer", "crossfit", "hyrox"])
    })),
    order: z.number()
  })
});

/* ===== TESTIMONIANZE ===== */
const testimonials = defineCollection({
  type: "content",
  schema: z.object({
    name: z.string(),
    initials: z.string().max(3),
    role: z.string(),
    quote: z.string(),
    /** Su quali pagine mostrare questa testimonianza */
    pages: z.array(z.enum([
      "home",
      "sala-pesi",
      "corsi-fitness",
      "pilates-reformer",
      "crossfit",
      "hyrox",
      "personal-training"
    ])),
    order: z.number().default(0)
  })
});

/* ===== PERSONAL TRAINING PACKAGES ===== */
const ptPackages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    tag: z.string(),
    num: z.string(),
    isPro: z.boolean().default(false),
    /** giorni di validità del pacchetto */
    validityDays: z.number(),
    /** prezzi per durata seduta */
    price60: z.number(),
    price40: z.number(),
    price30: z.number(),
    /** ID Perfect Gym (di una qualunque variante per il bottone principale) */
    productId: z.string(),
    order: z.number()
  })
});

/* ===== DROP-IN — singoli accessi ===== */
const dropIn = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    price: z.number(),
    meta: z.string(),
    note: z.string(),
    productId: z.string(),
    order: z.number()
  })
});

/* ===== DISCIPLINES — pagine corsi (per il hub) ===== */
const disciplines = defineCollection({
  type: "content",
  schema: z.object({
    slug: z.string(),
    eyebrow: z.string(),
    title: z.string(),
    description: z.string(),
    image: z.string(),
    href: z.string(),
    order: z.number()
  })
});

export const collections = {
  abbonamenti,
  orari,
  testimonials,
  "pt-packages": ptPackages,
  "drop-in": dropIn,
  disciplines
};
