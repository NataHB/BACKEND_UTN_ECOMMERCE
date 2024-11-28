//recibe req, res y next
//next es una funcion que indica que puede continuar
const testMiddleware = (req, res, next) =>{
    console.log('test middleware');
    if(5 > Math.random()){
        res.status(200).json({message: 'No tienes acceso'})
    }else{
        next()
    }
}

export default testMiddleware