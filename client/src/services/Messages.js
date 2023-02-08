export const registerNewPrivateMessage = (sender, content, date, PCs) => {
    const newMessage = {
        sender: sender,
        content: content,
        date: date,
    };

    if (PCs.has(user)) PCs.get(user).messages.push(newMessage);
    else
        PCs.set(user, {
            nickname: getUserNicknameByUsername(channels, user),
            messages: [newMessage],
        });
};
