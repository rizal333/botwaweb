let handler = async (m, { client }) => {
	client.sendMessage(m.id.remote, 'pong')
	//m.reply('pong')
}

handler.help = ['ping']
handler.tags = ['main']
handler.command = /^ping$/i

export default handler;