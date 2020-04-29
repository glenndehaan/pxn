/**
 * Import vendor packages
 */
const program = require('commander');

/**
 * Import own packages
 */
const epg = require('./modules/epg');

/**
 * Define global variables
 */
let subcommand = false;

/**
 * Set application name
 */
program.name('pxn');

/**
 * Setup application commands
 */
program
    .command('run')
    .description('grabs the epg data and stores it into an XMLTV format')
    .action(() => {
        /**
         * Log app info
         */
        console.log('---------------------------------------------------------------');
        console.log('PXN (Plex XMLTV Netherlands)');
        console.log('Author: Glenn de Haan');
        console.log('Documentation/Help: https://github.com/glenndehaan/pxn');
        console.log('---------------------------------------------------------------');

        subcommand = true;
        epg.grab();
    });

program
    .command('channels')
    .description('grabs the epg channels and stores it into a JSON format')
    .action(() => {
        /**
         * Log app info
         */
        console.log('---------------------------------------------------------------');
        console.log('PXN (Plex XMLTV Netherlands)');
        console.log('Author: Glenn de Haan');
        console.log('Documentation/Help: https://github.com/glenndehaan/pxn');
        console.log('---------------------------------------------------------------');

        subcommand = true;
        epg.channels();
    });

/**
 * Let commander handle process arguments
 */
program.parse(process.argv);

/**
 * Run help when no command is given
 */
if (!subcommand) {
    program.outputHelp();
}
