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
        
<<<<<<< HEAD
        dataset: function(elem, attr) {
            
            let val = null
            for (let i = elem; i; i = i.parentNode) {
                
                if (i.nodeType != Node.ELEMENT_NODE) { continue }
                val = i.getAttribute("data-" + attr)
                if (val !== null) { break }
            }
            
            return val
        },        
	}

	if (window) { window.ui = ui }
    else { console.error('ui instantiation failed') }
=======
		show: function(selector, visible) {

			let elt = ui.find(selector)
			if (!elt) { return undefined }

			if (visible === undefined) { visible = (elt.style.display == "none") }

			let tagName = elt.tagName.toLowerCase()

			let displayVal = "initial"
            if (tagName == "button") displayVal = "inline-block"
            else if (tagName == "div") displayVal = "block"
            
			if (!visible) { displayVal = "none" }
			elt.style.display = displayVal
		},
	}

	if (window) { window.ui = ui }
    else { console.error("ui instantiation failed") }
>>>>>>> d7239b5f2837db1bceae04a7cdd7bca1b1f86e30

})()