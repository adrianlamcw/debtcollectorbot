import { Client, Message } from "discord.js";
import { Connection } from "mysql";
declare const _default: {
    name: string;
    description: string;
    args: boolean;
    execute(message: Message, args: Array<string>, client: Client, database: Connection): void;
};
export = _default;
//# sourceMappingURL=newtop.d.ts.map