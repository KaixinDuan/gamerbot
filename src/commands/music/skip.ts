import { Message } from 'discord.js';

import { Command, CommandDocs } from '..';
import { CmdArgs } from '../../types';
import { codeBlock, Embed } from '../../util';

export class CommandSkip implements Command {
  cmd = 'skip';
  docs: CommandDocs = {
    usage: 'skip',
    description: 'skip current video',
  };
  async executor(cmdArgs: CmdArgs): Promise<void | Message> {
    const { msg, queueStore } = cmdArgs;
    const queue = queueStore.get(msg.guild.id);

    if (!queue.playing) return msg.channel.send(Embed.error('not playing'));

    const voice = msg.member?.voice;
    if (!voice?.channel || voice.channel.id !== queue.voiceConnection?.channel.id)
      return msg.channel.send(Embed.error('you are not in the music channel'));

    try {
      queue.voiceConnection?.dispatcher?.end('skip command');
      return msg.channel.send(Embed.success('skipped'));
    } catch (err) {
      return msg.channel.send(Embed.error(codeBlock(err)));
    }
  }
}
