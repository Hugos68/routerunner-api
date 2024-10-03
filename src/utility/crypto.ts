import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

export function encrypt(plaintext: string) {
	console.log(process.env);
	if (process.env.ENCRYPTION_KEY === undefined) {
		throw new Error("Cannot decrypt, ENCRYPTION_KEY is undefined");
	}
	const iv = randomBytes(12).toString("base64");
	const cipher = createCipheriv(
		"aes-256-gcm",
		Buffer.from(String(process.env.ENCRYPTION_KEY), "base64"),
		Buffer.from(iv, "base64"),
	);
	let ciphertext = cipher.update(plaintext, "utf8", "base64");
	ciphertext += cipher.final("base64");
	const tag = cipher.getAuthTag();

	return { ciphertext, iv, tag };
}

export function decrypt(ciphertext: string, iv: string, tag: string) {
	if (process.env.ENCRYPTION_KEY === undefined) {
		throw new Error("Cannot decrypt, ENCRYPTION_KEY is undefined");
	}
	const decipher = createDecipheriv(
		"aes-256-gcm",
		Buffer.from(String(process.env.ENCRYPTION_KEY), "base64"),
		Buffer.from(iv, "base64"),
	);
	decipher.setAuthTag(Buffer.from(tag, "base64"));
	let plaintext = decipher.update(ciphertext, "base64", "utf8");
	plaintext += decipher.final("utf8");
	return plaintext;
}
