export type JwtPayload = {
    UserID : number;
    Name : string;
    Email : string;
    isAdmin : Boolean;
    CreatedAt : Date;
}