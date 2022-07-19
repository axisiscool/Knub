import {
  AnyThreadChannel,
  ApplicationCommandPermissionsUpdateData,
  Client,
  CloseEvent,
  Collection,
  DMChannel,
  Guild,
  GuildBan,
  GuildEmoji,
  GuildMember,
  GuildScheduledEvent,
  Interaction,
  Invite,
  Message,
  MessageReaction,
  NewsChannel,
  NonThreadGuildBasedChannel,
  PartialGuildMember,
  PartialMessage,
  PartialThreadMember,
  PartialUser,
  Presence,
  Role,
  Snowflake,
  StageInstance,
  Sticker,
  TextBasedChannel,
  TextChannel,
  ThreadChannel,
  ThreadMember,
  Typing,
  User,
  VoiceChannel,
  VoiceState,
} from "discord.js";
import { GuildMessage } from "../types";

/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/**
 * Each property is a function that converts DJS event listener arguments to Knub's event argument object.
 * @see https://github.com/discordjs/discord.js/blob/cafde77d73452d729ba8e2cb1cac3f14235b889b/packages/discord.js/typings/index.d.ts#L4058
 */
export const fromDjsArgs = {
  applicationCommandPermissionsUpdate: (data: ApplicationCommandPermissionsUpdateData) => ({ data }),
  cacheSweep: (message: string) => ({ message }),
  channelCreate: (channel: NonThreadGuildBasedChannel) => ({ channel }),
  channelDelete: (channel: DMChannel | NonThreadGuildBasedChannel) => ({ channel }),
  channelPinsUpdate: (channel: TextBasedChannel, date: Date) => ({ channel, date }),
  channelUpdate: (
    oldChannel: DMChannel | NonThreadGuildBasedChannel,
    newChannel: DMChannel | NonThreadGuildBasedChannel
  ) => ({
    oldChannel,
    newChannel,
  }),
  debug: (message: string) => ({ message }),
  warn: (message: string) => ({ message }),
  emojiCreate: (emoji: GuildEmoji) => ({ emoji }),
  emojiDelete: (emoji: GuildEmoji) => ({ emoji }),
  emojiUpdate: (oldEmoji: GuildEmoji, newEmoji: GuildEmoji) => ({ oldEmoji, newEmoji }),
  error: (error: Error) => ({ error }),
  guildBanAdd: (ban: GuildBan) => ({ ban }),
  guildBanRemove: (ban: GuildBan) => ({ ban }),
  guildCreate: (guild: Guild) => ({ guild }),
  guildDelete: (guild: Guild) => ({ guild }),
  guildUnavailable: (guild: Guild) => ({ guild }),
  guildIntegrationsUpdate: (guild: Guild) => ({ guild }),
  guildMemberAdd: (member: GuildMember) => ({ member }),
  guildMemberAvailable: (member: GuildMember | PartialGuildMember) => ({ member }),
  guildMemberRemove: (member: GuildMember | PartialGuildMember) => ({ member }),
  guildMembersChunk: (
    members: Collection<Snowflake, GuildMember>,
    guild: Guild,
    data: { count: number; index: number; nonce: string | undefined }
  ) => ({ members, guild, data }),
  guildMemberUpdate: (oldMember: GuildMember | PartialGuildMember, newMember: GuildMember) => ({
    oldMember,
    newMember,
  }),
  guildUpdate: (oldGuild: Guild, newGuild: Guild) => ({ oldGuild, newGuild }),
  guildScheduledEventCreate: (guildScheduledEvent: GuildScheduledEvent) => ({ guildScheduledEvent }),
  guildScheduledEventUpdate: (
    oldGuildScheduledEvent: GuildScheduledEvent | null,
    newGuildScheduledEvent: GuildScheduledEvent
  ) => ({ oldGuildScheduledEvent, newGuildScheduledEvent }),
  guildScheduledEventDelete: (guildScheduledEvent: GuildScheduledEvent) => ({ guildScheduledEvent }),
  guildScheduledEventUserAdd: (guildScheduledEvent: GuildScheduledEvent, user: User) => ({ guildScheduledEvent, user }),
  guildScheduledEventUserRemove: (guildScheduledEvent: GuildScheduledEvent, user: User) => ({
    guildScheduledEvent,
    user,
  }),
  interactionCreate: (interaction: Interaction) => ({ interaction }),
  invalidated: () => ({}),
  inviteCreate: (invite: Invite) => ({ invite }),
  inviteDelete: (invite: Invite) => ({ invite }),
  messageCreate: (message: Message) => ({ message }),
  messageDelete: (message: Message | PartialMessage) => ({ message }),
  messageDeleteBulk: (messages: Collection<Snowflake, Message | PartialMessage>) => ({ messages }),
  messageReactionAdd: (reaction: MessageReaction, user: User | PartialUser) => ({ reaction, user }),
  messageReactionRemove: (reaction: MessageReaction, user: User | PartialUser) => ({ reaction, user }),
  messageReactionRemoveAll: (message: Message | PartialMessage) => ({ message }),
  messageReactionRemoveEmoji: (reaction: MessageReaction) => ({ reaction }),
  messageUpdate: (oldMessage: Message | PartialMessage, newMessage: Message | PartialMessage) => ({
    oldMessage,
    newMessage,
  }),
  presenceUpdate: (oldPresence: Presence | null, newPresence: Presence) => ({ oldPresence, newPresence }),
  ready: (client: Client<true>) => ({ client }),
  roleCreate: (role: Role) => ({ role }),
  roleDelete: (role: Role) => ({ role }),
  roleUpdate: (oldRole: Role, newRole: Role) => ({ oldRole, newRole }),
  shardDisconnect: (closeEvent: CloseEvent, shardId: number) => ({ closeEvent, shardId }),
  shardError: (error: Error, shardId: number) => ({ error, shardId }),
  shardReady: (shardId: number, unavailableGuilds: Set<Snowflake> | undefined) => ({ shardId, unavailableGuilds }),
  shardReconnecting: (shardId: number) => ({ shardId }),
  shardResume: (shardId: number, replayedEvents: number) => ({ shardId, replayedEvents }),
  stageInstanceCreate: (stageInstance: StageInstance) => ({ stageInstance }),
  stageInstanceDelete: (stageInstance: StageInstance) => ({ stageInstance }),
  stageInstanceUpdate: (oldStageInstance: StageInstance, newStageInstance: StageInstance) => ({
    oldStageInstance,
    newStageInstance,
  }),
  stickerCreate: (sticker: Sticker) => ({ sticker }),
  stickerDelete: (sticker: Sticker) => ({ sticker }),
  stickerUpdate: (oldSticker: Sticker, newSticker: Sticker) => ({ oldSticker, newSticker }),
  threadCreate: (thread: ThreadChannel) => ({ thread }),
  threadDelete: (thread: ThreadChannel) => ({ thread }),
  threadListSync: (threads: Collection<Snowflake, ThreadChannel>) => ({ threads }),
  threadMembersUpdate: (
    addedMembers: Collection<Snowflake, ThreadMember>,
    removedMembers: Collection<Snowflake, ThreadMember | PartialThreadMember>,
    thread: AnyThreadChannel
  ) => ({ addedMembers, removedMembers, thread }),
  threadMemberUpdate: (oldMember: ThreadMember, newMember: ThreadMember) => ({ oldMember, newMember }),
  threadUpdate: (oldThread: AnyThreadChannel, newThread: AnyThreadChannel) => ({ oldThread, newThread }),
  typingStart: (typing: Typing) => ({ typing }),
  userUpdate: (oldUser: User | PartialUser, newUser: User) => ({ oldUser, newUser }),
  voiceStateUpdate: (oldState: VoiceState, newState: VoiceState) => ({ oldState, newState }),
  webhookUpdate: (channel: TextChannel | NewsChannel | VoiceChannel) => ({ channel }),
};
/* eslint-enable @typescript-eslint/explicit-module-boundary-types */

/*
// Validate the above types against DJS types
type ValidFromDjsArgs = {
  [key in keyof ExtendedClientEvents]: (...args: ExtendedClientEvents[key]) => unknown;
};
type AssertEquals<TActual, TExpected> = TActual extends TExpected ? true : false;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const fromDjsArgsIsValid: AssertEquals<typeof fromDjsArgs, ValidFromDjsArgs> = true;
*/

// Extended event types
export type KnownEvents = {
  [key in keyof typeof fromDjsArgs]: ReturnType<typeof fromDjsArgs[key]>;
};

export interface KnownGuildEvents extends KnownEvents {
  channelUpdate: {
    oldChannel: DMChannel | NonThreadGuildBasedChannel;
    newChannel: DMChannel | NonThreadGuildBasedChannel;
  };
  channelDelete: {
    channel: DMChannel | NonThreadGuildBasedChannel;
  };
  messageCreate: {
    message: GuildMessage;
  };
  typingStart: {
    typing: Typing;
  };
}

export type EventArguments = KnownEvents;
export type GuildEventArguments = KnownGuildEvents;

export const globalEvents = [
  "debug",
  "shardDisconnect",
  "shardError",
  "shardReady",
  "shardReconnecting",
  "shardResume",
  "guildCreate",
  "guildUnavailable",
  "error",
  "ready",
  "invalidated",
  "userUpdate",
  "warn",
] as const;

export type ValidEvent = keyof KnownEvents;
export type GlobalEvent = typeof globalEvents[number];
export type GuildEvent = Exclude<ValidEvent, GlobalEvent>;

export function isGlobalEvent(ev: ValidEvent): ev is GlobalEvent {
  return globalEvents.includes(ev as any);
}

export function isGuildEvent(ev: ValidEvent): ev is GuildEvent {
  return !globalEvents.includes(ev as any);
}
