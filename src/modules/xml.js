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

                    // Check if we have additional show data
                    if(data.additionalShowData) {
                        // Set sub-title if available
                        if (typeof data.additionalShowData.secondaryTitle !== "undefined" && data.additionalShowData.secondaryTitle !== '') {
                            const subTitle = xmlProgramme.ele('sub-title').txt(data.additionalShowData.secondaryTitle);
                            subTitle.att('lang', 'nl');
                        }

                        // Set description if available
                        if (data.additionalShowData.longDescription !== '') {
                            const description = xmlProgramme.ele('desc').txt(data.additionalShowData.longDescription);
                            description.att('lang', 'nl');
                        }

                        // Set actor/director if available
                        if (data.additionalShowData.cast.length > 0 || data.additionalShowData.directors.length > 0) {
                            const credits = xmlProgramme.ele('credits');

                            for (let a = 0; a < data.additionalShowData.cast.length; a++) {
                                if (data.additionalShowData.cast[a]) {
                                    credits.ele('actor').txt(data.additionalShowData.cast[a]);
                                }
                            }

                            for (let b = 0; b < data.additionalShowData.directors.length; b++) {
                                if (data.additionalShowData.directors[b]) {
                                    credits.ele('director').txt(data.additionalShowData.directors[b]);
                                }
                            }
                        }

                        // Set date if available
                        if (data.additionalShowData.year !== '') {
                            xmlProgramme.ele('date').txt(data.additionalShowData.year);
                        }

                        // Set categories if available
                        for (let c = 0; c < data.additionalShowData.categories.length; c++) {
                            if (data.additionalShowData.categories[c].title) {
                                const category = xmlProgramme.ele('category').txt(data.additionalShowData.categories[c].title);
                                category.att('lang', 'nl');
                            }
                        }

                        // Set icon if available
                        const icon = stringUtils.getIconFromAdditionalData(data.additionalShowData.images);
                        if (icon) {
                            xmlProgramme.ele('icon').att('src', icon);
                        }

                        // Set episode if available
                        if (stringUtils.checkXMLTVNS(data.additionalShowData.seriesNumber, data.additionalShowData.seriesEpisodeNumber)) {
                            const category = xmlProgramme.ele('episode-num').txt(stringUtils.getXMLTVNS(data.additionalShowData.seriesNumber, data.additionalShowData.seriesEpisodeNumber));
                            category.att('system', 'xmltv_ns');
                        }

                        // Set rating if available
                        if (typeof data.additionalShowData.parentalRating !== "undefined" && data.additionalShowData.parentalRating !== '') {
                            xmlProgramme.ele('rating').ele('value').txt(data.additionalShowData.parentalRating);
                        }
                    }
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
