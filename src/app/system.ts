import { execSync } from 'child_process'
import * as os from "node:os";
import * as path from "path";


export function platform(): NodeJS.Platform {
    return process.platform
}

export function arch(): NodeJS.Architecture {
    return process.arch as NodeJS.Architecture;
}

export function type(): string {
    const p = platform();
    if (p === "win32") return "Windows";
    if (p === "darwin") return "Darwin";
    return "Linux";
}

export function release(): string {
    try {
        if(platform() === "win32") {
            return execSync("cmd /c ver", { encoding: "utf8" }).trim();
        }
        return execSync("uname -r", { encoding: "utf8" }).trim();
    } catch {
        return process.release?.name ?? "unknown";
    }
}

export function hostname(): string {
    return process.env.COMOUTERNAME || process.env.HOSTNAME || os.hostname()
}

export function uptime(): number {
    return Math.floor(process.uptime())
}

export function pid(): number {
    return process.pid
}

export function ppid(): number {
    return process.ppid
}

export function versions(): NodeJS.ProcessVersions {
    return process.versions
}