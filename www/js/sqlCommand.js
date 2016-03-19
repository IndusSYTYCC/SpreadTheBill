var eventsQuery = "CREATE TABLE EVENTS( \n\
        EVENT_ID INTEGER PRIMARY KEY AUTOINCREMENT, \n\
        NAME TEXT, \n\
        DESCRIPTION TEXT, \n\
        PLACE TEXT, \n\
        OWNER TEXT, \n\
        FRIENDS TEXT, \n\
        SOLDE INTEGER DEFAULT 0 , \n\
        START DATE, \n\
        END DATE, \n\
        IS_DELETE INTEGER DEFAULT 0 \n\
        );";
var accountQuery = "CREATE TABLE ACCOUNT( \n\
        ACCOUNT_ID INTEGER PRIMARY KEY AUTOINCREMENT, \n\
        FRIEND_ID INTEGER,\n\
        BALANCE INTEGER \n\
        );";
var friendsQuery = "CREATE TABLE FRIENDS(\n\
     FRIENDS_ID INTEGER PRIMARY KEY AUTOINCREMENT,\n\
     ACCOUNT_ID INTEGER,\n\
     FRIEND_ACCOUNT INTEGER UNIQUE\n\
     );";