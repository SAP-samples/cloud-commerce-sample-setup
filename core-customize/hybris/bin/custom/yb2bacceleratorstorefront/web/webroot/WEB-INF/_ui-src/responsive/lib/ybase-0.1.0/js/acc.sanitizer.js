DOMPurify.addHook('uponSanitizeAttribute', function(node, event) {
	if(node.nodeName.toLowerCase() !== 'em' || event.attrName.toLowerCase() !== 'class')
	{
		node.removeAttribute(event.attrName);
	}
});

ACC.sanitizer = {
	config: {
				ALLOWED_TAGS: ['pre', 'address', 'em', 'hr', "p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li",
                               "blockquote", 'b', 'i', 's', 'o', 'sup', 'sub', 'ins', 'del', 'strong', 'strike', 'tt', 'code', 'big', 'small', 'br', 'span']
	},
		  
	configSelect: {
				ALLOWED_TAGS: ['pre', 'address', 'hr', "p", "div", "h1", "h2", "h3", "h4", "h5", "h6", "ul", "ol", "li",
                               "blockquote", 'b', 'i', 's', 'o', 'sup', 'sub', 'ins', 'del', 'strong', 'strike', 'tt', 'code', 'big', 'small', 'br', 'span']
	},

	sanitize: function(dirty) {
		return DOMPurify.sanitize(dirty, ACC.sanitizer.config);
	},

	sanitizeSelect: function(dirty) {
		return DOMPurify.sanitize(dirty, ACC.sanitizer.configSelect);
	}
};