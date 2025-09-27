import { execSync } from 'child_process';
import * as fs from "fs"
import * as os from "node:os"
import { platform } from "./system"
import type { CpuInfo } from "../types/cpu"

export function cpu(): CpuInfo {
    const p = platform()
    let cores = 1;

    try {
        if ( p === "linux" ) {
            cores = parseInt(execSync("nproc", { encoding: "utf8" }).trim(), 10)
        } else if ( p === "darwin" ) {
            cores = parseInt(execSync("sysctl -n hw.ncpu", { encoding: "utf8" }).trim(), 10)
        } else if ( p === "win32" ) {
            cores = parseInt(process.env.NUMBER_OF_PROCESSORS || "1", 10)
        }
    } catch {
        cores = Math.max(1, os.cpus?.().length || 1)
    }

    let model = "unknown"
    try {
        if ( p === "linux" ) {
            const txt = fs.readFileSync("/proc/cpuinfo", "utf-8")
            model = /model name\\s*:\\s*(.+)/.exec(txt)?.[1].trim() || model
        } else if ( p === "darwin" ){
            model = execSync("sysctl -n machdep.cpu.brand_string", { encoding: "utf8" }).trim()
        } else if ( p === "win32" ) {
            model = execSync("wmic cpu Name /value", { encoding: "utf8" }).split("=")[1].trim() || model
        }
    } catch {}

    return { model, cores }
}