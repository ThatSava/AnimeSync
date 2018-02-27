# AnimeSync
A nodejs web app that allows "people" to watch anime together, in sync.
## Installation
1. Install nodejs, npm and bower.
2. Clone this repository `git clone git clone https://github.com/andrejsavikin/AnimeSync.git`
3. Install dependencies `npm install && bower install`
4. Change the secret key in main.js, if you want
5. Execute `node main.js`
6. Setup a reverse proxy or something fancy like that if you want

## FAQ
### Why do you use bower, when you have npm?
Bower was required in a previous development stage, and I just didn't have the time to refactor parts of code to work with npm dependencies.

### It no work
Well, fix it then, or provide a proper issue with appropriate info in issues tab

### Why does everything look like it's unfinished
Dunno, the fact that it's not finished could be a good clue, but then again it could be anything

### Where can I contact you?
[![Discord](https://discordapp.com/api/guilds/69730004467986432/widget.png?style=banner4)](https://discord.gg/jBRvWct)

### Will there ever be youtube support?
Soon, that's the next planned feature

### Will there be a better interface for subtitles?
Yes

### Will you ever support more subtitle formats?
No, this is a web browser limitation. Even if I wanted I couldn't.

### What port does this run on, be default?
3001, I recommend you set up a reverse proxy such as Nginx instead of changing the port