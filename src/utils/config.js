const config = {
    // server: 'https://api.play.elonmars.io',
    server: process.env.REACT_APP_API_URL,
    // websiteURL: "https://play.elonmars.io",
    websiteURL: process.env.REACT_APP_WEBSITE_URL,
    port: process.env.REACT_APP_API_PORT,
    baseURL: '/api/v1',
    appID: 'elonmars-game',
    agentUID: 'elonmars',
}

console.log('config: ', config)

export default config;
