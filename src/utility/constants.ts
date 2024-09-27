export const ARGON2ID_CONFIGURATION: Parameters<typeof Bun.password.hash>[1] = {
	algorithm: "argon2id",
	memoryCost: 19_456,
	timeCost: 2,
};
