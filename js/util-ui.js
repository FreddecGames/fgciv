(function() {
    
	var ui = {
        
		findAll: function(selector) {
            
			if (typeof selector === 'string') { return document.querySelectorAll(selector) }
            else { return undefined }			
		},
        
		find: function(selector) {
            
			if (typeof selector === 'string') { return document.querySelectorAll(selector)[0] }
            else if (typeof selector === 'object') { return selector }
            else { return undefined }
		},
        
        dataset: function(elem, attr) {
            
            let val = null
            for (let i = elem; i; i = i.parentNode) {
                
                if (i.nodeType != Node.ELEMENT_NODE) { continue }
                val = i.getAttribute("data-" + attr)
                if (val !== null) { break }
            }
            
            return val
        },
        
        show: function(selector, condition) {
            
            let elt = ui.find(selector)
            
			if (condition === undefined) { condition = (elt.style.display == 'none') }
            
            let displayVal = 'initial'
            if (!condition) { displayVal = 'none' }
            
            elt.style.display = displayVal
        },
        
        hide: function(selector, condition) {
            
			if (condition === undefined) { condition = true }
            
			this.show(selector, !condition)
		},
	}

	if (window) { window.ui = ui }
    else { console.error('ui instantiation failed') }
})()