import { escape } from "querystring";

export class JwtHelper {

  private urlBase64Decode(str: string) {
    var output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0: { break; }
      case 2: { output += '=='; break; }
      case 3: { output += '='; break; }
      default: {
        throw 'Illegal base64url string!';
      }
    }
    return decodeURIComponent(window.atob(output));
  }

  // decode token
  decodeToken(token: string) {
    var parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }

    var decoded = this.urlBase64Decode(parts[1]);

    if (!decoded) {
      throw new Error('Cannot decode the token');
    }
    return JSON.parse(decoded);
  }

  getTokenExpirationDate(token: string) {
    var decoded: any;
    decoded = this.decodeToken(token);

    if (typeof decoded.exp === "undefined") {
      return null;
    }

    var date = new Date(0); // The 0 here is the key, which sets the date to the epoch
    date.setUTCSeconds(decoded.exp);

    return date;
  }

  isTokenExpired(token: string, offsetSeconds?: number) {
    var date = this.getTokenExpirationDate(token);
    offsetSeconds = offsetSeconds || 0;
    if (date === null) {
      return false;
    }

    // Token expired?
    return !(date.valueOf() > (new Date().valueOf() + (offsetSeconds * 1000)));
  }

  //Get permissions for simulated user
  getSimulatedUserPermissions(token: string) {
    var decoded: any;
    decoded = this.decodeToken(token);

    if (typeof decoded.Permission === "undefined") {
      return null;
    }

    return decoded.Permission;
  }

  getFullName(token: string): string {
    var decoded: any;
    let fullName : string = '';

    decoded = this.decodeToken(token);
    
    if (decoded && decoded.FullName) {
      fullName = decoded.FullName;
    }

    return fullName;
  }

  //Check if logged in user is simulated user
  isSimulatedUser(token: string) {
    var decoded: any;
    decoded = this.decodeToken(token);

    var userId = decoded.userId;
    var clientId = decoded.aud;
    var luId = decoded.luid;
    var laId = decoded.laud;

    if (typeof userId === "undefined" || typeof clientId === "undefined"
      || typeof luId === "undefined" || typeof laId === "undefined") {
      return false;
    }

    if (userId != luId && clientId != laId) //User has been simulated
    {
      return true;
    }
    return false;
  }
}