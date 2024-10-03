import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

if (process.env.ENCRYPTION_KEY === undefined) {
	throw new Error("Failed to load crypto module, ENCRYPTION_KEY is undefined");
}

const ENCRYPTION_KEY = Buffer.from(process.env.ENCRYPTION_KEY, "base64");

export function encrypt(plaintext: string) {
	const iv = randomBytes(12);
	const cipher = createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
	let ciphertext = cipher.update(plaintext, "utf8", "base64");
	ciphertext += cipher.final("base64");
	const tag = cipher.getAuthTag();
	return {
		ciphertext: ciphertext,
		iv: iv.toString("base64"),
		tag: tag.toString("base64"),
	};
}

export function decrypt(ciphertext: string, iv: string, tag: string) {
	const decipher = createDecipheriv(
		"aes-256-gcm",
		ENCRYPTION_KEY,
		Buffer.from(iv, "base64"),
	);
	decipher.setAuthTag(Buffer.from(tag, "base64"));
	let plaintext = decipher.update(ciphertext, "base64", "utf8");
	plaintext += decipher.final("utf8");
	return plaintext;
}
