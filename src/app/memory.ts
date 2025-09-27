import { execSync } from 'child_process'
import * as fs from "fs"
import * as os from "node:os"
import { platform } from "./system"
import type { MemoryInfo } from "../types/memory"

export function memory(): MemoryInfo {
    const p = platform();

    if ( p === "linux" ) {
        try {
            const txt = fs.readFileSync("/proc/meminfo", "utf8");
            const get = (key: string) => {
                const m = txt.match(new RegExp(`^${key}:\\s+(\\d+)\\s+kB`, "m"))
                return m ? parseInt(m[1], 10) * 1024 : 0
            }
            const total = get("MemTotal")
            const free = get("MemAvailable") || get("MemFree")
            return { total, free } 
        } catch {}
    }

    if( p === "darwin" ) {
       try {
            const total = parseInt(execSync("sysctl -n hw.memsize", { encoding: "utf8" }).trim(), 10)
            const pageSize = parseInt(execSync("sysctl -n hw.pagesize", { encoding: "utf8" }).trim(), 10)
            const vm = execSync("vm_stat", { encoding: "utf8" })
            const freePages = /free:\\s+(\\d+)\\./.exec(vm)?.[1];
            const speculative = /speculative:\\s+(\\d+)\\./.exec(vm)?.[1];
            const free = ((parseInt(freePages || "0", 10) + parseInt(speculative || "0", 10)) * pageSize) >>> 0
            return { total, free }
       } catch {} 
    }

    if ( p === "win32" ) {
        try {
            const out = execSync(
                "powershell -NoProfile -Command \"$os=Get-CimInstance Win32_OperatingSystem; " +
                "[Console]::OutputEncoding=[Text.UTF8Encoding]::UTF8; " +
                "$total=$os.TotalVisibleMemorySize*1KB; $free=$os.FreePhysicalMemory*1KB; " +
                "Write-Output \\\"$total,$free\\\"\"",
                { encoding: "utf8" }
            ).trim();

            const [total, free] = out.split(",").map((x) => parseInt(x, 10))
            return { total, free }
        } catch{}
    }

    return { total: os.totalmem?.() ?? 0, free: os.freemem?.() ?? 0 }
}