1. Validator based on JOI Same like laravel validator 


they import @xacos/validation (auto-installed)

then they  add like 

in controller 

const data = XValidation(req.data,{
    email:,
    name:,
})

and then user check 
if(!data.success){

}

2. in api user can write like this
import { XRouter } from '@xaocs/core'
import { UserService } from '../app/services/UserService'

export const router = new XRouter()

router.get('/', async (req, res) => res.json(await UserService.all()))
router.get('/:id', async (req, res) => res.json(await UserService.find(req.params.id)))
router.post('/', async (req, res) => res.status(201).json(await UserService.create(req.body)))
router.put('/:id', async (req, res) => res.json(await UserService.update(req.params.id, req.body)))
router.delete('/:id', async (req, res) => { await UserService.destroy(req.params.id); res.status(204).send() })

and also like this 
import { XRouter } from '@xaocs/core'
import  UserController  from '../app/controller/UserController'
improt AuthMiddleware from '../app/middleware/AuthMiddleware'
export const router = new XRouter()

router.get('/', Userontroller.getAll)
router.get('/:id', AuthMiddleware.protect,async (req, res) => res.json(await UserService.find(req.params.id)))
router.post('/', async (req, res) => res.status(201).json(await UserService.create(req.body)))
router.put('/:id', async (req, res) => res.json(await UserService.update(req.params.id, req.body)))
router.delete('/:id', async (req, res) => { await UserService.destroy(req.params.id); res.status(204).send() })