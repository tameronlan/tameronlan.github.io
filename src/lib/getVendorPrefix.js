var vendorPrefixesCache = {};

export default function getVendorPrefix(prop) {
    if (vendorPrefixesCache[prop]) {
        return vendorPrefixesCache[prop];
    }

    var vendorPrefixes = ['Moz','Webkit','Khtml','O','ms'];
    var style          = document.createElement('div').style;
    var upper          = prop.charAt(0).toUpperCase() + prop.slice(1);
    var pref, len      = vendorPrefixes.length;

    if(prop in style) {
        return vendorPrefixesCache[prop] = '';
    }

    while (len--) {
        if ((vendorPrefixes[len] + upper) in style) {
            pref = vendorPrefixes[len];
        }
    }

    if (pref) {
        return vendorPrefixesCache[prop] = '-' + pref.toLowerCase() + '-';
    }

    if (prop in style) {
        return vendorPrefixesCache[prop] = '';
    }
}
