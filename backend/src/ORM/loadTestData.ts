import { CTFDataSource } from "./dataSource";
import { Challenge, Hint, Round, User, UserCategory, Team, ChallengeCategory, SolvedChallenges, PurchasedHint, Attempt } from "./entities";

export const loadTestData = async () => {

    let categories: UserCategory[] = [
        new UserCategory("BACHELOR 1", 1),
        new UserCategory("BACHELOR 2", 2),
        new UserCategory("BACHELOR 3", 3),
        new UserCategory("MASTER 1", 4),
        new UserCategory("MASTER 2", 5)
    ]
    await CTFDataSource.getRepository(UserCategory).save(categories);

    let rounds: Round[] = [
        new Round("Round 1", "The first round of a wonderful competition!", new Date(2022, 6, 7, 8, 0, 0 ) , new Date(2022, 6, 7, 12, 0, 0)),
        new Round("Round 2", "The second round of a wonderful competition!", new Date(2022, 6, 7, 13, 0, 0 ) , new Date(2022, 6, 7, 17, 0, 0 )),
        new Round("Round 3", "The third round of a wonderful competition!", new Date(2022, 6, 7, 18, 0, 0 ) , new Date(2022, 6, 7, 22, 0, 0 ))
    ]
    await CTFDataSource.getRepository(Round).save(rounds);
    
    let challengeCategories: ChallengeCategory[] = [
        new ChallengeCategory("Networking"),
        new ChallengeCategory("Reverse Engineering"),
        new ChallengeCategory("Forensic"),
        new ChallengeCategory("Crypto"),
        new ChallengeCategory("Binary")
    ]   
    await CTFDataSource.getRepository(ChallengeCategory).save(challengeCategories);

    let c1 = new Challenge(rounds[0], "Networking I", "How are Network types classified? (The flag is 3jpOOxFavA.)", challengeCategories[0], 20, 'Normal',["3jpOOxFavA"], null);
    let c2 = new Challenge(rounds[0], "Networking II", "What are VPN's anyways? (The flag is nYP8t8TQkn.)", challengeCategories[0], 30, 'Normal',["nYP8t8TQkn"], null, [c1]);
    let c3 = new Challenge(rounds[0], "Networking III", "What are nodes and links? (The flag is LTQ8aVbGyl.)", challengeCategories[0], 50, 'Normal',["LTQ8aVbGyl"], null, [c2]);
    let c4 = new Challenge(rounds[0], "Assembly I", "What is assembly condition codes? (The flag is S6aXPtvXKD.)", challengeCategories[1], 20, 'Normal',["S6aXPtvXKD"], null);
    let c5 = new Challenge(rounds[0], "Assembly II", "What is an intermediate language? (The flag is edhWGn9fxZ.)", challengeCategories[1], 40, 'Normal',["edhWGn9fxZ"], null, [c4]);
    let c6 = new Challenge(rounds[0], "Encrypting", "Where does the term 'RSA' come from? (The flag is UMXApYsijt.)", challengeCategories[3], 50, 'Normal',["UMXApYsijt"], null);
    let c7 = new Challenge(rounds[1], "Forensic I", "What is an .iso file? (The flag is Mgna5wBKcK.)", challengeCategories[2], 30, 'Normal',["Mgna5wBKcK"], null);
    let c8 = new Challenge(rounds[1], "Forensic II", "What is data carving? (The flag is CGBS88ih9Y.)", challengeCategories[2], 50, 'Normal',["CGBS88ih9Y"], null, [c7]);
    let c9 = new Challenge(rounds[1], "Crypto I", "What is cryptography? (The flag is siKKlrAKvc.)", challengeCategories[3], 30, 'Normal',["siKKlrAKvc"], null);
    let c10 = new Challenge(rounds[1], "Crypto II", "What is cleartext? (The flag is cSgMUylJC9.)", challengeCategories[3], 50, 'Normal',["cSgMUylJC9"], null, [c9]);
    let c11 = new Challenge(rounds[1], "Crypto + Forensic Duo", "How does the encryption process take place? (The flag is 4LMRcLn6rO.)", challengeCategories[3], 100, 'Normal',["4LMRcLn6rO"], null, [c8, c10]);
    let c12 = new Challenge(rounds[2], "Web Technology", "What is the CSS Box Model and its components? (The flag is SSsybro7jc.)", challengeCategories[0], 40, 'Normal',["SSsybro7jc"], null);
    let c13 = new Challenge(rounds[2], "Web Security", "What is a firewall? (The flag is XOqAHcco9Y.)", challengeCategories[0], 60, 'Normal',["XOqAHcco9Y"], null);
    let c14 = new Challenge(rounds[2], "Data Discovery", "What does Data Cleansing mean? (The flag is mym9xD2w8x.)", challengeCategories[3], 20, 'Normal',["mym9xD2w8x"], null);
    let c15 = new Challenge(rounds[2], "Magic Bytes", "What is a file signature? (The flag is q24RftrtjZ.)", challengeCategories[2], 30, 'Normal',["q24RftrtjZ"], null);
    let c16 = new Challenge(rounds[2], "Binary I", "What base system is binary in? (The flag is ceqiWdbjzQ.)", challengeCategories[4], 10, 'Normal',["ceqiWdbjzQ"], null);
    let c17 = new Challenge(rounds[2], "Binary II", "What do we call the extra digit that doesn't fit whenever we add two binary numbers together? (The flag is wv1IuSVHjh.)", challengeCategories[4], 20, 'Normal',["wv1IuSVHjh"], null, [c16]);
    let c18 = new Challenge(rounds[2], "Binary III", "What is inbetween a bit and a byte? (The flag is 8dxA63eW0h.)", challengeCategories[4], 30, 'Normal',["8dxA63eW0h"], null, [c17]);
    let c19 = new Challenge(rounds[2], "Binary IV", "What do we call the lowest-level form of code? (The flag is TsxtMHyYYb.)", challengeCategories[4], 30, 'Normal',["TsxtMHyYYb"], null, [c18]);
    let c20 = new Challenge(rounds[2], "Binary V", "Can you convert this entire webpage to binary? (The flag is AL8gWlDeuc.)", challengeCategories[4], 50, 'Normal',["AL8gWlDeuc"], null, [c19]);
    
    let cquizjson = JSON.parse('[{"Order": 1,"Answer": [{"Answer": "Open System Interconnection","IsCorrect": true},{"Answer": "Object Server Interface","IsCorrect": false}],"Question": "What does OSI stand for?","isMultipleChoice": true},{"Order": 2,"Answer": "Physical Layer","Question": "Which layer of the OSI model converts data bit into an electrical impulse?","isMultipleChoice": false}]');
    let cquiz = new Challenge(rounds[0], "Networking Quiz", "Pass this quiz to make sure you've got what it takes!", challengeCategories[0], 10, 'Quiz',["Tfghi34TwR"], cquizjson);

    let challenges: Challenge[] = [ c1, c2, c3, c4, c5,
                                    c6, c7, c8, c9, c10,
                                    c11, c12, c13, c14, c15,
                                    c16, c17, c18, c19, c20, cquiz
                                    ];
    await CTFDataSource.getRepository(Challenge).save(challenges);

    let hints: Hint[] = [
        new Hint(challenges[0], 1, "They're usually classified by the range they cover.", 5, 0),
        new Hint(challenges[0], 1, "PAN, LAN, MAN, WAN, GAN. What do they stand for?", 5, 0),
        new Hint(challenges[1], 1, "It's a type of private WAN.", 0, 15),
        new Hint(challenges[1], 1, "It allows the creation of a secured tunnel.", 0, 15),
        new Hint(challenges[1], 1, "You can connect to networks remotely through it.", 0, 20),
        new Hint(challenges[2], 1, "Links have to do with connectivity.", 15, 0),
        new Hint(challenges[3], 1, "They're something to be tested during conditional instructions.", 5, 0),
        new Hint(challenges[3], 1, "Think of jumps, branches, subroutine calls.", 0, 20),
        new Hint(challenges[4], 1, "Programs may be compiled via an IDE or command line, but, in fact...", 0, 40),
        new Hint(challenges[5], 1, "From the names of three gentlemen.", 10, 0),
        new Hint(challenges[5], 1, "Ron, Adi, and Leonard.", 15, 0),
        new Hint(challenges[6], 1, "It contains several files.", 10, 0),
        new Hint(challenges[6], 1, "Most app software can be made into an ISO.", 0, 20),
        new Hint(challenges[6], 1, "Windows comes with interal ISO mounting capabilities.", 5, 0),
        new Hint(challenges[7], 1, "It's very helpful when data is corrupted.", 25, 0),
        new Hint(challenges[9], 1, "Another term for cleartext is plaintext.", 0, 25),
        new Hint(challenges[10], 1, "A special mathematical formula is used.", 0, 25),
        new Hint(challenges[10], 1, "Third parties with malicious intent can't use garbled up data.", 0, 25),
        new Hint(challenges[11], 1, "There are 4 fields.", 5, 0),
        new Hint(challenges[11], 1, "One of them is border.", 5, 0),
        new Hint(challenges[11], 1, "The box model is used in modeling and designing the layouts of its elements.", 0, 20),
        new Hint(challenges[11], 1, "There is a component that defines spacing.", 0, 30),
        new Hint(challenges[13], 1, "Segregate, break, analyze, create, keep track.", 0, 50),
        new Hint(challenges[14], 1, "It's a collection of elements that require special tools to be seen.", 0, 50),
        new Hint(challenges[14], 1, "It's best seen with Linux.", 5, 0),
        new Hint(challenges[15], 1, "Our day-to-day numerical system is base 10. What does the word binary stand for?", 2, 0),
        new Hint(challenges[16], 1, "There's a very helpful site that many programmers use, think back on its name.", 5, 0),
        new Hint(challenges[16], 1, "When encountering such a thing the effects can vary greatly.", 0, 25),
        new Hint(challenges[17], 1, "It's a rather obscure word with many spellings. Sometimes called a half-byte.", 10, 0),
        new Hint(challenges[18], 1, "It's a type of code directly readable by machines.", 0, 33),
    ]
    await CTFDataSource.getRepository(Hint).save(hints);

    let users: User[] = [
        new User("Admin", "Admin@student.uhasselt.be", "Admin", true, categories[4]),
        new User("Joel Ross", "joel.ross@student.uhasselt.be", "password", false, categories[0]),
        new User("James Riley", "james.riley@student.uhasselt.be", "password", false, categories[1]),
        new User("Billy Riley", "billy.riley@student.uhasselt.be", "password", false, categories[2]),
        new User("Riley Harrison", "riley.harrison@student.uhasselt.be", "password", false, categories[3]),
        new User("Zariyah Schneider", "zariyah.schneider@student.uhasselt.be", "password", false, categories[4]),
        new User("Darnell Casey", "darnell.casey@student.uhasselt.be", "password", false, categories[0]),
        new User("Byron Finch", "byron.finch@student.uhasselt.be", "password", false, categories[1]),
        new User("Raul Howard", "raul.howard@student.uhasselt.be", "password", false, categories[2]),
        new User("William Douglas", "william.douglas@student.uhasselt.be", "password", false, categories[3]),
        new User("Emily Robinson", "emily.robinson@student.uhasselt.be", "password", false, categories[4]),
        new User("Patrick Hamilton", "patrick.hamilton@student.uhasselt.be", "password", false, categories[0]),
        new User("Aiden Knight", "aiden.knight@student.uhasselt.be", "password", false, categories[1]),
        new User("Liam Chambers", "liam.chambers@student.uhasselt.be", "password", false, categories[2]),
        new User("Patrick Marsh", "patrick.marsh@student.uhasselt.be", "password", false, categories[3]),
        new User("Jay Taylor", "jay.taylor@student.uhasselt.be", "password", false, categories[4]),
        new User("Maya Robertson", "maya.robertson@student.uhasselt.be", "password", false, categories[0]),
        new User("Grant Odom", "grant.odom@student.uhasselt.be", "password", false, categories[1]),
        new User("Jionni Garcia", "jionni.garcia@student.uhasselt.be", "password", false, categories[2]),
        new User("Landry Booker", "laundry.booker@student.uhasselt.be", "password", false, categories[3]),
        new User("Travis Gilliam", "travis.gilliam@student.uhasselt.be", "password", false, categories[4]),
    ]
    users.forEach((user)=>{
        user.Active = true;
    })
    await CTFDataSource.getRepository(User).save(users);

    let teamA = new Team("Tiger", "password", users[18]); teamA.Members = [users[18], users[16]];
    let teamB = new Team("Eagle", "password", users[19]); teamB.Members = [users[19], users[6], users[8], users[2]];
    let teamC = new Team("Lion", "password", users[3]); teamC.Members = [users[3], users[5], users[13]];
    let teamD = new Team("Bull", "password", users[12]); teamD.Members = [users[12], users[14], users[1], users[9]];
    let teamE = new Team("Rhino", "password", users[20]); teamE.Members = [users[20], users[10], users[4]];
    let teams: Team[] = [ teamA, teamB, teamC, teamD, teamE ];
    await CTFDataSource.getRepository(Team).save(teams);

    let solves: SolvedChallenges[] = [
        new SolvedChallenges(teamA, users[18], challenges[0]),
        new SolvedChallenges(teamA, users[18], challenges[1]),
        new SolvedChallenges(teamA, users[16], challenges[2]),
        new SolvedChallenges(teamA, users[16], challenges[5]),

        new SolvedChallenges(teamB, users[19], challenges[0]),
        new SolvedChallenges(teamB, users[2], challenges[1]),
        new SolvedChallenges(teamB, users[2], challenges[2]),
        new SolvedChallenges(teamB, users[6], challenges[3]),
        new SolvedChallenges(teamB, users[19], challenges[4]),
        new SolvedChallenges(teamB, users[2], challenges[5]),
        new SolvedChallenges(teamB, users[8], challenges[6]),

        new SolvedChallenges(teamC, users[3], challenges[0]),
        new SolvedChallenges(teamC, users[3], challenges[1]),
        new SolvedChallenges(teamC, users[5], challenges[2]),
        new SolvedChallenges(teamC, users[5], challenges[6]),
        new SolvedChallenges(teamC, users[3], challenges[7]),
        new SolvedChallenges(teamC, users[13], challenges[8]),
        new SolvedChallenges(teamC, users[13], challenges[9]),

        new SolvedChallenges(teamD, users[1], challenges[0]),
        new SolvedChallenges(teamD, users[9], challenges[1]),

        new SolvedChallenges(teamE, users[20], challenges[3]),
        new SolvedChallenges(teamE, users[10], challenges[4]),
        new SolvedChallenges(teamE, users[4], challenges[5]),

    ]
    await CTFDataSource.getRepository(SolvedChallenges).save(solves);

    let purchasedHint: PurchasedHint[] = [
        new PurchasedHint(users[18], challenges[0], teamA, hints[0]),
        new PurchasedHint(users[18], challenges[0], teamA, hints[5]),
        new PurchasedHint(users[16], challenges[5], teamA, hints[10]),

        new PurchasedHint(users[19], challenges[0], teamB, hints[0]),
        new PurchasedHint(users[6], challenges[3], teamB, hints[7]),

        new PurchasedHint(users[13], challenges[9], teamC, hints[15]),

        new PurchasedHint(users[10], challenges[4], teamE, hints[8]),
    ]
    await CTFDataSource.getRepository(PurchasedHint).save(purchasedHint);

    let attempts: Attempt[] = [

        new Attempt(challenges[0], users[6], teamB, "iG9kD9T4IE"),
        new Attempt(challenges[1], users[2], teamB, "TNQny2rzJ7"),
        new Attempt(challenges[1], users[2], teamB, "FqT67qX3Gb"),
        new Attempt(challenges[0], users[18], teamA, "hwlYS8E2F8"),
        new Attempt(challenges[0], users[18], teamA, "njO8GtXHLI"),
        new Attempt(challenges[0], users[18], teamA, "HbDByg2U9Y"),
        new Attempt(challenges[0], users[16], teamA, "lvOZiOvqQB"),
        new Attempt(challenges[1], users[3], teamC, "nEqrofzTT3"),
        new Attempt(challenges[2], users[2], teamB, "bxN3Fve4NI"),
        new Attempt(challenges[3], users[2], teamB, "d0PgqhTTsM"),
        new Attempt(challenges[4], users[6], teamB, "LdL1wSpRbQ"),
        new Attempt(challenges[3], users[19], teamB, "yc4EE9lY2U"),
        new Attempt(challenges[5], users[8], teamB, "vgugIkqdn4"),
        new Attempt(challenges[0], users[1], teamD, "xC1BUsKAF6"),
        new Attempt(challenges[0], users[1], teamD, "THLQGYMf2j"),
        new Attempt(challenges[1], users[1], teamD, "iQiW1Xi5z0"),
        new Attempt(challenges[3], users[20], teamE, "TwS9pDBwro"),
        new Attempt(challenges[3], users[20], teamE, "zQogmXOqHt"),
        new Attempt(challenges[3], users[20], teamE, "DHH54XRVkU"),
        new Attempt(challenges[4], users[10], teamE, "8p6dmdDwfI"),
        
        new Attempt(challenges[0], users[6], teamB, "3uBKtWNfJx"),
        new Attempt(challenges[1], users[2], teamB, "vyFMUU5G1A"),
        new Attempt(challenges[1], users[2], teamB, "WDWwGUyBn3"),
        new Attempt(challenges[0], users[18], teamA, "9B0LCmhMdd"),
        new Attempt(challenges[0], users[18], teamA, "SuMiAYvrUn"),
        new Attempt(challenges[0], users[18], teamA, "6WFGPYhYeR"),
        new Attempt(challenges[0], users[16], teamA, "YZtNmuNQC3"),
        new Attempt(challenges[1], users[3], teamC, "6IFXOByqPR"),
        new Attempt(challenges[2], users[2], teamB, "sR3A9cQHAZ"),
        new Attempt(challenges[3], users[2], teamB, "dEBWf3FekL"),
        new Attempt(challenges[4], users[6], teamB, "xEskITjC3r"),
        new Attempt(challenges[3], users[19], teamB, "ZKkY1GdeLG"),
        new Attempt(challenges[5], users[8], teamB, "duqpfX43I3"),
        new Attempt(challenges[0], users[1], teamD, "7IqVuOKLBZ"),
        new Attempt(challenges[0], users[1], teamD, "TAIMRiNcwi"),
        new Attempt(challenges[1], users[1], teamD, "65eGABAPt6"),
        new Attempt(challenges[3], users[20], teamE, "OQEvCGQj7R"),
        new Attempt(challenges[3], users[20], teamE, "nMDn7wvc3k"),
        new Attempt(challenges[3], users[20], teamE, "JM3asUTj94"),
        new Attempt(challenges[4], users[10], teamE, "gHOOokJtoh"),

        new Attempt(challenges[0], users[6], teamB, "5mWWVH1Ssv"),
        new Attempt(challenges[1], users[2], teamB, "r4A7qTYbjC"),
        new Attempt(challenges[1], users[2], teamB, "Lc98AHWcaL"),
        new Attempt(challenges[0], users[18], teamA, "PKdHxYOg5d"),
        new Attempt(challenges[0], users[18], teamA, "aYzMeKgDBo"),
        new Attempt(challenges[0], users[18], teamA, "6KvjfKVP9n"),
        new Attempt(challenges[0], users[16], teamA, "vqFhojvxDi"),
        new Attempt(challenges[1], users[3], teamC, "hfRR4XbhXS"),
        new Attempt(challenges[2], users[2], teamB, "lBZ9slgXQj"),
        new Attempt(challenges[3], users[2], teamB, "bZkWx5b5L9"),
        new Attempt(challenges[4], users[6], teamB, "kPxFix2zPt"),
        new Attempt(challenges[3], users[19], teamB, "GrQIUYhxRI"),
        new Attempt(challenges[5], users[8], teamB, "dVFtf9BAwh"),
        new Attempt(challenges[0], users[1], teamD, "5FjeWdKYWd"),
        new Attempt(challenges[0], users[1], teamD, "PbeMaFgqHr"),
        new Attempt(challenges[1], users[1], teamD, "KekkPsyFnG"),
        new Attempt(challenges[3], users[20], teamE, "NtROWB3SFV"),
        new Attempt(challenges[3], users[20], teamE, "Y27RVtxa4N"),
        new Attempt(challenges[3], users[20], teamE, "uwlNj58cZq"),
        new Attempt(challenges[4], users[10], teamE, "slc5Earb0I"),
        
        
        new Attempt(challenges[0], users[18], teamA, "3jpOOxFavA"),
        new Attempt(challenges[1], users[18], teamA, "nYP8t8TQkn"),
        new Attempt(challenges[2], users[16], teamA, "LTQ8aVbGyl"),
        new Attempt(challenges[5], users[16], teamA, "UMXApYsijt"),

        new Attempt(challenges[0], users[19], teamB, "3jpOOxFavA"),
        new Attempt(challenges[1], users[2], teamB, "nYP8t8TQkn"),
        new Attempt(challenges[2], users[2], teamB, "LTQ8aVbGyl"),
        new Attempt(challenges[3], users[6], teamB, "S6aXPtvXKD"),
        new Attempt(challenges[4], users[19], teamB, "edhWGn9fxZ"),
        new Attempt(challenges[5], users[2], teamB, "UMXApYsijt"),
        new Attempt(challenges[6], users[8], teamB, "Mgna5wBKcK"),

        new Attempt(challenges[0], users[3], teamC, "3jpOOxFavA"),
        new Attempt(challenges[1], users[3], teamC, "nYP8t8TQkn"),
        new Attempt(challenges[2], users[5], teamC, "LTQ8aVbGyl"),
        new Attempt(challenges[6], users[5], teamC, "Mgna5wBKcK"),
        new Attempt(challenges[7], users[3], teamC, "CGBS88ih9Y"),
        new Attempt(challenges[8], users[13], teamC, "siKKlrAKvc"),
        new Attempt(challenges[9], users[13], teamC, "cSgMUylJC9"),

        new Attempt(challenges[0], users[1], teamD, "3jpOOxFavA"),
        new Attempt(challenges[1], users[9], teamD, "nYP8t8TQkn"),

        new Attempt(challenges[3], users[20], teamE, "S6aXPtvXKD"),
        new Attempt(challenges[4], users[10], teamE, "edhWGn9fxZ"),
        new Attempt(challenges[5], users[4], teamE, "UMXApYsijt"),

    ]
    await CTFDataSource.getRepository(Attempt).save(attempts);
}