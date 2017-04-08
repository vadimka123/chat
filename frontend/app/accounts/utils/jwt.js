export class JwtHelper {
    urlBase64Decode(str) {
        var output = str.replace(/-/g, '+').replace(/_/g, '/');
        switch (output.length % 4) {
            case 0:
                break;
            case 2:
                output += '==';
                break;
            case 3:
                output += '=';
                break;
            default:
                throw 'Illegal base64url string!';
        }
        return decodeURIComponent(escape(window.atob(output)));
    }

    decodeToken(token) {
        var parts = token.split('.');

        if (parts.length !== 3)
            throw new Error('JWT must have 3 parts');

        var decoded = this.urlBase64Decode(parts[1]);

        if (!decoded)
            throw new Error('Cannot decode the token');

        return JSON.parse(decoded);
    }

    getTokenExpirationDate(token) {
        var decoded = this.decodeToken(token);

        if (typeof decoded.exp === "undefined")
            return null;

        var d = new Date(0); // The 0 here is the key, which sets the date to the epoch
        d.setUTCSeconds(decoded.exp);

        return d;
    }

    isTokenExpired(token, offsetSeconds) {
        var d = this.getTokenExpirationDate(token);
        offsetSeconds = offsetSeconds || 0;

        if (d === null)
            return false;

        // Token expired?
        return !(d.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
    }
}
