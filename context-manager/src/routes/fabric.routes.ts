import { Router, Request, Response } from 'express';
import { FabricService } from '../services/fabric.service';

const r = Router();

r.post('/',      async (req: Request, res: Response) => res.json(await FabricService.create(req.body)));
r.get('/',       async (_: Request, res: Response) => res.json(await FabricService.list()));
r.get('/:epc',   async (req: Request, res: Response) => res.json(await FabricService.getByEpc(req.params.epc)));
r.put('/:epc',   async (req: Request, res: Response) => res.json(await FabricService.update(req.params.epc, req.body)));
r.delete('/:epc',async (req: Request, res: Response) => res.json(await FabricService.remove(req.params.epc)));

export default r; 