process.on('uncaughtException', console.error)

import wweb from 'whatsapp-web.js'
const { Client, LocalAuth } = wweb
import { handler } from './handler.js'
import qrcode from 'qrcode-terminal'
import { platform } from 'os'
import {
    plugins,
    loadPluginFiles,
    pluginFolder,
    pluginFilter
} from './lib/plugins.js'

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        args: ['--no-sandbox'],
        executablePath: platform() === 'win32' ? 'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe' : '/usr/bin/google-chrome-stable',
    }
});

client.initialize();

client.on('loading_screen', (percent, message) => {
    console.log('LOADING SCREEN', percent, message);
});

client.on('qr', (qr) => {
    // Generate and scan this code with your phone
    console.log('QR RECEIVED', qr);
    qrcode.generate(qr, { small: true });
});

client.on('authenticated', () => {
    console.log('AUTHENTICATED');
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessful
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});

client.on('message_create', handler.bind(client));


// load plugins
loadPluginFiles(pluginFolder, pluginFilter, { logger: console, recursiveRead: false }).then(_ => console.log(Object.keys(plugins))).catch(console.error)

export { client }