export interface Login {
    Email : string,
    Password : string
}

export interface Register {
    Email : string,
    Password : string,
    PasswordConfirm : string,
    Category : number | null,
    Name : string
}

export interface RegisterAdmin {
    Password : string,
    PasswordConfirm : string,
    Category : number | null,
    Name : string
}

export interface JwtPayload {
    UserID : number;
    Name : string;
    Email : string;
    isAdmin : boolean;
    CreatedAt : Date;
}

export interface NewTeam {
    Name : string,
    Password : string
}

export interface Team {
    Id : number,
    Name : string,
    Captain : string,
    Points : number,
    Category : string,
    MemberCount : number
}

export interface UserCategory {
    Name : string,
    Level : number
}

export interface Search {
    FilterName : string,
    FilterCategory : string,
    SortBy: 'points' | 'name',
    SortDirection : 'asc' | 'desc'

}

export interface ChallengeCategory {
    Name : string
}

export interface Alert {
    title : string,
    message : string
}


export interface Hint {
    Order : number,
    PointsType : 'Percentage' | 'Normal',
    PointsValue : number,
    Hint : string
}

export interface Challenge {
    
    ChallengeType : string,
    Challenge : {
        Id ?: number,
        RoundID?: number,
        ChallengeCategoryID?: number,
        Name?: string,
        Description?: string,
        Points?: number,
        Flags?: string[],
        Quiz?: any,
        RequiredChallengeID?: number[],
        Ports?: string[],
        Hints?: Hint[]
    }
}

export interface QuizMultipleChoiceAnswer {
    Answer : string,
    IsCorrect : boolean
}

export interface Quiz {
    Order : number,
    Question : string,
    isMultipleChoice : boolean
    Answer : string | QuizMultipleChoiceAnswer[]
}


export interface Round {
    Id : number
    Name : string,
    Description : string,
    StartTime : string,
    EndTime : string,
}