The user wants to remove the contact form and redirect every call-to-action (CTA) on the site to WhatsApp.

## Scope

### 1. Remove the contact form
On the home page (`src/routes/index.tsx`), the `ContactSection` currently contains a `name`, `phone`, and `message` form that submits to `contact_messages`. Replace the form card with a single prominent "Contact us on WhatsApp" button/link instead.

### 2. Redirect every CTA to WhatsApp
The WhatsApp number is `+213770764200`.

CTAs to update across the site:
- **Home page** (`src/routes/index.tsx`):
  - Hero CTA button (`#hero`)
  - Navbar "Contact" button
  - Course card "Enroll" button (`href="#contact"`)
  - Bottom tab bar "Contact" tab (scrolls to `#contact`)
- **Courses page** (`src/routes/courses.tsx`):
  - Hero "Book a session" button
  - Final CTA section button
- **IT Skills page** (`src/routes/it-skills.tsx`):
  - Hero "Enroll" button
  - Final CTA section button
- **Support page** (`src/routes/support.tsx`):
  - Hero "Enroll" button
  - Final CTA section button

All these should link to:
```
https://api.whatsapp.com/send?phone=213770764200&text=%D9%84%D8%AF%D9%8A%20%D8%A7%D8%B3%D8%AA%D9%81%D8%B3%D8%A7%D8%B1
```

A reusable helper component (e.g. `WhatsAppButton`) will be created to keep links consistent.

## Technical details
- **New component:** `src/components/WhatsAppButton.tsx` (or inline helper) returning an `<a>` with the WhatsApp URL.
- **Remove:** All `useForm`, `zodResolver`, `z`, `Form`, `FormField`, `FormControl`, `FormLabel`, `FormMessage`, `Input`, `Textarea`, `supabase` imports and code related to the contact form submission from `ContactSection`.
- **Update translations if needed:** Check `src/lib/i18n.ts` for CTA labels — keep existing labels, only change the target URL.
- **No database changes needed.**
- **No backend changes needed.**