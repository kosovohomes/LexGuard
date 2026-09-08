// LexGuard legal & trust documents — public-launch hardening (PRD §9.2, §11).
// Content is drafted for public launch and marked as pending counsel review;
// it summarizes the product's actual behavior (dual modes, export, deletion,
// no trackers, no data sale) rather than promising future behavior.

export interface BiText {
  en: string;
  es: string;
}

export interface LegalSection {
  h: BiText;
  p: BiText[];
  list?: BiText[];
}

export interface LegalDoc {
  title: BiText;
  updated: string;
  sections: LegalSection[];
}

export type LegalSlug = "privacy" | "terms" | "accessibility";

export const LEGAL_DOCS: Record<LegalSlug, LegalDoc> = {
  privacy: {
    title: { en: "Privacy Policy", es: "Política de privacidad" },
    updated: "2026-09-09",
    sections: [
      {
        h: { en: "What we collect", es: "Qué recopilamos" },
        p: [
          {
            en: "In account mode we store your email (for sign-in only), your state and language preference, and the content you create: cases, journal entries, and uploaded documents. In anonymous local mode, nothing leaves your device — all data stays in this browser's storage and is never sent to any server.",
            es: "En modo cuenta almacenamos su correo (solo para iniciar sesión), su estado y preferencia de idioma, y el contenido que crea: casos, registros del diario y documentos subidos. En modo local anónimo, nada sale de su dispositivo: todos los datos permanecen en el almacenamiento de este navegador y nunca se envían a ningún servidor.",
          },
        ],
      },
      {
        h: { en: "What we never do", es: "Lo que nunca hacemos" },
        p: [{ en: "These commitments are permanent parts of this policy:", es: "Estos compromisos son parte permanente de esta política:" }],
        list: [
          { en: "We never sell your data — to anyone, ever.", es: "Nunca vendemos sus datos — a nadie, jamás." },
          { en: "We never run advertising or third-party analytics trackers inside the app.", es: "Nunca mostramos publicidad ni usamos rastreadores de análisis de terceros dentro de la aplicación." },
          { en: "We never publish anything you write, and there is no public review or naming feature at all.", es: "Nunca publicamos lo que usted escribe, y no existe ninguna función pública de reseñas ni de nombres." },
          { en: "We never require a lawyer's participation or notify any lawyer about your use of LexGuard.", es: "Nunca exigimos la participación de un abogado ni notificamos a ningún abogado sobre su uso de LexGuard." },
        ],
      },
      {
        h: { en: "Your controls", es: "Sus controles" },
        p: [
          {
            en: "You own your data. You can export everything as JSON at any time from Settings, and you can delete your account and all associated data at any time (erasure completes within 30 days, and backups purge on rotation). Deleting is self-service in account mode, and clearing your browser data removes local-mode content instantly.",
            es: "Sus datos son suyos. Puede exportarlos todo como JSON en cualquier momento desde Ajustes, y puede eliminar su cuenta y todos los datos asociados en cualquier momento (el borrado se completa en 30 días y las copias de seguridad se purgan por rotación). La eliminación es autónoma en modo cuenta, y borrar los datos del navegador elimina al instante el contenido del modo local.",
          },
        ],
      },
      {
        h: { en: "Your rights (CA and TX)", es: "Sus derechos (CA y TX)" },
        p: [
          {
            en: "California residents (CCPA/CPRA) and Texas residents (TDPSA) have rights to know, access, correct, delete, and port their personal data. LexGuard implements these natively: export gives you the full copy, and deletion fulfills erasure requests without forms or verification hoops beyond confirming you are signed in.",
            es: "Los residentes de California (CCPA/CPRA) y de Texas (TDPSA) tienen derecho a saber, acceder, corregir, eliminar y portar sus datos personales. LexGuard los implementa de forma nativa: la exportación le da la copia completa, y la eliminación cumple las solicitudes de borrado sin formularios ni trámites adicionales más allá de confirmar que inició sesión.",
          },
        ],
      },
      {
        h: { en: "Children", es: "Menores" },
        p: [
          {
            en: "LexGuard is not directed at children. Registration includes a neutral age confirmation (16+) and we do not knowingly collect data from anyone under 16.",
            es: "LexGuard no está dirigido a menores. El registro incluye una confirmación de edad neutral (16+) y no recopilamos a sabiendas datos de personas menores de 16 años.",
          },
        ],
      },
      {
        h: { en: "Security", es: "Seguridad" },
        p: [
          {
            en: "Traffic is encrypted in transit. Passwords are stored as salted scrypt hashes, sessions use signed HTTP-only cookies, and uploaded documents are access-checked on every download. Local mode data remains on your device under your browser's storage protections. If a data incident ever affects users, we will notify affected users directly.",
            es: "El tráfico está cifrado en tránsito. Las contraseñas se guardan como hashes scrypt con sal, las sesiones usan cookies HTTP-only firmadas, y los documentos subidos se verifican por propietario en cada descarga. Los datos del modo local permanecen en su dispositivo bajo las protecciones de almacenamiento de su navegador. Si un incidente de datos llegara a afectar a usuarios, notificaremos directamente a los usuarios afectados.",
          },
        ],
      },
    ],
  },

  terms: {
    title: { en: "Terms of Use", es: "Términos de uso" },
    updated: "2026-09-09",
    sections: [
      {
        h: { en: "Information, not advice", es: "Información, no asesoría" },
        p: [
          {
            en: "LexGuard provides legal information and document-organization tools. It does not provide legal advice, does not evaluate the merits of any claim, and does not predict or promise any outcome. No attorney-client relationship is created between you and LexGuard, and LexGuard is not a law firm.",
            es: "LexGuard proporciona información legal y herramientas de organización de documentos. No ofrece asesoría legal, no evalúa el mérito de ningún reclamo y no predice ni promete ningún resultado. No se crea ninguna relación abogado-cliente entre usted y LexGuard, y LexGuard no es un bufete.",
          },
        ],
      },
      {
        h: { en: "Neutral observations", es: "Observaciones neutrales" },
        p: [
          {
            en: "The red-flag panel compares facts you logged against published rules of professional conduct and produces conditional, neutral observations. An observation is not a conclusion that any rule was violated, and it is not evidence by itself. Only you and, where appropriate, the official channels described can assess what happened.",
            es: "El panel de alertas compara los hechos que registró con las reglas de conducta profesional publicadas y produce observaciones neutrales y condicionales. Una observación no es una conclusión de que se violó alguna regla ni es evidencia por sí misma. Solo usted y, cuando corresponda, los canales oficiales descritos pueden evaluar lo ocurrido.",
          },
        ],
      },
      {
        h: { en: "You stay in control of filings", es: "Usted controla sus presentaciones" },
        p: [
          {
            en: "LexGuard never files anything on your behalf. Deadlines and windows shown in the app are informational and computed from what you logged; they can be wrong if your entries are wrong or incomplete. Always verify deadlines and forms on official state bar and court pages before acting.",
            es: "LexGuard nunca presenta nada en su nombre. Los plazos y ventanas que muestra la aplicación son informativos y se calculan a partir de lo que usted registró; pueden ser incorrectos si sus registros son erróneos o incompletos. Verifique siempre los plazos y formularios en las páginas oficiales de los colegios de abogados y tribunales antes de actuar.",
          },
        ],
      },
      {
        h: { en: "Your content", es: "Su contenido" },
        p: [
          {
            en: "You keep all rights to everything you write and upload. You grant LexGuard no license to publish it — storage and processing happen only to provide the service to you. You are responsible for the accuracy of what you log, and for keeping your sign-in credentials and device safe, especially on shared devices (consider anonymous local mode and the quick-exit button).",
            es: "Usted conserva todos los derechos sobre lo que escribe y sube. No otorga a LexGuard ninguna licencia para publicarlo: el almacenamiento y procesamiento ocurren solo para brindarle el servicio. Usted es responsable de la exactitud de lo que registra y de mantener seguras sus credenciales y su dispositivo, especialmente en dispositivos compartidos (considere el modo local anónimo y el botón de salida rápida).",
          },
        ],
      },
      {
        h: { en: "No warranty; limits", es: "Sin garantía; límites" },
        p: [
          {
            en: "The service is provided 'as is' without warranties of any kind, to the fullest extent permitted by law. LexGuard does not warrant that content is complete, current, or error-free; state bar processes change and content shows its last-reviewed date. Nothing in these terms limits rights that applicable consumer law grants you.",
            es: "El servicio se proporciona 'tal cual', sin garantías de ningún tipo, en la máxima medida permitida por la ley. LexGuard no garantiza que el contenido sea completo, actual o libre de errores; los procesos de los colegios de abogados cambian y el contenido muestra su fecha de última revisión. Nada en estos términos limita los derechos que la ley de consumo aplicable le otorga.",
          },
        ],
      },
    ],
  },

  accessibility: {
    title: { en: "Accessibility Statement", es: "Declaración de accesibilidad" },
    updated: "2026-09-09",
    sections: [
      {
        h: { en: "Our target", es: "Nuestro objetivo" },
        p: [
          {
            en: "LexGuard aims for WCAG 2.1 Level AA. We take this seriously because many of our users are navigating stressful situations, on phones, on shared devices, or using assistive technology. Accessibility was part of this release's scope, not an afterthought.",
            es: "LexGuard apunta al nivel AA de WCAG 2.1. Lo tomamos en serio porque muchos de nuestros usuarios atraviesan situaciones estresantes, usan teléfonos, dispositivos compartidos o tecnologías de asistencia. La accesibilidad fue parte del alcance de esta versión, no una ocurrencia tardía.",
          },
        ],
      },
      {
        h: { en: "What is built in", es: "Lo que está integrado" },
        p: [{ en: "Concretely, the app provides:", es: "En concreto, la aplicación ofrece:" }],
        list: [
          { en: "A skip-to-content link, semantic landmarks, and current-page indication in navigation.", es: "Un enlace para saltar al contenido, regiones semánticas e indicación de página actual en la navegación." },
          { en: "Keyboard operation throughout, with visible focus styles; dialogs trap focus and close with Escape.", es: "Operación completa por teclado, con estilos de foco visibles; los diálogos atrapan el foco y se cierran con Escape." },
          { en: "Text alternatives: icon-only buttons carry accessible names, and images carry descriptions.", es: "Alternativas de texto: los botones de solo ícono tienen nombres accesibles y las imágenes llevan descripciones." },
          { en: "Respect for the system 'reduce motion' setting, which disables animations and transitions.", es: "Respeto por la configuración 'reducir movimiento' del sistema, que desactiva animaciones y transiciones." },
          { en: "Full Spanish parity, including content — not just interface labels.", es: "Paridad completa en español, incluido el contenido — no solo las etiquetas de la interfaz." },
          { en: "Safety-first design: quick exit (button or pressing Escape three times) and discreet mode that neutralizes the tab title.", es: "Diseño seguro: salida rápida (botón o presionar Escape tres veces) y modo discreto que neutraliza el título de la pestaña." },
        ],
      },
      {
        h: { en: "Known limitations", es: "Limitaciones conocidas" },
        p: [
          {
            en: "Generated PDF dossiers are produced by a client-side library; screen-reader support inside the PDF is limited, but the same content is available in the app and the narrative is fully editable text before export. Color is never the only means of conveying status — text labels accompany tone colors.",
            es: "Los dossiers PDF generados se producen con una biblioteca del lado del cliente; el soporte para lectores de pantalla dentro del PDF es limitado, pero el mismo contenido está disponible en la aplicación y la narrativa es texto totalmente editable antes de exportar. El color nunca es el único medio para transmitir el estado; las etiquetas de texto acompañan a los colores.",
          },
        ],
      },
      {
        h: { en: "Feedback", es: "Comentarios" },
        p: [
          {
            en: "If any part of LexGuard blocks you, tell us and we will fix it. Accessibility reports are treated as priority defects, not feature requests.",
            es: "Si alguna parte de LexGuard le genera barreras, díganoslo y lo corregiremos. Los informes de accesibilidad se tratan como defectos prioritarios, no como solicitudes de funcionalidades.",
          },
        ],
      },
    ],
  },
};
