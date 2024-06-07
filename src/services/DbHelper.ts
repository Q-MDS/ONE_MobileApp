import SQLite from 'react-native-sqlite-storage';

class DbHelper 
{
  static instance: DbHelper;
//   db: SQLite.SQLiteDatabase | null = null;
  db: any = null;

  constructor() 
  {
    if (DbHelper.instance) 
    {
      return DbHelper.instance;
    }

    DbHelper.instance = this;
  }

  openDb = () => 
  {
    if (this.db) return;

    this.db = SQLite.openDatabase(
      {
        name: 'one.db',
        location: 'default',
      },
      () => console.log('Database connected!'),
	  (error: any) => console.log('Database error', error),
    );
  }

  getDb = () => 
  {
    if (!this.db) this.openDb();
    return this.db;
  }
}

export default new DbHelper();