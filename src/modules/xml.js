/**
 * Import vendor modules
 */
const fs = require('fs');
const { create } = require('xmlbuilder2');

/**
 * Import own modules
 */
const config = require('../config');
const stringUtils = require('../utils/strings');
const dateUtils = require('../utils/date');

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Export the XML Module
 */
module.exports = {
    /**
     * Converts an epg storage to a XMLTV file
     *
     * @param epgStorage
     * @return {Promise<unknown>}
     */
    saveEpgData: (epgStorage) => {
        return new Promise((resolve) => {
            // Create root XML object
            const xmlObject = create({
                version: '1.0',
                encoding: 'UTF-8'
            }).ele('tv', {
                'generator-info-name': 'PXN',
                'generator-info-url': 'https://github.com/glenndehaan/pxn'
            });

            // Create XML channel data
            // Loop over all user marked channel numbers
            for(let item = 0; item < config.channels.length; item++) {
                // Get the channel number
                const channelNumber = config.channels[item];
                // Get the channel data from the pre-grabbed file
                const channel = stringUtils.getChannelByNumber(channelNumber);

                // Create channel element
                const xmlChannel = xmlObject.ele('channel', {
                    id: channelNumber
                });

                // Set channel elements
                const displayName = xmlChannel.ele('display-name').txt(channel.name);
                displayName.att('lang', 'nl');
                xmlChannel.ele('icon').att('src', channel.logo);
                xmlChannel.ele('url').txt('http://www.horizon.tv');
            }

            // Create XML programme data
            // Get channel numbers
            const channelNumbers = Object.keys(epgStorage);
            // Loop over all epg data
            for(let item = 0; item < channelNumbers.length; item++) {
                // Get channel number and data
                const channelNumber = channelNumbers[item];
                const channelData = epgStorage[channelNumber];

                // Loop over channel epg data
                for(let i = 0; i < channelData.length; i++) {
                    // Get epg data
                    const data = channelData[i];

                    // Create programme element
                    const xmlProgramme = xmlObject.ele('programme', {
                        start: dateUtils.getXMLTVDateTime(data.s),
                        stop: dateUtils.getXMLTVDateTime(data.e),
                        channel: channelNumber
                    });

                    // Set programme elements
                    const title = xmlProgramme.ele('title').txt(data.t);
                    title.att('lang', 'nl');
                }
            }

            // End XML file
            const xml = xmlObject.end({ prettyPrint: true });
            // Save XML to disk
            fs.writeFileSync(dev ? `${__dirname}/../pxn-guide.xml` : `${process.cwd()}/pxn-guide.xml`, xml);

            resolve();
        });
    }
};
