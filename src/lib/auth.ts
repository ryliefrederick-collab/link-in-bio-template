import { eq } from "drizzle-orm";
import { db } from "@/db";
import { siteSettings } from "@/db/schema";

const PBKDF2_ITERATIONS = 100_000;

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function fromHex(hex: string): ArrayBuffer {
  const buf = new ArrayBuffer(hex.length / 2);
  const view = new Uint8Array(buf);
  for (let i = 0; i < view.length; i++) {
    view[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return buf;
}

function randomHex(bytes: number): string {
  const arr = new Uint8Array(bytes);
  crypto.getRandomValues(arr);
  return toHex(arr.buffer);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: PBKDF2_ITERATIONS,
      hash: "SHA-256",
    },
    key,
    256
  );
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return `pbkdf2$${PBKDF2_ITERATIONS}$${saltHex}$${toHex(bits)}`;
}

export async function verifyPassword(
  password: string,
  stored: string
): Promise<boolean> {
  const [scheme, iterStr, saltHex, hashHex] = stored.split("$");
  if (scheme !== "pbkdf2" || !iterStr || !saltHex || !hashHex) return false;
  const iterations = parseInt(iterStr, 10);
  const salt = fromHex(saltHex);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveBits"]
  );
  const bits = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    key,
    256
  );
  const candidate = toHex(bits);
  if (candidate.length !== hashHex.length) return false;
  let diff = 0;
  for (let i = 0; i < candidate.length; i++) {
    diff |= candidate.charCodeAt(i) ^ hashHex.charCodeAt(i);
  }
  return diff === 0;
}

export async function signToken(
  payload: string,
  secret: string
): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return `${payload}.${toHex(sig)}`;
}

export async function verifyToken(
  token: string,
  secret: string
): Promise<boolean> {
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;
  const expected = await signToken(payload, secret);
  const expectedSig = expected.split(".")[1];
  if (expectedSig.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < signature.length; i++) {
    diff |= signature.charCodeAt(i) ^ expectedSig.charCodeAt(i);
  }
  return diff === 0;
}

export type AuthState = {
  isSetup: boolean;
  passwordHash: string | null;
  sessionSecret: string | null;
};

export async function getAuthState(): Promise<AuthState> {
  const row = await db
    .select({
      passwordHash: siteSettings.passwordHash,
      sessionSecret: siteSettings.sessionSecret,
    })
    .from(siteSettings)
    .where(eq(siteSettings.id, 1))
    .limit(1);
  const r = row[0];
  return {
    isSetup: !!r?.passwordHash,
    passwordHash: r?.passwordHash ?? null,
    sessionSecret: r?.sessionSecret ?? null,
  };
}

export async function completeSetup(password: string): Promise<string> {
  const state = await getAuthState();
  if (state.isSetup) {
    throw new Error("Already configured");
  }
  const passwordHash = await hashPassword(password);
  const sessionSecret = randomHex(32);

  const existing = await db
    .select({ id: siteSettings.id })
    .from(siteSettings)
    .where(eq(siteSettings.id, 1))
    .limit(1);

  if (existing[0]) {
    await db
      .update(siteSettings)
      .set({ passwordHash, sessionSecret })
      .where(eq(siteSettings.id, 1));
  } else {
    await db.insert(siteSettings).values({
      id: 1,
      passwordHash,
      sessionSecret,
    });
  }
  return sessionSecret;
}
