#!/usr/bin/env node

import { cmd } from './argv.js';
import handlers from './handlers.js';

handlers[cmd]();
