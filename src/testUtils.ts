import { noop } from "./utils";
import events = require("events");
import {
  ChannelManager,
  Client,
  DMChannel,
  Guild,
  GuildChannel,
  GuildChannelManager,
  GuildManager,
  GuildMember,
  GuildMemberManager,
  Message,
  NewsChannel,
  Options,
  Role,
  RoleManager,
  Snowflake,
  TextChannel,
  ThreadChannel,
  User,
  UserManager,
  WebSocketManager,
} from "discord.js";
import { ChannelType } from "discord-api-types/v10";

const EventEmitter = events.EventEmitter;

function persist<T, TProp extends keyof T>(that: T, prop: TProp, initial: T[TProp]) {
  if (!that[prop]) {
    that[prop] = initial;
  }

  return that[prop];
}

function createMockWebSocketManager(): WebSocketManager {
  return new Proxy<WebSocketManager>(new EventEmitter() as unknown as WebSocketManager, {
    get(target, p: string) {
      if (target[p]) {
        return target[p] as unknown;
      }

      return noop;
    },
  });
}

export function createMockClient(): Client {
  return new Proxy<Client>(new EventEmitter() as unknown as Client, {
    get(target, p: string, proxy) {
      if (target[p]) {
        return target[p] as unknown;
      }

      if (p === "ws") {
        return persist(target, p, createMockWebSocketManager());
      }

      if (p === "users") {
        // @ts-expect-error Private constructor
        return persist(target, p, new UserManager(proxy));
      }

      if (p === "guilds") {
        // @ts-expect-error Private constructor
        return persist(target, p, new GuildManager(proxy));
      }

      if (p === "options") {
        return {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          intents: [],
          makeCache: Options.cacheEverything(),
        };
      }

      if (p === "channels") {
        // @ts-expect-error Private constructor
        return persist(target, p, new ChannelManager(proxy, []));
      }

      return noop;
    },
  });
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let mockGuildId = 10000;
export function createMockGuild(client: Client, data = {}): Guild {
  const id = (++mockGuildId).toString();
  client.guilds.cache.set(id, {
    id,
    client,
    name: `Mock Guild #${id}`,
    ...data,
  } as Guild);

  const mockGuild = client.guilds.cache.get(id)!;
  // @ts-expect-error Private constructor
  mockGuild.members = new GuildMemberManager(mockGuild);
  // @ts-expect-error Private constructor
  mockGuild.channels = new GuildChannelManager(mockGuild);
  // @ts-expect-error Private constructor
  mockGuild.roles = new RoleManager(mockGuild);

  // Add everyone role
  mockGuild.roles.cache.set(mockGuild.id, createMockRole(mockGuild, { name: "everyone" }, mockGuild.id));

  return mockGuild;
}

let mockUserId = 20000;
export function createMockUser(client: Client, data = {}): User {
  const id = (++mockUserId).toString();
  const mockUser = client.users.cache.set(
    id,
    // @ts-expect-error Private constructor
    new User(client, {
      id,
      username: `mockuser_${id}`,
      discriminator: "0001",
      ...data,
    })
  );

  return mockUser.get(id)!;
}

export function createMockMember(guild: Guild, user: User, data = {}): GuildMember {
  // @ts-expect-error Private constructor
  guild.members.cache.set(user.id, new GuildMember(guild.client, { user, ...data }, guild));
  return guild.members.cache.get(user.id)!;
}

let mockChannelId = 30000;
export function createMockTextChannel(client: Client, guildId: Snowflake, data = {}): TextChannel {
  const id = (++mockChannelId).toString();
  const guild = client.guilds.cache.get(guildId)!;

  /* eslint-disable @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access */
  guild.channels.cache.set(
    id,
    // @ts-expect-error Private constructor
    new TextChannel(
      client,
      {
        id,
        guild,
        type: ChannelType.GuildText,
        name: `mock-channel-${id}`,
        ...data,
      },
      guild
    )
  );

  const mockChannel = guild.channels.cache.get(id)! as TextChannel;
  client.channels.cache.set(id, mockChannel);
  return mockChannel;
}

let mockMessageId = 40000;
export function createMockMessage(
  client: Client,
  channel: TextChannel | DMChannel | NewsChannel | ThreadChannel,
  author: User,
  data = {}
): Message {
  // @ts-expect-error Private constructor
  const message = new Message(client, {
    id: (++mockMessageId).toString(),
    channel_id: channel.id,
    mentions: [],
    // @ts-ignore
    author,
    ...data,
  });

  return message;
}

let mockRoleId = 50000;
export function createMockRole(guild: Guild, data = {}, overrideId: string | null = null): Role {
  const id = overrideId || (++mockRoleId).toString();
  guild.roles.cache.set(
    id,
    // @ts-expect-error Private constructor
    new Role(
      guild.client,
      {
        id,
        permissions: "0",
        ...data,
      } as any,
      guild
    )
  );
  return guild.roles.cache.get(id)!;
}

let mockThreadId = 60000;
export function createMockThread(channel: NewsChannel | GuildChannel): ThreadChannel {
  const id = (++mockThreadId).toString();
  channel.guild.channels.cache.set(
    id,
    // @ts-expect-error Private constructor
    new ThreadChannel(
      channel.guild,
      {
        id,
        type: ChannelType.GuildPublicThread,
        parent_id: channel.id,
      },
      channel.client
    )
  );

  const mockThread = channel.guild.channels.cache.get(id)!;
  channel.client.channels.cache.set(id, mockThread);
  return mockThread as ThreadChannel;
}
