import DbHelper from './DbHelper';

class DbQuestions 
{
    db = DbHelper.getDb();

    TABLE_LIST_QUIZ: string = 'list_quiz';
    TABLE_QUIZ_CONTROL: string = 'quiz_control';
    CREATE_TABLE_LIST_QUIZ: string = `CREATE TABLE "main"."` + this.TABLE_LIST_QUIZ + `" (
        "id"  INTEGER PRIMARY KEY AUTOINCREMENT,
        "question"  TEXT,
        "answer_one"  TEXT,
        "answer_two"  TEXT
        )
        ;`;
    CREATE_TABLE_QUIZ_CONTROL: string = `CREATE TABLE "main"."` + this.TABLE_QUIZ_CONTROL + `" (
        "id"  INTEGER PRIMARY KEY AUTOINCREMENT,
        "week_number" NUMBER DEFAULT 0,
        "day_array" TEXT,
        "done" INTEGER DEFAULT 0
        )
        ;`;

    constructor() {}

    addQuestion = (question: string, answer_one: string, answer_two: string) =>
    {
        return new Promise((resolve, reject) => 
        {
            let sql = `INSERT INTO list_quiz 
                (question, answer_one, answer_two) 
            VALUES 
                (?,?,?)`;

            this.db.executeSql(sql, [question, answer_one, answer_two], () => 
            {
                resolve(true);
            }, 
            (error: any) => 
            {
                console.log('DB: Add records error: ', error);
                reject(false);
            });

        });
    };

    getWeekQuestion = (weekNumber: number) => 
    {
        return new Promise((resolve, reject) => 
        {
            let db = DbHelper.getDb();
            let sql = 'SELECT * FROM quiz_control WHERE week_number = ? AND done = ?';

            db.executeSql(sql, [weekNumber, 0], (result: unknown) => 
            {
                resolve(result);
            }, 
            (error: any) => 
            {
                reject(error);
            });
        });
    }

    updDayArray = (id: number, dayArray: string) => 
    {
        return new Promise((resolve, reject) => 
        {
            this.db.transaction((tx: { executeSql: (arg0: string, arg1: (string | number)[], arg2: (tx: any, results: any) => void, arg3: (error: any) => void) => void; }) => 
            {
                tx.executeSql(
                'UPDATE quiz_control SET day_array = ? WHERE id = ?',
                [dayArray, id],
                (tx, results) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results);
                    } 
                    else 
                    {
                        reject(new Error('Update operation failed'));
                    }
                },
                (error) => 
                {
                    reject(error);
                },
                );
            });
        });
    }

    setWeekDone = (id: number) => 
    {
        return new Promise((resolve, reject) => 
        {
            this.db.transaction((tx: { executeSql: (arg0: string, arg1: number[], arg2: (tx: any, results: any) => void, arg3: (error: any) => void) => void; }) => 
            {
                tx.executeSql(
                'UPDATE quiz_control SET done = ? WHERE id = ?',
                [1, id],
                (tx, results) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results);
                    } 
                    else 
                    {
                        reject(new Error('Update operation failed'));
                    }
                },
                (error) => 
                {
                    reject(error);
                },
                );
            });
        });
    }

    resetQuizControl = () => 
    {
        this.truncQuizControl();

        if (!this.db) 
        {
          console.error('Database connection is not established.');
          return;
        }

        return new Promise((resolve, reject) => {
            try 
            {
                // Need to get current week number, then add 1 in a for loop and add records for each week
                let currentWeek: number = this.getCurrentWeekNumber();
                
                const getDayArray = new Array(7).fill(0);
                const dayArray = JSON.stringify(getDayArray);

                for (let i = 0; i < 5; i++)
                {
                    let sql = "INSERT INTO " + this.TABLE_QUIZ_CONTROL + " (week_number, day_array, done) VALUES (?, ?, ?)";
                    this.db.executeSql(sql, [currentWeek, dayArray, 0]);
                    currentWeek++;
                }
                resolve(true);
            } 
            catch (error) 
            {
                reject(error);
            }
        });
    }

    getCurrentWeekNumber() 
    {
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 1);
        const firstThursday = start.getDay() < 4 ? start : new Date(start.setDate(start.getDate() + (7 - start.getDay() + 4) % 7));
        const diffInMilliseconds = now.getTime() - firstThursday.getTime();
        const oneWeekInMilliseconds = 7 * 24 * 60 * 60 * 1000;
        
        return Math.floor(diffInMilliseconds / oneWeekInMilliseconds) + 1;
    }

    saveAnswer = (id: number, quizQuestion: string, answer: string) => 
    {
        return new Promise((resolve, reject) => 
        {
            let sql = `INSERT INTO calendar_quiz 
                (quiz_id, quiz_question, quiz_result, create_date) 
            VALUES 
                (?,?,?,datetime('now'))`;

            this.db.executeSql(sql, [id, quizQuestion, answer], () => 
            {
                resolve(true);
            }, 
            (error: any) => 
            {
                console.log('DB: Add records error: ', error);
                reject(false);
            });

        });
    };

    truncQuizControl = () =>    
    {
        this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_QUIZ_CONTROL);
        this.db.executeSql(this.CREATE_TABLE_QUIZ_CONTROL);
    }

    truncQuestions = () => 
    {
        this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_LIST_QUIZ);
        this.db.executeSql(this.CREATE_TABLE_LIST_QUIZ);

    }
}

export default new DbQuestions;