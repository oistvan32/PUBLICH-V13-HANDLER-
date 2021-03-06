/**
 * V13 handlers example made by !               Mich#3418 (https://discord.com/users/863954554542751745)
 * 
 * You can use npmjs.com/uuid to geterate UUIDs for buttons and selects.
 * Example for how I used it in the coins bot (/codes command):
  let ButtonsUUID = uuidv4();
  let nextPageButtonID = `${ButtonsUUID}:next_page`
  let PreviousPageButtonID = `${ButtonsUUID}:previous_page`

 * Commands files in ./commands need to end with .js for the bot to load it.
 * Buttons files in ./buttons need to end with .js for the bot to load it.
 * Selects files in ./selects need to end with .js for the bot to load it.
 */

const Discord = require("discord.js");
const client = new Discord.Client({ intents: [] }); //don't forget your intents.
client.commands = new Discord.Collection();
client.buttons = new Discord.Collection();
client.selects = new Discord.Collection();

const tokenfile = require('./tokenfile.json')

const botconfig = require('./botconfig.json')



client.on("ready", async() => {
    console.log(`ASDIBOT elindult!`)

    let státuszok = [
        `${client.guilds.cache.size}.szerver | !!Help`

        
    ]

    setInterval(function() {
        let status = státuszok[Math.floor(Math.random()* státuszok.length)]

        client.user.setActivity(status, {type: "WATCHING"})
    }, 3000)
})

client.on("ready", async() => {
    //Handlers.
    require("./handlers/commands")(client);
    require("./handlers/buttons")(client);
    require("./handlers/selects")(client);
});

client.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.command.name);
    if(!command) return interaction.reply({ ephemeral: true, content:"This slash command is probably not loaded, the bot must be restarted for it to load."});
    try {
    await command.execute(client, interaction);
    } catch (error) {
    interaction.reply({content: "There was an error while executing this command, please try again and If this continues to happen talk to the bot owner.", ephemeral: true,})
    console.log(error)
    }
});

//Custom IDs should be: UUID:button-event-name (Example: 89b86b0f-eaba-4e41-8f2f-b4d728b2efdc:ban), You can't set the same Custom ID for each button.
client.on("interactionCreate", async(interaction) => {
	if(!interaction.isButton()) return;
    let buttonEventID = interaction.customId.split(':')[1];
    if(!buttonEventID) return;
    const buttonEvent = client.buttons.get(buttonEventID);
    if(!buttonEvent) return interaction.reply({ ephemeral: true, content:"This button event is probably not loaded, the bot must be restarted for it to load."});
    try {
    await buttonEvent.execute(client, interaction);
    } catch (error) {
        interaction.reply({content: "There was an error while executing this button event, please try again and If this continues to happen talk to the bot owner.", ephemeral: true,})
        console.log(error)
    }
});

//Custom IDs should be: UUID:select-event-name (Example: 89b86b0f-eaba-4e41-8f2f-b4d728b2efdc:change_help_page), You can't set the same Custom ID for each select menu.
client.on("interactionCreate", async(interaction) => {
	if(!interaction.isSelectMenu()) return;
    let SelectEventID = interaction.customId.split(':')[1];
    if(!SelectEventID) return;
    const SelectEvent = client.selects.get(SelectEventID);
    if(!SelectEvent) return interaction.reply({ ephemeral: true, content:"This select event is not loaded, the bot must be restarted for it to load."});
    try {
    await SelectEvent.execute(client, interaction);
    } catch (error) {
        interaction.reply({content: "There was an error while executing this select event, please try again and If this continues to happen talk to Reevenge#0001.", ephemeral: true,})
        console.log(error)
    }
});

client.login(tokenfile.token);

