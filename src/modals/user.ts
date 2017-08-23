
export interface Roles {
    reader: boolean;
    author?: boolean;
    admin?: boolean;
}
export class User {
    emdisplayNameail: string;
    email: string;
    emailVerified: boolean;
    isAnonymous: boolean;
    phoneNumber: string;
    photoURL: string;
    uid: string;
    password: string;
    roles: Roles;
    constructor(authData) {
        this.email = authData.email
        this.photoURL = authData.photoURL
        this.roles = { reader: true }
    }
}