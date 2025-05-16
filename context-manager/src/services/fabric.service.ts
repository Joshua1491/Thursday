import Fabric from '../models/Fabric';

export class FabricService {
  static create(data: any)              { return Fabric.create(data); }
  static list()                        { return Fabric.find().sort({ createdAt: -1 }); }
  static getByEpc(epc: string)         { return Fabric.findOne({ epc }); }
  static update(epc: string, data: any) { return Fabric.findOneAndUpdate({ epc }, data, { new: true }); }
  static remove(epc: string)           { return Fabric.deleteOne({ epc }); }
} 