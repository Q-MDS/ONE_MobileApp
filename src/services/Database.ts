import SQLite from 'react-native-sqlite-storage';

class Database 
{
//   db: SQLite.SQLiteDatabase | null = null;

    /**
     * Constructs a new instance of the Database class.
     */
    constructor() 
    {
       /**
         * Create database connection
         */ 
        // this.db = SQLite.openDatabase(
        // {
        //     name: 'one',
        //     location: 'default',
        // },
        //     this.successCallback,
        //     this.errorCallback,
        // );
    }

    /**
     * Callback function called when the database connection is successful.
     */
    successCallback = () => 
    {
        console.log('Database connectedzzz!');
    };

    /**
     * Error callback function for the database.
     * @param error - The error object.
     */
    errorCallback = (error: any) => 
    {
        console.log('Database error', error);
    };

    /**
     * Creates the users table in the database if it doesn't exist.
     */
    createUserTable = () => 
    {
        // if (this.db) 
        // {
        //     this.db.executeSql(
        //     'CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR, name VARCHAR)',
        //     [],
        //     this.successCallback,
        //     this.errorCallback,
        //     );
        // }
    };

    /**
     * Creates the 'arb' table in the database if it doesn't exist.
     * The table has three columns: 'id' (INTEGER PRIMARY KEY AUTOINCREMENT), 'email' (VARCHAR), and 'name' (VARCHAR).
     */
    createArbTable = () => 
    {
        // if (this.db) 
        // {
        //     this.db.executeSql(
        //     'CREATE TABLE IF NOT EXISTS arb (id INTEGER PRIMARY KEY AUTOINCREMENT, email VARCHAR, name VARCHAR)',
        //     [],
        //     this.successCallback,
        //     this.errorCallback,
        //     );
        // }
    };

    /**
     * Creates a new user in the database.
     */
    createUser = () => 
    {
        // let sql = "INSERT INTO users (email, name) VALUES (?, ?)";
        // let params = ["harryP@gmail.com", "H Potterj"];
        // this.db.executeSql(sql, params, (result: any) => 
        // {
        //     console.log('Create user result: ', result);
        // }, 
        // (error: any) => 
        // {
        //     console.log("Create user error", error);
        // });
    }
    
    /**
     * Retrieves a list of users from the database.
     * @returns {Promise<void>} A promise that resolves when the list of users is retrieved.
     */
    listUsers = async () => 
    {
        // let sql = "SELECT * FROM users";
        // this.db.transaction((tx: any) => 
        // {
        //  tx.executeSql(sql, [], (tx: any, resultSet: any) => {
        //     var length = resultSet.rows.length;
        //     for(var i = 0; i < length; i++) 
        //     {
        //         console.log(resultSet.rows.item(i));
        //     }
        // }, 
        // (error: any) => 
        // {
        //     console.log("List user error", error);
        // })
        // })
    }
}

export default new Database();