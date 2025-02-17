export class JwtPayloadDTO {
    displayName: string;
    sub: string;
    iat: number;
    exp: number;

    constructor(partial: Partial<JwtPayloadDTO>) {
        Object.assign(this, partial);
    }
}
