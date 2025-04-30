#!/usr/bin/env node

import commands from './commands.js';
import { handlers } from './handlers.js';

const { cmd, args } = commands;
handlers[cmd].run(args);
