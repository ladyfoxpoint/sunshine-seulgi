
/*     Theme information:
- Default:
Text: ece7fa
Warn: ffae57
Danger: 
Error: 

- Client:
Bold: 

- Shoukaku:
Bold:

- Spotify:
Bold: 

*/

import chalk from 'chalk';

export default class Logger{
    constructor(name, color, trailing=null){
        this.color = color
        this.name = chalk.hex(this.color)(`${name}.${(trailing!=null)?`${chalk.hex("ece7fa")(trailing)}`:``}`)
    }

    bold(text){
        return `${chalk.hex(this.color)(text)}`
    }

    log(text){
        console.log(` ₊ ⊹ inf - (${this.name}): ${chalk.hex("ece7fa")(text)}`)
    }

    warn(text){
        console.log(` ₊ ⊹ ${chalk.hex("ffae57")("wrn")} - (${this.name}): ${chalk.hex("ece7fa")(text)}`)
    }

    error(text){
        console.log(` ₊ ⊹ ${chalk.hex("ffae57")("err")} - (${this.name}): ${chalk.hex("ece7fa")(text)}`)
    }
}