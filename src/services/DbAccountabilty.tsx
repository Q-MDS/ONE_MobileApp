import DbSetup from "./DbSetup";
import DbHelper from './DbHelper';

class DbAccountability
{
    db = DbHelper.getDb();

    TABLE_ACCOUNTABILITY_MASTER: string = 'accountability_master';
	TABLE_ACCOUNTABILITY_DETAIL: string = 'accountability_detail';

    CREATE_TABLE_ACCOUNTABILITY_MASTER: string = DbSetup.CREATE_TABLE_ACCOUNTABILITY_MASTER;
    CREATE_TABLE_ACCOUNTABILITY_DETAIL: string = DbSetup.CREATE_TABLE_ACCOUNTABILITY_DETAIL;

    constructor() {}

	addMasterRecord = (notiId: number, notiAccept: number, accDate: number, accTime: number, accYear: number, weekNum: number, dayNum: number, accScore: number, accStatus: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = `INSERT INTO accountability_master 
				(noti_id, noti_accept, am_date, am_time, am_year, week_num, day_num, am_tot_score, am_status) 
			VALUES 
				(?,?,?,?,?,?,?,?,?)`;

			this.db.executeSql(sql, [notiId, notiAccept, accDate, accTime, accYear, weekNum, dayNum, accScore, accStatus], (result) => 
			{
				resolve(true);
			}, 
			(error) => 
			{
				reject(error);
			});
		});
	}

	truncMasterTable = () => 
	{
		this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_ACCOUNTABILITY_MASTER);
		this.db.executeSql(this.CREATE_TABLE_ACCOUNTABILITY_MASTER);

		return "Ok";
	}
	
	truncDetailTable = () => 
	{
		this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_ACCOUNTABILITY_DETAIL);
		this.db.executeSql(this.CREATE_TABLE_ACCOUNTABILITY_DETAIL);

		return "Ok";
	}
}

export default new DbAccountability;