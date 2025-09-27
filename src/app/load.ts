import { execSync } from 'child_process';
import * as fs from "fs"
import { platform } from "./system"
import type { LoadAvg } from "../types/load"

export function loadAvg(): LoadAvg {
    if ( platform() === "win32" ) return [0, 0, 0]

    try {
        const txt = fs.readFileSync("/proc/loadavg", "utf8")
        const [a, b, c] = txt.trim().split(/\\s+/)
        return [parseFloat(a), parseFloat(b), parseFloat(c)]
    } catch {
        try {
            const out = execSync("uptime", { encoding: "utf8" })
            const m = out.match(/load averages?:\\s*([0-9.]+),?\\s*([0-9.]+),?\\s*([0-9.]+)/i)
            if ( m ) return [parseFloat(m[1]), parseFloat(m[2]), parseFloat(m[3])]
        } catch {}
        return [0, 0, 0]
    }
}