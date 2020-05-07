(() =>
{
    // Config

    // A selector to match the promoted icon (top arrow) in order to catch the advertisements and block them
    // I couldn't think of a better way to doing this, for the DOM is rendered with React, and given the selectors
    // are generated, finding the right selectors is a bit tricky
    const PROMOTED_ICON_SELECTOR = '[d="M20.75 2H3.25A2.25 2.25 0 0 0 1 4.25v15.5A2.25 2.25 0 0 0 3.25 22h17.5A2.25 2.25 0 0 0 23 19.75V4.25A2.25 2.25 0 0 0 20.75 2zM17.5 13.504a.875.875 0 1 1-1.75-.001V9.967l-7.547 7.546a.875.875 0 0 1-1.238-1.238l7.547-7.547h-3.54a.876.876 0 0 1 .001-1.751h5.65c.483 0 .875.39.875.874v5.65z"]'

    // once we catch the promoted icons, let's try to match their parent containers in order to remove those.
    // So far I've caught 2 types of ads, the tweet ads and user-follow cards. I'll update this list when I encounter
    // more ad placements as I continue to use the mobile version of Twitter on a regular basis. 
    const ADS_CONTAINERS = ['article[role="article"]', '[data-testid="UserCell"]']

    const wait_for_node = selector =>
    {
        return new Promise((resolve, reject) =>
        {
            return new MutationObserver(function()
            {
                let el

                if ( el = document.querySelector(selector) ) {
                    resolve(el)
                    this.disconnect()
                }
            }).observe(document.body, {
                subtree: true,
                childList: true,
            })
        })
    }

    const handle_ad_icon = item => ADS_CONTAINERS.map( selector => item.closest(selector) ).filter( Boolean ).map( el => el.remove() )

    ;(async function run()
    {
        // check for existing DOM elements before using mutation observers
        document.querySelector( PROMOTED_ICON_SELECTOR )
          && handle_ad_icon( document.querySelector( PROMOTED_ICON_SELECTOR ) )

        try {
            handle_ad_icon( await wait_for_node( PROMOTED_ICON_SELECTOR ) )
        } catch ( e ) { console.error( e ) }

        // for multiple elements, once the promise is resolved/rejected, send another promise
        run()
    })()
})()