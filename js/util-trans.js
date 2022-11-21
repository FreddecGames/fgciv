(function() {
    
	var trans = {
        
        currentLocale: 'en',
        defaultLocale: 'en',
        supportedLocales: ['en'],
        
        translations: {},
        
        browserLocales: function() { return navigator.languages.map(locale => locale.split('-')[0]) },
        
        isSupported: function(locale) { return trans.supportedLocales.indexOf(locale) > -1 },
        
        supportedOrDefault: function(locales) { return locales.find(trans.isSupported) || trans.defaultLocale },
        
        setLocale: function(newLocale) {
            
            if (newLocale === trans.locale) return
            trans.locale = newLocale
                
            document.documentElement.lang = newLocale
        },
        
        translate: function(key) {
            
            let ret = trans.translations[trans.locale][key]
            return ret ? ret : key
        },
	}

	if (window) { window.trans = trans }
    else { console.error('trans instantiation failed') }

})()