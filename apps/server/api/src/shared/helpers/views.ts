import Handlebars from 'handlebars';

interface ContentStore {
    [key: string]: string[];
}

// Store content sections
const contentStore: ContentStore = {};

export const helpers = {
    contentFor: function(name: string, options: any) {
        // Initialize array for this section if it doesn't exist
        contentStore[name] = contentStore[name] || [];
        
        // Add the content to the store
        contentStore[name].push(options.fn(this));
        return '';
    },

    content: function(name: string) {
        // Return the content for this section or empty string if none exists
        const content = contentStore[name] || [];
        return new Handlebars.SafeString(content.join('\n'));
    }
}; 