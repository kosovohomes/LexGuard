// LexGuard zero-knowledge vault (PRD §9.1: "Optional client-side encryption
// (zero-knowledge mode)"). For anonymous local mode: the whole local database
// is encrypted in the browser with a passphrase-derived AES-GCM key, so the
// plaintext never touches localStorage. The passphrase never leaves the device
// and cannot be recovered — a lost passphrase means the data stays encrypted.

const PBKDF2_ITERATIONS = 310_000; // OWASP 2023 guidance for PBKDF2-SHA256
const SALT_BYTES = 16;
const IV_BYTES = 12;
export const ZK_PREFIX = "lgzk1"; // payload version marker

function toB64(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = "";
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s);
}

function fromB64(s: string): Uint8Array {
  const bin = atob(s);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, ["deriveKey"]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: PBKDF2_ITERATIONS, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

/** Minimum passphrase strength we accept (kept low to be usable; the vault is
 *  one factor of defense on top of a device the user controls). */
export function passphraseProblem(p: string): "too_short" | null {
  return p.length >= 8 ? null : "too_short";
}

/** Encrypt any JSON-serializable value into a self-contained payload string:
 *  `lgzk1.<saltB64>.<ivB64>.<ciphertextB64>`. */
export async function encryptJson(value: unknown, passphrase: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
  const key = await deriveKey(passphrase, salt);
  const plaintext = new TextEncoder().encode(JSON.stringify(value));
  const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, plaintext as BufferSource);
  return [ZK_PREFIX, toB64(salt), toB64(iv), toB64(ct)].join(".");
}

/** Decrypt a payload produced by encryptJson. Throws on a wrong passphrase or
 *  a corrupted payload (GCM authentication failure). */
export async function decryptJson<T>(payload: string, passphrase: string): Promise<T> {
  const parts = payload.split(".");
  if (parts.length !== 4 || parts[0] !== ZK_PREFIX) throw new Error("bad_payload");
  const salt = fromB64(parts[1]);
  const iv = fromB64(parts[2]);
  const ct = fromB64(parts[3]);
  const key = await deriveKey(passphrase, salt);
  const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, ct as BufferSource);
  return JSON.parse(new TextDecoder().decode(pt)) as T;
}

/** True if the payload looks like a LexGuard zero-knowledge vault blob. */
export function isZkPayload(s: string): boolean {
  return s.startsWith(`${ZK_PREFIX}.`);
}

/** A cipher bound to one passphrase — the PBKDF2 key is derived once and
 *  reused, so per-save cost is a fast AES-GCM pass instead of 310k KDF
 *  iterations. Used by the local-mode vault for every persistence tick. */
export interface VaultCipher {
  encrypt(value: unknown): Promise<string>;
  decrypt<T>(payload: string): Promise<T>;
}

export async function createCipher(passphrase: string, knownPayload?: string): Promise<VaultCipher> {
  // Reuse the existing salt when unlocking so the same passphrase derives the
  // same key; a fresh random salt when creating a vault.
  let salt: Uint8Array;
  if (knownPayload && isZkPayload(knownPayload)) {
    salt = fromB64(knownPayload.split(".")[1]);
  } else {
    salt = crypto.getRandomValues(new Uint8Array(SALT_BYTES));
  }
  const key = await deriveKey(passphrase, salt);
  return {
    async encrypt(value: unknown): Promise<string> {
      const iv = crypto.getRandomValues(new Uint8Array(IV_BYTES));
      const plaintext = new TextEncoder().encode(JSON.stringify(value));
      const ct = await crypto.subtle.encrypt({ name: "AES-GCM", iv: iv as BufferSource }, key, plaintext as BufferSource);
      return [ZK_PREFIX, toB64(salt), toB64(iv), toB64(ct)].join(".");
    },
    async decrypt<T>(payload: string): Promise<T> {
      return decryptJson<T>(payload, passphrase);
    },
  };
}
