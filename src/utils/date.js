/**
 * Exports the date utils
 */
module.exports = {
    /**
     * Return the current date in the yyyymmdd format
     *
     * @return {string}
     */
    getYYYYMMDD: () => {
        const date = new Date();

        let day = date.getDate();
        if(day < 10) {
            day = `0${day}`;
        }

        let month = date.getMonth() + 1;
        if(month < 10) {
            month = `0${month}`;
        }

        return `${date.getFullYear()}${month}${day}`;
    }
}
