import { Message } from 'discord.js';
import { Command } from '.';
import { CmdArgs } from '../types';
import { hasFlags, spliceFlag } from '../util';

export class CommandSpam implements Command {
  cmd = 'spam';
  docs = {
    usage: 'spam [-r reptitions=5] [-m messages=4] <...text>',
    description: 'make the words appear on the screen',
  };
  async executor(cmdArgs: CmdArgs): Promise<void | Message> {
    const { msg, args, configStore, flags } = cmdArgs;

    if (!configStore.get(msg.guild?.id as string).allowSpam) {
      return msg.channel.send('spam commands are off');
    }

    const prefix = configStore.get(msg.guild?.id as string).prefix;

    const unrecognized = args.filter(v => v[0] === '-' && !'r|m'.split('|').includes(v.substr(1)));
    if (unrecognized.length > 0)
      return msg.channel.send(`unrecognized flag(s): \`${unrecognized.join('`, `')}\``);

    let repetitions = 5;
    let messages = 4;
    if (hasFlags(flags, ['-r'])) {
      let providedReps = parseInt(spliceFlag(flags, args, '-r', true) as string);
      if (!isNaN(providedReps)) repetitions = providedReps;
      else return msg.channel.send('invalid repetition count');
    }
    if (hasFlags(flags, ['-m'])) {
      let providedMsgs = parseInt(spliceFlag(flags, args, '-m', true) as string);
      if (!isNaN(providedMsgs)) messages = providedMsgs;
      else return msg.channel.send('invalid message count');
    }

    if (!args[0])
      return msg.channel.send(`no text to send\nusage: \`${prefix}${this.docs.usage}\``);

    let output = '';
    let spamText = args.join(' ');

    if (args[1] == 'fill') {
      while (true) {
        if (output.length + spamText.length + 1 > 2000) break;
        output += ' ' + spamText;
      }
    } else {
      if ((spamText.length + 1) * repetitions > 2000)
        return msg.channel.send(
          'too many reps (msg is over 2000 chars), use "fill" to fill the entire message'
        );

      for (let i = 0; i < repetitions; i++) output += ' ' + spamText;
    }

    for (let i = 0; i < messages; i++) msg.channel.send(output);
  }
}