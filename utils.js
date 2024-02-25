const crypto  = require('crypto');
const SanitizeHtml = require('sanitize-html');

const ENCRYPTION_KEY = 'c52153b228eb4c32';

class Utils
{
    constructor()
    {
        throw new Error('Cannot instantiate static object');
    }

    /**
     * @param {String} app_name 
     * @param {String} app_id 
     * @param {String} project_id 
     */
    static createToken (app_name, app_id, project_id)
    {
        let encrypted = Utils.encrypt(app_id +'|'+ app_name +'|'+ project_id);
        return encrypted;
    }

    /**
     * @param {String} text 
     */
    static encrypt(text) 
    {
        let result = null;
        try
        {
            let iv = Buffer.from([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
            let cipher = crypto.createCipheriv('aes-128-cbc', Buffer.from(ENCRYPTION_KEY), iv);
            result = cipher.update(text,'utf8','hex')
            result += cipher.final('hex');
        }
        catch(error)
        {
            console.log(error);
        }
        
        return result;
    }
   
    /**
     * @param {String} text 
     */
    static decrypt(text) 
    {
        let result = null;
        try
        {
            let iv = Buffer.from([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
            let decipher = crypto.createDecipheriv('aes-128-cbc', Buffer.from(ENCRYPTION_KEY), iv);
            let decrypted = decipher.update(text,'hex','utf8')
            decrypted += decipher.final('utf8');
            result = decrypted;
        }
        catch(error)
        {
            console.error(error);
        }
        return result;
    }

    /**
     * @param {String} secret
     */
    static extractTag(secret)
    {
        let output = Utils.decrypt(secret);
        if (output != null)
        {
            let entries = output.split('|');
    
            if (entries.length > 1)
                return entries[0];
        }
        return null;
    }

    /**
     * 
     * @param {String} str 
     */
    static isNullOrEmpty (str) 
    {
        if (str === null || str === undefined)
            return true;
        if (str === '')
            return true;

        let text = str.replace(/ /g, '');

        if (text.length === 0)
            return true;    
    }

    /**
     * @param {Object} ipInfo
     * @param {String} ipInfo.city
     * @param {String} ipInfo.region
     * @param {String} ipInfo.country
     */
    static formatCountry(ipInfo)
    {
        let location = null;
        if (ipInfo.country)
        {
            location = ipInfo.country;
        }
        if (ipInfo.region && isNaN(parseInt(ipInfo.region)))
        {
            location = `${ipInfo.region}, ${location}`;
        }
        if (ipInfo.city)
        {
            location = `${ipInfo.city}, ${location}`;
        }
    
        return location;
    }

    static dateKey()
    {
        let today = new Date();
        return `${today.getDate()}-${today.getMonth()}-${today.getFullYear()}`;
    }

    /**
     * @param {String} message
     */
    static sanitize (message)
    {
        let clean = SanitizeHtml(message, {
            allowedTags: [ 'b', 'i', 'em', 'strong', 'a', 'img' ],
            allowedAttributes: {
              'a': [ 'href', 'target' ],
              'img': [ 'src' ]
            },
            allowedSchemes: [ 'http', 'https' ],
            allowedStyles: {}
        });
        clean = clean.trim();      
        return clean;
    }


     /**
     * @param {String} str
     */
      static removeurispecialchars (str)
      {
        // str = str.replace(/[\/?]/g, '');
        //   str = str.replace('/', '');
        //   str = str.replace('?', '');
          // str = str.replace('&', '');
        //   str = str.replace('=', '');
         str = str.replace(/[^0-9.a-zA-Z-]/g, '')

          return str;
      }

    /**
     * @param {Integer} length
     */
    static  makeid(length) {
        let result = '';
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const charactersLength = characters.length;
        let counter = 0;
        while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
        }
        return result;
    }
    /**
     * @param {Integer} length
     */
    static generateTrackingNumber(length) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let trackingNumber = '';
        for (let i = 0; i < length; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          trackingNumber += characters[randomIndex];
        }
        return trackingNumber;
      }

}

module.exports = Utils;