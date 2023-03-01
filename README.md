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
