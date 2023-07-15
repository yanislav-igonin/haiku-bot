import { Telegraf, Context } from 'telegraf';

import * as Config from '../../common/config';
import { LoggerModule } from '../logger.module';
import { StartController, TextController } from './controllers';
import { metrics } from '../../common/utils';

export class BotModule {
  private config: typeof Config;
  private bot: Telegraf<Context>;

  constructor(config: typeof Config) {
    this.config = config;
    this.bot = new Telegraf(config.telegramConfig.token);

    this.bot.catch((err: Error) => {
      metrics.error();
      LoggerModule.error(`ERROR: ${err}\n`);
    });

    // TODO: move to middlewares
    this.bot.use(async (_, next) => {
      metrics.request();
      await next();
    });

    this.bot.start(StartController);
    this.bot.on('text', TextController);
  }

  get telegraf() {
    return this.bot;
  }

  async launch() {
    await this.bot.launch();
    LoggerModule.info('bot - online');
  }
}
