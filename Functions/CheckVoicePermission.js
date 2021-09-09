function CheckVoicePermission(client, message, permission) {
  const permissions = message.channel.guild.channels
    .get(message.member.voiceState.channelID)
    .permissionsOf(client.user.id);
  if (!permissions.has(permission)) {
    return false;
  } else {
    return true;
  }
}

module.exports = {
  CheckVoicePermission: CheckVoicePermission,
};
