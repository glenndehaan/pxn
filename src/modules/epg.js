/**
 * Import vendor modules
 */
const fs = require('fs');
const fetch = require('node-fetch');

/**
 * Import own modules
 */
const config = require('../config');

/**
 * Check if we are using the dev version
 */
const dev = process.env.NODE_ENV !== 'production';

/**
 * Fetch the EPG data from a provider
 *
 * @return {Promise<unknown>}
 */
const fetchRawEpg = () => {
    return new Promise((resolve, reject) => {
        reject(new Error('Getting EPG Data!'));
    });
};

/**
 * Fetch the EPG channels from a provider
 *
 * @return {Promise<unknown>}
 */
const fetchChannels = () => {
    return new Promise((resolve, reject) => {
        fetch(`${config.epg.host}/${config.epg.country}/channels?sort=channelNumber`, {
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
        const epgData = await fetchRawEpg().catch((e) => {
            console.log(e);
            process.exit(1);
        });

        console.log('epgData', epgData);
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
    }
};
