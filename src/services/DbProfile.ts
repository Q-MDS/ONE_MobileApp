import DbHelper from './DbHelper';
import DbSetup from './DbSetup';

class DbProfile 
{
    dbx = DbHelper.getDb();

    constructor() {}

    getFirstTimeUse = () => 
    {
        return new Promise((resolve, reject) => 
        {
            let db = DbHelper.getDb();
            let sql = 'SELECT first_time_use, first_time_login, cred_1, token FROM profile WHERE id = 1';

            db.executeSql(sql, [], (result) => 
            {
                console.log('Get first time use result: ', result);
                resolve(result);
            }, 
            (error) => 
            {
                console.log('Get first time use error: ', error);
                reject(error);
            });
        });
    }

    createProfile = () => 
    {
        let db = DbHelper.getDb();
        let sql = 'INSERT INTO profile (remote_id, first_time_use, first_time_login, first_name, last_name, cred_1, token, plan_type, card_info_save, card_info_data) VALUES (0, 1, 0, "", "", "", "", 0, 0, "")'

        DbSetup.truncProfile(db);

        db.executeSql(sql, [], (result) => 
        {
            console.log('Create user result: ', result);
            return true;
        }, 
        (error) => 
        {
            console.log("Create user error", error);
            return false;
        });
    }

    updateProfile = (remoteId: number, firstTimeUse: number, firstTimeLogin: number, firstName: string, lastName: string, email: string, token: string, planType: number, cardInfoSave: number, cardInfoData: string | false) => 
    {
        let db = DbHelper.getDb();

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx) => 
            {
                tx.executeSql(
                'UPDATE profile SET remote_id = ?, first_time_use = ?, first_time_login = ?, first_name = ?, last_name = ?, cred_1 = ?, token = ?, plan_type = ?, card_info_save = ?, card_info_data = ? WHERE id = ?',
                [remoteId, firstTimeUse, firstTimeLogin, firstName, lastName, email, token, planType, cardInfoSave, cardInfoData, 1],
                (tx, results) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results.rowsAffected);
                    } 
                    else 
                    {
                        reject(new Error('Update operation failed '));
                    }
                },
                (error) => 
                {
                    reject(error.message);
                },
                );
            });
        });
    };
        
    getProfile = () => 
    {
        return new Promise((resolve, reject) => 
        {
            let db = DbHelper.getDb();
            let sql = 'SELECT * FROM profile WHERE id = 1';

            db.executeSql(sql, [], (result) => 
            {
                console.log('Get profile result: ', result.rows.item(0));
                resolve(result.rows.item(0));
            }, 
            (error) => 
            {
                reject(error);
            });
        });
    }

    setLoginToken = (token: string) => 
    {
        let db = DbHelper.getDb();

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx) => 
            {
                tx.executeSql(
                'UPDATE profile SET token = ? WHERE id = ?',
                [token, 1],
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

    setFirstTimeLogin = () => 
    {
        let db = DbHelper.getDb();

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx) => 
            {
                tx.executeSql(
                'UPDATE profile SET first_time_login = ? WHERE id = ?',
                [1, 1],
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

    getToken = () => 
    {
        return new Promise((resolve, reject) => 
        {
            let db = DbHelper.getDb();
            let sql = 'SELECT token FROM profile WHERE id = 1';

            db.executeSql(sql, [], (result) => 
            {
                console.log('Get token result: ', result.rows.item(0).token);
                resolve(result.rows.item(0).token);
            }, 
            (error) => 
            {
                reject(error);
            });
        });
    }

    clearToken = () => 
    {
        let db = DbHelper.getDb();

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx) => 
            {
                tx.executeSql(
                'UPDATE profile SET token = ? WHERE id = ?',
                ["", 1],
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

    getProfileManage = () => 
    {
        return new Promise((resolve, reject) => 
        {
            let db = DbHelper.getDb();
            let sql = 'SELECT * FROM profile WHERE id = 1';

            db.executeSql(sql, [], (result) => 
            {
                console.log('Get profile result: ', result.rows.item(0));
                resolve(result.rows.item(0));
            }, 
            (error) => 
            {
                reject(error);
            });
        });
    }

    updateFirstName = (firstName: string) => 
    {
        let db = DbHelper.getDb();

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx) => 
            {
                tx.executeSql(
                'UPDATE profile SET first_name = ? WHERE id = ?',
                [firstName, 1],
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

    updateLastName = (lastName: string) => 
    {
        let db = DbHelper.getDb();

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx) => 
            {
                tx.executeSql(
                'UPDATE profile SET last_name = ? WHERE id = ?',
                [lastName, 1],
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

    updateNotifications = (notifications: boolean) => 
    {
        let db = DbHelper.getDb();

        let isOn = 0;

        if (notifications)
        {
            isOn = 1;
        }

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx) => 
            {
                tx.executeSql(
                'UPDATE profile SET notifications = ? WHERE id = ?',
                [isOn, 1],
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

    updateQuotes = (quotes: boolean) => 
    {
        let db = DbHelper.getDb();

        let isOn = 0;

        if (quotes)
        {
            isOn = 1;
        }

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx) => 
            {
                tx.executeSql(
                'UPDATE profile SET quotes = ? WHERE id = ?',
                [isOn, 1],
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

    updateQuizMode = (quizMode: boolean) => 
    {
        let db = DbHelper.getDb();

        let isOn = 0;

        if (quizMode)
        {
            isOn = 1;
        }

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx) => 
            {
                tx.executeSql(
                'UPDATE profile SET quiz_mode = ? WHERE id = ?',
                [isOn, 1],
                (tx, results) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results);
                    } 
                    else 
                    {
                        reject(new Error('Update quiz mode failed'));
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

    updateOnePlan = (planType: number) => 
    {
        let db = DbHelper.getDb();

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx) => 
            {
                tx.executeSql(
                'UPDATE profile SET one_package = ? WHERE id = ?',
                [planType, 1],
                (tx, results) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results.rowsAffected);
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

    savePassword = (password: string) => 
    {
        let db = DbHelper.getDb();

        return new Promise((resolve, reject) => 
        {
            db.transaction((tx) => 
            {
                tx.executeSql('UPDATE profile SET cred_2 = ? WHERE id = ?', [password, 1], (tx, results) => 
                {
                    if (results.rowsAffected > 0) 
                    {
                        resolve(results.rowsAffected);
                    } 
                    else 
                    {
                        reject(new Error('Update operation failed'));
                    }
                },
                (error) => 
                {
                    reject(error);
                });
            });
        });
    }
}

export default new DbProfile();