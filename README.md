# Thiscord

## Project overview
Thiscord is a "*web chat IRC*" built in the context of my studies at Epitech Bordeaux.
Developed in six days with [Alexis Moins](https://github.com/alexis-moins/), Thiscord provides the classical features of real-time chat app :
- Public channels management (creation, name edition, deletion...)
- Private messages to specific users
- Real-time chatting
- Basic account management

## Technical stack & architecture
![thiscord-architecture](https://user-images.githubusercontent.com/65446617/222144711-069e2018-9d20-4f48-add2-c62361a52398.png)

The technical architecture is a classic Model View Controller composed by:
- a MySQL database for persistence (Model)
- a Node.js server back-end (Controller)
- a React.js front-end (View)

The Node.js back-end server is based on a few tools:
- Typescript: to have a better control and quality over the persisted data
- [Socket.io](https://socket.io/): to be able to send real-time events to the various clients
- [Prisma](https://www.prisma.io/): to assure the communication with the MySQL database

The React front-end also uses extra tools:
- Socket.io: to send and receive real-time events from the back-end server
- [Mantine](https://mantine.dev/): which provides beautiful and easy to use React components

## Here are some screenshots of the app 😁:

<img src="https://media.discordapp.net/attachments/808748311574085653/1080937614485508096/mp.png" alt="private message chat page" />
<div>
  <img src="https://media.discordapp.net/attachments/808748311574085653/1080937612568703116/register_page.png" alt="register page" width="500" />
  <img src="https://media.discordapp.net/attachments/808748311574085653/1080937614208675840/login_invalid.png" alt="login page" width="500" />
</div>
<div>
  <img src="https://media.discordapp.net/attachments/808748311574085653/1080937613785038918/first_channel.png" alt="first channel page" width="500" />
  <img src="https://media.discordapp.net/attachments/808748311574085653/1080937613986385940/join_channel.png" alt="join channel page" width="500" />
</div>
<div>
  <img src="https://media.discordapp.net/attachments/808748311574085653/1080937613252382760/channel_chat.png" alt="channel chat page" width="500" />
  <img src="https://media.discordapp.net/attachments/808748311574085653/1080937612921012354/change_channel_name.png" alt="channel name page" width="500" />
</div>
<div>
  <img src="https://media.discordapp.net/attachments/808748311574085653/1080937613520810014/edit_nickname.png" alt="edit nickname page" width="500" />
  <img src="https://media.discordapp.net/attachments/808748311574085653/1080937615068495872/new_mp.png" alt="new private message page" width="500" />
</div>
