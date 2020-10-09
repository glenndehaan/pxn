/**
 * Import vendor modules
 */
const fetch = require('node-fetch');

/**
 * Import own modules
 */
const config = require('../config');

/**
 * Exports the data utils
 */
module.exports = {
    /**
     * Gets an epg index list
     *
     * @param date
     * @param page
     * @return {Promise<unknown>}
     */
    epgIndex: (date, page) => {
        return new Promise((resolve, reject) => {
            console.log(`EPG Indexing: ${config.epg.host}/${config.epg.country}/web/programschedules/${date}/${page}`);
            fetch(`${config.epg.host}/${config.epg.country}/web/programschedules/${date}/${page}`, {
                method: 'get',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:75.0) Gecko/20100101 Firefox/75.0'
                }
            })
                .then(res => res.json())
                .then(json => resolve(json))
                .catch(e => reject(e));
        });
    },

    /**
     * Gets epg show data
     *
     * @param index
     * @param item
     * @param total
     * @return {Promise<unknown>}
     */
    epgShow: (index, item, total) => {
        return new Promise((resolve, reject) => {
            console.log(`EPG Show (${item + 1}/${total}): ${config.epg.host}/${config.epg.country}/web/listings/${index}`);
            fetch(`${config.epg.host}/${config.epg.country}/web/listings/${index}`, {
                method: 'get',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.13; rv:75.0) Gecko/20100101 Firefox/75.0'
                }
            })
                .then(res => res.json())
                .then(json => resolve(json.program))
                .catch(e => reject(e));
        });
    }
};
