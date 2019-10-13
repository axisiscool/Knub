import { defaultParameterTypes, TypeConversionError, TTypeConverterFn } from "knub-command-manager";
import { disableCodeBlocks } from "./helpers";
import { getChannelId, getRoleId, getUserId } from "./utils";
import { Channel, GuildChannel, Member, Role, TextChannel, User, VoiceChannel } from "eris";
import { ICommandContext } from "./commandUtils";

export interface IParameterTypeMap {
  [key: string]: TTypeConverterFn<ICommandContext>;
}

export const baseParameterTypes: IParameterTypeMap = {
  ...defaultParameterTypes,

  boolean: defaultParameterTypes.bool,

  number(value) {
    const result = parseFloat(value);
    if (Number.isNaN(result)) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid number`);
    }

    return result;
  },

  user(value, { bot }): User {
    const userId = getUserId(value);
    if (!userId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid user`);
    }

    const user = bot.users.get(userId);
    if (!user) {
      throw new TypeConversionError(`Could not find user for user id \`${userId}\``);
    }

    return user;
  },

  member(value, { message, bot }): Member {
    if (!(message.channel instanceof GuildChannel)) {
      throw new TypeConversionError(`Type 'Member' can only be used in guilds`);
    }

    const userId = getUserId(value);
    if (!userId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid user id`);
    }

    const user = bot.users.get(userId);
    if (!user) {
      throw new TypeConversionError(`Could not find user for user id \`${userId}\``);
    }

    const member = message.channel.guild.members.get(user.id);
    if (!member) {
      throw new TypeConversionError(`Could not find guild member for user id \`${userId}\``);
    }

    return member;
  },

  channel(value, { message, bot }): Channel {
    const channelId = getChannelId(value);
    if (!channelId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid channel`);
    }

    if (!(message.channel instanceof GuildChannel)) {
      throw new TypeConversionError(`Type 'Channel' can only be used in guilds`);
    }

    const guild = message.channel.guild;
    const channel = guild.channels.get(channelId);
    if (!channel) {
      throw new TypeConversionError(`Could not find channel for channel id \`${channelId}\``);
    }

    return channel;
  },

  textChannel(value, { message, bot }): TextChannel {
    const channelId = getChannelId(value);
    if (!channelId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid channel`);
    }

    if (!(message.channel instanceof GuildChannel)) {
      throw new TypeConversionError(`Type 'Channel' can only be used in guilds`);
    }

    const guild = message.channel.guild;
    const channel = guild.channels.get(channelId);
    if (!channel) {
      throw new TypeConversionError(`Could not find channel for channel id \`${channelId}\``);
    }

    if (!(channel instanceof TextChannel)) {
      throw new TypeConversionError(`Channel \`${channel.name}\` is not a text channel`);
    }

    return channel;
  },

  voiceChannel(value, { message, bot }): VoiceChannel {
    const channelId = getChannelId(value);
    if (!channelId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid channel`);
    }

    if (!(message.channel instanceof GuildChannel)) {
      throw new TypeConversionError(`Type 'Channel' can only be used in guilds`);
    }

    const guild = message.channel.guild;
    const channel = guild.channels.get(channelId);
    if (!channel) {
      throw new TypeConversionError(`Could not find channel for channel id \`${channelId}\``);
    }

    if (!(channel instanceof VoiceChannel)) {
      throw new TypeConversionError(`Channel \`${channel.name}\` is not a voice channel`);
    }

    return channel;
  },

  role(value, { message, bot }): Role {
    if (!(message.channel instanceof GuildChannel)) {
      throw new TypeConversionError(`Type 'Role' can only be used in guilds`);
    }

    const roleId = getRoleId(value);
    if (!roleId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid role`);
    }

    const role = message.channel.guild.roles.get(roleId);
    if (!role) {
      throw new TypeConversionError(`Could not find role for role id \`${roleId}\``);
    }

    return role;
  },

  userId(value) {
    const userId = getUserId(value);
    if (!userId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid user`);
    }

    return userId;
  },

  channelId(value) {
    const channelId = getChannelId(value);
    if (!channelId) {
      throw new TypeConversionError(`\`${disableCodeBlocks(value)}\` is not a valid channel`);
    }

    return channelId;
  }
};