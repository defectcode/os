import { execSync } from "child_process";
import * as dns from "node:dns";
import { hostname } from "./system";

export async function ipAddresses(): Promise<string[]> {
    try {
        const host = hostname()
        const recs = await new Promise<dns.LookupAddress[]>((resolve, reject) => {
            dns.lookup(host, { all: true }, (err, addresses) => (err ? reject(err) : resolve(addresses)));
        })
        return recs.map((a) => a.address)
    } catch {
        return []
    }
}

export function ipAdressSync(): string[] {
    try {
        const host = hostname()
        const out = execSync(process.platform === "win32" ? `nslookup ${host}` : `getent hosts ${host}`, { encoding: "utf8" })
        const ips = out.match(/\\b(\\d{1,3}\\.){3}\\d{1,3}\\b/g) || [];
        return Array.from(new Set(ips))
    } catch {
        return []
    }
}