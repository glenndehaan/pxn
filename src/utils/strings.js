/**
 * Import vendor modules
 */
const fs = require('fs');

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Export the string utils
 */
module.exports = {
    /**
     * Log app info
     */
    outputHelp: () => {
        console.log('---------------------------------------------------------------');
        console.log('PXN (Plex XMLTV Netherlands)');
        console.log('Author: Glenn de Haan');
        console.log('Documentation/Help: https://github.com/glenndehaan/pxn');
        console.log('---------------------------------------------------------------');
    },

    /**
     * Log channel info
     *
     * @param channel
     */
    outputChannel: (channel) => {
        console.log('---------------------------------------------------------------');
        console.log(`${channel.number}. ${channel.name}`);
        console.log('---------------------------------------------------------------');
        console.log('');
    },

    /**
     * Log save info
     */
    outputSave: () => {
        console.log('');
        console.log('Saving data to XMLTV file...');
    },

    /**
     * Return the channel data by number
     *
     * @param number
     * @return {*}
     */
    getChannelByNumber: (number) => {
        if(fs.existsSync(`${dev ? __dirname + '/../config' : process.cwd()}/.pxn-channels`)) {
            const channels = JSON.parse(fs.readFileSync(`${dev ? __dirname + '/../config' : process.cwd()}/.pxn-channels`, 'utf-8'));
            return channels.filter(channel => {
                return channel.number === number
            })[0];
        } else {
            console.log('Error missing channel list! Please grab channel list first.');
            process.exit(0);
        }
    },

    /**
     * Gets the box icon from additional show data
     *
     * @param data
     * @return {*}
     */
    getIconFromAdditionalData: (data) => {
        const value = data.filter((obj) => {
            return obj.assetType === "tva-boxcover";
        });

        return typeof value[0] !== "undefined" ? value[0].url ? value[0].url : false : false;
    },

    /**
     * Check if a show has an episode number
     *
     * @param season
     * @param episode
     * @return {boolean}
     */
    checkXMLTVNS: (season, episode) => {
        if(season === "" || episode === "") {
            return false;
        }

        if(isNaN(season) || isNaN(episode)) {
            return false;
        }

        const seasonNumber = parseInt(season);
        const episodeNumber = parseInt(episode);

        if(seasonNumber > 1000 || episodeNumber > 1000) {
            return false;
        }

        return true;
    },

    /**
     * Returns the correct XMLTV_NS episode number
     *
     * @param season
     * @param episode
     * @return {string}
     */
    getXMLTVNS: (season, episode) => {
        const seasonNumber = parseInt(season);
        const episodeNumber = parseInt(episode);

        return `${seasonNumber - 1}.${episodeNumber - 1}.`;
    }
};
