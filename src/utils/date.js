/**
 * Exports the date utils
 */
const dateUtil = module.exports = {
    /**
     * Return the current date in the yyyymmdd format
     *
     * @param date
     * @return {string}
     */
    getYYYYMMDD: (date) => {
        let day = date.getDate();
        if(day < 10) {
            day = `0${day}`;
        }

        let month = date.getMonth() + 1;
        if(month < 10) {
            month = `0${month}`;
        }

        return `${date.getFullYear()}${month}${day}`;
    },

    getXMLTVDateTime: (epoch) => {
        const date = new Date(epoch);

        let day = date.getUTCDate();
        if(day < 10) {
            day = `0${day}`;
        }

        let month = date.getUTCMonth() + 1;
        if(month < 10) {
            month = `0${month}`;
        }

        let hour = date.getUTCHours();
        if(hour < 10) {
            hour = `0${hour}`;
        }

        let minute = date.getUTCMinutes();
        if(minute < 10) {
            minute = `0${minute}`;
        }

        let second = date.getUTCSeconds();
        if(second < 10) {
            second = `0${second}`;
        }

        return `${date.getUTCFullYear()}${month}${day}${hour}${minute}${second} +0000`;
    },

    /**
     * Get the next days
     *
     * @param amount
     * @return {[]}
     */
    getNextDays: (amount = 7) => {
        const days = [];

        const date = new Date();
        days.push(dateUtil.getYYYYMMDD(date));

        for(let item = 0; item < amount; item++) {
            const date = new Date();
            date.setDate(date.getDate() + (item + 1));
            days.push(dateUtil.getYYYYMMDD(date));
        }

        return days;
    }
}
