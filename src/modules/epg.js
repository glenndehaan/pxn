/**
 * Import vendor modules
 */
const fs = require('fs');
const fetch = require('node-fetch');

/**
 * Import own modules
 */
const config = require('../config');
const stringUtils = require('../utils/strings');
const dateUtils = require('../utils/date');
const dataUtils = require('../utils/data');
const xml = require('../modules/xml');

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Fetch the EPG index from a provider
 *
 * @param date
 * @param channel
 * @return {Promise<unknown>}
 */
const fetchEpgIndex = (date, channel) => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve) => {
        // Define new data pool for all index lists
        let data = [];

        // Loop over a predefined page list
        for(let page = 1; page < 5; page++) {
            // Get an index page
            const index = await dataUtils.epgIndex(date, page);
            // Get the channel from the index page
            const channelIndex = index.entries.filter((index) => {
                return index.o === channel.epgId;
            });
            // Store the index items into the pool
            data = data.concat(channelIndex[0].l);
        }

        // Return the complete index list
        resolve(data);
    });
};

/**
 * Fetch the EPG channels from a provider
 *
 * @return {Promise<unknown>}
 */
const fetchChannels = () => {
    return new Promise((resolve, reject) => {
        fetch(`${config.epg.host}/${config.epg.country}/web/channels?sort=channelNumber`, {
            method: 'get',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:75.0) Gecko/20100101 Firefox/75.0'
            }
        })
            .then(res => res.json())
            .then(json => resolve(json.channels))
            .catch(e => reject(e));
    });
};

/**
 * Export the EPG Module
 */
module.exports = {
    /**
     * Grabs all EPG data and stores it into an XMLTV format
     *
     * @return {Promise<void>}
     */
    grab: async () => {
        const epgStorage = {};

        // Loop over all user marked channel numbers
        for(let item = 0; item < config.channels.length; item++) {
            // Create channel epg storage
            let data = [];

            // Get the channel number
            const channelNumber = config.channels[item];
            // Get the channel data from the pre-grabbed file
            const channel = stringUtils.getChannelByNumber(channelNumber);
            // Output the currently running channel
            stringUtils.outputChannel(channel);

            // Get the dates to loop over
            const days = dateUtils.getNextDays(config.epg.days);

            // Loop over all dates to get from the epg index
            for(let i = 0; i < days.length; i++) {
                // Get date
                const date = days[i];

                // Fetch the EPG index list
                const epgData = await fetchEpgIndex(date, channel);

                // Store data in channel epg storage
                data = data.concat(epgData);
            }

            // Store data in epg storage
            epgStorage[channel.number] = data;

            console.log(`Found ${data.length} show(s)!`);
        }

        /**
         * Save data to XMLTV format
         */
        stringUtils.outputSave();
        await xml.saveEpgData(epgStorage);
    },

    /**
     * Grabs all channels and stores it into a JSON format
     */
    channels: async () => {
        console.log('Getting EPG Data...');
        const epgData = await fetchChannels().catch((e) => {
            console.log(e);
            process.exit(1);
        });

        console.log('Reformatting EPG Channels...');
        const channels = [];

        for(let item = 0; item < epgData.length; item++) {
            const channel = epgData[item];
            const logo = channel.stationSchedules[0].station.images.filter((image) => {
                return image.assetType === "station-logo-large";
            });

            channels.push({
                number: channel.channelNumber,
                id: channel.id,
                name: channel.title,
                epgId: channel.stationSchedules[0].station.id,
                logo: logo.length > 0 ? logo[0].url : ''
            });
        }

        console.log('Storing EPG Channels...');
        fs.writeFileSync(`${dev ? __dirname + '/../config' : process.cwd()}/.pxn-channels`, JSON.stringify(channels));

        console.log(`Saved ${channels.length} channel(s)!`);
    },

    /**
     * Lists available channels and marks the channels configured for epg grabbing
     */
    list: () => {
        if(fs.existsSync(`${dev ? __dirname + '/../config' : process.cwd()}/.pxn-channels`)) {
            const channels = JSON.parse(fs.readFileSync(`${dev ? __dirname + '/../config' : process.cwd()}/.pxn-channels`, 'utf-8'));

            console.log(`Found ${channels.length} channel(s). ${config.channels.length} channel(s) marked for grabbing:`);
            console.log('');
            for(let item = 0; item < channels.length; item++) {
                const channel = channels[item];
                console.log(`${channel.number}. ${channel.name}${config.channels.includes(channel.number) ? ' <-- Configured for grabbing' : ''}`);
            }
        } else {
            console.log('Error missing channel list! Please grab channel list first.');
        }
    }
};
