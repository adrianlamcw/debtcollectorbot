import * as Discord from "discord.js";
import * as Database from "mysql";
export declare function getDatabase(): Database.Connection;
export declare function getUsername(client: Discord.Client, id: string, placeholder?: string): Promise<string>;
//# sourceMappingURL=newutils.d.ts.map