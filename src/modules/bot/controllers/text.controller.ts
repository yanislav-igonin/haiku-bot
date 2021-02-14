import { Context } from 'telegraf';
import { detector } from '../utils';

export const TextController = async (ctx: Context) => {
  const message = ctx.update.message?.text;
  if (message === undefined) return;
  const haiku = detector.getHaiku(message);
  if (haiku === false) return;
  const user = ctx.update.message?.from;
  if (user === undefined) return;
  const suffix = `— ${user.first_name} ${user.last_name}`;
  ctx.reply(`${haiku}\n\n${suffix}`);
};
