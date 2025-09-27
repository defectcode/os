import * as path from "path"
import { platform } from "./system"
import { UserInfo } from "../types/user"

export function env(): NodeJS.ProcessEnv {
    return process.env;
}


export function homeDir(): string {
    return process.env.HOME || process.env.TEMP || process.env.TMP || path.join(homeDir(), ".tmp")
}

export function tmpdir(): string {
  return process.env.TMPDIR || process.env.TEMP || process.env.TMP || path.join(homeDir(), ".tmp");
}

export async function userInfo(): Promise<UserInfo> {
    const username = process.env.USER || process.env.LOGNAME || process.env.USERNAME || "unknown"
    const home = homeDir()
    let uid: number | undefined
    let gid: number | undefined
    let shell: string | undefined

    if ( platform() !== "win32" ) {
        uid = process.getuid?.()
        gid = process.getgid?.()
        shell = process.env.SHELL
    }
    return { username, uid, gid, shell, homedir: home}
}