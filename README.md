# Passion Fitness Tuscolana — Sito Astro + Decap CMS

Sito web di Passion Fitness Tuscolana, costruito con [Astro 5](https://astro.build) e [Decap CMS](https://decapcms.org) (ex Netlify CMS), in deploy continuo su [Netlify](https://www.netlify.com).

Stack:
- **Astro 5** — generatore statico, output HTML puro
- **Decap CMS** — pannello admin Git-based per editing dei contenuti
- **Netlify** — hosting + CI/CD + Identity per auth CMS
- **Content Collections** — schema validato con Zod per i dati strutturati (abbonamenti, orari, testimonianze)

---

## Struttura del progetto

```
astro-site/
├── public/
│   ├── admin/              ← pannello CMS (passionfitness.it/admin/)
│   │   ├── config.yml      ← schema collezioni
│   │   └── index.html      ← loader Decap
│   ├── favicon.svg
│   ├── robots.txt
│   └── images/uploads/     ← media caricati dal CMS
├── src/
│   ├── content/            ← dati strutturati (.md con frontmatter YAML)
│   │   ├── abbonamenti/    ← 3 piani prezzi
│   │   ├── orari/          ← 7 giorni planning
│   │   ├── testimonials/   ← recensioni clienti
│   │   ├── pt-packages/    ← pacchetti Personal Training
│   │   ├── drop-in/        ← singoli accessi
│   │   ├── disciplines/    ← card hub corsi
│   │   └── config.ts       ← schema Zod (validazione)
│   ├── components/         ← componenti riutilizzabili .astro
│   ├── layouts/Base.astro  ← layout con nav + footer
│   ├── pages/              ← le 10 pagine del sito
│   └── styles/global.css   ← tutti gli stili condivisi
├── astro.config.mjs
├── netlify.toml            ← build settings + redirect 301
├── package.json
└── tsconfig.json
```

---

## Sviluppo locale

### Prerequisiti
- [Node.js 20+](https://nodejs.org/) (vedi `.nvmrc`)
- [git](https://git-scm.com/)

### Setup

```bash
# Installa le dipendenze
npm install

# Avvia il dev server (http://localhost:4321)
npm run dev

# Build di produzione
npm run build

# Preview della build
npm run preview
```

### Testare il CMS in locale

Per editare i contenuti dal pannello admin in locale (senza Netlify Identity):

```bash
# In un terminale, avvia il proxy Decap
npx decap-server

# In un altro terminale, avvia Astro
npm run dev

# Apri http://localhost:4321/admin/
```

Le modifiche scriveranno direttamente sui file `.md` in `src/content/`.

---

## Deploy: GitHub + Netlify (passo passo)

### Step 1 — Creare il repository GitHub

1. Vai su [github.com/new](https://github.com/new)
2. Nome repository: `passion-fitness-tuscolana` (o quello che preferisci)
3. **Privato** o **pubblico** (consigliato privato per un sito commerciale)
4. NON inizializzare con README/gitignore/license (li abbiamo già)
5. Clicca "Create repository"

### Step 2 — Pushare il progetto

Da terminale, dentro la cartella `astro-site/`:

```bash
git init
git add .
git commit -m "Initial commit: Astro + Decap CMS setup"
git branch -M main
git remote add origin https://github.com/TUO-USERNAME/passion-fitness-tuscolana.git
git push -u origin main
```

### Step 3 — Connettere Netlify al repo

1. Vai su [app.netlify.com](https://app.netlify.com)
2. Fai login con GitHub
3. Clicca **"Add new site" → "Import an existing project"**
4. Scegli **GitHub** e autorizza Netlify
5. Seleziona il repository `passion-fitness-tuscolana`
6. Le impostazioni di build sono già definite in `netlify.toml`:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: 20
7. Clicca **"Deploy site"**

In ~30 secondi il sito è online su un URL temporaneo tipo `random-name-12345.netlify.app`.

### Step 4 — Abilitare Netlify Identity (per il CMS)

1. Nel dashboard del sito Netlify, vai su **Site configuration → Identity**
2. Clicca **"Enable Identity"**
3. **Registration preferences**: imposta **"Invite only"** (così solo chi inviti può registrarsi)
4. Sotto **"External providers"**, opzionalmente abilita Google per login più semplice
5. Sotto **"Services → Git Gateway"**, clicca **"Enable Git Gateway"**

### Step 5 — Invitare gli utenti CMS

1. Vai su **Identity → Invite users**
2. Inserisci l'email di Michele (e di chiunque altro deve gestire i contenuti)
3. Loro riceveranno un'email con il link per impostare la password
4. Una volta dentro, possono accedere a `passionfitness.it/admin/` e modificare:
   - Prezzi abbonamenti (3 piani × 3 durate)
   - Planning settimanale (7 giorni × N lezioni)
   - Testimonianze clienti
   - Pacchetti Personal Training
   - Singoli accessi
   - Card delle discipline

### Step 6 — Dominio custom

1. Nel dashboard Netlify: **Domain management → Add custom domain**
2. Inserisci `passionfitness.it`
3. Netlify ti dirà quali record DNS configurare:
   - **Opzione A** (più semplice): cambia i nameserver del dominio puntando a quelli di Netlify
   - **Opzione B**: aggiungi un record `A` con IP `75.2.60.5` + record `CNAME www → tuo-sito.netlify.app`
4. Aspetta la propagazione DNS (5-60 minuti)
5. Netlify attiva automaticamente il certificato **HTTPS via Let's Encrypt**

### Step 7 — Testare il flusso CMS end-to-end

1. Vai su `passionfitness.it/admin/`
2. Login con il tuo account Identity
3. Modifica un prezzo abbonamento (es: cambia 87 in 89)
4. Clicca **"Publish"**
5. Decap committa il file `src/content/abbonamenti/open.md` su GitHub
6. Netlify rileva il commit, ribuilda Astro (~30s)
7. Il sito live mostra il nuovo prezzo

---

## Aggiornare i contenuti senza CMS (da codice)

I contenuti sono file Markdown con YAML frontmatter dentro `src/content/`. Si possono modificare direttamente:

```yaml
# src/content/abbonamenti/open.md
---
title: "Open"
price12: 89  ← cambia qui
price4: 99
priceFlex: 121
included:
  - "Accesso senza limiti orari"
  - "..."
---
```

Push su `main` → Netlify ribuilda automaticamente.

---

## Workflow per gli sviluppatori

```bash
# Branch nuovo per modifiche grafiche o di codice
git checkout -b feature/nome-feature

# Lavora, committa
git add .
git commit -m "feat: descrizione modifiche"

# Push: Netlify crea automaticamente una "Deploy preview"
git push origin feature/nome-feature

# Apri Pull Request su GitHub. Netlify aggiunge un commento con l'URL preview.
# Quando approvato e mergiato in main → deploy in produzione automatico.
```

---

## Performance & SEO

Il sito è ottimizzato out-of-the-box:
- **HTML puro** — Lighthouse score atteso: 95-100
- **Prefetch automatico** dei link in viewport (configurato in `astro.config.mjs`)
- **Cache aggressivo** sugli asset di Astro (1 anno) via `netlify.toml`
- **Redirect 301** dalle vecchie URL Wordpress (`/abbonamenti/` → `/abbonamenti`, ecc.)
- **OpenGraph + Twitter cards** in ogni pagina (Base layout)
- **Sitemap XML** auto-generata da Astro
- **robots.txt** che blocca `/admin/` dall'indicizzazione

---

## Estendere il CMS

Per aggiungere una nuova collection editabile dal pannello admin:

1. Definisci lo schema Zod in `src/content/config.ts`
2. Aggiungi la cartella `src/content/nuova-collection/`
3. Aggiungi la collection in `public/admin/config.yml` con i fields desiderati
4. Aggiungi `getCollection("nuova-collection")` nelle pagine `.astro` che la usano

---

## Troubleshooting

**Il CMS dice "Failed to load"**
→ Verifica che Git Gateway sia abilitato (Site config → Identity → Services)

**Il build Netlify fallisce con "ENOENT package.json"**
→ Site settings → Build & deploy → Base directory: lascia vuoto se il repo ha `astro-site/` come root, altrimenti imposta `astro-site` come base directory

**Le modifiche dal CMS non appaiono**
→ Aspetta 30-60s. Il rebuild Astro non è istantaneo. Controlla **Deploys** su Netlify per vedere se è in corso.

**Errore Zod schema su un file content**
→ Hai aggiunto/modificato un campo che non rispetta lo schema in `src/content/config.ts`. L'errore in build dice quale file e quale campo.

---

## Costi

Tutto **gratis** entro i limiti free di Netlify:
- 100 GB bandwidth / mese
- 300 build minutes / mese
- 1 utente Netlify (chi gestisce il dashboard) — gli editor CMS sono "Identity users", possono essere illimitati nel piano free

Una palestra di quartiere è ben sotto questi limiti. Solo costo: il dominio (Aruba o dove è registrato).

---

## Migrazione dai mockup HTML

Gli HTML originali (`mockup_home_v2.html`, `corsi.html`, `sala-pesi.html`, `corsi-fitness.html`, `pilates-reformer.html`, `crossfit.html`, `hyrox.html`, `personal-training.html`, `abbonamenti.html`, `orari.html`) sono stati migrati 1:1 mantenendo:
- Design language editoriale dark Hyrox-inspired
- Tipografia Barlow Condensed + Inter
- Color scheme `--c-bg #0A0A0A` + `--c-accent #E11D2E`
- Animazioni: hero parallax, reveal-on-scroll, counter, planning filter
- SEO meta tags, breadcrumb, canonical URL

Sezioni "data" sono ora gestite dal CMS:
- **Abbonamenti**: prezzi 3 piani × 3 durate
- **Orari**: 7 giorni × N lezioni × 5 discipline filtrabili
- **Testimonianze**: distribuite per pagina
- **Personal Training**: 3 pacchetti × 3 durate seduta
- **Singoli accessi**: 4 prodotti
- **Discipline**: 6 card hub corsi

---

## Contatti

Sito sviluppato da [Ready2Digital](https://ready2digital.it) per **Passion Fitness Tuscolana**.

- Sede: Via Tuscolana 1052, Roma
- Sviluppatore: Michele · michele@ready2digital.it
