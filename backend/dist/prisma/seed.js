"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const adapter_pg_1 = require("@prisma/adapter-pg");
const client_1 = require("@prisma/client");
const pg_1 = require("pg");
const bcrypt = __importStar(require("bcrypt"));
async function main() {
    const connectionString = process.env.DATABASE_URL ?? 'postgresql://user:password@localhost:5433/samity_db';
    const pool = new pg_1.Pool({ connectionString });
    const adapter = new adapter_pg_1.PrismaPg(pool);
    const prisma = new client_1.PrismaClient({ adapter });
    const email = 'admin@shomiti.com';
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
        console.log('Admin already exists:', email);
        await prisma.$disconnect();
        await pool.end();
        return;
    }
    const hashed = await bcrypt.hash('Admin@1234', 10);
    const user = await prisma.user.create({
        data: { email, name: 'System Admin', password: hashed, role: 'ADMIN' },
    });
    await prisma.member.create({
        data: { memberNumber: 'MBR-0001', fullName: 'System Admin', userId: user.id },
    });
    console.log('✅ Admin created!');
    console.log('Email: admin@shomiti.com');
    console.log('Password: Admin@1234');
    await prisma.$disconnect();
    await pool.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
//# sourceMappingURL=seed.js.map