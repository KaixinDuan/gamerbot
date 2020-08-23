import * as Discord from 'discord.js';
// @ts-ignore
import * as YouTube from 'simple-youtube-api';
import { Store } from '../store';
import { GuildGames } from './games';
import { GuildQueue } from './youtube';

export * from './economy';
export * from './games';
export * from './youtube';

export interface GuildConfig {
  prefix: string;
  allowSpam: boolean;
  cowPrefix: string;
}

export interface CmdArgs {
  msg: Discord.Message | Discord.PartialMessage;
  args: string[];
  flags: Record<string, number>;
  cmd: string;
  youtube: YouTube;
  client: Discord.Client;
  configStore: Store<GuildConfig>;
  queueStore: Store<GuildQueue>;
  gameStore: Store<GuildGames>;
}