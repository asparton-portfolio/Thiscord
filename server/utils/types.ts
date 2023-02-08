export type Channels = {
    members: {
        user: {
            username: string;
            nickname: string;
        };
    }[];

    name: string;
    owner: {
        username: string;
        nickname: string;
    };
}[];

export const users = new Map<string, number>();
