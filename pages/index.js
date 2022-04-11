import Discord from "discord.js";

export default function Home() {
  return <div>I'm Alive!</div>;
}

export const getStaticProps = () => {
  // ================== Discord ==================
  console.log("starting");
  const client = new Discord.Client({
    intents: [
      Discord.Intents.FLAGS.GUILDS,
      Discord.Intents.FLAGS.GUILD_MESSAGES,
      Discord.Intents.FLAGS.GUILD_MEMBERS,
      Discord.Intents.FLAGS.DIRECT_MESSAGES,
    ],
  });

  client.on("ready", () => {
    console.log(`Logged in as ${client.user.tag}!`);

    let activities = [`like a vill'n`, `'n chillin`, `with the gang`],
      i = 0;
    setInterval(() => {
      if (i >= Number.MAX_SAFE_INTEGER - 1) {
        i = 0;
      }
      client.user.setActivity(`${activities[i++ % activities.length]}`, {
        type: "STREAMING",
        url: "https://www.youtube.com/watch?v=DWcJFNfaw9c",
      });
    }, 5000);
  });
  client.on("error", (error) => {
    console.log("error", error);
  });
  client.on("message", (message) => {
    let text, channel;

    if (client.user.id === message.author.id) {
      if (message.content.indexOf("Invalid command, please use one of:") > -1) {
        setTimeout(() => message.delete(), 10000);
      }
      return;
    }

    if (message.content.indexOf("!gw") === 0) {
      const [channelName, ...rest] = message.content
        .split("!gw")[1]
        .split("\n");
      channel = client.channels.cache
        .filter((item) => item.guild.id === message.guild.id)
        .find((item) => item.name === channelName.trim());
      text = rest.join("");
    }
    ["top", "mid", "bot", "str"].forEach((item) => {
      if (message.content.indexOf(`!gw-${item}`) === 0) {
        const target = {
          top: "top-fortress",
          mid: "middle-fortress",
          bot: "bottom-fortress",
          str: "stronghold",
        }[item];
        channel = client.channels.cache
          .filter((item) => item.guild.id === message.guild.id)
          .find((item) => item.name === target);
        text = message.content.split(`!gw-${item}`)[1];
      }
    });

    if (!!channel) {
      channel.send(`From <@${message.author.id}>:\n${text}`);
    }

    if (
      // Delete any messages to be posted
      message.content.indexOf("!gw") === 0 ||
      // Delete any messages that are not from the bot
      ([
        "top-fortress",
        "middle-fortress",
        "bottom-fortress",
        "stronghold",
        "gw-info-submission",
      ].some((channelName) => channelName === message.channel.name) &&
        message.author.id !== client.user.id)
    ) {
      message.delete();

      if (!text) {
        message.reply({
          content: `Invalid command, please use one of:
    !gw-top
    !gw-mid
    !gw-bot
    !gw-str
    `,
          flags: 64,
        });
      }
    }
  });

  client.login(process.env.TOKEN);

  return {
    props: {},
  };
};
