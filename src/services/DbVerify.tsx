import DbSetup from "./DbSetup";
import DbHelper from './DbHelper';

class DBVerify
{
    db = DbHelper.getDb();

    TABLE_VERIFY_MASTER: string = 'verify_master';
	TABLE_VERIFY_DETAIL: string = 'verify_detail';

    CREATE_TABLE_VERIFY_MASTER: string = DbSetup.CREATE_TABLE_VERIFY_MASTER;
    CREATE_TABLE_VERIFY_DETAIL: string = DbSetup.CREATE_TABLE_VERIFY_DETAIL;

    constructor() {}

	addMasterRecord = (notiId: number, notiAccept: number, verifyDate: number, verifyTime: number, verifyYear: number, weekNum: number, dayNum: number, verifyScore: number, verifyStatus: number) => 
	{
		return new Promise((resolve, reject) => 
		{
			let sql = `INSERT INTO verify_master 
				(noti_id, noti_accept, vm_date, vm_time, vm_year, week_num, day_num, vm_tot_score, vm_status) 
			VALUES 
				(?,?,?,?,?,?,?,?,?)`;

			this.db.executeSql(sql, [notiId, notiAccept, verifyDate, verifyTime, verifyYear, weekNum, dayNum, verifyScore, verifyStatus], (result) => 
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
		this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_VERIFY_MASTER);
		this.db.executeSql(this.CREATE_TABLE_VERIFY_MASTER);

		return "Ok";
	}

	truncDetailTable = () => 
	{
		this.db.executeSql("DROP TABLE IF EXISTS " + this.TABLE_VERIFY_DETAIL);
		this.db.executeSql(this.CREATE_TABLE_VERIFY_DETAIL);

		return "Ok";
	}
}

export default new DBVerify();