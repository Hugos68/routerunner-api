export const HASH_CONFIG: Parameters<typeof Bun.password.hash>[1] = {
    algorithm: "argon2id",
    memoryCost: 19_456,
    timeCost: 2,	
} 