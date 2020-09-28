const puppeteer = require('puppeteer')

const SUBREDDIT_URL = reddit => `https://old.reddit.com${reddit}`;

const self = {
    browser: null,
    page: null,

    divExtractor: async (divC, el) => {
        const element = await divC.$(el)
        return element
    },

    divsExtractor: async (divC, el) => {
        const elements = await divC.$$(el)
        return elements
    },
    
    initialize: async (reddit) => {
        self.browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox']
        })
        self.page = await self.browser.newPage()

        self.page.goto(SUBREDDIT_URL(reddit), {waitUntil: 'networkidle0'})
    },

    getResults: async (nr) => {
        let count = 0;
        let results = []

        do{
            let dataFetch = await self.fetchResults()
            results = [...results, ...dataFetch]
            count = count + dataFetch.length

            let btn = await self.divExtractor(self.page, "span.next-button a")

            if(btn){
                await btn.click()
            } else {
                break;
            }
            
        } while(count<nr);

        await self.page.close()
        await self.browser.close()
        return results
    },

    fetchResults: async () => {
        await self.page.waitForNavigation({
            waitUntil: "networkidle0"
        })
        self.page.elem = await self.divExtractor(self.page, "#siteTable")
        let elements = [];
        let data = []

        elements = (await self.divsExtractor(self.page.elem, `div[data-promoted="false"]`))
        let letters = /[\\.\\(\\)\\-\\_\\:\\!]/
        let lettersCheck = /[\\.\\(\\)\\-\\_\\:\\!]+/
        for(let i = 0; i<elements.length; i++){
            let temp = await elements[i].$eval(("a.title"), el => el.innerText.trim()) 
            if(temp.toLowerCase().includes('[homemade]')){
                temp = temp.substr(11)
                if(!temp.toLowerCase().includes('beef') && temp.length <= 40){
                    while(temp.match(lettersCheck)){
                        temp = temp.replace(letters, " ")
                    }
                    temp = temp.trim()
                    data.push({
                        title: temp  
                    })
                }
            } else if(temp.toLowerCase().includes('[i ate]')){
                temp = temp.substr(8)
                if(!temp.toLowerCase().includes('beef') && temp.length <= 40){
                    while(temp.match(lettersCheck)){
                        temp = temp.replace(letters, " ")
                    }
                    temp = temp.trim()
                    data.push({
                        title: temp  
                    })
                }
            }
        }

        return data
    }
}

module.exports = self