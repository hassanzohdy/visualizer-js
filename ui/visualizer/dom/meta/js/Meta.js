class _Meta {
    /**
     * Constructor
     */
    constructor() {
        this.titleElement = $('title');
    }

    /**
     * Get page title
     * 
     * @returns string
     */
    title() {
        return this.titleElement.html();
    }

    /**
     * Set meta title
     * @param string title 
     */
    setTitle(title) {
        this.titleElement.html(title);

        // og:title
        this.meta('og:title', title);
    }

    /**
     * Set meta description
     * 
     * @param string description 
     */
    setDescription(description) {
        this.description = description;
        this.meta('description', description);
        this.meta('og:description', description);
    }

    /**
     * Meta image 
     * 
     * @param string imagePath 
     */
    setImage(imagePath) {
        this.meta('og:image', imagePath);
    }

    /**
     * Set meta url 
     * 
     * @param string url 
     * @returns void
     */
    setUrl(url) {
        this.url = url;
        this.meta('og:url', url);
    }

    /**
     * Create or modify the given meta name
     * 
     * @param string metaName 
     * @param string value 
     * @returns void
     */
    meta(metaName, value) {
        if (['keywords', 'description'].includes(metaName)) {
            this.metaByName(metaName, value);
        }

        let meta = $(`meta[property="${metaName}"]`);

        if (Is.empty(meta)) {
            meta = $('<meta />').attr('property', metaName).insertAfter('head meta:last');
        }

        meta.attr('content', value);
    }

    /**
     * Edit meta based on the attribute 'name'
     * 
     * @param string metaName 
     * @param string value 
     */
    metaByName(metaName, value) {
        let meta = $(`meta[name="${metaName}"]`);

        if (Is.empty(meta)) {
            meta = $('<meta />').attr('name', metaName).insertAfter('head meta:last');
        }

        meta.attr('content', value);
    }
}

DomBuilder.Meta = _Meta;