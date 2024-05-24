class Datapool 
{
    private static instance: Datapool;
    private _data: { [key: string]: any };
    
    private constructor() 
    {
      this._data = {};
    }
  
    public static getInstance(): Datapool 
    {
      if (!Datapool.instance) 
      {
        Datapool.instance = new Datapool();
      }
  
      return Datapool.instance;
    }
  
    public get(key: string): any 
    {
      return this._data[key];
    }
  
    public set(key: string, value: any): void 
    {
      this._data[key] = value;
    }
  }
  
  export default Datapool;