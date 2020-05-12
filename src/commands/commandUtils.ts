import { Client, GuildChannel, Message, PrivateChannel } from "eris";
import { Awaitable } from "../utils";
import { ICommandConfig, ICommandDefinition, isSwitchOption, TSignature, TTypeConverterFn } from "knub-command-manager";
import { Lock } from "../locks/LockManager";
import { PluginData } from "../plugins/PluginData";
import { hasPermission } from "../helpers";
import { CommandBlueprint } from "./CommandBlueprint";

/**
 * An identity function that helps with type hinting.
 * Takes a command blueprint as an argument and returns that same blueprint.
 */
export function asCommand<T extends CommandBlueprint>(blueprint: T): T {
  return blueprint;
}

export function getDefaultPrefix(client: Client): RegExp {
  return new RegExp(`<@!?${client.user.id}> `);
}

export interface CommandMeta {
  message: Message;
  command: ICommandDefinition<any, any>;
  pluginData: PluginData;
  lock?: Lock;
}

export type CommandFn = (args: any, meta: CommandMeta) => Awaitable<void>;

export interface CommandContext {
  message: Message;
  pluginData: PluginData;
  lock?: Lock;
}

export interface ICommandExtraData {
  requiredPermission?: string;
  allowDMs?: boolean;
  locks?: string | string[];
  cooldown?: number;
  cooldownPermission?: string;
  info?: any;
  _lock?: Lock;
}

export type PluginCommandDefinition = ICommandDefinition<CommandContext, ICommandExtraData>;
export type PluginCommandConfig = ICommandConfig<CommandContext, ICommandExtraData>;

export interface CustomArgumentTypes {
  [key: string]: TTypeConverterFn<CommandContext>;
}

/**
 * Returns a readable command signature string for the given command.
 * Trigger is passed as a string instead of using the "triggers" property of the command to allow choosing which
 * trigger of potentially multiple ones to show and in what format.
 */
export function getCommandSignature(
  command: PluginCommandDefinition,
  overrideTrigger?: string,
  overrideSignature?: TSignature
) {
  const signature = overrideSignature || command.signatures[0];
  const paramStrings = signature.map((param) => {
    return param.required ? `<${param.name}>` : `[${param.name}]`;
  });
  const optStrings = (command.options || []).map((opt) => {
    const required = isSwitchOption(opt) ? false : opt.required;
    return required ? `<-${opt.name}>` : `[-${opt.name}]`;
  });

  const prefix =
    command.originalPrefix != null
      ? typeof command.originalPrefix === "string"
        ? command.originalPrefix
        : command.originalPrefix.source
      : null;

  const trigger =
    overrideTrigger != null
      ? overrideTrigger
      : typeof command.originalTriggers[0] === "string"
      ? command.originalTriggers[0]
      : command.originalTriggers[0].source;

  const usageLine = `${prefix}${trigger} ${paramStrings.join(" ")} ${optStrings.join(" ")}`.replace(/\s+/g, " ").trim();

  return usageLine;
}

/**
 * Command pre-filter to restrict the command to the plugin's guilds, unless
 * allowed for DMs
 */
export function restrictCommandSource(cmd: PluginCommandDefinition, context: CommandContext): boolean {
  if (context.message.channel instanceof PrivateChannel) {
    if (!cmd.config.extra?.allowDMs) {
      return false;
    }
  } else if (!(context.message.channel instanceof GuildChannel)) {
    return false;
  }

  return true;
}

/**
 * Command pre-filter to restrict the command by specifying a required
 * permission
 */
export function checkCommandPermission(cmd: PluginCommandDefinition, context: CommandContext): boolean {
  const permission = cmd.config.extra?.requiredPermission;
  if (permission) {
    const config = context.pluginData.config.getForMessage(context.message);
    if (!hasPermission(config, permission)) {
      return false;
    }
  }

  return true;
}

/**
 * Command post-filter to check if the command's on cooldown and, if not, to put
 * it on cooldown
 */
export function checkCommandCooldown(cmd: PluginCommandDefinition, context: CommandContext): boolean {
  if (cmd.config.extra?.cooldown) {
    const cdKey = `${cmd.id}-${context.message.author.id}`;

    let cdApplies = true;
    if (cmd.config.extra.cooldownPermission) {
      const config = context.pluginData.config.getForMessage(context.message);
      cdApplies = hasPermission(config, cmd.config.extra.cooldownPermission);
    }

    if (cdApplies && context.pluginData.cooldowns.isOnCooldown(cdKey)) {
      // We're on cooldown
      return false;
    }

    context.pluginData.cooldowns.setCooldown(cdKey, cmd.config.extra.cooldown);
  }

  return true;
}

/**
 * Command post-filter to wait for and trigger any locks the command has, and to
 * interrupt command execution if the lock gets interrupted before it
 */
export async function checkCommandLocks(cmd: PluginCommandDefinition, context: CommandContext): Promise<boolean> {
  if (!cmd.config.extra?.locks) {
    return true;
  }

  const lock = (cmd.config.extra._lock = await context.pluginData.locks.acquire(cmd.config.extra.locks));
  return !lock.interrupted;
}
