/**
 * Import vendor packages
 */
const program = require('commander');

/**
 * Import own packages
 */
const epg = require('./modules/epg');
const stringHelper = require('./utils/strings');

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
        subcommand = true;
        stringHelper.outputHelp();
        epg.grab();
    });

program
    .command('channels')
    .description('grabs the epg channels and stores it into a JSON format')
    .action(() => {
        subcommand = true;
        stringHelper.outputHelp();
        epg.channels();
    });

program
    .command('list')
    .description('lists the available channels and marks the channels configured for epg grabbing')
    .action(() => {
        subcommand = true;
        stringHelper.outputHelp();
        epg.list();
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
